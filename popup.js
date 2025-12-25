document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const modalCaption = document.getElementById("modal-caption");
    const closeModal = document.getElementById("close-modal");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    let currentIndex = 0;
    let currentGallery = []; // тут будет массив картинок ТОЛЬКО галереи

    function getGalleryImages(img) {
        let parent = img.parentElement;
        let grandparent = parent?.parentElement;
        if (grandparent?.classList.contains("scrolling-container")) {
            return Array.from(grandparent.querySelectorAll("img.popup-image"));
        }
        if (grandparent?.classList.contains("gallery-container")) {
            return Array.from(grandparent.querySelectorAll("img.popup-image"));
        }
        return [img];
    }

    document.querySelectorAll(".popup-image").forEach((image) => {
        image.addEventListener("click", (event) => {
            if (isDragging) {
                event.preventDefault();
                return;
            }
            currentGallery = getGalleryImages(image);
            currentIndex = currentGallery.indexOf(image);
            modalImage.src = image.src;
            modalCaption.textContent = image.alt || "";
            modal.style.display = "flex";
            if (currentGallery.length > 1) {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            } else {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
        });
    });


    function changeImage(newIndex) {
        modalImage.style.opacity = 0;
        setTimeout(() => {
            currentIndex = newIndex;
            const newImg = currentGallery[currentIndex];
            modalImage.src = newImg.src;
            modalCaption.textContent = newImg.alt || "";
            modalImage.onload = () => {
                modalImage.style.opacity = 1;
            };
        }, 200);
    }

    prevBtn.addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        changeImage(newIndex);
    });

    nextBtn.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % currentGallery.length;
        changeImage(newIndex);
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    let isDragging = false;

    document.querySelectorAll(".scrolling-container").forEach((scrollingContainer) => {
        initializeScrolling(scrollingContainer);
        initializeDots(scrollingContainer);
    });

 function initializeScrolling(scrollingContainer) {
    //let isDragging = false; // Флаг для определения, скроллит ли пользователь
    let dragThreshold = 5; // Порог движения для активации скролла
    let movedDistance = 0; // Расстояние, пройденное при тягивании

    let startX = null; // Начальная координата мыши
    let scrollLeft = null; // Начальная прокрутка контейнера
    let velocity = 0; // Скорость прокрутки
    let animationFrame;

    // Начало тягивания
    scrollingContainer.addEventListener("mousedown", (event) => {
        isDragging = false;
        startX = event.pageX - scrollingContainer.offsetLeft;
        scrollLeft = scrollingContainer.scrollLeft;
        movedDistance = 0; // Сбрасываем расстояние
        velocity = 0; // Обнуляем скорость при начале тягивания
        cancelAnimationFrame(animationFrame); // Останавливаем инерцию
    });

    // Завершение тягивания
    scrollingContainer.addEventListener("mouseup", () => {
        if (movedDistance > dragThreshold) {
            isDragging = true; // Если движение было больше порога, это была прокрутка
        } else {
            isDragging = false; // Иначе — это клик
        }
        startX = null; // Сбрасываем начальную позицию
        scrollLeft = null; // Сбрасываем начальную прокрутку
        applyInertia(); // Запускаем инерцию
    });

    // Обработка движения мыши
    scrollingContainer.addEventListener("mousemove", (event) => {
        if (startX === null) return; // Если начальная позиция не задана, ничего не делаем
        const x = event.pageX - scrollingContainer.offsetLeft;
        const walk = x - startX; // Расстояние движения
        movedDistance += Math.abs(walk); // Считаем общее движение
        scrollingContainer.scrollLeft = scrollLeft - walk; // Прокручиваем
        velocity = walk * 0.1; // Обновляем скорость
    });

    // Инерция
    function applyInertia() {
        const decay = 0.95; // Коэффициент замедления
        if (Math.abs(velocity) > 0.1) {
            scrollingContainer.scrollLeft -= velocity; // Продолжаем движение
            velocity *= decay; // Замедляем
            animationFrame = requestAnimationFrame(applyInertia); // Рекурсивно продолжаем
        }
    }

    // Блокируем стандартное выделение
    scrollingContainer.addEventListener("dragstart", (e) => e.preventDefault());
 }

function initializeDots(scrollingContainer) {
    const dotsContainer = scrollingContainer.parentElement.querySelector(".scrolling-dots");
    if (!dotsContainer) return;

    const items = scrollingContainer.querySelectorAll("img");
    const gap = 16; // Твой gap между элементами

    dotsContainer.innerHTML = "";

    items.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dotsContainer.appendChild(dot);

        dot.addEventListener("click", () => {
            const target = items[index];
            const containerRect = scrollingContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            // Центрирование элемента
            const diff = (targetRect.left + targetRect.width / 2) - (containerRect.left + containerRect.width / 2);

            scrollingContainer.scrollTo({
                left: scrollingContainer.scrollLeft + diff,
                behavior: "smooth",
            });

            // МГНОВЕННО выделить dot
            activateDot(index);
        });
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    // Выделение активной точки
    function activateDot(activeIndex) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    }

    // При скролле → выставляем dot по центральной картинке
    scrollingContainer.addEventListener("scroll", () => {
        const containerRect = scrollingContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        items.forEach((item, i) => {
            const r = item.getBoundingClientRect();
            const itemCenter = r.left + r.width / 2;
            const dist = Math.abs(itemCenter - containerCenter);

            if (dist < closestDistance) {
                closestDistance = dist;
                closestIndex = i;
            }
        });

        activateDot(closestIndex);
    });

    // Начальная активная точка
    activateDot(0);
}


});

