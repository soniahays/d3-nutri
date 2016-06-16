(function() {
    $.ajax({
        url: '/data'
    }).then(function(data) {
        nutrientsData = data.nutrients;
        foodsData = data.foods;
        filteredFoodsData = foodsData;
        buildGraph(nutrientsData);
        buildTable(filteredFoodsData, tableHeaders);
        init();
    });

    function init() {
        for (var i = 0; i < nutrientContainerArr.length; i++) {
            var nutrientType = nutrientContainerArr[i].id;

            var incrementBtn = nutrientContainerArr[i].getElementsByClassName('increment');
            var decrementBtn = nutrientContainerArr[i].getElementsByClassName('decrement');

            var nutrientDisplay = nutrientContainerArr[i].getElementsByClassName('display');
            populateDisplay(nutrientDisplay, nutrientType);

            incrementBtn[0].addEventListener('click', nutrientInputHandler.bind(null, 'add', nutrientType), false);
            decrementBtn[0].addEventListener('click', nutrientInputHandler.bind(null, 'remove', nutrientType), false);
        }
    }

    function populateDisplay(nutrientDisplay, nutrientType) {
        // Can we remove this nested loop?
        for (var j = 0; j < nutrientsData.length; j++) {
            if (nutrientsData[j].nutrient === nutrientType) {
                nutrientDisplay[0].innerText = nutrientsData[j].value;
                break;
            }
        }
    }

    function updateDisplay(updatedNutrient) {
        var nutrientDisplay = document.querySelector('#' + updatedNutrient.nutrient + ' .display');
        nutrientDisplay.textContent = updatedNutrient.value;
    }

    function nutrientInputHandler(operation, nutrientType) {
        for (var i = 0; i < nutrientsData.length; i++) {
            if (nutrientsData[i].nutrient === nutrientType) {
                if (operation === 'add') {
                    nutrientsData[i].value += 1;
                    break;
                } else if (operation === 'remove') {
                    nutrientsData[i].value -= 1;
                    break;
                }
            }
        }

        updatedNutrient = {
            "nutrient": nutrientType,
            "value": nutrientsData[i].value
        };

        updateNutrient(updatedNutrient);
        updateDisplay(updatedNutrient);
        updateNutrientUI(updatedNutrient);
        buildGraph(nutrientsData);
        foodFilter(updatedNutrient);
    }

    function updateNutrientUI(updatedNutrient) {
        for (var i = 0; i < nutrientsData.length; i++) {
            if (nutrientsData[i].nutrient === updatedNutrient.nutrient) {
                if (nutrientsData[i].value <= 0) {
                    nutrientsData[i].value = 0; //update control display as well right use of break?.
                } else {
                    nutrientsData[i].value = updatedNutrient.value;
                }
                break;
            }
        }
    }

    function updateNutrient(updatedNutrient) {
        $.ajax({
            method: 'POST',
            url: '/save',
            data: JSON.stringify(updatedNutrient),
            contentType: 'application/json'
        }).done(function() {
            console.log('done');
        });
    }

    function foodFilter(updatedNutrient) {
        for (var i = 0; i < filteredFoodsData.length; i++) {
            console.log('filteredFoodsData', filteredFoodsData[i]);
            if (filteredFoodsData[i][updatedNutrient.nutrient] > updatedNutrient.value) {
                filteredFoodsData = filteredFoodsData.filter(function(el) {
                    return el.name !== filteredFoodsData[i].name;
                    // buildTable(filteredFoodsData, tableHeaders); // right spot to call it?
                });
            }
        }
    }
})();
