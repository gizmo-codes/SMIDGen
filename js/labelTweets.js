$(document).ready(function () {
    $('.spinner').css('visibility', 'visible');


    //Load existing projects:
    var params = new URLSearchParams(window.location.search);
    var projID = params.get('projectid')
    var project_info = {}
    project_info.projectID = projID
    $.ajax({
        type: "POST",
        url: "/loadTweets",
        data: JSON.stringify(project_info),
        contentType: "application/json"
    }).done(function(data){
        $('#spinner').css('visibility', 'hidden');
        for(var i =0; i<data.length; i++){
            loadTweets(data[i]['content'], data[i]['id'],data[i]['relevant'])
        }
    })

    //Add href to cancel:
    var cancel_labling = document.getElementById('cancelLabel');
    cancel_labling.href = "/search?projectid="+projID

    //Save relevant/unrelevant status:
    document.getElementById('save').addEventListener("click", saveStatus)
    function saveStatus(){
        var relevance_arr = []
        $("#tweets_ul .checkBox").each(function() {
            var tweet_id = $(this).attr('id').split('-')[0]
            var checked = $(this).is(":checked")

            relevance_arr.push({'id': tweet_id, 'checked': checked})

        });
        var params = new URLSearchParams(window.location.search);
        var projID = params.get('projectid')
        var project_info = {}
        project_info.projectID = projID
        project_info.relevance = relevance_arr
        $.ajax({
            type:"POST",
            url:"/saveRelevance",
            contentType: "application/json",
            data: JSON.stringify(project_info),
            contentType: "application/json; charset=utf-8"
        })
        alert("Saved!")
    }

    function loadTweets(content, id, relevant){
        var tweets_list = document.getElementById('tweets_ul')

        var tweet_li = document.createElement('li')
        tweet_li.id = id + '-li'
        tweet_li.className = "list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom-10 rounded-0 mb-2"

        var tweet_div = document.createElement('div')
        tweet_div.id = id + '-div'
        tweet_div.className = "d-flex align-items-center"
        tweet_div.textContent = content

        var tweet_checkBox = document.createElement('input')
        tweet_checkBox.id = id + '-checkBox'
        tweet_checkBox.className = "form-check-input mr-5 checkBox"
        tweet_checkBox.setAttribute('type', 'checkbox')
        if(relevant){
            tweet_checkBox.checked = true
        }else{
            tweet_checkBox.checked = false
        }
        

        tweet_div.append(tweet_checkBox)
        tweet_li.append(tweet_div)
        tweets_list.append(tweet_li)
    }


});
