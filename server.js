const http = require('http');
const cheerio = require('cheerio');
const io = require('socket.io')(http);
const moment = require('moment');
const request = require("request");

const searchString = "lore%2Bgamma%2Bcrimson%2Bhowl%2Bmedusa%2Bautotronic%2Btiger%2Bserpent%2Bmarble_fade&category_730_Exterior%5B%5D=tag_WearCategory0&category_730_Exterior%5B%5D=tag_WearCategory1&category_730_Exterior%5B%5D=tag_WearCategory2&category_730_Weapon%5B%5D=tag_weapon_ak47&category_730_Weapon%5B%5D=tag_weapon_awp&category_730_Weapon%5B%5D=tag_weapon_m4a1&category_730_Weapon%5B%5D=tag_weapon_bayonet&category_730_Weapon%5B%5D=tag_weapon_knife_karambit&category_730_Weapon%5B%5D=tag_weapon_knife_m9_bayonet";
const allItemsFromServer = [{ "item": "★ Karambit | Gamma Doppler (Factory New)", "price": "600", "csgofast": "554.82", "autobuy": true }, { "item": "★ Karambit | Lore (Minimal Wear)", "price": "500", "csgofast": "705.99", "autobuy": true }, { "item": "★ Karambit | Lore (Factory New)", "price": "600", "csgofast": "1158.25", "autobuy": true }, { "item": "★ M9 Bayonet | Lore (Minimal Wear)", "price": "600", "csgofast": "714.07", "autobuy": true }, { "item": "★ M9 Bayonet | Lore (Factory New)", "price": "600", "csgofast": "970.85", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Minimal Wear)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Lore (Minimal Wear)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Lore (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "AWP | Dragon Lore (Field-Tested)", "price": "600", "csgofast": "752.51", "autobuy": true }, { "item": "AWP | Dragon Lore (Minimal Wear)", "price": "600", "csgofast": "942.08", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Crimson Web (Minimal Wear)", "price": "600", "csgofast": "480.14", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Crimson Web (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "M4A4 | Howl (Minimal Wear)", "price": "500", "csgofast": "374.61", "autobuy": true }, { "item": "M4A4 | Howl (Factory New)", "price": "500", "csgofast": "624.36", "autobuy": true }, { "item": "AWP | Medusa (Minimal Wear)", "price": "500", "csgofast": "477.60", "autobuy": true }, { "item": "AWP | Medusa (Factory New)", "price": "500", "csgofast": "878.21", "autobuy": true }, { "item": "AWP | Dragon Lore (Factory New)", "price": "500", "csgofast": "1414.18", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Field-Tested)", "price": "500", "csgofast": "775.57", "autobuy": true }, { "item": "★ Karambit | Autotronic (Factory New)", "price": "500", "csgofast": "748.76", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Autotronic (Minimal Wear)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Gamma Doppler (Factory New)", "price": "500", "csgofast": "965.77", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Marble Fade (Factory New)", "price": "500", "csgofast": "507.63", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Tiger Tooth (Factory New)", "price": "500", "csgofast": "506.79", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Marble Fade (Factory New)", "price": "500", "csgofast": "575.32", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Fade (Factory New)", "price": "500", "csgofast": "484.37", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Factory New)", "price": "500", "csgofast": "1568.51", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Minimal Wear)", "price": "500", "csgofast": "1048.44", "autobuy": true }, { "item": "★ M9 Bayonet | Crimson Web (Factory New)", "price": "500", "csgofast": "3203.45", "autobuy": true }, { "item": "★ Karambit | Crimson Web (Factory New)", "price": "500", "csgofast": "1651.19", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Factory New)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "StatTrak™ M9 Bayonet | Gamma Doppler (Factory New)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "AK-47 | Fire Serpent (Factory New)", "price": "500", "csgofast": "505.37", "autobuy": true }, { "item": "StatTrak™ AK-47 | Fire Serpent (Field-Tested)", "price": "500", "csgofast": "677.78", "autobuy": true }, { "item": "StatTrak™ AK-47 | Fire Serpent (Minimal Wear)", "price": "500", "csgofast": "914.06", "autobuy": true }, { "item": "★ Karambit | Marble Fade (Factory New)", "price": "350", "csgofast": "323.01", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Fade (Factory New)", "price": "500", "csgofast": "484.37", "autobuy": true }];

const refreshTime = 12300;
const refreshOneNumber = 8;
const startTime = 1;

io.on('connection', function (socket) {
  socket.send("connect");
  socket.on('disconnect', function () {
  });
});

var refresh = setInterval(function () {
  if (((moment().seconds() < 10 ? '0' : '') + moment().seconds()).substring(1) == startTime) {
    refreshFunction()
    clearInterval(refresh);
  }
}, 100);

function refreshFunction() {
  getData('http://steamcommunity.com/market/search/render/?currency=3&appid=730&start=0&count=100&query=' + searchString, 1);
  setInterval(function () {
    getData('http://steamcommunity.com/market/search/render/?currency=3&appid=730&start=0&count=100&query=' + searchString, 1);
  }, refreshTime);
}

function getData(url, refreshNumber) {
  http.get(url, (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.log(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData);
        if (refreshNumber === 1)
          checkData(parsedData)
        if (refreshNumber === 2)
          getOneItemPrice(parsedData)
      } catch (e) {
        console.log(e.message);
      }
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}

function checkData(body) {
  console.log('checkData');
  let $ = cheerio.load(body.results_html);
  knifes = [];
  $(".market_listing_searchresult .market_listing_item_name").each(function (index) {
    knifes[index] = { "item": $(this).text(), "price": 0 };
  });
  for (var i = 0; i < knifes.length; i++) {
    for (var j = 0; j < allItemsFromServer.length; j++) {
      if (knifes[i].item == allItemsFromServer[j].item) {
        refresh(knifes[i].item)
      }
    }
  }
}

function getOneItemPrice(body) {
  console.log('getOneItemPrice');
  var keys = Object.keys(body.listinginfo);
  let $ = cheerio.load(body.results_html);
  let knife = "";
  $(".market_listing_item_name").each(function () {
    knife = $(this).text();
  });
  if (!isNaN(body.listinginfo[keys[0]].converted_price_per_unit)) {
    var param = {
      listingid: body.listinginfo[keys[0]].listingid,
      subtotal: body.listinginfo[keys[0]].converted_price_per_unit,
      fee: body.listinginfo[keys[0]].converted_fee_per_unit,
      total: parseInt(body.listinginfo[keys[0]].converted_price_per_unit) + parseInt(body.listinginfo[keys[0]].converted_fee_per_unit)
    }
    for (var j = 0; j < allItemsFromServer.length; j++) {
      if (knife == allItemsFromServer[j].item) {
        if (param.total * 0.01 <= allItemsFromServer[j].price) {
          buyItem(param, knife);
        }
      }
    }
  }
}

function refresh(item) {
  getData("http://steamcommunity.com/market/listings/730/" + encodeURIComponent(item) + "/render?start=0&count=10&currency=3&language=english&format=json", 2);
  var callCount = 1;
  var repeater = setInterval(function () {
    if (callCount < refreshOneNumber) {
      getData("http://steamcommunity.com/market/listings/730/" + encodeURIComponent(item) + "/render?start=0&count=10&currency=3&language=english&format=json", 2);
      callCount += 1;
    } else {
      clearInterval(repeater);
    }
  }, 300);
}

function buyItem(param, name) {
  console.log(param);
  io.emit('buyItem', param);
  request({ url: 'https://api.myjson.com/bins/9elit', method: 'PUT', json: { item: name, time: moment().format('MMMM Do YYYY, h:mm:ss a'), price: param.total * 0.01 + 'e', param: param } }, function () { })
}