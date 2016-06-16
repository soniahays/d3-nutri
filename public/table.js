
function buildTable(data, headers) {
    thead.append('tr')
      .selectAll('th')
      .data(headers)
      .enter()
      .append('th')
        .text(function(header) { return header; });

    rows = tbody.selectAll('tr')
        .data(data);

    rows.enter().append('tr');

    cells = rows.selectAll('td')
      .data(function(d) {
          return headers.map(function(header) {
            return { header: header, value: d[header] };
          });
      });

    cells.enter()
      .append('td')
      .html(function(d) { return d.value; });

  return table;
}
