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

    get_top_tweets('toxicity', '.9');

     $('#identity_attack').click(function(){
         get_top_tweets('identity_attack', '.7')
     });
     $('#sexually_explict').click(function(){
         get_top_tweets('sexually_explicit', '.7')
     });
     $('#toxicity').click(function(){
         get_top_tweets('toxicity', '.9')
     });
});


function get_top_tweets(attribute, gtv){
     $.ajax({
        type: "GET",
        url: "https://constitute.herokuapp.com/tweets/?format=json&" + attribute + "__gt=" + gtv + "&ordering=-" + attribute,
        dataType: "json",
        success: function (result, status, xhr) {
            console.log(result);
            let cards = $();
            let data = result.results;
            data.forEach(function(item, i){
                cards = cards.add(tweet_card(item, attribute));
            });

            $('#top_toxic').html(cards)
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

function tweet_card(tweet, attribute){
    let cardTemplate = [
        '<div class="card p-3 text-left" style="width: 18rem;>',
        '<div class="card-body">',
        '<h5 class="card-subtitle mb-2 text-muted">Score:',
        tweet[attribute] || tweet.attribute,
        '</h5>',
        '<p class="card-text">',
        tweet.text || 'cant find text',
        '</p>' +
        '<small><a href="#" class="card-link ">Report Tweet</a></small>',
        '</div></div>'
    ];
    return $(cardTemplate.join(''));
}