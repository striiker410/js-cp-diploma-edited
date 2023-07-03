let selectSeanse = JSON.parse(sessionStorage.selectSeanse);                                                                                           // Получение информации о сеансе и конфигурации зала
let request = `event=get_hallConfig&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}`;       // Формируем запрос для получения конфигурации зала

document.addEventListener("DOMContentLoaded", () => {
  let buttonAcceptin = document.querySelector('.acceptin-button');                                                          // Находим кнопку "Принять" на странице
  let buyingTitle = document.querySelector('.buying__info-title');                                                            // Находим заголовок с названием фильма на странице
  let buyingStart = document.querySelector('.buying__info-start');                                                          // Находим информацию о начале сеанса на странице
  let buyingHall = document.querySelector('.buying__info-hall');                                                            // Находим информацию о зале на странице
  let priceStandart = document.querySelector('.price-standart');                                                            // Находим информацию о стандартной цене на странице
  let confStepWrapper = document.querySelector('.conf-step__wrapper');                                                      // Находим обертку для конфигурации зала на странице

  buyingTitle.innerHTML = selectSeanse.filmName;                                                                              // Заполняем заголовок с названием фильма данными из выбранного сеанса
  buyingStart.innerHTML = `Начало сеанса ${selectSeanse.seanceTime}`;                                                       // Заполняем информацию о начале сеанса данными из выбранного сеанса
  buyingHall.innerHTML = selectSeanse.hallName;                                                                             // Заполняем информацию о зале данными из выбранного сеанса
  priceStandart.innerHTML = selectSeanse.priceStandart;                                                                   // Заполняем информацию о стандартной цене данными из выбранного сеанса

  getRequest(request, (response) => {                                                                                     // Отправляем запрос для получения конфигурации зала
    console.log(response)
    if (response) {
      selectSeanse.hallConfig = response;
    }
    confStepWrapper.innerHTML = selectSeanse.hallConfig;
    
    let chairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));                                 // Находим все кресла на странице
    buttonAcceptin.setAttribute("disabled", true);                                                                        // Устанавливаем кнопку "Принять" в неактивное состояние
    
    chairs.forEach((chair) => {
      chair.addEventListener('click', (event) => {
        if (event.target.classList.contains('conf-step__chair_taken')) {
          return;
        };
        event.target.classList.toggle('conf-step__chair_selected');                                                         // Переключаем класс "conf-step__chair_selected" при клике на кресло  
        let chairsSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));           // Находим все выбранные кресла
        if (chairsSelected.length > 0) {
          buttonAcceptin.removeAttribute("disabled");                                                                     // Если есть выбранные кресла, активируем кнопку "Принять"
        } else {
          buttonAcceptin.setAttribute("disabled", true);                                                                  // Если нет выбранных кресел, деактивируем кнопку "Принять"
        };
      });
    });
  });
  
  
  
  buttonAcceptin.addEventListener("click", (event) => {                                                                   // Обработчик клика на кнопку "Принять"
    event.preventDefault();
    
    let selectedPlaces = Array();                                                                                         // Создаем пустой массив для выбранных мест
    let rows = Array.from(document.getElementsByClassName("conf-step__row"));
    
    for (let i = 0; i < rows.length; i++) {                                                                              // Проходим по каждому ряду и каждому месту в ряду с помощью цикла for
      let spanPlaces = Array.from(rows[i].getElementsByClassName("conf-step__chair"));
      for (let j = 0; j < spanPlaces.length; j++) {
        if (spanPlaces[j].classList.contains("conf-step__chair_selected")) {                                            // Если место выбрано
          let typePlace = (spanPlaces[j].classList.contains("conf-step__chair_standart")) ? "standart" : "vip";         // Определяем тип места
          selectedPlaces.push({
            "row": i+1,                                     // Записываем номер ряда
            "place": j+1,                                 // Записываем номер места
            "type":  typePlace,                           // Записываем тип места
          });
        };
      };
    };
    
    let configurationHall = document.querySelector('.conf-step__wrapper').innerHTML;                                      // Получаем конфигурацию зала
    selectSeanse.hallConfig = configurationHall;                                                                          // Сохраняем конфигурацию зала в выбранный сеанс
    selectSeanse.salesPlaces = selectedPlaces;                                                                          // Сохраняем выбранные места в выбранный сеанс
    
    sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));                                              // Сохраняем выбранный сеанс в sessionStorage
    
    window.location.href = "payment.html";                                                                             // Переходим на страницу оплаты
  });
});