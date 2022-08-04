
POSTS=$(wildcard *.gmi)
HTMLS=$(POSTS:.gmi=.html)


all: $(HTMLS)

clean: fake
	rm -f $(HTMLS)

dist: all
	rsync -avzP ./ charon:/www/damus.io/log/

%.html: %.gmi head.html tail.html
	./gmi2md < $< | pandoc -f markdown -t html -o - | cat head.html - tail.html > $@

.PHONY: fake
