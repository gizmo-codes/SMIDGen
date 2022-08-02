from TwitterSearch import *
from pprint import pprint
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import string
import time

# import ssl

# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context

# import nltk
# nltk.download()
def searchTweets(keywords_list, numberOfTweets):
    try:
        tso = TwitterSearchOrder()
        tso.set_language('en') 
        tso.set_include_entities(False)
        tso.arguments.update({'tweet_mode':'extended'})
        keywords_tso = keywords_list + ['-filter:retweets', '-filter:replies']
        tso.set_keywords(keywords_tso)
        ts = TwitterSearch(
            consumer_key = 'CONSUMER_KEY_HERE',
            consumer_secret = 'CONSUMER_SECRET_HERE',
            access_token = 'ACCESS_TOKEN_HERE',
            access_token_secret = 'ACCESS_TOKEN_SECRET_HERE'
            )
        def my_callback_closure(current_ts_instance): # accepts ONE argument: an instance of TwitterSearch
            queries, tweets_seen = current_ts_instance.get_statistics()
            if queries > 0 and (queries % 5) == 0: # trigger delay every 5th query
                time.sleep(60) # sleep for 60 seconds

        tweets_dict = {}
        count = 0
        for tweet in ts.search_tweets_iterable(tso, callback=my_callback_closure):
            if(count < numberOfTweets):
                tweets_dict[tweet['id']] = tweet['full_text']
                count = count + 1
        
        return tweets_dict
                

    except TwitterSearchException as e: # take care of all those ugly errors if there are some
        print(e)

def nltk_filter(str):
    str = str.lower()
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(str)
    
    filtered_sentence = [w for w in word_tokens if not w.lower() in stop_words]
    filtered_sentence = []
    
    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)

    return filtered_sentence

# Strip symbols.
def strip_symbols(str):
    str = str.replace("\\n", "")
    str = str.replace("&amp;", "")
    str = str.replace("’", "")
    str = str.replace("”", "")
    str = str.replace("“", "")
    # Characters to replace
    for char in string.punctuation:
        str=str.replace(char,'')
    return str


if __name__ == "__main__":
    keywords = ['cat', 'dog']
    numberOfTweets = 100
    result = searchTweets(keywords, numberOfTweets)
    pprint(result)

    tweet_text_string =  " ".join(list(result.values()))
    tweet_text_string = strip_symbols(tweet_text_string)
    tweet_text_string = nltk_filter(tweet_text_string)
    word_count = dict(Counter(tweet_text_string).most_common(4))
    pprint(word_count)