DATA1 = document.getElementById('data1');

$.ajax({   type: "GET",
                url: "http://constitute.tech/tweets/?format=json&limit=100&politician__last_name=Ocasio-Cortez",
                dataType: "jgit sson",
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
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
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