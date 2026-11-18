
document.addEventListener("DOMContentLoaded", function () {

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
    const heroIndicators = document.querySelectorAll(".hero-indicators button");

    heroIndicators.forEach(function (indicator, index) {
        indicator.addEventListener("click", function () {
            const alternateSlide = index === 1;
            hero.classList.toggle("is-alternate", alternateSlide);

            heroIndicators.forEach(function (button, buttonIndex) {
                const active = buttonIndex === index;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
        });
    });

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

});
