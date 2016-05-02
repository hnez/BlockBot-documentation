MD_FILES := $(wildcard *.md)
HTML_FILES := $(patsubst %.md, %.html, $(MD_FILES))

MDCOMPILER= pandoc

all: $(HTML_FILES)

%.html: %.md
	$(MDCOMPILER) -o $@ $< -H style.html.inc
