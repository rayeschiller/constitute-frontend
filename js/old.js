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