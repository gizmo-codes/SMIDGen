testTweets = [{"id": 123123, "content": "id is 123123"},
              {"id": 123154, "content": "id is 123123"},
              {"id": 1233645, "content": "id is 123123"},
              {"id": 123356454, "content": "id is 123123"},
              {"id": 123112312, "content": "id is 123123"}
]

$(document).ready(function (){
    var numberOfTweets = document.getElementById("numberOfTweets")
    var search_numOfTweets = "50" // default number of tweets

    // When user change number of tweets:
    var oneHundred = document.getElementById("oneHundred")
    oneHundred.onclick = function(e){
        numberOfTweets.textContent = 100
        search_numOfTweets = 100
    }
    var oneFifty = document.getElementById("oneFifty")
    oneFifty.onclick = function(e){
        numberOfTweets.textContent = 150
        search_numOfTweets = 150
    }



    // When user click search button:
    button_search = document.getElementById("search")
    button_search.onclick = function(){
        // AJAX request to server:
        var search_param = {};
        search_param.keywords = document.getElementById("keywords").value
        search_param.numOfTweets = search_numOfTweets
        console.log(search_param)
        $.ajax({
            type:"POST",
            url:"/searchTweets",
            contentType: "application/json",
            data: JSON.stringify(search_param),
            contentType: "application/json; charset=utf-8"
        }).done(function(data){
            for(var i =0; i<data.length; i++){
                loadExistingProjects(data[i]['id'], data[i]['name'])
            }
        })
    };

    //Test loadTweets:
    for(var i =0; i<testTweets.length; i++){
        loadTweets(testTweets[i]['id'], testTweets[i]['content'])
    }

    //Load tweets to the "tweets" div
    function loadTweets(id, content){
        var tweets_div = document.getElementById("tweets")
        
        var dashed_line = document.createElement("div")
        dashed_line.className = "hr-line-dashed"

        var tweet_div = document.createElement("div")
        tweet_div.className = "search-result"
        tweet_div.id = id.toString() + "tweet_div"

        var tweet_id = document.createElement("a")
        tweet_id.className = "search-link"
        tweet_id.text = id
        tweet_id.href = "#"
        tweet_id.id = id.toString() + "tweet_id"

        var tweet_content = document.createElement("p")
        tweet_content.textContent = content
        tweet_content.id = id.toString() + "tweet_content"

        tweet_div.append(tweet_id)
        tweet_div.append(tweet_content)

        tweets_div.append(dashed_line)
        tweets_div.append(tweet_div)
    
    }

});





	  
	  