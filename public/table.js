(function(nutriD3) {
    nutriD3.buildTable = function(data, headers) {
        var table = d3.select('#foodTable');
        var thead = table.append('thead');
        var tbody = table.append('tbody');
        var rows;
        var cells;
        thead.append('tr')
            .selectAll('th')
            .data(headers)
            .enter()
            .append('th')
            .text(function(header) {
                return header;
            });

        rows = tbody.selectAll('tr')
            .data(data);

        rows.enter().append('tr');

        cells = rows.selectAll('td')
            .data(function(d) {
                return headers.map(function(header) {
                    return {
                        header: header,
                        value: d[header]
                    };
                });
            });

        cells.enter()
            .append('td')
            .html(function(d) {
                return d.value;
            });

        return table;
    }
})(window.nutriD3 = window.nutriD3 || {})
