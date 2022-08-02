from unittest import result
import requests
from pprint import pprint
import time
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

from flask import Flask
app = Flask(__name__)


bearer_token = "BEARER_TOKEN_HERE"
search_url = "https://api.twitter.com/2/tweets/search/all"

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
def bearer_oauth(r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2FullArchiveSearchPython"
    return r

def connect_to_endpoint(url, params):
    response = requests.request(
        "GET", search_url, auth=bearer_oauth, params=params)

    if response.status_code != 200:
        raise Exception(response.status_code, response.text)

    return response.json()

@app.route("/tweets.py")
def get_tweets(keyword_arr, counts):
    api_response = []
    hit_terms = []
    no_results = []
    for tz in range(len(keyword_arr)):
        # API query parameters.
        query_params = {'query': '%s place_country:US -birthday -is:retweet' % keyword_arr[tz],
                'tweet.fields': 'public_metrics,created_at,lang,source',
                'max_results':10,
                'expansions': 'author_id',
                'user.fields': 'name,username,location'}

        # Call the twitter API with the given paramaters. Save the result temporarily.
        rescheck = connect_to_endpoint(search_url, query_params)

        # If the response produced results, append them to an array, otherwise ignore it.
        if(rescheck['meta']['result_count'] != 0):
            api_response.append(rescheck)
            hit_terms.append(keyword_arr[tz])
        else:
            no_results.append(keyword_arr[tz])

 
    # Required - Full-archive queries have a 1 request / 1 second limit
    if(len(keyword_arr)>1):
        time.sleep(1.2)

    count = 0
    returned_tweets = {}
    if len(api_response) > 0:
        for x in range(len(api_response)):
            for tweet_info in api_response[x]['data']:
                if(count < counts):
                    returned_tweets[tweet_info['id']] = tweet_info['text']
                    count = count + 1
                else:
                    return returned_tweets

    return returned_tweets

def find_most_common(list_of_strings, frequency, keywords):
    tweet_text_string =  " ".join(list_of_strings)
    tweet_text_string = strip_symbols(tweet_text_string)
    tweet_text_string = nltk_filter(tweet_text_string)
    word_count = dict(Counter(tweet_text_string).most_common(frequency))
    for key in keywords:
        word_count.pop(key, None)
    
    suggestion = list(word_count.keys())
    return suggestion

if __name__ == "__main__":
    result = {'1552382715982479364': 'Buying up endless shit cause it’s Big Cat Szn 🦁. \n'
                        '\n'
                        'I wanna skip august but Leo Appreciation month can '
                        'stay 😇✨',
            '1552382730209333248': 'Jorts is one of my favorite things about twitter. A '
                                    'happy orange cat I’m these crazy times. '
                                    'https://t.co/fROXv5xifG',
            '1552383679221051392': '@muchado33 @liam081963 What’s weird is I’m not '
                                    'allergic to my friends bengal cat like no allergies '
                                    'bc they are part wild house cats I’m def allergic to '
                                    'a friend of mine has a savanna and I’m not allergic '
                                    'to those either',
            '1552383979650793473': '@AnesthesiaCG I’ll keep my eyes open! I am also '
                                    'looking for that but with a cat!',
            '1552383988714672130': '@lovesomepapa @mattxiv The tail rotor is the cat they '
                                    'all agreed to adopt',
            '1552385727031394304': '@tiltedsun1 @i_m_cat @KonaBrewingCo '
                                    'https://t.co/rfr4X0ZJja',
            '1552386309993500673': '@DEADLINE Also best of luck and congratulations '
                                    'miuamboalak on your new show cat on Fox TV',
            '1552386525987479553': '@DEADLINE Call me cat on Fox TV',
            '1552386814257893376': 'Me: I’m going out to refill the bird baths.\n'
                                    '\n'
                                    'Cat: MEOW 😸 \n'
                                    '\n'
                                    'Me: Banana it’s too hot.\n'
                                    '\n'
                                    'Cat: MEOW 🥺\n'
                                    '\n'
                                    'Me: Baby I’m serious, it’s way too hot. You won’t '
                                    'like it.\n'
                                    '\n'
                                    'Cat: MEOW 😡 (scratch on door)\n'
                                    '\n'
                                    'Me: Okay fine. (Opens door)\n'
                                    '\n'
                                    '-5 mins later-\n'
                                    '\n'
                                    'Cat: MEOW 🥵 (waiting at door to go inside) '
                                    'https://t.co/rsvGJaykWY',
            '1552386982478655489': 'love how everyone has a work slack comfort emote that '
                                    'just speaks to and for their identity in some way. '
                                    'for some it’s a thinking cat, spiraling dog or '
                                    'dancing parrot and mine is a screaming toad and i '
                                    'think that’s beautiful https://t.co/2HxwXwHTIQ'}


    keywords = ['cat', 'dog']
    # counts = 10
    # result = get_tweets(keywords,counts)

    suggestion = find_most_common(list(result.values()), 4, keywords)
    print(result)
    # pprint(suggestion)
    