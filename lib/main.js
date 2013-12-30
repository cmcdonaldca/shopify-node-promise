(function() {

	var ShopifyAPI = function(shopDomain, token) {

		if (!shopDomain)
			throw "Empty shopDomain param";

		var Promise = require('node-promise');
		var https = require('https');

		var _request = function(method, path, data, requestPromise) {

			// if this is the first request, then create a new Promise
			if (typeof requestPromise === "undefined")
				requestPromise = new Promise.Promise();

			var options = {
				hostname: shopDomain,
				path: path,
				method: method,
				headers: {
					'X-Shopify-Access-Token': token,
					'Expect:': ''
				}
			};

			var query = null;
			var body = null;

			if (method == 'GET' || method == 'DELETE') {

				// convert data to query string
				if (data) {
					// todo: check if question mark is already there
					options.path +=  "?" + _convertToQueryString(data);
				}
			} else if (method == 'POST' || method == 'PUT') {
				body = JSON.stringify(data);
				options.headers['Content-Type'] = 'application/json; charset=utf-8';
			}

			var req = https.request(options, function(res) {

				var headers = JSON.stringify(res.headers);

				res.setEncoding('utf8');
				var responseBody = '';
				res.on('data', function(chunk) {
					responseBody += chunk;
				});

				res.on('end', function() {

					if (res.statusCode == 429) {
						setTimeout(function() {
							_request(method, path, data, requestPromise);
						}, 500);
					} else {
						try {
							var result = {
								data: JSON.parse(responseBody),
								statusCode: res.statusCode,
								headers: headers
							};
							requestPromise.resolve(result);
						} catch (e) {
							requestPromise.reject(e);
						}
					}
				});
			});

			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
				requestPromise.reject(e);
			});

			if (body)
				req.write(body);

			req.end();

			return requestPromise;

		};

		var _convertToQueryString = function(data){
			var params = [];
			for(var index in data) { 
			   if (data.hasOwnProperty(index)) {
			       params.push(encodeURIComponent(index) + "=" + encodeURIComponent(data[index]));
			   }
			}
			return params.join("&");
		};

		ShopifyAPI.prototype.get = function(path, data) {
			return _request('GET', path, data);
		};

		ShopifyAPI.prototype.post = function(path, data) {
			return _request('POST', path, data);
		};

		ShopifyAPI.prototype.put = function(path, data) {
			return _request('PUT', path, data);
		};

		ShopifyAPI.prototype["delete"] = function(path, data) {
			return _request('DELETE', path, data);
		};
	};

	module.exports = ShopifyAPI;

}).call(this);