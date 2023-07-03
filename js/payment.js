let selectSeanse = JSON.parse(sessionStorage.selectSeanse);                                                     // Получаем данные о выбранном сеансе из sessionStorage
let placesArray = selectSeanse.salesPlaces.map(salePlace => `${salePlace.row}/${salePlace.place}`);
let price = selectSeanse.salesPlaces.reduce((acc, salePlace) => {                                                 // Вычисляем общую стоимость выбранных мест
  if (salePlace.type === "standart") {
    return acc + Number(selectSeanse.priceStandart);
  } else {
    return acc + Number(selectSeanse.priceVip);
  }
}, 0);

let places = placesArray.join(", ");                                                                              // Преобразуем массив строк в одну строку, разделяя элементы запятой  

document.querySelector(".ticket__title").innerHTML = selectSeanse.filmName;                                       // Заполняем элементы на странице данными из выбранного сеанса
document.querySelector(".ticket__chairs").innerHTML = places;
document.querySelector(".ticket__hall").innerHTML = selectSeanse.hallName;
document.querySelector(".ticket__start").innerHTML = selectSeanse.seanceTime;
document.querySelector(".ticket__cost").innerHTML = price;

let newHallConfig = selectSeanse.hallConfig.replace(/selected/g, "taken");                                        // Заменяем классы "selected" на "taken" в конфигурации зала
console.log(newHallConfig);

const acceptinButton = document.getElementById("acceptin-button");                                              // Получаем кнопку "Принять"

acceptinButton.addEventListener("click", function(event) {                                                      // Добавляем обработчик клика на кнопку "Принять"
  event.preventDefault();
  
  let request = `event=sale_add&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}&hallConfiguration=${newHallConfig}`;  // Формируем запрос для добавления продажи                        
  
  getRequest(request, function() {                                                                             // Отправляем запрос на сервер
    window.location.href = 'ticket.html';
  });
});