# Recommended RSS

This is a quick node.js script that generates RSS feeds of Likes (Favorites, Hearts, etc.) from some social sites.

## Medium

Accepts a Medium username at 
 
	/medium-recommended?name=[username w/o @] 
  
From there it scrapes the user's Recommended page at Medium and returns an RSS feed that includes the articles listed there.

## Twitter

Accepts a Twitter username at 

	/twitter-likes?name=[username w/o @]
  
It gathers the most recent tweets marked as a favorite from that user via the Twitter API. You'll need to register an app at the Twitter API (https://apps.twitter.com/) and pass in a consumer key, consumer secret, and app bearer token when you start this script.
