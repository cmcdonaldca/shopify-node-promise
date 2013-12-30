describe("ShopifyAPI Base Tests", function() {

	var _ = require('underscore')._;
	var assert = require('chai').assert;
	var Promise = require('node-promise');
	var ShopifyAPI = require('../lib/main');
	var config = require('./config.json');
	var shopifyAPI = new ShopifyAPI(config.shopDomain, config.token);

	describe('new', function() {

		it('should fail when no params are passed', function() {

			assert.throws(function() {
				new ShopifyAPI()
			});

		});

	});


	describe('get with querystring', function() {
		it('should understand the parameters', function(done){
			var limit = 2;
			shopifyAPI.get("/admin/pages.json", { limit: limit }).then(function(result) {

				assert.equal(result.data.pages.length, limit);

				done();
			}, function(error) {
				console.log("error");
				console.log(error);
				done(error);
			});
		});
	});

	describe('get', function() {

		it('should return shop object', function(done) {

			var path = "/admin/shop.json";

			shopifyAPI.get(path).then(function(result) {

				assert.equal(result.data.shop.name, config.shopName);

				done();
			}, function(error) {
				console.log("error");
				console.log(error);
				done(error);
			});
		});

		it('should never give a 429', function(done) {

			var promises = [];

			var path = "/admin/shop.json";

			for (var i = 0; i < 100; i++) {
				promises.push(shopifyAPI.get(path));
			}

			Promise.all(promises).then(function(results) {

				_.each(results, function(result) {
					assert.equal(result.statusCode, 200);
					assert.equal(result.data.shop.name, config.shopName);
				});
				done();
			}, function(error) {
				done(error);
			});
		});
	});

	describe("post", function() {

		it('should create a page', function(done) {

			// create a page
			// data is literally copy and pasted from the API docs
			shopifyAPI.post("/admin/pages.json", {
				"page": {
					"title": "Warranty information",
					"body_html": "<h1>Warranty</h1>\n<p><strong>Forget it</strong>, we aint giving you nothing</p>"
				}
			}).then(function(result) {
				assert.isNumber(result.data.page.id, "Id number of the new page");
				done();
			});
		});

	});

});