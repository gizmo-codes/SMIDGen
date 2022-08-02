// Two issues:1. truncated tweets 2. need to remove retweets
const Twit = require('twit')

const apikey = 'API_HERE'
const apiSecretKey = 'API_SECRET_HERE'
const accessToken = 'TOKEN_HERE'
const accessTokenSecret = 'TOKEN_SECRET_HERE'

var T = new Twit({
  consumer_key:         apikey,
  consumer_secret:      apiSecretKey,
  access_token:         accessToken,
  access_token_secret:  accessTokenSecret,
  tweet_mode: 'extended'
});

(async () => {

    // //1. GET RECENT TWEETS
    T.get('search/tweets', { q: 'tesla cool', count: 200, }, function(err, data, response) {
      const tweets = data.statuses
      .map(tweet => tweet.text)
      for (let i = 0; i < tweets.length; i++) {
        console.log(tweets[i])
        console.log("---------------")
      }
    })


})();