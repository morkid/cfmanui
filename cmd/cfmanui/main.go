package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"

	"github.com/morkid/cfmanui"
)

func main() {
	baseURL := os.Getenv("CLOUDFLARE_API_BASEURL")
	authToken := os.Getenv("CLOUDFLARE_API_AUTHTOKEN")
	portString := os.Getenv("PORT")
	port := 3000
	sslInsecure := false
	token := ""
	apiBase := "https://api.cloudflare.com/client/v4"
	flag.IntVar(&port, "port", port, "UI port")
	flag.StringVar(&apiBase, "cloudflare-api-baseurl", apiBase, "Cloudfare api base url")
	flag.StringVar(&token, "cloudflare-api-authtoken", token, "Cloudfare auth token")
	flag.BoolVar(&sslInsecure, "ssl-insecure", sslInsecure, "Skip SSL verification")
	flag.Parse()

	if token == "" {
		token = authToken
		if token == "" {
			panic("missing auth token")
		}
	}

	if port < 80 {
		if portString != "" {
			port, _ = strconv.Atoi(portString)
		} else {
			port = 3000
		}
	}

	if apiBase == "" {
		apiBase = baseURL
	}

	if os.Getenv("SSL_INSECURE") == "true" {
		sslInsecure = true
	}

	apiBaseURL, err := url.Parse(apiBase)
	if nil != err {
		panic("invalid base url")
	}

	cfHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		transport := http.DefaultTransport.(*http.Transport)
		if sslInsecure {
			transport.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
		}

		uri := &url.URL{
			Host:     apiBaseURL.Host,
			Scheme:   apiBaseURL.Scheme,
			Path:     r.URL.Path,
			RawQuery: r.URL.RawQuery,
		}

		req, _ := http.NewRequest(r.Method, uri.String(), r.Body)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
		for h := range r.Header {
			req.Header.Set(h, r.Header.Get(h))
		}

		var err error
		var res *http.Response
		client := &http.Client{Transport: transport}
		res, err = client.Do(req)

		if nil == err {
			defer res.Body.Close()
			for h := range res.Header {
				w.Header().Set(h, res.Header.Get(h))
			}
			_, err = io.CopyBuffer(w, res.Body, make([]byte, 1024))
		}

		if nil != err {
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(err.Error()))
		}
	})

	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		re := regexp.MustCompile(apiBaseURL.Path)
		if !re.MatchString(r.URL.Path) {
			switch r.URL.Path {
			case "/oauth2/userinfo":
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte(`{"sub":"Administrator"}`))
			case "/roles/Administrator":
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte(`{}`))
			default:
				http.FileServer(cfmanui.NewHttpFS()).ServeHTTP(w, r)
			}
		} else {
			cfHandler.ServeHTTP(w, r)
		}
	}))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), mux))
}
