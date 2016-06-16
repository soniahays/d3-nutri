
function buildGraph(data) {
    var width = 550;
    var height = 400;

    var y = d3.scale.linear()
      .domain([0, 200])
      .range([height, 0]);

    chart = d3.select('.chart')
      .attr({
        width: width,
        height: height
    });

    var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"])

    var barWidth = width / data.length;

    bar = chart.selectAll('g').data(data);

    bar.enter().append('g');

    bar.attr('transform', function(d, i) { return 'translate(' + i * barWidth + ', 0)'; });

    bar.append('rect')
      .attr({
        y: function(d) { return y(d.value); },
        height : function(d) { return height - y(d.value); },
        width: barWidth - 1
      }).style('fill', function(d) { return color(d.nutrient)});

    bar.append('text')
      .attr({
        x: barWidth / 2,
        y: function(d) { return y(d.value) + 3; },
        dy: '.75em'
      })
      .text(function(d) { return d.value; });

    bar.exit().remove();
}
