$('#searchRooms').autocomplete({
  lookup: _.debounce(fetchSuggestions, 300),
  onSelect: function(suggestion) {
    window.location.href = '/room/' + suggestion.data.id;
  },
});

function fetchSuggestions(query, done) {
  if (query.length > 0) {
    fetch('/searchRooms', {
      method: 'post',
      body: JSON.stringify({
        query: $('#searchRooms').val(),
      }),
      headers: { 'Content-type': 'application/json' },
    }).then((response) => {
      return response.json();
    }).then((response) => {
      const result = {
        suggestions: response.map((data) => {
          return { value: data.name, data: Object.assign({}, data) };
        }),
      };

      done(result);
    });
  } else {
    done();
  }
};
