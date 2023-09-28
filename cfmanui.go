package cfmanui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed dist/*
var ui embed.FS

func NewUI() fs.FS {
	dist, _ := fs.Sub(ui, "dist")
	return dist
}

func NewHttpFS() http.FileSystem {
	return http.FS(NewUI())
}
