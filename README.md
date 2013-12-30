Shopify Node API Adapter
===

Light-weight Shopify API adapter for Node that uses `node-promise` node package.   Part of the appeal of this package is the automatic handling of the Shopify API Call Limit.  When you make a request with this library, and a 429 is returned, it will keep re-requesting every 500 milliseconds until an HTTP status code other than 429 is return.  In other words, if you use this Shopify API Adapter, you shouldn't have to worry about the API Call Limit if you're not concerned with the time it takes to execute your code.

Another thing that needs to be noted about this library, is that it assumes you've already performed the oAuth handshake and recieved a token.  For the most part, App developers store the token in a db along with the domain of the shop.  With that being said, you'll notice that you don't need to supply the Application Key or Secret.

Along with the other adapters I've written, I believe strongly that if you are going to work with an API, you should become as intimate with it as possibly. And thus, the adapter should be as "thin" as possible.  Therefore, you'll notice that you have to know of the paths and parameters of the Shopify API in order to use this API Adapter, and that's a good thing!

Usage
---

	$ # change directory to the root of your node project
	$ npm install shopify-node-promise

```js


var ShopifyAPI = require('shopify-node-promise');

// setup the API with the domain and token
// this instance is now ready for this domain
var api = new ShopifyAPI(config.shopDomain, config.token);

// make a simple get request to get the shop info
api.get("/admin/shop.json").then(function(result){
	
	console.log("Status Code: " + result.statusCode);
	console.log("Shop Name: " + result.data.shop.name);
	// response headers are parsed and available in result.headers

}, function(error){
	console.log("An error occured fetching the shop: ", error);
});

// create a page
// data is literally copy and pasted from the API docs
api.post("/admin/pages.json", {
  "page": {
    "title": "Warranty information",
    "body_html": "<h1>Warranty</h1>\n<p><strong>Forget it</strong>, we aint giving you nothing</p>"
  }
}).then(function(result){
	console.log(result.data.page);
});


```

Tests
---

To run the tests, first create file called config.json and put it in the test folder.  It should look like this:

```js
{
	"shopDomain" : "SOME-TEST-SHOP.myshopify.com",
	"token" : "YOUR-TOKEN",
	"shopName" : "YOUR-SHOP-NAME"
}
```

Then run;

	$ make test
