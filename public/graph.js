var nutrientsData;
var foodsData;
var tableHeaders = ['name', 'qty', 'sugestedServing', 'calories', 'protein', 'totalFat', 'totalCarbs', 'sugar'];
var chart;
var bar;

var filteredFoodsData;

document.addEventListener('DOMContentLoaded', function () {
    // Build Controls.
    var nutrientContainerArr = document.querySelectorAll('.container');

    function init() {
        for(var i = 0; i < nutrientContainerArr.length; i++) {
          var nutrientType = nutrientContainerArr[i].id;

          var incrementBtn = nutrientContainerArr[i].getElementsByClassName('increment');
          var decrementBtn = nutrientContainerArr[i].getElementsByClassName('decrement');

          var nutrientDisplay = nutrientContainerArr[i].getElementsByClassName('display');
          populateDisplay(nutrientDisplay, nutrientType);

          incrementBtn[0].addEventListener('click', nutrientInputHandler.bind(null, 'add', nutrientType), false);
          decrementBtn[0].addEventListener('click', nutrientInputHandler.bind(null, 'remove', nutrientType), false);
        }
    }

    $.ajax({
        url: '/data'
        }).then(function(data) {
            nutrientsData = data.nutrients;
            foodsData = data.foods;
            filteredFoodsData = foodsData;
            buildGraph(nutrientsData);
            buildTable(foodsData, tableHeaders);
            init();
    });
});

function populateDisplay(nutrientDisplay, nutrientType) {
    // Can we remove this nested loop?
    for(var j = 0; j < nutrientsData.length; j++) {
        if(nutrientsData[j].nutrient === nutrientType) {
            console.log(nutrientsData[j].value);
            nutrientDisplay[0].innerText = nutrientsData[j].value;
            break;
        }
    }
}

function buildTable(data, headers) {
    var table = d3.select('#foodTable');
    var thead = table.append('thead');
    var tbody = table.append('tbody');

    thead.append('tr')
      .selectAll('th')
      .data(headers)
      .enter()
      .append('th')
        .text(function(header) { return header; });

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    var cells = rows.selectAll('td')
      .data(function(d) {
          return headers.map(function(header) {
            return { header: header, value: d[header] };
          });
      })
      .enter()
      .append('td')
      .html(function(d) { return d.value; });

  return table;
}

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

function updateDisplay (updatedNutrient) {
    var nutrientDisplay = document.querySelector('#' + updatedNutrient.nutrient + ' .display');
    nutrientDisplay.textContent = updatedNutrient.value;
}

function nutrientInputHandler(operation, nutrientType) {
    for(var i = 0; i < nutrientsData.length; i++) {
      if(nutrientsData[i].nutrient === nutrientType) {
          if (operation === 'add') {
              nutrientsData[i].value += 1;
              break;
          } else if (operation === 'remove') {
              nutrientsData[i].value -= 1;
              break;
          }
      }
    }

    updatedNutrient = { "nutrient": nutrientType, "value": nutrientsData[i].value };

    updateNutrient(updatedNutrient);
    updateDisplay(updatedNutrient);
    updateNutrientFrontEnd(updatedNutrient);
    buildGraph(nutrientsData);
    foodFilter(updatedNutrient);
}

function updateNutrientFrontEnd(updatedNutrient) {
    for(var i = 0; i < nutrientsData.length; i++) {
        if(nutrientsData[i].nutrient === updatedNutrient.nutrient) {
            nutrientsData[i].value = updatedNutrient.value;
            break;
        }
    }
}

function updateNutrient (updatedNutrient) {
    $.ajax({
        method: 'POST',
        url: '/save',
        data: JSON.stringify(updatedNutrient),
        contentType: 'application/json'
    }).done(function() {
        console.log('done');
    });
}

function foodFilter (updatedNutrient) {
    console.log("filteredFoodsData", filteredFoodsData);
    for(var i = 0; i < foodsData.length; i++) {
        if (filteredFoodsData[i][updatedNutrient.nutrient] > updatedNutrient.value) {
          console.log("before", filteredFoodsData);
          filteredFoodsData = filteredFoodsData.filter(function(el) {
              return el.name !== filteredFoodsData[i].name;
          });
          break;
          console.log("after", filteredFoodsData);
        } else {
          console.log(false, filteredFoodsData[i].name);
        }
    }
}


// we have a foodsData array on the front end and on the back end.
// we have a filteredFoodsData array on the front end
// we want to update the UI to only show the Filtered food
// Tell the back end whether or not food is filtered?

// Two arrays foodsData
// filteredFoodsData
