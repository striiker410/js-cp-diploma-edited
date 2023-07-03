function getRequest(body, callback) {                                            // Создаем функцию getRequest, которая принимает два аргумента: body  и callback 
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();                                               // Создаем новый объект XMLHttpRequest

    xhr.open("POST", "https://jscp-diplom.netoserver.ru/", true);                   // Открываем соединение с сервером
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onload = () => {                                                             // Определяем  onload, который вызывается при успешном завершении запроса
      if (xhr.status >= 200 && xhr.status < 300) {                                   // Проверяем статус запроса
        const response = xhr.response;                                                // Получаем ответ от сервера
        if (callback) {                                                                // Если передан колбэк, вызываем его с полученным ответом
          callback(response);
        }
        resolve(response);                                                              // Разрешаем Promise с полученным ответом
      } else {
        reject(xhr.statusText);                                                          // Отклоняем Promise с текстом статуса запроса
      }
    };

    xhr.onerror = () => {                                                             // Определяем обработчик события onerror, который вызывается при ошибке запроса
      reject(xhr.statusText);
    };
  });
}