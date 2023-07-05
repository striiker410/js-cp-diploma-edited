function generateTicket() {                                             // Эта функция служит для генерации билета на основе данных, полученных из sessionStorage.
  let selectSeanse = JSON.parse(sessionStorage.selectSeanse);           // Получаем данные о выбранном сеансе из sessionStorage и преобразуем их из строки JSON в объект JavaScript
 
  // Инициализируем переменные places и price
  let places = "";                                                        // places будет содержать строку с информацией о выбранных местах, разделенных запятыми                                                               
  
  let price = 0;                                                          // price будет содержать общую стоимость выбранных мест

  for (let salePlace of selectSeanse.salesPlaces) {                  // Итерируемся по массиву salesPlaces, содержащему информацию о выбранных местах в сеансе
  if (places !== "") {
    places += ", ";
  }
  places += salePlace.row + "/" + salePlace.place;                      // Если тип места "standart", добавляем стоимость стандартного места к переменной price
  
  price += salePlace.type === "standart" ? Number(selectSeanse.priceStandart) : Number(selectSeanse.priceVip);
  }

  // Обновляем содержимое элементов на странице, отображающих информацию о билете
  document.querySelector(".ticket__title").innerHTML = selectSeanse.filmName;  
  document.querySelector(".ticket__chairs").innerHTML = places; 
  document.querySelector(".ticket__hall").innerHTML = selectSeanse.hallName;  
  document.querySelector(".ticket__start").innerHTML = selectSeanse.seanceTime;  

  let date = new Date(Number(selectSeanse.seanceTimeStamp * 1000));                                              // Создаем объект даты на основе временной метки сеанса
  let dateStr = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });          // Форматируем дату в строку в формате "день.месяц.год"
  let textQR =`                                                                                                
  Фильм: ${selectSeanse.filmName}
  Зал: ${selectSeanse.hallName}
  Ряд/Место ${places}
  Дата: ${dateStr}
  Начало сеанса: ${selectSeanse.seanceTime}
  Билет действителен строго на свой сеанс`;

  let qrcode = QRCreator(textQR, { image: "SVG" });                       // Создаем QR-код на основе текста QR и добавляем его на страницу
  qrcode.download();                                                       // Затем скачиваем QR-код
  document.querySelector(".ticket__info-qr").append(qrcode.result);
}

document.addEventListener("DOMContentLoaded", generateTicket);              // Добавляем обработчик события "DOMContentLoaded" к документу, который вызывает функцию generateTicket при загрузке страницы