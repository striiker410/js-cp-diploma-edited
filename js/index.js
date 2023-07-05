let Request = "event=update";

document.addEventListener("DOMContentLoaded", () => {    
  let dayNumb = document.querySelectorAll(".page-nav__day-number");   // Получаем все элементы с классом "page-nav__day-number" и сохраняем их в переменную dayNumb
  let dayWeek = document.querySelectorAll(".page-nav__day-week");       // Получаем все элементы с классом "page-nav__day-week" и сохраняем их в переменную dayWeek
  let dayWeekCatalog = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];         // Создаем массив dayWeekCatalog, содержащий сокращенные названия дней недели
  let today = new Date();                                               // Создаем объект today, представляющий текущую дату без времени
  today.setHours(0, 0, 0);
  for (let i = 0; i < dayNumb.length; i++) {                             // В цикле проходим по всем элементам dayNumb
    let day = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));       // Вычисляем дату, добавляя к текущей дате количество миллисекунд, соответствующее количеству дней от начала текущей даты
    let markTime = Math.trunc(day/1000);                                 
    dayNumb[i].innerHTML = `${day.getDate()},`;
    dayWeek[i].innerHTML = `${dayWeekCatalog[day.getDay()]}`;
    let dayLink = dayNumb[i].parentNode
    dayLink.dataset.markTime = markTime;                                        // Добавляем атрибут data-markTime со значением временной метки для элемента dayLink
    if ((dayWeek[i].innerHTML == 'Вс') || (dayWeek[i].innerHTML == 'Сб')) {    // Если день недели является выходным (Вс или Сб), добавляем класс "page-nav__day_weekend" для элемента dayLink, в противном случае удаляем этот класс
      dayLink.classList.add('page-nav__day_weekend');
    } else {
      dayLink.classList.remove('page-nav__day_weekend');
    };
  };

  getRequest(Request, (response) => {                                           
    let subject = {};                                                              //Создание объекта для хранения данных
    
    subject.seances = response.seances.result;                                       // Заполняем объект данными из response
    subject.films = response.films.result;
    subject.halls = response.halls.result;
    subject.halls = subject.halls.filter(hall => hall.hall_open == 1);                  // Фильтруем залы, оставляем только открытые
    
    let main = document.querySelector("main");

    subject.films.forEach((film) => {
      let seancesHTML = '';
      let filmId = film.film_id;
      
      subject.halls.forEach((hall) => {
        let seances = subject.seances.filter(seance => ((seance.seance_hallid == hall.hall_id) && (seance.seance_filmid == filmId)));        // Фильтрация сеансов для текущего фильма и зала
        if (seances.length > 0) {                                                                                                             // Если есть сеансы, создаем HTML-код для них
          seancesHTML += `
            <div class="movie-seances__hall">
              <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
              <ul class="movie-seances__list">`
          seances.forEach(seance => seancesHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time"   href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}" 
              data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`);
          seancesHTML += `
            </ul>
            </div>`
        };
      });

      if (seancesHTML) {
        main.innerHTML += `
          <section class="movie">
            <div class="movie__info">
              <div class="movie__poster">
                <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
              </div>
              <div class="movie__description">
                <h2 class="movie__title">${film.film_name}</h2>
                <p class="movie__synopsis">${film.film_description}</p>
                <p class="movie__data">
                  <span class="movie__data-duration">${film.film_duration} мин.</span>
                  <span class="movie__data-origin">${film.film_origin}</span>
                </p>
              </div>
            </div>
            ${seancesHTML}
          </section>`
      };
    });

    let daydayLinks = Array.from(document.querySelectorAll(".page-nav__day"));
		let movieSeances = Array.from(document.querySelectorAll(".movie-seances__time"));
    
    daydayLinks.forEach(daydayLink => daydayLink.addEventListener('click', (event) => {                        // Добавляем обработчик события click для каждого элемента
      event.preventDefault();
      
      document.querySelector(".page-nav__day_chosen").classList.remove("page-nav__day_chosen");                // Удаляем класс "page-nav__day_chosen" у выбранного элемента
			daydayLink.classList.add("page-nav__day_chosen");                                                        // Добавляем класс "page-nav__day_chosen" к выбранному элементу daydayLink
      
      let markTimeDay = Number(event.target.dataset.markTime);                                                 // Получаем значение markTimeDay из атрибута data-markTime выбранного элемента
      if (isNaN(markTimeDay)) {                                                                                // Если markTimeDay не является числом, получаем значение markTimeDay из атрибута data-markTime ближайшего родительского элемента с классом "page-nav__day"
        markTimeDay = Number(event.target.closest('.page-nav__day').dataset.markTime);
      };

      movieSeances.forEach(movieSeance => {                                                                    // Для каждого элемента movieSeance вычисляем значения markTimeSeanceDay, markTimeSeance и markTimeNow
        let markTimeSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
        let markTimeSeance = markTimeDay + markTimeSeanceDay;
        let markTimeNow = Math.trunc(+new Date() / 1000);
        movieSeance.dataset.seanceTimeStamp = markTimeSeance;                                                   // 05.07.2023  Исправлена ошибка (seanceTimeStamp в строке movieSeance.dataset.seanceTimeStamp = markTimeSeance);
      
        if ((markTimeSeance - markTimeNow) > 0) {                                                               // Проверяем условие (markTimeSeance - markTimeNow) > 0 с помощью оператора if
          movieSeance.classList.remove('acceptin-button-disabled');
        } else {
          movieSeance.classList.add('acceptin-button-disabled');
        };
      });
    }));
    
    daydayLinks[0].click();                                                                                      // Вызываем событие click для первого элемента daydayLinks
    
    movieSeances.forEach(movieSeance => movieSeance.addEventListener('click', (event) => {                       // Добавляем обработчик события click для каждого элемента movieSeance
      let selectSeanse = event.target.dataset;
      selectSeanse.hallConfig = subject.halls.find(hall => hall.hall_id == selectSeanse.hallId).hall_config;
        sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));
    }));
  });
});