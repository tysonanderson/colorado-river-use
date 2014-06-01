/*global define */
define(['d3'], function (d3) {
    'use strict';
    $('#overlay').hide();
    $('#popup-close').on('click', function (e){
    	$('#overlay').hide();
    })
    $(window).keypress(function(e){
    	if(e.charCode == 32){
    		$('#overlay').hide();
    	}
    })

    //vis variables
    var w = $('body').width() - 20,
    	h = $( window ).height(),
    	color = d3.scale.category10();

    var currentYear = 1971;

    var color = d3.scale.ordinal( ).range(["#FC432A","#2B2E42","#7BD968"]);

    //timeline scale/axis
    var timeline_x = d3.scale.linear()
    	.range([0,w - 100])
    	.domain([1970, 2012])
    	.nice();

    var timeline = d3.select("#timeline")
    	.append("svg")
    	.attr("height", 100)
    	.attr("width", w);

    var tmap = d3.select("#tree_container").append("svg")
    	.attr("height", h - 200)
    	.attr("width", w);

    var timeline_axis = d3.svg.axis()
    	.scale(timeline_x)
    	.orient("bottom")
    	.ticks(10)
    	.tickSize(1)
    	.tickFormat(timeline_x.tickFormat(1,"d"));

    timeline.append("g")
    	.attr("transform", "translate(50,80)")
    	.call(timeline_axis);

    var treemap = d3.layout.treemap()
	    .size([w, h - 100])
	    .sticky(true)
	    .children(function (d){ return d.values})
	    .value(function(d) { return d["1971"]; });


   	d3.csv("data/combined.csv", function (data){

   		var year_sums = $.map(d3.range(1971,2012,1), function (d){

   			return {"year": d,"total": d3.sum( $.map(data, function (f){ return +f[d] }) )};
   		})

   		var timeline_y = d3.scale.linear()
   			.domain([d3.min(year_sums, function (d){ return d.total}),d3.max(year_sums, function (d){ return d.total})])
   			.range([0,75]);

   		var line = d3.svg.line()
    		.x(function(d) { return timeline_x(d.year) + 50 })
    		.y(function(d) { return timeline_y(d.total) })
    		.interpolate("basis");

    	timeline.append("path").datum(year_sums)
    		.attr("class", "timepath")
    		.attr("d", function(d) { return line(d); });

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




		var ndata = {"key": "colorado_river", "values": nest}

		var thou = d3.format("0,000");
		var perc = d3.format("%");

		 // make cells for each 
		var cell = tmap.data([ndata]).selectAll("g")
      		.data(treemap.nodes)
    		.enter().append("g")
      		.attr("class", function (d) { return (d.values) ? "cell nofill" : "cell"})
      		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      		.on('mouseover', function(e){
      			d3.select('#tooltip').style("top", e.pageY).style("left", e.pageX)
      			$('#user').html(e['Water User'])
      			$('#used').html("TOTAL USE: " + thou(e['1971']) + " kaf")
      			$('#type').html("TYPE: " + e['Category'])
      			$('#percentage').html( perc(e[currentYear] / $.grep(year_sums, function(d){ return d.year == currentYear })[0].total))
      			d3.select(this).attr("opacity", .5);
      		})
      		.on('mouseout', function(e){
      			//d3.select('#tooltip').style("top", e.pageY).style("left", e.pageX)
      			d3.select(this).attr("opacity", 1);
      			$('#user').html('')
      			$('#used').html('')
      			$('#percentage').html('')
      			$('#type').html('')
      		})
      		.on('click', function (e){
      			$('#overlay').show();
      			drawOverlay(e);
      		});

		cell.append("rect")
		    .attr("width", function (d) { return d.dx; })
		    .attr("height", function (d) { return d.dy; })
		    .style("fill", function (d) { return d.values ? "none" : color(d.State); });

		cell.append("text")
		    .attr("x", function(d) { return 0; })
		    .attr("y", function(d) { return 0; })
		    .attr("class", "state_label")
		    .attr("dy", "1.1em")
		    .attr("dx", ".3em")
		    .attr("text-anchor", "start")
		    .text(function(d) { return (d.depth == 1)? d.key : null ; });

		d3.selectAll(".nofill").moveToFront();

		timeline.selectAll("circle")
   			.data(year_sums)
   			.enter()
   			.append("circle")
   			.attr("class", "time-dot")
   			.attr("cx", function (d){ return timeline_x(d.year) + 50 })
   			.attr("cy", function (d){ return timeline_y(d.total) })
   			.attr("r", 10)
   			.attr("opacity", 0)
   			.on("mouseover", function (e){
   				d3.select(this).transition().attr("opacity", 1);

   			})
   			.on("mouseout", function (e){
   				d3.select(this).transition().attr("opacity", 0);
   			})
   			.on("click", function (e){
   				currentYear = e.year;
   				$('#year').html("Year: " + currentYear);

				treemap.value(function(d) { return d[currentYear]; });
				//initial += 1;

				cell.data(treemap.nodes)
					.transition()
		      		.attr("class", "cell")
				    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

				cell.selectAll("rect")
					.transition()
				    .attr("width", function(d) { return d.dx; })
				    .attr("height", function(d) { return d.dy; })
   			});
		// var timer = setInterval(function (){
		// 	if(initial == 2011){
		// 		clearInterval(timer);
		// 	}

		// 	$('#year').html("Year: " + initial);

		// 	treemap.value(function(d) { return d[initial]; });
		// 	initial += 1;

		// 	cell.data(treemap.nodes)
		// 		.transition()
	 //      		.attr("class", "cell")
		// 	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		// 	cell.selectAll("rect")
		// 		.transition()
		// 	    .attr("width", function(d) { return d.dx; })
		// 	    .attr("height", function(d) { return d.dy; })
		// }, 1000)

		//BEGIN POPUP CODE
		function drawOverlay(data){
			$('#overlay').offset({ top: 100, left: 300})

			d3.select("svg").remove();
			var margin = {top: 50, right: 20, bottom: 30, left: 80},
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

			var line2 = d3.svg.line()
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.value); })
			    .interpolate("basis");

			var svg = d3.select("#overlay").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var datum = data;

		    var list = d3.range(1971, 2012, 1),
		        vals = [];
		    /* Iterate over the range of years and construct an object containing a year-value
		    pair */
		    for (var i = 0; i < list.length; i++) {
		        vals.push({date:  new Date(list[i], 0, 1), value: +datum[ list[i].toString()]})
		    };
		    

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
		        .attr("class", "timepath")
		        .attr("d", line2);
		    
		    svg.append("svg:text")
		       .attr("x", 0)
		       .attr("y", -20)
		       .attr("class", "overlay-title")
		       .text(datum["State"] + ' - ' + datum["Water User"]);


		}



   	});

		d3.selection.prototype.moveToFront = function() {
		  return this.each(function(){
		    this.parentNode.appendChild(this);
		  });
		};
		d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

});