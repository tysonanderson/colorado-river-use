d3.text('../data/combined.csv', function (unparsedData) {
    var data = d3.csv.parse(unparsedData),
        datum = data[0],
        w = 800,
        h = 500,
        margin = 20;
    
    console.log("datum", datum);
     

    //var parseDate = d3.time.format('%y').parse;



    var list = d3.range(1971, 2012, 1),
        vals = [];
    
    for (var i = 0; i < list.length; i++) {
        vals.push({date:  new Date(list[i], 0, 1), value: +datum[ list[i].toString()]})
    };
            console.log("vals",vals);
//    var seriesData = varNames.map(function (name) {
//      return {
//        name: name,
//        values: data.map(function (d) {
//          return {name: name, label: d[labelVar], value: +d[name]};
//        })
//      };
//    });    console.log("series", seriesData);

    var y = d3.scale.linear()
        .domain(d3.extent(vals, function(d) { return d.value; }))
        .range([0 + margin, h - margin]),
        x = d3.time.scale()
        .domain(d3.extent(vals, function(d) { return d.date; }))
        .range([0 + margin, w - margin])
        
       console.log(d3.extent(data, function(d) { return d.date; })) 
    var svg = d3.select("body") 
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)

    //var g = svg.append("svg:g")
     //   .attr("transform", "translate(0, 200)");          
    
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); }); 

    svg.append("svg:path").attr("d", line(vals)); 
    
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

 /*   g.append("svg:line")
        .attr("x1", x(0))
        .attr("y1", -1 * y(0))
        .attr("x2", x(w))
        .attr("y2", -1 * y(0))

    g.append("svg:line")
        .attr("x1", x(0))
        .attr("y1", -1 * y(0))
        .attr("x2", x(0))
        .attr("y2", -1 * y(d3.max(data)))

    g.selectAll(".xLabel")
        .data(x.ticks(5))
        .enter().append("svg:text")
        .attr("class", "xLabel")
        .text(String)
        .attr("x", function(d) { return x(d) })
        .attr("y", 0)
        .attr("text-anchor", "middle")

    g.selectAll(".yLabel")
        .data(y.ticks(4))
        .enter().append("svg:text")
        .attr("class", "yLabel")
        .text(String)
        .attr("x", 0)
        .attr("y", function(d) { return -1 * y(d) })
        .attr("text-anchor", "right")
        .attr("dy", 4)

    g.selectAll(".xTicks")
        .data(x.ticks(5))
        .enter().append("svg:line")
        .attr("class", "xTicks")
        .attr("x1", function(d) { return x(d); })
        .attr("y1", -1 * y(0))
        .attr("x2", function(d) { return x(d); })
        .attr("y2", -1 * y(-0.3))

    g.selectAll(".yTicks")
        .data(y.ticks(4))
        .enter().append("svg:line")
        .attr("class", "yTicks")
        .attr("y1", function(d) { return -1 * y(d); })
        .attr("x1", x(-0.3))
        .attr("y2", function(d) { return -1 * y(d); })
        .attr("x2", x(0))*/
        })
