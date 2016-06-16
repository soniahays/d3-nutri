//data
var nutrientsData;
var foodsData;
var tableHeaders = ['name', 'qty', 'sugestedServing', 'calories', 'protein', 'totalFat', 'totalCarbs', 'sugar'];
var filteredFoodsData;

// Build Controls.
var nutrientContainerArr = document.querySelectorAll('.container');

//chart display
var chart;
var bar;

// Table display
var table = d3.select('#foodTable');
var thead = table.append('thead');
var tbody = table.append('tbody');
var rows;
var cells;
