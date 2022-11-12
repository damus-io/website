
all: fake
	@echo "you don't need to build anything."

tags: fake
	find js -name '*.js' | grep -v noble-secp256k1 | xargs ctags > "$@"

emojiregex: fake
	@curl -sL 'https://raw.githubusercontent.com/mathiasbynens/emoji-test-regex-pattern/main/dist/latest/javascript.txt'

dist:
	rsync -avzP ./ charon:/www/damus.io/web/

.PHONY: fake
