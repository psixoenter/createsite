// Learn JS :)

/* Captcha - 1 */
const variable = 7531; // общий ключ с PHP
const DIGIT_IMAGES = [
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">0</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">1</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">2</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">3</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">4</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">5</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">6</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">7</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">8</text></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 30 40"><text x="50%" y="80%" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#111" text-anchor="middle">9</text></svg>')
];
var generateCaptchaDiv = null;

function clearOldCaptcha() {
  if (generateCaptchaDiv) {
    generateCaptchaDiv.innerHTML = ''; // убираем старую капчу
    generateCaptchaDiv = null;
  }
}

// --- простая XOR + Base64 ---
function xorEncrypt(str, key) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const out = bytes.map((b, i) => b ^ (key >> (i % 4)));
  let bin = '';
  out.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}

// --- основная функция ---
function generateCaptcha(containerId, digits = 1) {
  //alert('!1:'+ containerId);
  if (containerId) {
    clearOldCaptcha();
    generateCaptchaDiv = document.getElementById(containerId);
  }

  // если уже есть кука verified — не показываем
  if (document.cookie.includes('variable=')) {
    generateCaptchaDiv.innerHTML = '';
    return;
  }

  // генерируем случайные числа
  const max = Math.pow(10, digits) - 1;
  const a = Math.floor(Math.random() * (max + 1));
  const b = Math.floor(Math.random() * (max + 1));

  // шифруем только данные (а + b)
  const token = xorEncrypt(JSON.stringify({ a, b }), variable);

  // показываем только картинки, без alt-текста
  function renderNumber(num) {
    return String(num)
      .split('')
      .map(n => `<img src="${DIGIT_IMAGES[+n]}" style="height:24px;" alt="">`)
      .join('');
  }

  // вставляем форму (пользователь не видит числа в исходнике)
/*  el.innerHTML = `
    <form id="captcha-form" onsubmit="return verifyCaptcha(event)">
      <div style="display:flex;align-items:center;gap:6px;font-size:22px;margin:6px 0;">
        ${renderNumber(a)} + ${renderNumber(b)} =
        <input name="captcha_answer" maxlength="5" style="width:50px;text-align:center;">
        <input type="hidden" name="captcha_token" value="${token}">
        <input type="hidden" name="action" value="captcha">
        <button type="submit">OK</button>
      </div>
    </form>
  `;*/

// вставляем форму (пользователь не видит числа в исходнике)
generateCaptchaDiv.innerHTML = `
  <form id="captcha-form" onsubmit="return verifyCaptcha(event)">
    <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; margin: 8px 0; font-family: Arial, sans-serif; border: 1px solid #ccc; border-radius: 6px; padding: 6px 10px; background: #fafafa; width: fit-content;">
    <div id="captchaContainer_">
       <img class="bot-icon" src="../../lib/support.png" style="width: 24px; height: 24px;">
       <span style="font-weight: bold; color: #666; letter-spacing: 0.5px; margin-right: 4px; font-size: 12px;">?</span>
       ${renderNumber(a)} + ${renderNumber(b)} =
       <input name="captcha_answer" maxlength="5" style="width: 55px; text-align: center; font-size: 16px; padding: 3px 5px; border: 1px solid #bbb; border-radius: 4px; outline: none;" value="">
       <input type="hidden" name="captcha_token" value="${token}">
       <input type="hidden" name="action" value="captcha">
       <button type="submit" style="background-color: #f2f2f2; color: #666; font-size: 15px; padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; width: 70px;"
         onmouseover="this.style.backgroundColor='#e6e6e6'; this.style.borderColor='#bbb';"
         onmouseout="this.style.backgroundColor='#f2f2f2'; this.style.borderColor='#ccc';"
       >
         OK
       </button>
      </div>
    </div>
  </form>
`;

}

function verifyCaptcha(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const data = {
    captcha_token: formData.get('captcha_token'),
    captcha_answer: formData.get('captcha_answer').trim(),
    action: 'captcha' // 👈 ключевой параметр, чтобы попасть в нужный блок
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(r => r.text())
  .then(res => {//alert(":"+res);
      if (res.trim() === "1") {
        document.getElementById("captchaContainer_").innerHTML =
          "<b style='color:green'>✔️ Verification successful!</b>";
        //location.reload(); // you can just hide the form instead of reloading
      } else {
        //alert("❌ Incorrect! Please try again.");
        generateCaptcha();
      }
    })
    .catch(() => alert("Connection error with the server."));
}

function hasCaptchaCookie() {
  //return document.cookie.includes('variable=');
  return document.cookie
    .split(';')
    .some(c => {
      const [name, value] = c.trim().split('=');
      return name === 'formHash' && value && value.trim() !== '';
    });
}
/* Captcha - 2 */

// Получаем элемент с id="chatData"
const chatData = document.getElementById('chatData');

// Извлекаем значения data-атрибутов
const userEmail = chatData.getAttribute('data-email');
const userName = chatData.getAttribute('data-name');
const userPhone = chatData.getAttribute('data-phone');
const userId = chatData.getAttribute('data-user-id');
const urlCS = chatData.getAttribute('data-urlcs');


var originalTitle = document.title;
var blinkTimeout;
var isBlinking = false; // Флаг для отслеживания, мигает ли заголовок

document.cookie = "formHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

function blinkTitle(newMessage) {
    if (isBlinking) return; // Не запускаем повторно, если уже мигает
    isBlinking = true;
    var isOriginal = true;
    document.querySelector('.chat-icon').classList.add('blinking'); // Добавляем класс для мигания
    blinkTimeout = setInterval(function() {
        document.title = isOriginal ? newMessage : originalTitle;
        isOriginal = !isOriginal;
    }, 1000); // меняет заголовок каждые 1 сек
}

function stopBlinking() {
    if (!isBlinking) return; // Не останавливаем, если мигание уже выключено
    clearInterval(blinkTimeout);
    document.title = originalTitle;
    document.querySelector('.chat-icon').classList.remove('blinking'); // Убираем класс мигания
    isBlinking = false;
}

// Останавливаем мигание после клика по странице или после получения фокуса
//window.onfocus = stopBlinking;
//document.addEventListener('click', stopBlinking);
//document.getElementById('chatBody').addEventListener('focus', stopBlinking);
document.getElementById('chatBody').addEventListener('click', stopBlinking);
document.getElementById('chatButton').addEventListener('click', stopBlinking);

/*
const submitButton = document.getElementById('submitButton');
if (submitButton) {
    submitButton.addEventListener('click', submitForm);
};*/

document.addEventListener('DOMContentLoaded', () => {
    // Обрабатываем все формы на странице
      // Навешиваем обработчик на все формы контактов
/*      document.querySelectorAll('form.contact-form').forEach(form => {
        form.addEventListener('submit', handleContactForm);
      });   alert("-2"); */
    document.querySelectorAll('form.contact-form').forEach(form => {
        // Находим кнопку submit внутри формы и добавляем событие click
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) { 
            submitButton.disabled = false; // Разблокируем кнопку
            // Добавляем обработчик события click вместо submit
            submitButton.addEventListener('click', (event) => {
                //submitButton.disabled = true; // заблокируем кнопку
                //event.preventDefault(); // Останавливаем стандартную отправку формы
                //submitForm(event, submitButton); // Вызываем функцию отправки
                handleFormSubmission(event);
            });
        };
    });
});


    function setCookie(name, value, sec) {
        var expires = "";
        if (sec) {
            var date = new Date();
            date.setTime(date.getTime() + (sec * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // определяем, HTTPS ли сейчас
        var isSecure = location.protocol === "https:";
        var secureFlag = isSecure ? "; SameSite=None; Secure" : "";
        document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/" + secureFlag;
    }

    // чтение куки (оставь как есть)
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }

    // Check if the chat was already opened
//    window.addEventListener('load', function() {
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}       //alert(getCookie('chatOpened'));
        var popupDelay = document.getElementById("chatData").dataset.delay || 5;
        if (!getCookie('chatOpened') /*&& !isMobileDevice()*/) {
             setTimeout(function() {
               toggleChat(true);
             }, popupDelay * 1000);

            //toggleChat(true);
            //setTimeout(toggleChat(true), 15000); // 15000 milliseconds = 15 seconds
        } else 
           if (getCookie('chatOpened') === 'true') {
             toggleChat(false);
           } else {
              //setTimeout(toggleChat, 15000); // 15000 milliseconds = 15 seconds
           };
//    });

//setTimeout(startFun, 2000);

//function prefPhone(st_) {
//    var input = document.querySelector(st_);
//        window.intlTelInput(input, {
//          initialCountry: "gb",
//        utilsScript:"../../js/utils.js?1",
//	separateDialCode: true,
//	initialCountry: "auto",
//	geoIpLookup: function (callback) { callback($.cookie('country18')) }
//    });
//};

//php

// Функция для преобразования timestamp в читаемую дату и время
function formatTimestamp(timestamp) {
    var date = new Date(timestamp * 1000); // Умножаем на 1000, так как timestamp в секундах
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
    var year = date.getFullYear();
    return `(${day}.${month}.${year} ${hours}:${minutes})`;
}

let lastFileSize = parseInt(getCookie('lastFileSize') || 0, 10);
let lastFileTime = parseInt(getCookie('lastFileTime') || 0, 10);

let lastMsgTime = false;
let lastMsgTimeC = 0;
let adminMode = false;
let timeoutId;
let url = '../../lib/chatbot.php';

function loadChatHistory(full = false) {
    var chatContent = document.getElementById("chatMessages");
    chatContent.innerHTML = ""; // Очищаем текущее содержимое
    //var url = '../../lib/chatbot.php' ;//+ (full ? '&full=1' : '');
    document.getElementById('loadingAnimation').style.display = 'block';
    document.getElementById('chatMessages').style.display = 'none';

    setTimeout(function() {
    // Load chat history
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'loadChatHistory', full: full }),
    })
    .then(response => response.json())
    .then(data => {  //alert(JSON.stringify(data, null, 2)); 
        //if (data.changed && data.messages && Array.isArray(data.messages) && data.messages.length > 0) return;
        if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) return;

        lastFileSize = data.lastFileSize;
        lastFileTime = data.lastFileTime;
        if (chatPopup.classList.contains("visible")) { 
         setCookie('lastFileSize', lastFileSize, 30*24*3600);
         setCookie('lastFileTime', lastFileTime, 30*24*3600);
        };

        var hasMore = data.hasMore;

        if (hasMore && !full) {
            var buttonContainer = createLoadFullChatButton();
            chatContent.appendChild(buttonContainer); // Добавляем кнопку
        }

          // Загружаем сообщения
            data.messages.forEach(function(message) {
                var st = "AI Chatbot";
                var nameElement = document.createElement("div");
                nameElement.classList.add("message-content-n");
                 if (message.sender==2) {
                  st = "Administrator";
                 } if (message.sender==1) {
                  st = "You";
                 };
                nameElement.textContent = st+" "+formatTimestamp(message.timestamp)+":";
                var messageElement = document.createElement("div");
                //var senderClass = senderClassMap[message.sender] || 'bot'; // По умолчанию 'bot'
                messageElement.classList.add("chat-message", "snd"+message.sender);
                //if (message.sender!=="user") { if (message.unread) { messageElement.classList.add("chat-message", message.unread); }; };
                //messageElement.classList.add("chat-message", message.sender === 'user' ? "user" : "bot");

                var messageContent = document.createElement("div");
                messageContent.classList.add("message-content");
                //messageContent.textContent = message.message;
                renderMessageContent(message.message, messageContent);
                messageElement.appendChild(nameElement);
                if (message.sender!=1) {
                  var botIcon2 = document.createElement("img");
                  if (message.sender==0) { botIcon2.src = "../../lib/support.png"; } else
                    { botIcon2.src = "../../lib/support2.png"; };
                  botIcon2.classList.add("bot-icon");
                  messageElement.appendChild(botIcon2);
                };
                messageElement.appendChild(messageContent);
                chatContent.appendChild(messageElement);
            });
        // Если есть еще сообщения, показываем кнопку "Load Full Chat"
        //if (hasMore) { document.getElementById("loadFullChatButtonContainer").style.display = "block"; } 
        // else { document.getElementById("loadFullChatButtonContainer").style.display = "none"; };
        checkForUpdates(0,0); //первоначально забираем только данные о файле истории - дату последнего изменения и размер
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }).finally(() => {
        document.getElementById('loadingAnimation').style.display = 'none';
        document.getElementById('chatMessages').style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    });
   }, 1000); // 1-секундная задержка
}


function createLoadFullChatButton() {
    var buttonContainer = document.createElement('div');
    buttonContainer.id = 'loadFullChatButtonContainer';
    var button = document.createElement('button');
    button.id = 'loadFullChatButton';
    button.innerText = 'View more messages...';// 'View more...';
    button.onclick = function() { loadChatHistory(true); };
    buttonContainer.appendChild(button);
    return buttonContainer;
}

//Читаем изменения в поле ввода
document.getElementById('chatInput').addEventListener('input', function() {
   lastMsgTime = true; lastMsgTimeC++;
   if (lastMsgTimeC==1) { updMsg(); };
});


function updMsg() {
    lastMsgTime = false; //Обновляем сообщение alert('chatUpd')
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ chatUpd: true, }),
    })//.then(response => response.json()).then(data => { //alert(JSON.stringify(data, null, 2)); }).catch(error => { }).finally(() => { })*/;
}

let blocked = false;
let msgupd = false;

function checkForUpdates(full,again) { //alert(lastFileSize+'!'+lastFileTime);
    // Получаем chatName из атрибута
    //alert(full+"-"+lastFileSize+"-"+lastFileTime);
    if (blocked) return;
    if (lastMsgTime) { updMsg(); };
    blocked = true; new_ = false;  //alert(lastFileSize+"-"+lastFileTime);
    // Отправляем запрос на сервер для проверки изменений
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'chatInfo',
            full: full,
            lastFileSize: lastFileSize,
            lastFileTime: lastFileTime
        }),
    })
    .then( response => response.json())
    //.then(response => response.text()) 
    .then(data => {
        //alert(JSON.stringify(data, null, 2)); //null и 2 для форматирования
        // Если файл изменился, загружаем новые строки
        if ((data.msgupd===msgupd) && (!data.changed)) return;
        msgupd = data.msgupd;
        //if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) return;

        lastFileSize = data.lastFileSize;
        lastFileTime = data.lastFileTime;
        if (chatPopup.classList.contains("visible")) {
          setCookie('lastFileSize', lastFileSize, 30*24*3600);
          setCookie('lastFileTime', lastFileTime, 30*24*3600);
        };

        //alert(lastFileSize + "-" + lastFileTime);
        var chatContent = document.getElementById('chatMessages');

        if (data.changed) {
            //loadNewMessages(data.messages);  // Загружаем новые сообщения
            //alert(lastFileSize + ' - ' + lastFileTime);
            if (lastMessageElement) { lastMessageElement.remove(); };
            data.messages.forEach(function(message) {
               var st = "AI Chatbot";
               var nameElement = document.createElement("div");
               nameElement.classList.add("message-content-n");
                if (message.sender==2) { st = "Administrator";
                } if (message.sender==1) { st = "You"; };
               nameElement.textContent = st+" "+formatTimestamp(message.timestamp)+":";
               var messageElement = document.createElement("div");
               //var senderClass = senderClassMap[message.sender] || 'bot'; // По умолчанию 'bot'
               messageElement.classList.add("chat-message", "snd"+message.sender);
               //if (message.sender!=="user") { if (message.unread) { messageElement.classList.add("chat-message", message.unread); }; };
               //messageElement.classList.add("chat-message", message.sender === 'user' ? "user" : "bot");
               var messageContent = document.createElement("div");
               messageContent.classList.add("message-content");
               //messageContent.textContent = message.message;
               renderMessageContent(message.message, messageContent);
               messageElement.appendChild(nameElement);
               if (message.sender!=1) { new_ = true; //alert(st);
                 var botIcon2 = document.createElement("img");
                 if (message.sender==0) { botIcon2.src = "../../lib/support.png"; } else
                   { botIcon2.src = "../../lib/support2.png"; };
                 botIcon2.classList.add("bot-icon");
                 messageElement.appendChild(botIcon2);
               };
               messageElement.appendChild(messageContent);
               chatContent.appendChild(messageElement);
            });
          };
        if (data.msgupd) {
             toggleTypingIndicator('add');
             if (!adminMode) 
               { adminMode = true;
                 var nameElement = document.createElement("div");
                 nameElement.classList.add("message-content-n");
                 nameElement.textContent = "Administrator joined the chat.";
                 var messageElement = document.createElement("div");
                 messageElement.classList.add("chat-message", "snd0");
                 messageElement.appendChild(nameElement);
                 chatContent.appendChild(messageElement);
                 chatContent.scrollTop = chatContent.scrollHeight;
                 if (timeoutId) { clearTimeout(timeoutId); };
                 timeoutId = setTimeout(function() {
                   adminMode = false;
                   //console.log("adminMode set to false after 5 minutes");
                 }, 3*60*1000);//5 minutes
               };
        } else { toggleTypingIndicator('remove'); };
        if (data.changed || data.msgupd) { chatContent.scrollTop = chatContent.scrollHeight; };
    })
    .catch(error => {
        //console.error('Error update:', error);
    })
    .finally(() => {
        if(new_) { blinkTitle("✉️ "); };
        blocked = false;  // Сброс блокировки в любом случае
        if(again) { setTimeout(() => checkForUpdates(1,1), 5000); }
    });
}

checkForUpdates(1,1);

function toggleChat(timer) {
        var chatPopup = document.getElementById("chatPopup");
        var chatMessages = document.getElementById("chatMessages");

        if (chatPopup.classList.contains("visible") && (timer === false)) {
            chatPopup.classList.remove("visible");
            chatPopup.classList.add("hidden");
            setTimeout(() => chatPopup.style.display = 'none', 500);
            setCookie('chatOpened', 'false', 1*24*3600); // Set cookie when chat is closed 
        } else {
            chatPopup.classList.remove("hidden");
            chatPopup.style.display = 'block';
            setTimeout(() => chatPopup.classList.add("visible"), 10); // Add class after display block
            setCookie('chatOpened', 'true', 1*24*3600); // Set cookie when chat is opened 

            // Load chat history
            loadChatHistory();

            // Add initial bot message
            if (chatMessages.childElementCount === 0) {                              
                var botMessage = document.createElement("div");
                botMessage.classList.add("chat-message", "snd0");
                var botIcon = document.createElement("img");
                botIcon.src = "../../lib/support.png";
                botIcon.classList.add("bot-icon");
                var botMessageContent = document.createElement("div");
                botMessageContent.classList.add("message-content");
                botMessageContent.textContent = "Hello, I am your support bot. How can I help you today? 😊";
                botMessage.appendChild(botIcon);
                botMessage.appendChild(botMessageContent);
                chatMessages.appendChild(botMessage);

                // Check if user ID is not set and show the contact form

                //php2
                /*if (userId < 1) {
                    showContactForm();
                    // Инициализация intl-tel-input
                    //setTimeout(function() { prefPhone("#phoneCS_") }, 1000);
                } else {
                    var botMessage2 = document.createElement("div");
                    botMessage2.classList.add("chat-message", "snd0");
                    var botIcon2 = document.createElement("img");
                    botIcon2.src = "../../lib/support.png";
                    botIcon2.classList.add("bot-icon");
                    var botMessageContent2 = document.createElement("div");
                    botMessageContent2.classList.add("message-content");

                    //php3
                    botMessageContent2.textContent = "Contacts: " + userName + ", " + userEmail + ", " + userPhone;

                    botMessage2.appendChild(botIcon2);
                    botMessage2.appendChild(botMessageContent2);
                    chatMessages.appendChild(botMessage2);
                }*/
            }
        }
    }


function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target.closest("form");
  if (!form) return;

  const type = form.dataset.type || (form.closest("#chatMessages") ? "chat" : "site");
  const chatMessages = document.getElementById("chatMessages");
  const submitBtn = form.querySelector('button[type="button"], button[type="submit"]');

  const emailField = form.querySelector('input[name*="email"]');
  const nameField = form.querySelector('input[name*="name"]');
  const phoneField = form.querySelector('input[name*="phone"]');
  const msgField = form.querySelector('textarea[name*="msg"]');
  const errMsg = form.querySelector(".error-message");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namePattern = /^[\p{L}\p{N}\s'’.-]+$/u;
  const phonePattern = /^[0-9+\s()\-]+$/;

  const formData = new FormData(form);
  const data = {
    name: (formData.get("nameCS") || formData.get("name") || "").trim(),
    email: (formData.get("emailCS") || formData.get("email") || "").trim(),
    phone: (formData.get("phoneCS") || formData.get("phone") || "").trim(),
    msg: (formData.get("msgCS") || formData.get("msg") || "").trim(),
    viber: formData.get("viberCS") || formData.get("viber") ? 1 : 0,
    whatsapp: formData.get("whatsappCS") || formData.get("whatsapp") ? 1 : 0,
    telegram: formData.get("telegramCS") || formData.get("telegram") ? 1 : 0,
    action: "submitContactForm",
  };

  // === Валидация ===
  let isValid = true;

  // Имя
  if (!namePattern.test(data.name) || data.name.length < 2) {
    nameField.style.borderColor = "red";
    nameField.style.background = "#ffe6e6";
    isValid = false;
  } else {
    nameField.style.borderColor = "#ccc";
    nameField.style.background = "white";
  }

  // Телефон
  if (!phonePattern.test(data.phone)) {
    phoneField.style.borderColor = "red";
    phoneField.style.background = "#ffe6e6";
    isValid = false;
  } else {
    phoneField.style.borderColor = "#ccc";
    phoneField.style.background = "white";
  }

  // Email
  if (!emailPattern.test(data.email)) {
    emailField.style.borderColor = "red";
    emailField.style.background = "#ffe6e6";
    isValid = false;
  } else {
    emailField.style.borderColor = "#ccc";
    emailField.style.background = "white";
  }

  // Msg — только для сайта
  if (type === "site" && msgField) {
    if (data.msg.length < 3) {
      msgField.style.borderColor = "red";
      msgField.style.background = "#ffe6e6";
      isValid = false;
    } else {
      msgField.style.borderColor = "#ccc";
      msgField.style.background = "white";
    }
  }

  if (errMsg) errMsg.style.display = isValid ? "none" : "block";
  if (!isValid) return;

/*
  // === Капча ===
  if (type === "site" && !hasCaptchaCookie()) {
    generateCaptcha("captchaContainer2");
    return;
  }
  if (type === "chat" && !hasCaptchaCookie()) {
    generateCaptcha("captchaContainer0");
    return;
  }
  // Очистка старой капчи
  const existingCaptcha = form.querySelector(
    type === "chat" ? "#captchaContainer0" : "#captchaContainer2"
  );
  if (existingCaptcha) existingCaptcha.innerHTML = ""; */

  // 🚫 блокируем повторные клики
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.6";
  submitBtn.style.cursor = "not-allowed";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
//  .then(r => r.text())
    .then((r) => r.json())
    .then((res) => {
      //alert(JSON.stringify(res, null, 2));
      //alert("="+res);
      if (res.s === 1) {
        if (type === "chat") {
          document.getElementById("contactForm1654")?.remove();
          document.querySelectorAll('#captchaContainer0').forEach(el => el.remove());
          toggleTypingIndicator("add");
        } else if (type === "site") {
          form.style.display = "none";
          const success = form.parentElement.querySelector(".submitSuccessMessage");
          if (success) success.style.display = "block";
        }
      } else {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
        submitBtn.style.cursor = "";
        if (type === "chat") {
          generateCaptcha("captchaContainer0");
          if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
          generateCaptcha("captchaContainer2");
        }
      }
    })
    .catch((err) => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.style.cursor = "";
    });
}

    function closeChat(event) {
        if (!event.target.classList.contains("menu-picker") && !event.target.classList.contains("close-icon")) {
            toggleChat(false);
        }
    }

function openMenu(event) {
    event.stopPropagation();
    var emojiPicker = document.getElementById("emojiPicker");
    if (emojiPicker.style.display !== "none") {
        emojiPicker.style.display = "none";
        document.removeEventListener('click', closeEmojiPicker);
    }
    var chatMenu = document.getElementById("chatMenu");
    if (chatMenu.style.display === "none" || chatMenu.style.display === "") {
        chatMenu.style.display = "block";
        document.addEventListener('click', closeMenuOnClickOutside);
        chatMenu.addEventListener('click', closeMenu);
    } else {
        chatMenu.style.display = "none";
        document.removeEventListener('click', closeMenuOnClickOutside);
        chatMenu.removeEventListener('click', closeMenu);
    }
}

function showCaptcha(input) {
    var chatMessages = document.getElementById("chatMessages");
    //var lastMessage = chatMessages.lastElementChild;

    toggleTypingIndicator('remove');
    if (lastMessageElement) { lastMessageElement.remove(); };
    document.getElementById("chatInput").value = input;

    document.querySelectorAll('#contactForm1654').forEach(el => el.remove());
    document.querySelectorAll('#captchaContainer0').forEach(el => el.remove());
    document.querySelectorAll('#captchaContainer3').forEach(el => el.remove());

    var captchaForm = document.createElement("div");
    captchaForm.innerHTML = `
        <div class="message-content">
            <div id="captchaContainer3"></div>
        </div>`;
    chatMessages.appendChild(captchaForm);
    generateCaptcha('captchaContainer3');
    chatMessages.scrollTop = chatMessages.scrollHeight; // Прокручиваем вниз до последнего сообщения
    // Инициализация intl-tel-input
    //setTimeout(function() { prefPhone("#phoneCS") }, 1000);
}

function showContactForm() {
    var chatMessages = document.getElementById("chatMessages");
    var lastMessage = chatMessages.lastElementChild;

    // Проверяем, существует ли уже форма в последнем сообщении
    if (lastMessage && lastMessage.querySelector('form#contactForm1654')) {
        // Закрываем меню, если форма уже существует
        closeMenu();
        return;
    }

    document.querySelectorAll('#contactForm1654').forEach(el => el.remove());
    document.querySelectorAll('#captchaContainer0').forEach(el => el.remove());

    var contactForm = document.createElement("div");
    contactForm.innerHTML = `
        <div class="message-content">
            <form class="chat-form contact-form" data-type="chat" id="contactForm1654">
                <p>Please fill your contacts:</p>
                <input type="text" name="nameCS" placeholder="Name" required maxlength="100">
                <input type="email" name="emailCS" placeholder="Email" required maxlength="100">
                <input id="phoneCS" type="text" name="phoneCS" placeholder="Phone" required maxlength="100">
                <div class="messenger-checks">
                  <label>
                    <img src="lib/sett_ico5.png">
                    <input type="checkbox" name="whatsappCS">
                  </label>
                  <label>
                    <img src="lib/sett_ico6.png">
                    <input type="checkbox" name="viberCS">
                  </label>
                  <label>
                    <img src="lib/sett_ico4.png">
                    <input type="checkbox" name="telegramCS">
                  </label>
                </div>
                <input type="hidden" name="urlCS" value="${urlCS}">
                <button type="button" onclick="handleFormSubmission(event)">Submit</button>
            </form>
            <div id="captchaContainer0"></div>
        </div>`;
    chatMessages.appendChild(contactForm);
    generateCaptcha('captchaContainer0');
    chatMessages.scrollTop = chatMessages.scrollHeight; // Прокручиваем вниз до последнего сообщения

    // Инициализация intl-tel-input
    //setTimeout(function() { prefPhone("#phoneCS") }, 1000);

    closeMenu(); // Закрываем меню
}


function closeMenuOnClickOutside(event) {
        var chatMenu = document.getElementById("chatMenu");
        if (!chatMenu.contains(event.target) && !event.target.classList.contains("menu-picker")) {
            chatMenu.style.display = "none";
            document.removeEventListener('click', closeMenuOnClickOutside);
            chatMenu.removeEventListener('click', closeMenu);
        }
}

function closeMenu() {
    var chatMenu = document.getElementById("chatMenu");
    chatMenu.style.display = "none";
    document.removeEventListener('click', closeMenuOnClickOutside);
    chatMenu.removeEventListener('click', closeMenu);
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function renderMessageContent(message, element) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // 1️⃣ Экранируем HTML, чтобы не вставили код
    let safeMessage = escapeHtml(message || "");
    // 2️⃣ Добавляем поддержку переносов строк и табуляции
    safeMessage = safeMessage
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    // 3️⃣ Обрабатываем ссылки и изображения
    const processedMessage = safeMessage.replace(urlRegex, function (url) {
        if (/\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url)) {
            const shortUrl =
                url.length > 25
                    ? url.substring(0, 20) + "..." + url.substring(url.length - 5)
                    : url;
            return `
                <img src="${url}" alt="Image" 
                     style="width:180px;max-width:100%;height:auto;display:block;margin:6px 0;border-radius:6px;" />
                <a href="${url}" target="_blank" rel="noopener noreferrer">${shortUrl}</a>`;
        } else {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        }
    });
    // 4️⃣ Добавляем результат в DOM
    element.innerHTML = processedMessage;
}

let isSendingMessage = false;
let lastMessageElement = null;

function sendMessage(msg = null) {
    if (isSendingMessage) {
        return; // Блокируем повторную отправку, если уже идет отправка сообщения
    }
    var input = "";
    if (msg !== null) { input = msg; } else { input = document.getElementById("chatInput").value; };
    if (input.length > 2048) { input = input.slice(0, 2048); };
    var chatMessages = document.getElementById("chatMessages");
    if (input.trim() === "") return; // Предотвращаем отправку пустых сообщений
    lastMsgTime = false; //отменяем сигнал что набирается текст
    //alert('0');
    // Добавляем сообщение пользователя в чат
    var userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "snd1");
    var userNameElement = document.createElement("div");
    userNameElement.classList.add("message-content-n");
    //php4
    const d = new Date();
    //const f = d.toLocaleString('uk-UA', { hour12: false }).replace(',', '');
    const f = d.toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hour12: false }).replace(',', '');

    userNameElement.textContent = `You (${f}):`;//userName + ":";
    var userMessageContent = document.createElement("div");
    userMessageContent.classList.add("message-content");
    //userMessageContent.textContent = input; // Экранирование HTML для сообщений пользователя
    renderMessageContent(input, userMessageContent);
    userMessage.appendChild(userNameElement);
    userMessage.appendChild(userMessageContent);
    chatMessages.appendChild(userMessage);
    lastMessageElement = userMessage;

    //alert(adminMode);
    toggleTypingIndicator('add');
/*  // Добавляем временное сообщение от бота с "..."
    var tempBotMessage = document.createElement("div");
    tempBotMessage.classList.add("chat-message", "snd0");
    // Анимация "..."
    var botMessageContent = document.createElement("div");
    botMessageContent.classList.add("message-content", "typing-indicator");
    //botMessageContent.innerHTML = 'Writing <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
    //botMessageContent.innerHTML = '<span class="typing-text"> writing</span> <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
    botMessageContent.innerHTML = '<span class="typing-indicator">writing a response</span> <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
    tempBotMessage.appendChild(botMessageContent); */
    //chatMessages.appendChild(toggleTypingIndicator('add'););

    // Прокручиваем вниз до последнего сообщения
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Очищаем поле ввода
    document.getElementById("chatInput").value = "";
    
    isSendingMessage = true;
    // Отправляем сообщение на сервер
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ save: true, message: input }),
    })
    .then(response => response.json())
    //.then(response => response.text())
    .then(data => { //alert(":"+data);
        //alert(JSON.stringify(data, null, 2));
        if (data.s === 3) {
          showCaptcha(input);
        } else if (data.d === 0) {
          toggleTypingIndicator('remove');

              var chatContent = document.getElementById('chatMessages');
            //loadNewMessages(data.messages);  // Загружаем новые сообщения
            //alert(lastFileSize + ' - ' + lastFileTime);
            //if (lastMessageElement) { lastMessageElement.remove(); };
               var st = "AI Chatbot";
               var nameElement = document.createElement("div");
               nameElement.classList.add("message-content-n");
               nameElement.textContent = "";
               var messageElement = document.createElement("div");
               messageElement.classList.add("chat-message", "snd0");
               messageElement.classList.add("chat-message", "bot");
               var messageContent = document.createElement("div");
               messageContent.classList.add("message-content");
               renderMessageContent('Please log in to your account to chat with an operator! The chat is located on the Support page.', messageContent);
               messageElement.appendChild(nameElement);
               var botIcon2 = document.createElement("img");
               botIcon2.src = "../../lib/support.png";
               botIcon2.classList.add("bot-icon");
               messageElement.appendChild(botIcon2);
               messageElement.appendChild(messageContent);
               chatContent.appendChild(messageElement);
               chatContent.scrollTop = chatContent.scrollHeight;

        };

        // Удаляем временное сообщение от бота
        //userMessage.remove();
        //toggleTypingIndicator('remove');
        //checkForUpdates(1,0);
/*
        // Добавляем ответ бота в чат
        var botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "snd0");
        var botIcon = document.createElement("img");
        botIcon.src = "../../lib/support.png";
        botIcon.classList.add("bot-icon");
        var botMessageContent = document.createElement("div");
        botMessageContent.classList.add("message-content");
        botMessageContent.innerHTML = data.response; // Используем innerHTML для отображения HTML-содержимого от бота
        botMessage.appendChild(botIcon);
        botMessage.appendChild(botMessageContent);
        chatMessages.appendChild(botMessage);
        // Прокручиваем вниз до последнего сообщения
        chatMessages.scrollTop = chatMessages.scrollHeight;
*/
    })
    .finally(() => {
        setTimeout(() => isSendingMessage = false, 1000);
        //isSendingMessage = false; // Снимаем блокировку после завершения отправки
    })
    .catch(error => {
        /*alert('Error: ' + error);*/
        setTimeout(() => isSendingMessage = false, 1000);
        //isSendingMessage = false; // Снимаем блокировку в случае ошибки
    });
}

// Глобальная переменная для индикатора
var tempBotMessage = null;
let typingTimer;
let isTypingVisible = false;
let typingAddTimer = null;

// Функция для управления индикатором печати
function toggleTypingIndicator(action) {
    //alert(action);
    if (action === 'add') {
        if (typingAddTimer) return;
        typingAddTimer = setTimeout(() => {
          if (!typingAddTimer) return;
           typingAddTimer = null;
           if (tempBotMessage) {
             typingTimer = null;
             tempBotMessage.remove();
             tempBotMessage = null; // Обнуляем переменную после удаления
           }
           // Создаем новый индикатор
           tempBotMessage = document.createElement("div");
           tempBotMessage.classList.add("chat-message", "typing-message");
           var botMessageContent = document.createElement("div");
           botMessageContent.classList.add("message-content", "typing-indicator");
           botMessageContent.innerHTML = '<span class="typing-indicator">writing a response</span> <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
           tempBotMessage.appendChild(botMessageContent);
           chatMessages.appendChild(tempBotMessage);
           // Запускаем анимацию с задержками
           startTypingAnimation();
           var chatContent = document.getElementById('chatMessages');
           chatContent.appendChild(tempBotMessage);
           chatContent.scrollTop = chatContent.scrollHeight;
        }, 500 + Math.random() * 500 );
    } else if (action === 'remove') {
        clearTimeout(typingAddTimer);
        typingAddTimer = null;
        if (tempBotMessage) {
            // Останавливаем таймер, удаляем индикатор
            clearTimeout(typingTimer);
            typingTimer = null;
            tempBotMessage.remove();
            tempBotMessage = null; // Обнуляем переменную после удаления
        }
    }
}

// Функция для запуска анимации набора текста
function startTypingAnimation() {
    if (!tempBotMessage) return;
    // Случайный интервал для показа/скрытия индикатора (0.5 - 3 секунд)
    let randomDelay = Math.random() * (5 - 0.5) + 0.5;
    if (!isTypingVisible) { randomDelay = Math.random() * (1 - 0.5) + 0.5; };
    typingTimer = setTimeout(function () {
        if (!tempBotMessage) return;
        // Скрываем или показываем индикатор
        tempBotMessage.style.visibility = isTypingVisible ? "hidden" : "visible";
        isTypingVisible = !isTypingVisible;
        // Перезапускаем анимацию с новым случайным интервалом
        startTypingAnimation();
    }, randomDelay * 1000); // переводим секунды в миллисекунды
}

    document.getElementById("chatInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function toggleEmojiPicker() {
        var emojiPicker = document.getElementById("emojiPicker");
        if (emojiPicker.style.display === "none" || emojiPicker.style.display === "") {
            emojiPicker.style.display = "block";
            document.addEventListener('click', closeEmojiPicker);
        } else {
            emojiPicker.style.display = "none";
            document.removeEventListener('click', closeEmojiPicker);
        }
    }

    function closeEmojiPicker(event) {
        if (event) {
            var emojiPicker = document.getElementById("emojiPicker");
            var emojiButton = document.querySelector('.emoji-button');
            if (!emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
                emojiPicker.style.display = "none";
                document.removeEventListener('click', closeEmojiPicker);
            }
        }
    }

    function addEmoji(emoji) {
        var chatInput = document.getElementById("chatInput");
        chatInput.value += emoji;
        chatInput.focus();
        closeEmojiPicker({ target: document.body }); // Close the picker after selecting an emoji
    }

document.addEventListener("DOMContentLoaded", function() {
  // проверяем, есть ли уже кука utm
  if (!document.cookie.includes('utm=')) {
    let params = window.location.search.substring(1); // всё после ?
    if (!params) params = ''; // если нет строки — пустая
    setCookie('utm', params, 30*24*3600); // 30 суток
  }
});

