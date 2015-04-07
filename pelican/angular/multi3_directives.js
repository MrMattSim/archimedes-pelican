/////////////////////////
// Directive <wine>

var dir = mod.directive('wine', function() {

    function link(scope, element, attr) {

        scope.xlabel = attr.xlabel;
        scope.ylabel = attr.ylabel;

        var el = element[0];
        var svg = d3.select(el).append('svg').attr('class','scatter');

        var w = 400;
        var h = 400;
        svg.attr({width: w, height: h});

        var xAxisG = svg.append('g').attr('class', 'x-axis');
        var yAxisG = svg.append('g').attr('class', 'y-axis');
        var points = svg.append('g').attr('class', 'points').selectAll('g.point');
        var x = d3.scale.linear();
        var y = d3.scale.linear();

        var m = 50;
        x.range([m, w - m]);
        y.range([h - m, m]);

        // axis

        var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);

        xAxisG.attr('transform', 'translate(' + [0, y.range()[0] + 0.5] + ')');
        yAxisG.attr('transform', 'translate(' + [x.range()[0], 0] + ')');
        update();

        // x axis label

        var xloc = w - (w/2);
        var yloc = h - (m/10);
        svg.append("text")
            .attr("class", "axislabel")
            .attr("id", "xaxislabel")
            .attr("text-anchor", "middle")
            .attr("x",xloc)
            .attr("y",yloc)
            .text(scope.xlabel);

        // y axis label

        var xloc = 0 - (h/2);
        var yloc = -(m/10);
        svg.append("text")
            .attr("class", "axislabel")
            .attr("id", "yaxislabel")
            .attr("text-anchor", "middle")
            .attr("x",xloc)
            .attr("y",yloc)
            .attr("dy","1em")
            .attr("transform","rotate(-90)")
            .text(scope.ylabel);


        scope.$watch('data', update);

        function update(){
            if(!scope.data){ return };
            var data = scope.data;

            // NOTE: the +d notation forces D3 to return the data
            // as a float. This is because D3 treats integers as strings
            // by default.
            var x_min = d3.min(data,function(d){return +d[scope.xlabel];});
            var x_max = d3.max(data,function(d){return +d[scope.xlabel];});
            x.domain([x_min,x_max]);

            var y_min = d3.min(data,function(d){return +d[scope.ylabel];});
            var y_max = d3.max(data,function(d){return +d[scope.ylabel];});
            y.domain([y_min,y_max]);

            points = points.data(data);
            points.exit().remove();
            var point = points.enter().append('g').attr('class', 'point');

            var cValue = function(d) { return d.class },
                color = d3.scale.category10();

            // using attr(fill) instead of style(fill) 
            // allows active class to take precedence
            point.append('circle')
              .attr('r', 5)
              .attr('opacity',0.5)
              .attr('fill', function(d) { return color(cValue(d)); })
              .on({'mouseover': function(d,i){
                  scope.$apply(function(){
                    scope.selectedPoint = d;
                  });
                  d3.selectAll('circle').classed('active',function(e,j){ return i==e['id']; });
                }
              })
              .on('mouseout', function(){
                  /*
                  scope.$apply(function(){
                      scope.selectedPoint = {};
                  });
                  */
                  d3.selectAll('circle').classed('active',false);
              });

            // update the position of all the points
            points.attr('transform', function(d){
                      return 'translate(' + [x( d[scope.xlabel] ), y(d[scope.ylabel])] + ')';
            });

            xAxisG.call(xAxis);
            yAxisG.call(yAxis);

        };

    }

    return {
        link: link,
        restrict: 'E',
        scope: { 
            data: '=',
            selectedPoint: '=',
            xlabel: '=',
            ylabel: '='
        }
    }
});

var c = mod.controller("Ctrl1", ["$scope","$http","$interval",Ctrl1]);
