/*global define */
define(['d3'], function (d3) {
    'use strict';

    //vis variables
    var width = 960,
    	height = 100;

    //timeline scale/axis
    var timeline_x = d3.scale.linear()
    	.range([0,width])
    	.domain([1970, 2012])
    	.nice();

    var timeline = d3.select("#timeline").append("svg");

    var timeline_axis = d3.svg.axis()
    	.scale(timeline_x)
    	.orient("bottom")
    	.ticks(10)
    	.tickFormat(timeline_x.tickFormat(1,"d"));

    timeline.append("g")
    	.call(timeline_axis);


    console.log( timeline_x(2000) );

});