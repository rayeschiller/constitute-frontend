DATA1 = document.getElementById('data1');
DATA2 = document.getElementById('data2');

$.ajax({   type: "GET",
                url: "https://constitute.herokuapp.com/tweets/?format=json&limit=10&politician__last_name=Ocasio-Cortez",
                dataType: "json",
                success: function (result, status, xhr) {
                    let data = result.results;
                    console.log(result);
                    let toxicity = [];
                    let dates = [];
                    let texts = [];
                    let sexually_explicit_data = [];
                    let identity_attack_data = [];
                    for (var i=0; i<data.length; i++) {
                        toxicity.push(data[i].toxicity);
                        dates.push(data[i].date);
                        texts.push(data[i].text);
                        sexually_explicit_data.push(data[i].sexually_explicit);
                        identity_attack_data.push(data[i].identity_attack);
                    }
                    console.log(texts);
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
                url: "https://constitute.herokuapp.com/tweets/?format=json&limit=10&politician__last_name=Warren",
                dataType: "json",
                success: function (result, status, xhr) {
                    $.ajax({   type: "GET",
                        url: "https://constitute.herokuapp.com/tweets/?format=json&limit=10&politician__last_name=Sanders",
                        dataType: "json",
                        success: function (sanders_results, status, xhr) {
                            let warren_data = result.results;
                            console.log(result);
                            let warren_toxicity = [];
                            let warren_dates = [];
                            let warren_texts = [];
                            for (var i=0; i<warren_data.length; i++) {
                                warren_toxicity.push(warren_data[i].toxicity);
                                warren_dates.push(warren_data[i].date);
                                warren_texts.push(warren_data[i].text);
                            }
                            console.log(warren_texts);

                            let sanders_data = sanders_results.results;
                            console.log(result);
                            let sanders_toxicity = [];
                            let sanders_dates = [];
                            let sanders_texts = [];
                            for (var i=0; i<sanders_data.length; i++) {
                                sanders_toxicity.push(sanders_data[i].toxicity);
                                sanders_dates.push(sanders_data[i].date);
                                sanders_texts.push(sanders_data[i].text);
                            }
                            console.log(sanders_texts);
                            const layout = {
                                yaxis: {
                                    range: [0, 1]
                                },
                                title: 'Sanders, Warren'
                            };

                            let sanders_toxicity_trace = create_trace(sanders_dates, sanders_toxicity, "Toxicity", sanders_texts);
                            let warren_toxicity_trace = create_trace(warren_dates, warren_toxicity, "Toxicity", warren_texts);
                            let trace_data = [warren_toxicity_trace,sanders_toxicity_trace];
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
        mode: 'lines+markers',
        type: 'scatter'
    };
}