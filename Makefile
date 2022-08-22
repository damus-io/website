dist: fake
	rsync -avzP ./ charon:/www/damus.io/

.PHONY: fake
