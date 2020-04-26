DATA1 = document.getElementById('data1');
DATA2 = document.getElementById('data2');
DATA3 = document.getElementById('data3');
DATA4 = document.getElementById('data4');

function get_date_query(query_date) {
    let gt_month = query_date.getMonth();
    let lt_month = query_date.getMonth() + 2;
    let gt_year = query_date.getFullYear() - 1;
    let lt_year = query_date.getFullYear() + 1;
    let gt_day = query_date.getDate() - 1;
    let lt_day = query_date.getDate() + 1;
    console.log("gt_month %s, lt_month %s, gt_year %s, lt_year %s, gt_day %s, lt_day %s", gt_month, lt_month, gt_year, lt_year, gt_day, lt_day);
    return "&created_at__year__lt=" + lt_year + "&created_at__year__gt=" + gt_year + "&created_at__month__gt=" + gt_month + "&created_at__month__lt=" + lt_month + "&created_at__day__gt=" + gt_day + "&created_at__day__lt=" + lt_day;
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


function toxicity_frequency(absolute=false) {
    $.ajax({
        type: "GET",
        url: "https://constitute.herokuapp.com/politicians/toxicity_counts?format=json&",
        dataType: "json",
        success: function (result, status, xhr) {
            console.log(result);
            let x = Object.keys(result);
            let y = Object.values(result);
            let toxicity, sexually_explicit, identity_attack;
            if (absolute) {
                toxicity = y.map(a => a.toxicity);
                sexually_explicit = y.map(a => a.sexually_explicit);
                identity_attack = y.map(a => a.identity_attack);
            } else {
                toxicity = y.map(a => a.toxicity / a.total);
                sexually_explicit = y.map(a => a.sexually_explicit / a.total);
                identity_attack = y.map(a => a.identity_attack / a.total);
            }
            let data = [count_trace(x, toxicity, 'toxicity'),
                count_trace(x, sexually_explicit, 'sexually explicit'),
                count_trace(x, identity_attack, 'identity attack')];
            Plotly.newPlot(DATA2, data, count_layout(absolute));
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

$(document).ready(function () {
    //Make initial tweets graph
    let last_name = "Ocasio-Cortez";
    let today = new Date();
    create_tweet_chart(last_name, today);
    let toggle=false;
    toxicity_frequency(toggle);
    // create_gender_chart(today);
    //Change graph depending on politician
    $('#button1').click(function () {
        last_name = $('#combo :selected').val();
        create_tweet_chart(last_name, today, DATA1);
    });
    //Change graph depending on date
    $('#date_tweets').click(function () {
        let date = $('#date_tweets_field').val();
        create_tweet_chart(last_name, new Date(date))
    });

    $('#toggle').click(function () {
        if (toggle === false) {
            toxicity_frequency(true);
            toggle = true
        } else {
            toxicity_frequency(false);
            toggle = false
        }

    });

    
    let x_var = "toxicity";
    let y_var = "identity_attack";
    create_attribute_chart(today, x_var, y_var);
    $('#attribute_btn').click(function () {
        x_var = $('#x_var :selected').val();
        y_var = $('#y_var :selected').val();
        create_attribute_chart(today, x_var, y_var, DATA3);
    });
    //Change graph depending on date
    $('#date_select').click(function () {
        console.log("click");
        let date = $('#date_input').val();
        create_attribute_chart(new Date(date), x_var, y_var);
    });

    // $('#starting_date_tweets').click(function () {
    //     year = $('#year_choice :selected').val();
    //     toxicity_by_gender(year);
    // });
    // $('#date_gender').click(function(){
    //     let date = $('#date_gender_field').val();
    //     console.log(date);
    //     create_gender_chart(new Date(date))
    // });
});


function create_trace(x_data, y_data, name_info, mode = 'markers', texts = null) {
    return {
        x: x_data,
        y: y_data,
        text: texts,
        name: name_info,
        mode: mode,
        type: 'scatter'
    };
}

function count_trace(x_data, y_data, name_info) {
    return {
        x: x_data,
        y: y_data,
        type: 'bar',
        name: name_info
    }
};

function count_layout(absolute) {
    if (absolute) {
        return {}
    } else {
        return {
            yaxis: {
                tickformat: ',.0%',
                // range: [0, 1]
            }
        }
    }
}

function get_newline_text(text) {
    let html = text.split(" ");
    let newhtml = [];
    for (let i = 0; i < html.length; i++) {
        if (i > 0 && (i % 5) === 0)
            newhtml.push("<br />");
        newhtml.push(html[i]);
    }
    newhtml = newhtml.join(" ");
    return newhtml;
}


function create_attribute_chart(query_date, x_var, y_var) {
    let q_date = get_date_query(query_date);

    $.ajax({
        type: "GET",
        url: "https://constitute.herokuapp.com/tweets/?format=json" + q_date,
        dataType: "json",
        success: function (result, status, xhr) {

            let data = result.results;
            console.log(data);
            let x_data = [];
            let y_data = [];
           
            let texts = [];
            for (let i = 0; i < data.length; i++) {
                x_data.push(parseFloat(data[i][x_var]));
                y_data.push(parseFloat(data[i][y_var]));
                texts.push(get_newline_text(data[i].text));
                
            }
            let attr_trace = create_trace(x_data, y_data, "Toxicity", 'markers', texts);
            const layout = {
                yaxis: {
                    range: [0, 1]
                },
                xaxis: {
                    range: [0, 1]
                },
                title: y_var.replace("_", " ").replace(y_var[0], y_var[0].toUpperCase()) + " Vs " + x_var.replace("_", " ").replace(x_var[0], x_var[0].toUpperCase()) + " On " + query_date.toString().substring(0,15),
                xaxis: {
                    title: {
                        text: x_var.replace("_", " ").replace(x_var[0], x_var[0].toUpperCase()) + " Score (0-1)"
                    }
                },
                yaxis: {
                    title: {
                        text: y_var.replace("_", " ").replace(y_var[0], y_var[0].toUpperCase()) + " Score (0-1)"
                    }
                }
            };

            
            Plotly.newPlot(DATA3, [attr_trace], layout);
        },
        error: function (xhr, status, error) {
            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
}

























// function get_year(year) {
//     let gt_year = parseInt(year) - 1;
//     let lt_year = parseInt(year) + 1;
//     return "&created_at__year__lt=" + lt_year + "&created_at__year__gt=" + gt_year
// }
// function toxicity_by_gender(year) {
//     console.log("year")
//     console.log(year)
//     let q_year = get_year(year);
//     console.log(q_year);
//     let female_data, female_dates, male_data, male_dates;
//     let female_trace, male_trace
//     const layout = {
//                 yaxis: {
//                     range: [0, 1]
//                 },
//                 title: 'Toxicity Over Time by Gender',
//                 xaxis: {
//                     title: {
//                         text: 'Date'
//                     },
//                 },
//                 yaxis: {
//                     title: {
//                         text: 'Toxicity Level'
//                     }
//                 }
//             };
//      $.ajax({
//         type: "GET",
//         url: "https://constitute.herokuapp.com/tweets/?format=json" + q_year +'&politician__gender=Female',
//         dataType: "json",
//         success: function (result, status, xhr) {
//             female_dates, female_data = get_toxicity_per_day(result, status, xhr)
//             console.log(female_data);
//             female_trace = create_trace(female_dates, female_data)
//             Plotly.newPlot(DATA4, female_trace, layout);
//         },
//         error: function (xhr, status, error) {
//             console.log("Error: " + error);
//         }
//     });

// }

// function get_toxicity_per_day(result, status, xhr) {
//             let total = result.count
//             let obj_dates = {}
//             let data = result.results;
//             for (let i = 0; i < data.length; i++) {
//                 let date = data[i].date.substring(0,10)
//                 if (obj_dates.hasOwnProperty(date)) {
//                     obj_dates[date].total += 1
//                     if (data[i].toxicity > 0.7) {
//                         obj_dates[date].toxic += 1
//                     } 
//                 } else {
//                     if (data[i].toxicity > 0.7) {
//                         obj_dates[date] = {total: 1, toxic: 1}
//                     } else {
//                         obj_dates[date] = {total: 1, toxic: 0}
//                     }
//                 }
//             }
//             let tox_per_day = []
//             let dates = Object.keys(obj_dates)
        

//             for (const v in obj_dates) {
//                 console.log(v);
//                 tox_per_day.push(v.toxic/v.total)
//             }
//             return dates, tox_per_day
            
//             // Plotly.newPlot(DATA2, data);
// }


