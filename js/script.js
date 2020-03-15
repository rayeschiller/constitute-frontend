DATA1 = document.getElementById('data1');

$.ajax({   type: "GET",
                url: "http://constitute.tech/tweets/?format=json&limit=100&politician__last_name=Ocasio-Cortez",
                dataType: "json",
                success: function (result, status, xhr) {
                    let data = result.results;
                    console.log(result);
                    let toxicity = [];
                    let dates = [];
                    for (var i=0; i<data.length; i++) {
                        toxicity.push(data[i].toxicity)
                        dates.push(data[i].date)
                    }
                    console.log(toxicity);
                    console.log(dates)
                    Plotly.newPlot( DATA1, [{
                        x: dates,
                        y: toxicity }], {
                        margin: { t: .2 } } );
                },
                error: function (xhr, status, error) {
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });


