var express = require('express');
var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var RSS = require('rss');
var url = require('url');
var twitter = require('twitter');
var app = express();
var xml;

app.get('/medium-recommended', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
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

app.get('/twitter-likes ', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
	if (queryData.name) {

		var client = new twitter({
		  consumer_key: process.env.TWITTER_CONSUMER_KEY,
		  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		  bearer_token: process.env.TWITTER_BEARER_TOKEN
		});

		client.get('favorites/list', {screen_name: queryData.name},  function(error, tweets, response) {
		  	if (!error) {
				var feed = new RSS({
					title: queryData.name + '\'s favorites on Twitter',
					description: queryData.name + '\'s favorites on Twitter',
					site_url: 'https://twitter.com/' + queryData.name + '/likes',
					language: 'en',
					ttl: '60'
				});			
				for(var i in tweets) {
					var tweet = tweets[i];
					var user = tweet['user'];
					var urls = tweet['entities']['urls'];
					var post_title = 'tweet by ' + user['screen_name'];
					var post_url = 'https://twitter.com/'+ user['screen_name'] +'/status/' + tweet['id_str'];
				    var post_desc = tweet['text'];
					for (var j in urls) {
						post_desc = post_desc.replace(urls[j]['url'],'<a href="'+urls[j]['expanded_url']+'">'+urls[j]['display_url']+'</a>');
					}
					feed.item({
						title: post_title,
						description: post_desc,
						url: post_url
					});

				}
				xml = feed.xml({indent: true});

				res.end(xml);
			}
			else { 
				console.log(error); 
			}
		});
		
  	} else {
		res.end("Need a name!");
  	}
});

app.get('/github-stars', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
	if (queryData.name) {
		var github_url = 'https://github.com/'+ queryData.name +'?tab=stars';
		var options = {
		    uri: github_url,
		    transform: function (body) {
		        return cheerio.load(body);
		    }
		};
		
		rp(options) 
		    .then(function ($) {
				var feed = new RSS({
					title: queryData.name + '\'s stars on Github',
					description: queryData.name + '\'s stars on Github',
					site_url: github_url,
					language: 'en',
					ttl: '60'
				});
			    $('.d-table').each(function(){
			        var data = $(this);
					var post_title = data.find('h3.f4').find('a').text();
					var post_desc = data.find('p.text-gray').text();
					if (post_desc.length == 0) {
						post_desc = '[no description]';
					}
					var post_url = 'https://github.com' + data.find('h3.f4').find('a').attr('href');
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

app.get('/hackernews-favorites', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
	if (queryData.name) {
		var hn_url = 'https://news.ycombinator.com/favorites?id=' + queryData.name;
		var options = {
		    uri: hn_url,
		    transform: function (body) {
		        return cheerio.load(body);
		    }
		};
		
		rp(options) 
		    .then(function ($) {
				var feed = new RSS({
					title: queryData.name + '\'s favories on HackerNews',
					description: queryData.name + '\'s favorites on HackerNews',
					site_url: hn_url,
					language: 'en',
					ttl: '60'
				});
			    $('.athing').each(function(){
			        var data = $(this);
					var post_title = data.find('.title').find('a').html();
					var post_desc = data.find('.title').find('.sitebit').text();
					if (post_desc.length == 0) {
						post_desc = '[no description]';
					}
					var post_desc = post_desc + ' ' + data.next().find('.subtext').html().replace(/href="/g,'href="https://news.ycombinator.com/');
					var post_url = data.find('.title').find('a').attr('href');
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