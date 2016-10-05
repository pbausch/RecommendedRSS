var express = require('express');
var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var RSS = require('rss');
var purl = require('url');
var app = express();
var xml;
app.get('/medium-recommended', function(req, res) {

	var queryData = purl.parse(req.url, true).query;
	
	if (queryData.name) {
		var medium_url = 'https://medium.com/@'+ queryData.name +'/has-recommended';
		var options = {
		    uri: medium_url,
		    transform: function (body) {
		        return cheerio.load(body);
		    }
		};
		
		rp(options) 
		    .then(function ($) {
				var feed = new RSS({
					title: $('.heading-title').text() + ' on Medium',
					description: $('.heading-title').text() + ' on Medium',
					site_url: medium_url,
					language: 'en',
					ttl: '60'
				});
			    $('article').each(function(){
			        var data = $(this);
					var post_title = data.find('.layoutSingleColumn').find('h3').text();
					var post_desc = data.find('.layoutSingleColumn').find('h4').text();
					if (post_desc.length === 0) {
						post_desc = data.find('.layoutSingleColumn').find('p').text();
					}
					var post_url = data.find('.layoutSingleColumn').find('a').attr('href');
					post_url = post_url.split("?")[0];
					if (post_title.length > 0) {
						feed.item({
							title: post_title,
							description: post_desc,
							url: post_url
						});
					}
			    });
				xml = feed.xml({indent: true});

				res.end(xml);
			})
			.catch(function (err) {
				res.end(error);
			});

  	} else {
		res.end("Need a name!");
  	}
});

app.listen('8081');
console.log('server started on 8081');