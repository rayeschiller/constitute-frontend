DATA1 = document.getElementById('data1');
DATA2 = document.getElementById('data2');
DATA3 = document.getElementById('data3');


//RINA's CHART 1
$.ajax({   type: "GET",
                url: "https://constitute.herokuapp.com/tweets/?format=json&limit=10&politician__last_name=Ocasio-Cortez",
                dataType: "json",
                success: function (result, status, xhr) {
                    let data = result.results;
                    let toxicity = [];
                    let dates = [];
                    let texts = [];
                    let sexually_explicit_data = [];
                    let identity_attack_data = [];
                    for (var i=0; i<data.length; i++) {
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
                        title: 'Toxicity, Sexually Explicit, Identity Attacks about AOC'
                    };

                    let toxicity_trace = create_trace(dates, toxicity, "Toxicity", 'lines+markers', texts) ;
                    let identity_attack_trace= create_trace(dates,  identity_attack_data, "Identity Attack", 'lines+markers');
                    let sexually_explicit_trace = create_trace(dates, sexually_explicit_data, "Sexually Explicit", 'lines+markers');
                    let trace_data = [toxicity_trace, identity_attack_trace, sexually_explicit_trace];
                    Plotly.newPlot( DATA1, trace_data, layout);
                },
                error: function (xhr, status, error) {
                    console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });

//TOMS CHART
$.ajax({   type: "GET",
                url: "https://constitute.herokuapp.com/tweets/?format=json&politician__gender=Female",
                dataType: "json",
                success: function (female_results, status, xhr) {
                    $.ajax({   type: "GET",
                        url: "https://constitute.herokuapp.com/tweets/?format=json&politician__gender=Male",
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
                                male_texts.push(male_data[i].text);
                                male_texts.push(get_newline_text(male_data[i].text));
                            }

                            const layout = {
                                yaxis: {
                                    range: [0, 1]
                                },
                                // title: 'Sexually Explicit Tweets about Leading Politicians'
                            };

                            let male_explicit_trace = gender_trace(male_dates, male_explicit, "Male Politicians", male_texts);
                            let female_explicit_trace = gender_trace(male_dates, female_explicit, "Female Politicians", female_texts);
                            let trace_data = [female_explicit_trace,male_explicit_trace];
                            Plotly.newPlot(DATA2, trace_data, layout);
                        },
                        error: function (xhr, status, error) {
                            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                        }
                    });
                }
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

function makeTrace(i) {
    let last_name = "";
    switch(i){
        case 1:
             last_name="Ocasio-Cortez";
             break;
        case 2:
             last_name="Biden";
             break;
        case 3:
             last_name="Sanders";
             break;
         case 0:
             last_name="Warren";
             break;
    }

    url = "https://constitute.herokuapp.com/tweets/?format=json&limit=10&politician__last_name=" + last_name;
    Plotly.d3.csv(url, function(data){
         let r = data.results;
        let toxicity = [];
        for (var i=0; i<r.length; i++) {
            toxicity.push(r[i].toxicity);
            // texts.push(get_newline_text(data[i].text));
        }
        ret =  {
            y: toxicity,
            line: {
                shape: 'spline' ,
                color: 'red'
            },
            visible: i === 0,
            name: 'Data set ' + i,

        };
        return ret
     } );
}

//Rinas chart 2 test

Plotly.plot('data3', [0, 1, 2, 3].map(makeTrace), {
updatemenus: [ {
    y: 1,
    yanchor: 'top',
    buttons: [{
        method: 'restyle',
        args: ['visible', [true, false, false, false]],
        label: 'Data set 0'
    }, {
        method: 'restyle',
        args: ['visible', [false, true, false, false]],
        label: 'Data set 1'
    }, {
        method: 'restyle',
        args: ['visible', [false, false, true, false]],
        label: 'Data set 2'
    }, {
        method: 'restyle',
        args: ['visible', [false, false, false, true]],
        label: 'Data set 3'
    }]
}],
});