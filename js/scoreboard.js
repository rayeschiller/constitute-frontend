function get_oembed(tweet_id){
    $.ajax({
        type: "GET",
        url: "https://publish.twitter.com/oembed?url=https://twitter.com/user/status/" + tweet_id,
        dataType: "json",
        success: function (result, status, xhr) {
            console.log(result);
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

$(document).ready(function () {

    // get_oembed('1254130684546998279');
    get_top_tweets()
});


function get_top_tweets(){
     $.ajax({
        type: "GET",
        url: "https://constitute.herokuapp.com/tweets/?" + "toxicity__gt=.9",
        dataType: "json",
        success: function (result, status, xhr) {
            console.log(result);
            let cards = $();
            let data = result.results;
            data.forEach(function(item, i){
                cards = cards.add(tweet_card(item));
            });

            $('#top_toxic').append(cards)
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

function tweet_card(tweet){
    let cardTemplate = [
        '<div class="card p-3 text-left" style="width: 18rem;>',
        '<div class="card-body">',
        '<h5 class="card-subtitle mb-2 text-muted">Score:',
        tweet.toxicity,
        '</h5>',
        '<p class="card-text">',
        tweet.text || 'cant find text',
        '</p>' +
        '<small><a href="#" class="card-link ">Report Tweet</a></small>',
        '</div></div>'
    ];
    return $(cardTemplate.join(''));
}