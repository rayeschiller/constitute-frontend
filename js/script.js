DATA1 = document.getElementById('data1');
DATA2 = document.getElementById('data2');

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

                    let toxicity_trace = create_trace(dates, toxicity, "Toxicity", texts);
                    let identity_attack_trace= create_trace(dates,  identity_attack_data, "Identity Attack");
                    let sexually_explicit_trace = create_trace(dates, sexually_explicit_data, "Sexually Explicit");
                    let trace_data = [toxicity_trace, identity_attack_trace, sexually_explicit_trace];
                    Plotly.newPlot( DATA1, trace_data, layout);
                },
                error: function (xhr, status, error) {
                    console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });

 $.ajax({   type: "GET",
                url: "https://constitute.herokuapp.com/tweets/?format=json&limit=100&politician__last_name=Warren",
                dataType: "json",
                success: function (result, status, xhr) {
                    $.ajax({   type: "GET",
                        url: "https://constitute.herokuapp.com/tweets/?format=json&limit=100&politician__last_name=Sanders",
                        dataType: "json",
                        success: function (sanders_results, status, xhr) {
                            let warren_data = result.results;
                            console.log(result);
                            let warren_explicit = [];
                            let warren_dates = [];
                            let warren_texts = [];
                            for (var i=0; i<warren_data.length; i++) {
                                warren_explicit.push(warren_data[i].sexually_explicit);
                                warren_dates.push(warren_data[i].date);
                                warren_texts.push(warren_data[i].text);
                            }
                            console.log(warren_texts);

                            let sanders_data = sanders_results.results;
                            console.log(result);
                            let sanders_explicit = [];
                            let sanders_dates = [];
                            let sanders_texts = [];
                            for (var i=0; i<sanders_data.length; i++) {
                                sanders_explicit.push(sanders_data[i].sexually_explicit);
                                sanders_dates.push(sanders_data[i].date);
                                sanders_texts.push(sanders_data[i].text);
                            }
                            console.log(sanders_texts);
                            const layout = {
                                yaxis: {
                                    range: [0, 1]
                                },
                                title: 'Sexually Explicit Tweets about Leading Presidential Candidates'
                            };

                            let sanders_explicit_trace = create_trace(sanders_dates, sanders_explicit, "Bernie Sanders", sanders_texts);
                            let warren_explicit_trace = create_trace(sanders_dates, warren_explicit, "Elizabeth Warren", warren_texts);
                            let trace_data = [warren_explicit_trace,sanders_explicit_trace];
                            Plotly.newPlot( DATA2, trace_data, layout);
                        },
                        error: function (xhr, status, error) {
                            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                        }
                    });
                }
            });



function create_trace(x_data, y_data, name_info, texts=null) {
    return {
        x: x_data,
        y: y_data,
        text: texts,
        name: name_info,
        mode: 'markers',
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
    console.log("hereeee");
    console.log(newhtml);
    newhtml = newhtml.join(" ");
    console.log(newhtml);
    return newhtml;
}