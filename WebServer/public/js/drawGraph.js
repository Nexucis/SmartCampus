function loadHighchartsTheme(){
    // Load the fonts
    Highcharts.createElement('link', {
        href: '//fonts.googleapis.com/css?family=Unica+One',
        rel: 'stylesheet',
        type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                 "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);

}

function drawGraph(objElem, type){
    loadHighchartsTheme();

    var sensorsData;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/sensorsWireless_Data/",
        success: function(data) {
            sensorsData = data.payload;
        },
        error: function(err) {
            console.log(err);
        }
    });    
    var lastData = [];
    sensorsData.forEach(function(elem, index, array){
        if(elem.name === objElem.name){
            var dataDate = {
                year : new Date(elem.date).getFullYear(),
                month : new Date(elem.date).getMonth(),
                day : new Date(elem.date).getDate(),
                hour : new Date(elem.date).getHours(),
                minutes : new Date(elem.date).getMinutes(),
                seconds : new Date(elem.date).getSeconds()

            };
        
            if(type === "Vitesse du vent"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.vitesseVent]);
            } else if (type === "Pluviométrie"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.pluviometrie]);
            }else if (type === "Luminosité"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.luminosite]);
            }else if (type === "Pression"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.pression]);
            }else if (type === "Température"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.temperature]);
            }else if (type === "Humidité"){
                lastData.push([Date.UTC(dataDate.year,dataDate.month,dataDate.day, dataDate.hour, dataDate.minutes,dataDate.seconds),elem.humidite]);
            }
            
        }
    });
    var lastDate = {
        year : new Date(lastData[0][0]).getFullYear(),
        month : new Date(lastData[0][0]).getMonth(),
        day : new Date(lastData[0][0]).getDate(),
        hour : new Date(lastData[0][0]).getHours(),
        minutes : new Date(lastData[0][0]).getMinutes(),
        seconds : new Date(lastData[0][0]).getSeconds()

    };
    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Capteur n°'+objElem.name +' '+type 
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' :
            'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: type
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: type,
            data: lastData
        }]
    });
}

