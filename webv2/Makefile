
all: fake
	@echo "you don't need to build anything."

tags: fake
	ctags damus.js nostr.js > $@

dist:
	rsync -avzP ./ charon:/www/damus.io/web/

.PHONY: fake
