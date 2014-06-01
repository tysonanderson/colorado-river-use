/*global define */
define(['d3'], function (d3) {
    'use strict';

    //vis variables
    var w = 960,
    	h = 500,
    	color = d3.scale.category10();

    var color = d3.scale.ordinal( ).range(["#FC432A","#2B2E42","#7BD968"]);

    //timeline scale/axis
    var timeline_x = d3.scale.linear()
    	.range([0,w])
    	.domain([1970, 2012])
    	.nice();

    var timeline = d3.select("#timeline").append("svg");
    var tmap = d3.select("#tree_container").append("svg");

    var timeline_axis = d3.svg.axis()
    	.scale(timeline_x)
    	.orient("bottom")
    	.ticks(10)
    	.tickFormat(timeline_x.tickFormat(1,"d"));

    timeline.append("g")
    	.call(timeline_axis);

    var treemap = d3.layout.treemap()
	    .size([w, h])
	    .sticky(true)
	    .children(function (d){ return d.values})
	    .value(function(d) { return d["1971"]; });


   	d3.csv("data/combined.csv", function (data){

   		var nest = d3.nest()
		    .key(function(d) { return d.State; })
		    .entries(data);

		 //console.log(d3.min(data, function (d){ return +d["2012"]}));

		// var y = d3.scale.linear()
		// 	.domain([d3.min(data, function (d){ return +d["2012"]}), d3.max(data, function (d){ return +d["2012"]})])
		// 	.range([0, h]);
		// console.log(y);


		//  tmap.selectAll("rect")
		//  	.data(data)
		//  	.enter()
		//  	.append("rect")
		//  	.attr("width", 10)
		//  	.attr("height", function (d){ console.log(+d["2012"]); return y(+d["2012"]) })
		//  	.attr("x", function (d,i){ return i*11  });

		console.log(nest);

		var ndata = {"key": "colorado_river", "values": nest}

		 // make cells for each 
		var cell = tmap.data([ndata]).selectAll("g")
      		.data(treemap.nodes)
    		.enter().append("g")
      		.attr("class", "cell")
      		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		cell.append("rect")
		    .attr("width", function(d) { return d.dx; })
		    .attr("height", function(d) { return d.dy; })
		    .style("fill", function(d) { console.log(d.State); return d.values ? color(d.State) : color(d.State); });

		cell.append("text")
		    .attr("x", function(d) { return d.dx / 2; })
		    .attr("y", function(d) { return d.dy / 2; })
		    .attr("dy", ".35em")
		    .attr("text-anchor", "middle")
		    .text(function(d) { return (d.depth == 1)? d.key : null ; });

		var initial = 1971;

		var timer = setInterval(function (){
			if(initial == 2011){
				clearInterval(timer);
			}

			$('#year').html("Year: " + initial);

			treemap.value(function(d) { return d[initial]; });
			initial += 1;

			cell.data(treemap.nodes)
				.transition()
	      		.attr("class", "cell")
	      		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			cell.selectAll("rect")
			    .attr("width", function(d) { return d.dx; })
			    .attr("height", function(d) { return d.dy; })
			    .style("fill", function(d) { console.log(d.State); return d.values ? color(d.State) : color(d.State); });
		}, 1000)


   	});

});