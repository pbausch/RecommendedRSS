# Recommended RSS

This is a quick node.js script that generates RSS feeds of Likes (Favorites, Hearts, Claps, etc.) from some social sites.

## Medium

Accepts a Medium username at 
 
	/medium-recommended?name=[username w/o @] 
  
From there it scrapes the user's Recommended page at Medium and returns an RSS feed that includes the articles listed there.

## Twitter

Accepts a Twitter username at 

	/twitter-likes?name=[username w/o @]
  
It gathers the most recent tweets marked as a favorite from that user via the Twitter API. You'll need to register an app at the Twitter API (https://apps.twitter.com/) and pass in a consumer key, consumer secret, and app bearer token when you start this script.

## Github

Accepts a Github username at 

	/github-stars?name=[username]
  
It scrapes the user's starred projects tab at Github and returns an RSS feed that includes those projects.

## Hacker News

Accepts a Hacker News username at

	/hackernews-favorites?name=[username]

It scrapes the user's favorite stories tab at Hacker News and returns an RSS feed that includes those links.

## Mlkshk

Accepts a Mlkshk username at

	/mlkshk-likes?name=[username]

It scrapes the user's likes at Mlkshk and returns an RSS feed that includes those items.
