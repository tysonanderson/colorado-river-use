var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('../data/combined.csv', function (error, data) {
/*  I structured this by parsing the csv and then reading one user from the array. 
    It should probably be structured as a function that accepts a record object
    from the treemap.
*/    
    var datum = data[60]; // a test placeholder
    console.log("datum", datum);
     

    var list = d3.range(1971, 2012, 1),
        vals = [];
    /* Iterate over the range of years and construct an object containing a year-value
    pair */
    for (var i = 0; i < list.length; i++) {
        vals.push({date:  new Date(list[i], 0, 1), value: +datum[ list[i].toString()]})
    };
    
    console.log("vals",vals);

    x.domain(d3.extent(vals, function(d) { return d.date; }));
    y.domain(d3.extent(vals, function(d) { return d.value; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Thousand acre feet");
    
    svg.append("path")
        .datum(vals)
        .attr("class", "line")
        .attr("d", line);
    
    svg.append("svg:text")
       .attr("x", 50)
       .attr("y", 35)
       .text(datum["State"] + ' - ' + datum["Water User"]);

});
