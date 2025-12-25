  // --- пагинация ---
  let sortAsc = true; // глобальный флаг сортировки
  let sortMode = "price"; // "price", "name", "tag"

  function createPagination(container, page, totalPages, limit) {
    const pagination = document.createElement("div");
    pagination.className = "shop-pagination";
    // --- кнопки страниц ---
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.toggle("active", i === page);
      btn.onclick = () => {
        renderShop(i, limit);
        //window.scrollTo({ top: container.offsetTop - 50, behavior: "smooth" });
        //window.scrollIntoView({ behavior: "smooth", block: "start" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
    // --- универсальные кнопки сортировки ---
    const sortWrap = document.createElement("div");
    sortWrap.className = "sort-group";
    ["price", "name", "tag"].forEach(type => {
      const btn = document.createElement("button");
      btn.className = "sort-btn";
      const isActive = sortMode === type;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      btn.textContent = isActive ? `${label} ${sortAsc ? "▲" : "▼"}` : label;
      btn.onclick = () => {
        if (isActive) sortAsc = !sortAsc;
        sortMode = type;
        renderShop(page, limit);
      };
      sortWrap.appendChild(btn);
    });
    pagination.appendChild(sortWrap);
    // --- корзина ---
    const cartBtn = document.createElement("button");
    cartBtn.className = "sort-btn shop-cart-btn";
    cartBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                     0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                     2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                     0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                     0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                     7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                     15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"></path>
          </svg> Cart (<span class="cart-count">0</span>)`;
    cartBtn.onclick = showCart; // потом добавим
    pagination.appendChild(cartBtn);
    return pagination;
  }

  // Корзина
  let CART = JSON.parse(localStorage.getItem("shop_cart") || "[]");
  function saveCart() {
    localStorage.setItem("shop_cart", JSON.stringify(CART));
    updateCartCounter();
  }
  function updateCartCounter() {
    const count = CART.length;
    document.querySelectorAll(".cart-count").forEach(span => {
      span.textContent = count;
    });
  }
  function addToCart(item) {
    // если товар уже в корзине — увеличиваем количество
    const existing = CART.find(i => i.id === item.id);
    if (existing) existing.qty += 1;
    else CART.push({ ...item, qty: 1 });
    saveCart();
  }

  function showCart() {
    // 🔹 Если открыта карточка товара — закрываем её
    const existingDetail = document.querySelector(".shop-detail");
    if (existingDetail) existingDetail.remove();
    const container = document.getElementById("shop-block");
    const existing = document.querySelector(".shop-cart");
    if (existing) existing.remove();
    const thankyou = document.querySelector(".shop-thankyou");
    if (thankyou) thankyou.remove();

    const shopBlock2 = document.getElementById("shop-block");
    const payOptions = shopBlock2?.dataset.payOptions
      ? shopBlock2.dataset.payOptions.split(",")
      : [];

    const allMethods = {
      paypal: "PayPal",
      stripe: "Stripe",
      liqpay: "LiqPay",
      fondy: "Fondy",
      wayforpay: "WayForPay",
      binance: "Binance Pay",
      coinbase: "Coinbase Commerce",
      nowpayments: "NOWPayments",
      payoneer: "Payoneer",
      revolut: "Revolut",
      wise: "Wise",
    };
    let paymentHTML = "";
    if (payOptions.length) {
      paymentHTML = `
        <div class="shop-payments">
          <div class="shop-payments-title">Choose payment methods:</div>
          <div class="shop-payments-final">
            ${payOptions
              .map(
                (key, i) => `
                <label class="pay-method">
                  <input type="checkbox" name="shop-payment" value="${key}" ${
                    i === 0 ? "checked" : ""
                  }>
                  ${allMethods[key] || key}
                </label>`
              )
              .join("")}
          </div>
        </div>`;
    }

    const cartDiv = document.createElement("div");
    cartDiv.className = "shop-cart";
    if (CART.length === 0) {
      cartDiv.innerHTML = `
        <div class="shop-cart-inner empty">
          <button class="shop-close">✕</button>
          <h2 class="shop-cart-title">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
               <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                        0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                        2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                        0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                        0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                        7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                        15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/>
             </svg>
             Your cart is empty
          </h2>
        </div>`;
      container.prepend(cartDiv);
      cartDiv.querySelector(".shop-close").onclick = () => cartDiv.remove();
      return;
    }

    let total = 0;
    CART.forEach(i => total += i.price * i.qty);
    cartDiv.innerHTML = `
      <div class="shop-cart-inner">
        <button class="shop-close">✕</button>
        <h2 class="shop-cart-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                     0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                     2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                     0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                     0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                     7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                     15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/>
          </svg>
          Your Cart
        </h2>
        <div class="shop-cart-list">
          ${CART.map(i => `
             <div class="cart-item" data-id="${i.id}">
               <img src="${i.photo}" alt="${i.title}">
               <div class="cart-info">
                 <div class="shop-id">ID: ${i.id}</div>
                 <h2>${i.title}</h2>
                 <div class="shop-price">${i.price} ${SHOP.shop.currency}</div>
               </div>
               <div class="cart-qty">
                 <button class="qty-minus">−</button>
                 <span>${i.qty}</span>
                 <button class="qty-plus">+</button>
                 <button class="qty-del">❌</button>
               </div>
             </div>`).join("")}
        </div>
        <div class="shop-cart-total">
          <b>Total:</b> <span>${total.toFixed(2)} ${SHOP.shop.currency}</span>
        </div>
        ${paymentHTML}
        <button class="shop-order-btn"> <!-- используем тот же класс, что и в карточке -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                     0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                     2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                     0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                     0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                     7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                     15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/>
          </svg>
          Order&nbsp;Now
        </button>

        <div id="captchaContainer1"></div>
      </div>
    `;/*&nbsp;*/
    container.prepend(cartDiv);
    generateCaptcha('captchaContainer1');

    //window.scrollTo({ top: container.offsetTop - 50, behavior: "smooth" });
    cartDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    // закрыть
    cartDiv.querySelector(".shop-close").onclick = () => cartDiv.remove();
    // изменение количества / удаление
    cartDiv.querySelectorAll(".cart-item").forEach(el => {
      const id = el.dataset.id;
      el.querySelector(".qty-plus").onclick = () => changeQty(id, 1);
      el.querySelector(".qty-minus").onclick = () => changeQty(id, -1);
      el.querySelector(".qty-del").onclick = () => removeFromCart(id);
    });
    // оформить заказ
    cartDiv.querySelector(".shop-order-btn").onclick = () => {
      //alert("🧾 Order placed! (temporary)");
      //alert(getCookie('formHash'));
      if (!hasCaptchaCookie()) {
        generateCaptcha('captchaContainer1');
        return; // капчи нет — выходим
      }
      const selectedPays = [...document.querySelectorAll('input[name="shop-payment"]:checked')]
        .map(el => el.value);
      sendOrderToChat();
      CART = [];
      saveCart();
      cartDiv.remove();
      showThankYou(selectedPays);
    };
  }

  function sendOrderToChat() {
    const cart = JSON.parse(localStorage.getItem("shop_cart") || "[]");
    if (!cart.length) {
      alert("Your cart is empty!");
      return;
    }
    // Собираем текст заказа
    let total = 0;
    const lines = cart.map(item => {
      const sum = item.price * item.qty;
      total += sum;
      return `• ${item.title} (${item.qty} × ${item.price} ${SHOP.shop.currency}) = ${sum} ${SHOP.shop.currency}`;
    });
    const selectedPays = [...document.querySelectorAll('input[name="shop-payment"]:checked')]
      .map(el => el.value);
    const payMethod = selectedPays.length ? selectedPays.join(", ") : "not selected";
    /*const msg1 =
      "Service Message:\nNew Order.\n{\n" +
      lines.join("\n") +
      `\nTotal: *${total.toFixed(2)} ${SHOP.shop.currency}*\n` +
      `Date: ${new Date().toLocaleString()}\n` +
      `Payment methods: ${payMethod}\n}`;*/
    const msg = 
      "🛒 New Order :\n" +
      lines.join("\n") + "\n" +
      "━━━━━━━━━━━━━━━━━━\n" +
      `💰 Total: ${total.toFixed(2)} ${SHOP.shop.currency}\n` +
//      `📅 Date: ${new Date().toLocaleString()}\n` +
      "━━━━━━━━━━━━━━━━━━\n"+
      `💳 Payment method: ${payMethod}\n`;

    // Отправляем через чат
    if (!chatPopup.classList.contains("visible")) {
      toggleChat(true);
    }
    sendMessage(msg);
    // Очищаем корзину
    //localStorage.removeItem("shop_cart");
  }

  function showThankYou(selectedPays = []) {
    const container = document.getElementById("shop-block");
    const thankDiv = document.createElement("div");
    thankDiv.className = "shop-thankyou";
    // Словарь названий и иконок
    const icons = {
      paypal: "💰 PayPal",
      stripe: "💳 Stripe",
      liqpay: "💵 LiqPay",
      fondy: "🏦 Fondy",
      wayforpay: "💼 WayForPay",
      binance: "🟡 Binance Pay",
      coinbase: "🪙 Coinbase",
      nowpayments: "🌐 NOWPayments",
      payoneer: "🧾 Payoneer",
      revolut: "💶 Revolut",
      wise: "💷 Wise",
    };
    // Если ничего не выбрано — сообщение
    const paymentList = selectedPays.length
      ? selectedPays.map(p => `<div class="pay-method">${icons[p] || p}</div>`).join("")
      : `<div class="pay-method none">No payment methods selected</div>`;
    thankDiv.innerHTML = `
      <div class="shop-thankyou-inner">
        <button class="shop-close">✕</button>
        <h2>🎉 Thank you for your order!</h2>
        <p>Your order has been successfully sent.</p>
        <p>We’ll contact you soon to confirm the details.</p>
        <hr>
        <p style="margin-bottom:6px;">Selected payment methods:</p>
        <div class="shop-payments-final">${paymentList}</div>
        <hr>
        <p>All your orders can be viewed in the chat 💬</p>
        <!--<button class="shop-pay-btn">💳 Pay Now</button>-->
      </div>
    `;
    container.prepend(thankDiv);
    thankDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    thankDiv.querySelector(".shop-close").onclick = () => thankDiv.remove();
    /*thankDiv.querySelector(".shop-pay-btn").onclick = () => {
      alert("🔜 We’ll contact you soon to confirm the details!");
    };*/
  }

/*  function showThankYou() {
    const container = document.getElementById("shop-block");
    const thankDiv = document.createElement("div");
    thankDiv.className = "shop-thankyou";
    thankDiv.innerHTML = `
      <div class="shop-thankyou-inner">
        <button class="shop-close">✕</button>
        <h2>🎉 Thank you for your order!</h2>
        <p>Your order has been successfully sent.</p>
        <p>We’ll contact you soon to confirm the details.</p>
        <hr>
        <p>You can also proceed to payment:</p>
        <button class="shop-pay-btn">💳 Pay Now</button>
      </div>
    `;
    container.prepend(thankDiv);
    thankDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    // Закрыть окно
    thankDiv.querySelector(".shop-close").onclick = () => thankDiv.remove();
    // Кнопка "Pay Now" (пока без логики)
    thankDiv.querySelector(".shop-pay-btn").onclick = () => {
      alert("🔜 Payment link will be added here soon!");
    };
  }*/

  function changeQty(id, delta) {
    const item = CART.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    updateCartTotals(); // 🔥 вместо showCart()
  }

  function removeFromCart(id) {
    CART = CART.filter(i => i.id !== id);
    saveCart();
    const itemEl = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (itemEl) itemEl.remove();
    updateCartTotals(); // 🔥 без перерисовки
  }

  function updateCartTotals() {
    // обновляем счётчик возле Cart (в обоих местах)
    document.querySelectorAll(".cart-count").forEach(span => {
      span.textContent = CART.length;
    });
//    document.querySelectorAll(".cart-count").forEach(span => {
//      span.textContent = CART.reduce((sum, i) => sum + i.qty, 0);
//    });
    // обновляем количество внутри корзины (в строках)
    CART.forEach(item => {
      const qtySpan = document.querySelector(`.cart-item[data-id="${item.id}"] .cart-qty span`);
      if (qtySpan) qtySpan.textContent = item.qty;
    });
    // обновляем итоговую сумму, если окно корзины открыто
    const totalEl = document.querySelector(".shop-cart-total");
    if (totalEl) {
      const total = CART.reduce((sum, i) => sum + i.price * i.qty, 0);
      totalEl.innerHTML = `<b>Total:</b> <span>${total.toFixed(2)} ${SHOP.shop.currency}</span>`;
    }
  }

  function renderShop(page = 1, limit = 10) {
    let sortedItems = [...(SHOP.shop.items || [])];

    sortedItems.sort((a, b) => {
      const getVal = (item) => {
        switch (sortMode) {
          case "name": return (item[1] || "").toLowerCase();
          case "tag":  return (item[2] || "").toLowerCase();
          default:     return parseFloat(item[3]) || 0;
        }
      };
      const valA = getVal(a), valB = getVal(b);
      return sortAsc
        ? (valA > valB ? 1 : valA < valB ? -1 : 0)
        : (valA < valB ? 1 : valA > valB ? -1 : 0);
    });

    const totalPages = Math.ceil(sortedItems.length / limit);
    const start = (page - 1) * limit;
    const pageItems = sortedItems.slice(start, start + limit);

    const container = document.getElementById("shop-block");
    container.innerHTML = "";

    // пагинация сверху
    container.appendChild(createPagination(container, page, totalPages, limit));

    // карточки
    pageItems.forEach(item => {
      const [id, title, tags, price, descRaw, photo] = item;
      const desc = (descRaw || "").slice(0, 128);
      const imgSrc = photo || "/lib/img256.png";

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
        <img src="${imgSrc}" alt="${title}" class="shop-more" data-id="${id}">
        <div class="id-item">ID: ${id}</div>
        <h4>${title}</h4>
        <div class="tags">${tags}</div>
        <div class="price">${price} ${SHOP.shop.currency}</div>
        <button class="shop-more-btn" data-id="${id}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                     0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                     2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                     0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                     0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                     7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                     15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/>
          </svg>
          Buy&nbsp;Now
        </button>
      `;
      container.appendChild(card);
    });

    // обработчик кнопки "Order Now"
    container.querySelectorAll(".shop-more, .shop-more-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        showProductDetail(id);
      });
    });

    // пагинация снизу
    container.appendChild(createPagination(container, page, totalPages, limit));
    updateCartCounter();
  }

function initPopupImages(detail) {
    const images = detail.querySelectorAll(".shop-image");
    images.forEach(img => {
        if (img.dataset.shopPopupReady) return;
        img.dataset.shopPopupReady = "1";
        img.addEventListener("click", () => {
            modalImage.src = img.src;
            modal.classList.add("shop-mode");
            modal.style.display = "flex";
            if (window.modalCaption) {
                window.modalCaption.textContent = img.alt || "";
            }
        });
    });
}

function showProductDetail(id) {
  const item = SHOP.shop.items.find(i => i[0] === id);
  if (!item) return;

  // если visible=0 — не отображаем
  if (typeof item[8] !== "undefined" && item[8] == 0) return;

  const [pid, title, tags, price, descRaw, photo, photo1, photo2] = item;
  const desc = descRaw || "No description available.";
  const imgSrc = photo || "/lib/img256.png";

  const container = document.getElementById("shop-block");

  // 🔹 Если корзина открыта — закрываем её
  const existingCart = document.querySelector(".shop-cart");
  if (existingCart) existingCart.remove();
  const thankyou = document.querySelector(".shop-thankyou");
  if (thankyou) thankyou.remove();

  // Если уже открыт блок — удалить
  const existingDetail = document.querySelector(".shop-detail");
  if (existingDetail) existingDetail.remove();

  // Создаём карточку
  const detail = document.createElement("div");
  detail.className = "shop-detail";
  detail.innerHTML = `
    <div class="shop-detail-inner">
      <button class="shop-close1">✕</button>
      <div class="shop-detail-image">
        <div class="shop-detail-main">
          <img class="shop-image" src="${imgSrc}" alt="${title}">
        </div>
        <div class="shop-detail-thumbs">
          ${photo1 ? `<div class="thumb"><img class="shop-image" src="${photo1}" alt="${title}"></div>` : ""}
          ${photo2 ? `<div class="thumb"><img class="shop-image" src="${photo2}" alt="${title}"></div>` : ""}
        </div>
      </div>
      <div class="shop-detail-info">
        <div class="shop-id">ID: ${pid}</div>
        <h2>${title}</h2>
        <div class="shop-tags">${tags}</div>
        <p class="shop-desc">${desc}</p>
        <div class="shop-price">${price} ${SHOP.shop.currency}</div>
        <button class="shop-buy">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                     0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
                     2-2-.9-2-2-2zM7.16 14.26l.84-2h8.45c.75 
                     0 1.41-.41 1.75-1.03l3.58-6.49A.993.993 
                     0 0 0 21 3H5.21L4.27 1H1v2h2l3.6 
                     7.59-1.35 2.44C4.52 13.37 5.48 15 7 
                     15h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/>
          </svg>
          Add&nbsp;to&nbsp;Cart
        </button>
      </div>
    </div>
  `;

  // вставляем сверху
  container.prepend(detail);
  initPopupImages(detail);

  // плавный скролл вверх
  //window.scrollTo({ top: container.offsetTop - 40, behavior: "smooth" });
/*  window.scrollTo({ 
    top: container.offsetTop - (window.innerWidth < 700 ? 10 : 40), 
    behavior: "smooth" 
  });*/
  container.scrollIntoView({ behavior: "smooth", block: "start" });

  // закрытие карточки
  detail.querySelector(".shop-close1").addEventListener("click", () => {
    detail.remove();
  });

  // кнопка "Order Now"
  detail.querySelector(".shop-buy").addEventListener("click", () => {
    addToCart({ id: pid, title, price, photo: imgSrc });
    // 🔹 Закрываем карточку
    detail.classList.add("closing");
    detail.remove();
    // 🔹 Показываем корзину
    setTimeout(showCart, 20); // чуть позже, чтобы закрытие отработало плавно
  });

}

document.addEventListener("DOMContentLoaded", () => {
  const shopBlock = document.getElementById('shop-block');
  if (!shopBlock) return; // 🧱 <— если магазина нет, просто выходим
  shopBlock.innerHTML = "";
  const css = document.querySelector('link[href*="shop.css"]');
  if (css) {
    // если уже загружен (sheet существует) → выполняем сразу
    if (css.sheet) {
      renderShop();
      updateCartCounter();
      if (getComputedStyle(shopBlock).display === "none") { shopBlock.style.display = "flex"; };
    } else {
      // иначе — ждём загрузку
      css.addEventListener("load", () => {
        renderShop();
        updateCartCounter();
        if (getComputedStyle(shopBlock).display === "none") { shopBlock.style.display = "flex"; };
      });
    }
  }

  const toggleBtn = document.getElementById('toggleShop');

  // Клик по кнопке
  toggleBtn.addEventListener('click', () => toggleExpand());

  // Клик по магазину: если не раскрыт — раскрыть
  shopBlock.addEventListener('click', e => {
    if (shopBlock.classList.contains('expanded')) return;
//  if (e.target.closest('.sort-btn') || e.target.closest('#toggleShop')) return;
    toggleExpand(true);
  });

  function toggleExpand(auto = false) {
    const expanding = !shopBlock.classList.contains('expanded');
    shopBlock.classList.toggle('expanded');
    toggleBtn.innerHTML = expanding ? 'Hide' : 'Show&nbsp;more';
    if (expanding) {
      // ждём, пока блок физически раскроется
      setTimeout(() => {
        shopBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600); // чуть дольше, чем transition (0.6s)
    } else {
      shopBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Если есть ссылка на товар
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("item_id");
  setTimeout(() => {
     if (shopBlock.classList.contains('expanded')) return;
     if (itemId) { toggleExpand(true); showProductDetail(itemId); };
  }, 300);

});


