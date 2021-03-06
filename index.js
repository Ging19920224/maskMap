/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const week = document.querySelector('.week');
const date = document.querySelector('.date');
const number = document.querySelector('.number');
const identity = document.querySelector('.identity');
const input = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__btn');
const list = document.querySelector('.data');
const loading = document.querySelector('.loading');
const menu = document.querySelector('.menu');
const mapView = document.querySelector('#map');
const menuBtn = document.querySelector('.menuBtn');
const btnFont = document.querySelector('.menuBtn i');
const menuWidth = menu.offsetWidth;
const mapWidth = mapView.offsetWidth;
// const mapHeight = mapView.offsetHeight;
// const screenWidth = window.screen.width;
let btnStatus = 'open';
let map = '';
let allData = [];
let localData = [];
let value = '';
(() => {
  const getDate = new Date();
  const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
  let month = getDate.getMonth() + 1;
  let day = getDate.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  const todayDate = `${getDate.getFullYear()}-${month}-${day}`;
  const todayWeek = weekArray[getDate.getDay()];
  week.innerHTML = `星期${todayWeek}`;
  date.innerHTML = todayDate;
  if (getDate.getDay() === 0) {
    identity.innerHTML = '今日全民皆可購買';
  } else if (getDate.getDay() % 2 === 0) {
    number.innerHTML = '2,4,6,8,0';
  } else {
    number.innerHTML = '1,3,5,7,9';
  }
})();
navigator.geolocation.getCurrentPosition((position) => {
  const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const nowLat = position.coords.latitude;
  const nowLng = position.coords.longitude;
  map = L.map('map', {
    center: [nowLat, nowLng],
    zoom: 15,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
  L.marker([nowLat, nowLng]).addTo(map)
    .bindPopup('<h5>目前位置</h5>')
    .openPopup();
  const markers = new L.MarkerClusterGroup().addTo(map);
  function filterData() {
    const check = '臺';
    const check2 = '台';
    let value2 = '';
    if (value.indexOf(check) !== -1) {
      value2 = value.replace('臺', '台');
    } else if (value.indexOf(check2) !== -1) {
      value2 = value.replace('台', '臺');
    }
    if (value2 !== '') {
      localData = allData.filter((item) => item.properties.address.indexOf(value) !== -1 || item.properties.name.indexOf(value) !== -1 || item.properties.address.indexOf(value2) !== -1 || item.properties.name.indexOf(value2) !== -1);
    } else {
      localData = allData.filter((item) => item.properties.address.indexOf(value) !== -1 || item.properties.name.indexOf(value) !== -1);
    }
  }
  function changeMap(data) {
    let adult = 'bg-adult';
    let child = 'bg-child';
    if (data.properties.mask_adult === 0) adult = 'bg-dark';
    if (data.properties.mask_child === 0) child = 'bg-dark';
    const LatLng = L.latLng(data.geometry.coordinates[1], data.geometry.coordinates[0]);
    map.setView(LatLng, 16);
    L.marker([data.geometry.coordinates[1], data.geometry.coordinates[0]],
      { icon: greenIcon }).addTo(map)
      .bindPopup(`
      <div class="mark__info">
        <h5 class="text-center">${data.properties.name}</h5>
        <p class="text-center">${data.properties.address}</p>
        <p class="text-center">${data.properties.phone}</p>
        <p>${data.properties.note}</p>
        <div class="data__warp">
          <div class="mark__number position-relative mr-20 ${adult}">
            <span class="mark__mask position-absolute">成人口罩</span>
            <span class="mark__num position-absolute">${data.properties.mask_adult}</span>
          </div>
          <div class="mark__number position-relative ${child}">
            <span class="mark__mask position-absolute">兒童口罩</span>
            <span class="mark__num position-absolute">${data.properties.mask_child}</span>
          </div>
        </div>
      <div/>
    `)
      .openPopup();
  }
  function clickData(id) {
    const targetData = allData.filter((item) => item.properties.id === id);
    changeMap(targetData[0]);
  }
  function creatList(data) {
    if (data.length === 0) {
      list.innerHTML = '<div class="data__info"><h5 class="text-center">無符合條件藥局</h5></div>';
      return;
    }
    let info = '';
    data.forEach((item) => {
      let adult = 'bg-adult';
      let child = 'bg-child';
      if (item.properties.mask_adult === 0) adult = 'bg-dark';
      if (item.properties.mask_child === 0) child = 'bg-dark';
      info += `
      <div class="data__info" data-id="${item.properties.id}">
        <h5 data-id="${item.properties.id}">${item.properties.name}</h5>
        <p data-id="${item.properties.id}">${item.properties.address}</p>
        <p data-id="${item.properties.id}">${item.properties.phone}</p>
        <p data-id="${item.properties.id}">${item.properties.note}</p>
        <div class="data__warp" data-id="${item.properties.id}">
          <div class="data__number position-relative mr-20 ${adult}" data-id="${item.properties.id}">
            <span class="data__mask position-absolute" data-id="${item.properties.id}">成人口罩</span>
            <span class="data__num position-absolute" data-id="${item.properties.id}">${item.properties.mask_adult}</span>
          </div>
          <div class="data__number position-relative ${child}" data-id="${item.properties.id}">
            <span class="data__mask position-absolute" data-id="${item.properties.id}">兒童口罩</span>
            <span class="data__num position-absolute" data-id="${item.properties.id}">${item.properties.mask_child}</span>
          </div>
        </div>
      </div>`;
    });
    list.innerHTML = '<img src="./images/loading.gif">';
    setTimeout(() => {
      list.innerHTML = info;
      const dataInfo = document.querySelector('.data');
      dataInfo.addEventListener('click', (e) => {
        clickData(e.target.dataset.id);
      });
    }, 300);
  }
  function keyFunction() {
    if (event.keyCode === 13) {
      value = input.value;
      filterData();
      creatList(localData);
      changeMap(localData[0]);
    }
  }
  function getMask(data) {
    data.forEach((item) => {
      let adult = 'bg-adult';
      let child = 'bg-child';
      if (item.properties.mask_adult === 0) adult = 'bg-dark';
      if (item.properties.mask_child === 0) child = 'bg-dark';
      markers.addLayer(L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], { icon: greenIcon })
        .bindPopup(`
          <div class="mark__info">
            <h5 class="text-center">${item.properties.name}</h5>
            <p class="text-center">${item.properties.address}</p>
            <p class="text-center">${item.properties.phone}</p>
            <p>${item.properties.note}</p>
            <div class="data__warp">
              <div class="mark__number position-relative mr-20 ${adult}">
                <span class="mark__mask position-absolute">成人口罩</span>
                <span class="mark__num position-absolute">${item.properties.mask_adult}</span>
              </div>
              <div class="mark__number position-relative ${child}">
                <span class="mark__mask position-absolute">兒童口罩</span>
                <span class="mark__num position-absolute">${item.properties.mask_child}</span>
              </div>
            </div>
          <div/>
        `));
    });
    map.addLayer(markers);
  }
  function nearbyMask(lat, data) {
    const nearbyData = data.filter((item) => Math.abs(item.geometry.coordinates[1] - lat) < 0.015);
    creatList(nearbyData);
  }
  menuBtn.addEventListener('click', () => {
    if (btnStatus === 'open') {
      btnStatus = 'close';
      mapView.style.width = '100%';
      menu.style.width = '0%';
      btnFont.style.transform = 'rotate(180deg)';
    } else {
      btnStatus = 'open';
      mapView.style.width = `${mapWidth}px`;
      menu.style.width = `${menuWidth}px`;
      btnFont.style.transform = 'rotate(0deg)';
    }
  });
  axios.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json').then((response) => {
    allData = response.data.features;
    getMask(allData);
    nearbyMask(position.coords.latitude, allData);
    loading.style.display = 'none';
    searchBtn.addEventListener('click', () => {
      value = input.value;
      filterData();
      creatList(localData);
      changeMap(localData[0]);
    });
    document.onkeydown = keyFunction;
  }).catch((error) => {
    loading.innerHTML = error;
  });
});
