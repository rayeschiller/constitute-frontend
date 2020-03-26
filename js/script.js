DATA1 = document.getElementById('data1');
DATA2 = document.getElementById('data2');
DATA3 = document.getElementById('data3');

function get_date_query(query_date){
    let gt_month = query_date.getMonth();
    let lt_month = query_date.getMonth()+2;
    let gt_year = query_date.getFullYear()-1;
    let lt_year = query_date.getFullYear()+1;
    let gt_day = query_date.getDate()-1;
    let lt_day = query_date.getDate()+1;
    console.log("gt_month %s, lt_month %s, gt_year %s, lt_year %s, gt_day %s, lt_day %s", gt_month, lt_month, gt_year, lt_year, gt_day, lt_day);
    return "&date__year__lt=" + lt_year + "&date__year__gt=" + gt_year + "&date__month__gt=" + gt_month + "&date__month__lt=" + lt_month + "&date__day__gt=" + gt_day + "&date__day__lt=" + lt_day;
};

function create_tweet_chart(last_name, query_date) {
    let q_date = get_date_query(query_date);

    $.ajax({
        type: "GET",
        url: "https://constitute.herokuapp.com/tweets/?format=json&limit=100&politician__last_name=" + last_name + q_date,
        dataType: "json",
        success: function (result, status, xhr) {
            console.log(this.url);
            console.log(result);
            let data = result.results;
            let toxicity = [];
            let dates = [];
            let texts = [];
            let sexually_explicit_data = [];
            let identity_attack_data = [];
            for (let i = 0; i < data.length; i++) {
                toxicity.push(data[i].toxicity);
                dates.push(data[i].date);
                texts.push(get_newline_text(data[i].text));
                sexually_explicit_data.push(data[i].sexually_explicit);
                identity_attack_data.push(data[i].identity_attack);
            }
            const layout = {
                yaxis: {
                    range: [0, 1]
                },
                title: 'Toxicity, Sexually Explicit, Identity Attacks about ' + last_name,
                xaxis: {
                    title: {
                      text: 'Date'
                    },
                  },
                  yaxis: {
                    title: {
                      text: 'Toxicity Level'
                    }
                  }
            };

            let toxicity_trace = create_trace(dates, toxicity, "Toxicity", 'lines+markers', texts);
            let identity_attack_trace = create_trace(dates, identity_attack_data, "Identity Attack", 'lines+markers');
            let sexually_explicit_trace = create_trace(dates, sexually_explicit_data, "Sexually Explicit", 'lines+markers');
            let trace_data = [toxicity_trace, identity_attack_trace, sexually_explicit_trace];
            Plotly.newPlot(DATA1, trace_data, layout);
        },
        error: function (xhr, status, error) {
            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
}

function create_gender_chart(query_date){
    let q_date = get_date_query(query_date);

    $.ajax({   type: "GET",
                    url: "https://constitute.herokuapp.com/tweets/?format=json&politician__gender=Female" + q_date,
                    dataType: "json",
                    success: function (female_results, status, xhr) {
                        $.ajax({   type: "GET",
                            url: "https://constitute.herokuapp.com/tweets/?format=json&politician__gender=Male" + q_date,
                            dataType: "json",
                            success: function (male_results, status, xhr) {
                                let female_explicit = [];
                                let female_dates = [];
                                let female_texts = [];

                                let female_data = female_results.results;
                                for (var i=0; i<female_data.length; i++) {
                                    female_explicit.push(female_data[i].sexually_explicit);
                                    female_dates.push(female_data[i].date);
                                    female_texts.push(get_newline_text(female_data[i].text));
                                }

                                let male_explicit = [];
                                let male_dates = [];
                                let male_texts = [];

                                let male_data = male_results.results;
                                for (var i=0; i<male_data.length; i++) {
                                    male_explicit.push(male_data[i].sexually_explicit);
                                    male_dates.push(male_data[i].date);
                                    male_texts.push(get_newline_text(male_data[i].text));
                                }

                                const layout = {
                                    yaxis: {
                                        range: [0, 1]
                                    },
                                     xaxis: {
                                        title: {
                                          text: 'Date'
                                        },
                                      },
                                      yaxis: {
                                        title: {
                                          text: 'Toxicity Level'
                                        }
                                      }
                                };

                                let male_explicit_trace = gender_trace(male_dates, male_explicit, "Male Politicians", male_texts);
                                let female_explicit_trace = gender_trace(female_dates, female_explicit, "Female Politicians", female_texts);
                                let trace_data = [female_explicit_trace, male_explicit_trace];
                                Plotly.newPlot(DATA2, trace_data, layout);
                            },
                            error: function (xhr, status, error) {
                                console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                            }
                        });
                    }
                });

    }
$(document).ready(function(){
        //Make initial tweets graph
        let last_name = "Ocasio-Cortez";
        let today = new Date();
        create_tweet_chart(last_name, today);
        create_gender_chart(today);
        //Change graph depending on politician
        $('#button1').click(function(){
            last_name = $('#combo :selected').val();
            create_tweet_chart(last_name, today, DATA1);
        });
        //Change graph depending on date
        $('#date_tweets').click(function(){
            let date = $('#date_tweets_field').val();
            create_tweet_chart(last_name, new Date(date))
        });

        $('#date_gender').click(function(){
            let date = $('#date_gender_field').val();
            console.log(date);
            create_gender_chart(new Date(date))
        });
});






function create_trace(x_data, y_data, name_info, mode='markers', texts=null) {
    return {
        x: x_data,
        y: y_data,
        text: texts,
        name: name_info,
        mode: mode,
        type: 'scatter'
    };
}

function get_newline_text(text){
    let html = text.split(" ");
    let newhtml = [];
    for(let i=0; i< html.length; i++) {
        if(i>0 && (i%5) === 0)
            newhtml.push("<br />");
        newhtml.push(html[i]);
    }
    newhtml = newhtml.join(" ");
    return newhtml;
}

function gender_trace(x_data, y_data, name_info, texts=null) {
    return {
        x: x_data,
        y: y_data,
        text: texts,
        name: name_info,
        mode: 'markers',
        marker: {
            size: 4,
        },
        type: 'scatter'
    };
}



