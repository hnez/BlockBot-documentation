MD_FILES := $(wildcard *.md)
HTML_FILES := $(patsubst %.md, %.html, $(MD_FILES))

MDCOMPILER= pandoc

.PHONY: all
all: $(HTML_FILES)

.PHONY: watch
watch:
	inotify-hookable -w . -c make

%.html: %.md
	$(MDCOMPILER) -o $@ $< -H style.html.inc

