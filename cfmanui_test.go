package cfmanui

import (
	"bytes"
	"io"
	"net/http"
	"strings"
	"testing"
)

type TestTransport struct {
}

func (t *TestTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	index, _ := NewHttpFS().Open("index.html")
	output, _ := io.ReadAll(index)
	res := &http.Response{}
	res.Body = io.NopCloser(bytes.NewReader(output))
	res.Header = http.Header{
		"Content-Type": []string{"text/html; charset=utf-8"},
	}

	res.StatusCode = http.StatusOK

	return res, nil
}

var _ http.RoundTripper = &TestTransport{}

func TestNewUI(t *testing.T) {
	// Build Before test
	// build, err := exec.Command("yarn", "build").Output()
	// utils.AssertEqual(t, nil, err)
	// utils.AssertEqual(t, false, build == nil)
	// log.Println(string(build))

	req, _ := http.NewRequest("GET", "/", nil)
	client := &http.Client{
		Transport: &TestTransport{},
	}

	res, err := client.Do(req)
	if err != nil {
		t.Error(err)
	}

	if res.StatusCode != 200 {
		t.Error("Status code is not 200")
	}

	body, err := io.ReadAll(res.Body)
	defer res.Body.Close()
	if err != nil {
		t.Error(err)
	}

	if len(body) == 0 {
		t.Error("Body is empty")
	}

	if !strings.Contains(string(body), "CFMan") {
		t.Error("Body contains CFMan")
	}
}
