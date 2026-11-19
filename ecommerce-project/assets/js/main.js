
document.addEventListener("DOMContentLoaded", function () {

    const cartStorageKey = "eboxinghandles-cart-count";
    const wishlistStorageKey = "eboxinghandles-wishlist";
    let cartCount = Number.parseInt(localStorage.getItem(cartStorageKey) || "0", 10);
    if (!Number.isFinite(cartCount) || cartCount < 0) cartCount = 0;

    function renderCartCount() {
        document.querySelectorAll(".cart-count").forEach(function (badge) {
            badge.textContent = String(cartCount);
            badge.setAttribute("aria-label", cartCount + " items in cart");
        });
    }
    function addToCart(quantity) {
        cartCount += quantity;
        localStorage.setItem(cartStorageKey, String(cartCount));
        renderCartCount();
    }
    renderCartCount();

    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem(wishlistStorageKey) || "[]");
        if (!Array.isArray(wishlist)) wishlist = [];
    } catch (error) { wishlist = []; }

    document.querySelectorAll(".product-card").forEach(function (card, index) {
        const button = card.querySelector(".product-wish");
        if (!button) return;
        const id = card.dataset.productId || card.querySelector(".product-name")?.textContent.trim() || "product-" + index;
        const selected = wishlist.includes(id);
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute("aria-label", selected ? "Remove from wishlist" : "Add to wishlist");
        button.addEventListener("click", function () {
            const wasSelected = wishlist.includes(id);
            wishlist = wasSelected ? wishlist.filter(function (item) { return item !== id; }) : wishlist.concat(id);
            localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
            button.classList.toggle("is-active", !wasSelected);
            button.setAttribute("aria-pressed", String(!wasSelected));
            button.setAttribute("aria-label", wasSelected ? "Add to wishlist" : "Remove from wishlist");
        });
    });

    document.querySelectorAll(".product-card .qty, .pd-qty-wrap .qty").forEach(function (control) {
        const value = control.querySelector("span");
        const buttons = control.querySelectorAll("button");
        if (!value || buttons.length < 2) return;
        buttons[0].addEventListener("click", function () {
            value.textContent = String(Math.max(1, (Number.parseInt(value.textContent, 10) || 1) - 1));
        });
        buttons[1].addEventListener("click", function () {
            value.textContent = String((Number.parseInt(value.textContent, 10) || 1) + 1);
        });
    });

    document.querySelectorAll(".btn-cart, .pd-add").forEach(function (button) {
        button.addEventListener("click", function () {
            const quantity = button.closest(".product-card, .pd-info")?.querySelector(".qty span");
            const amount = Math.max(1, Number.parseInt(quantity?.textContent || "1", 10) || 1);
            addToCart(amount);
            const originalText = button.textContent;
            button.textContent = "Added to cart";
            window.setTimeout(function () { button.textContent = originalText; }, 1200);
        });
    });

    // Demo-only video used by workout and testimonial thumbnails.
    const demoVideoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    const videoDialog = document.createElement("div");
    videoDialog.className = "demo-video-dialog";
    videoDialog.setAttribute("role", "dialog");
    videoDialog.setAttribute("aria-modal", "true");
    videoDialog.setAttribute("aria-label", "Demo video player");
    videoDialog.innerHTML = '<div class="demo-video-panel"><button class="demo-video-close" type="button" aria-label="Close video">&times;</button><video controls playsinline></video><p>Demo video</p></div>';
    document.body.appendChild(videoDialog);
    const demoVideo = videoDialog.querySelector("video");                      

    function closeDemoVideo() {
        demoVideo.pause();
        demoVideo.removeAttribute("src");
        demoVideo.load();
        videoDialog.classList.remove("is-open");
        document.body.classList.remove("demo-video-open");
    }

    function openDemoVideo() {
        demoVideo.src = demoVideoUrl;
        videoDialog.classList.add("is-open");
        document.body.classList.add("demo-video-open");
        demoVideo.play().catch(function () {});
        videoDialog.querySelector(".demo-video-close").focus();
    }

    document.addEventListener("click", function (event) {
        const watchVideoLink = event.target.closest(".watch-video-btn");
        if (watchVideoLink) {
            event.preventDefault();
            openDemoVideo();
            return;
        }
        if (event.target.closest(".workout-video, .testimonial-card, .cta-video-main")) {
            openDemoVideo();
        }
    });
    videoDialog.querySelector(".demo-video-close").addEventListener("click", closeDemoVideo);
    videoDialog.addEventListener("click", function (event) {
        if (event.target === videoDialog) closeDemoVideo();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && videoDialog.classList.contains("is-open")) closeDemoVideo();
    });

    const productMainImage = document.querySelector("#pdMainImg");
    const productThumbs = Array.from(document.querySelectorAll(".pd-thumb"));
    const previousImageButton = document.querySelector(".pd-prev");
    const nextImageButton = document.querySelector(".pd-next");

    if (productMainImage && productThumbs.length) {
        function selectProductImage(index) {
            const activeIndex = (index + productThumbs.length) % productThumbs.length;
            const activeThumb = productThumbs[activeIndex];
            const thumbImage = activeThumb.querySelector("img");

            productMainImage.src = activeThumb.dataset.src;
            if (thumbImage && thumbImage.alt) {
                productMainImage.alt = thumbImage.alt;
            }

            productThumbs.forEach(function (thumb, thumbIndex) {
                const isActive = thumbIndex === activeIndex;
                thumb.classList.toggle("active", isActive);
                thumb.setAttribute("aria-pressed", String(isActive));
            });
        }

        productThumbs.forEach(function (thumb, index) {
            thumb.setAttribute("aria-pressed", String(thumb.classList.contains("active")));
            thumb.addEventListener("click", function () {
                selectProductImage(index);
            });
        });

        if (previousImageButton) {
            previousImageButton.addEventListener("click", function () {
                const currentIndex = productThumbs.findIndex(function (thumb) {
                    return thumb.classList.contains("active");
                });
                selectProductImage(currentIndex - 1);
            });
        }

        if (nextImageButton) {
            nextImageButton.addEventListener("click", function () {
                const currentIndex = productThumbs.findIndex(function (thumb) {
                    return thumb.classList.contains("active");
                });
                selectProductImage(currentIndex + 1);
            });
        }

        const lightbox = document.createElement("div");
        lightbox.className = "pd-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Product image preview");
        lightbox.innerHTML = '<button class="pd-lightbox-close" type="button" aria-label="Close image preview">&times;</button><img alt="">';
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector("img");
        const closeLightboxButton = lightbox.querySelector(".pd-lightbox-close");

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            document.body.classList.remove("pd-lightbox-open");
        }

        productMainImage.addEventListener("click", function () {
            lightboxImage.src = productMainImage.src;
            lightboxImage.alt = productMainImage.alt;
            lightbox.classList.add("is-open");
            document.body.classList.add("pd-lightbox-open");
            closeLightboxButton.focus();
        });

        closeLightboxButton.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
                closeLightbox();
            }
        });
    }

    document.querySelectorAll(".product-card").forEach(function (card) {
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", "View product details");

        function openProduct(event) {
            if (event.target.closest("a, button, input, select, textarea, label")) {
                return;
            }

            window.location.href = card.dataset.productLink || "product.html";
        }

        card.addEventListener("click", openProduct);
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProduct(event);
            }
        });
    });

    const hero = document.querySelector(".hero-section");
    if (hero) {
        let activeSlide = 0;
        let slideTimer;
        let dragStartX = null;
        const rotationDelay = 5000;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function showNextHeroSlide() {
            activeSlide = (activeSlide + 1) % 2;
            hero.classList.toggle("is-alternate", activeSlide === 1);
        }

        function stopHeroRotation() {
            window.clearInterval(slideTimer);
        }

        function startHeroRotation() {
            stopHeroRotation();
            if (!reduceMotion && !document.hidden) {
                slideTimer = window.setInterval(showNextHeroSlide, rotationDelay);
            }
        }

        function moveHeroSlide(direction) {
            activeSlide = (activeSlide + direction + 2) % 2;
            hero.classList.toggle("is-alternate", activeSlide === 1);
            startHeroRotation();
        }

        hero.querySelector(".hero-slider-prev").addEventListener("click", function () {
            moveHeroSlide(-1);
        });
        hero.querySelector(".hero-slider-next").addEventListener("click", function () {
            moveHeroSlide(1);
        });

        hero.addEventListener("pointerdown", function (event) {
            if (event.button !== 0 || event.target.closest("a, button")) return;
            dragStartX = event.clientX;
        });
        hero.addEventListener("pointerup", function (event) {
            if (dragStartX === null) return;
            const distance = event.clientX - dragStartX;
            dragStartX = null;
            if (Math.abs(distance) > 50) moveHeroSlide(distance < 0 ? 1 : -1);
        });
        hero.addEventListener("pointercancel", function () {
            dragStartX = null;
        });
        hero.addEventListener("keydown", function (event) {
            if (event.target.closest("a, button")) return;
            if (event.key === "ArrowLeft") moveHeroSlide(-1);
            if (event.key === "ArrowRight") moveHeroSlide(1);
        });

        hero.addEventListener("mouseenter", stopHeroRotation);
        hero.addEventListener("mouseleave", startHeroRotation);
        hero.addEventListener("focusin", stopHeroRotation);
        hero.addEventListener("focusout", startHeroRotation);
        document.addEventListener("visibilitychange", startHeroRotation);
        startHeroRotation();
    }

    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link"
    );

    const navbarCollapse = document.querySelector(
        "#mainNavbar"
    );

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {

            if (window.innerWidth < 992) {
                const bsCollapse =
                    bootstrap.Collapse.getOrCreateInstance(
                        navbarCollapse,
                        { toggle: false }
                    );

                bsCollapse.hide();
            }

        });
    });

    document.querySelectorAll(".mobile-menu-brand").forEach(function (brand) {
        brand.addEventListener("click", function () {
            if (window.innerWidth < 992 && navbarCollapse) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }).hide();
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (navbarCollapse && navbarCollapse.classList.contains("show") &&
            !navbarCollapse.contains(event.target) && !event.target.closest(".navbar-toggler")) {
            bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }).hide();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && navbarCollapse && navbarCollapse.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }).hide();
        }
    });

});
