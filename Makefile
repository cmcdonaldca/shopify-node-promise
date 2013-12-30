TESTS = test/*.js
REPORTER = spec
MOCHA = ./node_modules/mocha/bin/mocha

test:
	$(MOCHA) \
			--reporter $(REPORTER) \
			--timeout 60000 \
			--bail \
			$(TESTS)
.PHONY: test			