const validationList = []

const stocksList = ['MSFT', 'AAPL', 'TSLA', 'GOOG'];

var favoriteList = [];

var storedList = [];
if( localStorage.getItem('favorites')) {
    storedList = localStorage.getItem('favorites').split(',');
}


const validateStocks = function () {
    const queryURL = "https://api.iextrading.com/1.0/ref-data/symbols";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        for (i=0; i<response.length; i++)
        validationList.push(response[i].symbol)
    })
}
validateStocks()


const renderFavorites = function () {
    $('.favoriteList').empty();
    if( storedList.length > 0){
        for (let i = 0; i < storedList.length; i++) {

            let newButton = $('<button>');
        
            newButton.addClass('stock');
        
            newButton.addClass("btn btn-primary")

            newButton.addClass("nav-item")
        
            newButton.attr('data-name', storedList[i]);
        
            newButton.text(storedList[i]);
        
            $('.favoriteList').append(newButton);
        };
    };
};

renderFavorites();

const displaystockInfo = function () {

  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=10`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {

    const holdStock = $('<div class="stockWrapper">');

    const logo = response.logo.url

    const displayLogo = $(`<p class="logo"><img src="${logo}" alt="${response.quote.companyName}"></p>`);

    holdStock.append(displayLogo);

    const compName = response.quote.companyName;

    const displayName = $(`<p class="name">${compName}</p>`);

    holdStock.append(displayName);

    const stockSymbol = response.quote.symbol;

    const displaySymbol = $(`<p class="symbol">${stockSymbol}</p>`);

    holdStock.append(displaySymbol);

    const compPrice = response.quote.latestPrice;

    const displayPrice = $(`<p class="price">Stock Price: ${compPrice}</p>`);

    holdStock.append(displayPrice);

    holdStock.append('<p class="news">News Headlines:</p>')

    for (i = 0; i < response.news.length; i++) {
        holdStock.append(`<a href="${response.news[i].url}"><p class="articleLink">${response.news[i].headline}</p></a>`);
    }

    holdStock.prependTo('#stocks-view')
  });
};

const render = function () {

  $('#buttons-view').empty();

  for (let i = 0; i < stocksList.length; i++) {

    let newButton = $('<button>');

    newButton.addClass('stock');

    newButton.addClass("btn btn-primary")

    newButton.attr('data-name', stocksList[i]);

    newButton.text(stocksList[i]);

    $('#buttons-view').append(newButton);
  };
};

const addButton = function(event) {

  event.preventDefault();

  const stock = $('#stock-input').val().trim().toUpperCase();
  for (i=0; i < validationList.length; i++) {
      if (stock === validationList[i]) {
        stocksList.push(stock);
      }
  }

  $('#stock-input').val('');

  render();
}

const clearButton = function (event) {
    event.preventDefault()
    $('#stocks-view').empty()
}

const addFavorites = function (e) {
    e.preventDefault();
    const stock = $('#stock-input').val().trim().toUpperCase();
  for (i=0; i < validationList.length; i++) {
      if (stock === validationList[i] && storedList.indexOf(stock) === -1) {
        if( !localStorage.getItem('favorites')) {
            storedList.push(stock)
            favoriteList = stock;
        } else {
            favoriteList = storedList.join(',') + "," + stock
        }
        localStorage.setItem("favorites", favoriteList);
        storedList = localStorage.getItem('favorites').split(',');
        }
    }
    renderFavorites()
    $('#stock-input').val('');
}

const emptyFavorites = function (e) {
    e.preventDefault();
    localStorage.removeItem('favorites');
    $('.favoriteList').empty();
}



$('#clearButton').on('click', clearButton)

$('#add-stock').on('click', addButton);

$('#buttons-view').on('click', '.stock', displaystockInfo);

$('.favoriteList').on('click', '.stock', displaystockInfo);

$('#add-favorite').on('click', addFavorites )

$('#clearFavorites').on('click', emptyFavorites)

render();

