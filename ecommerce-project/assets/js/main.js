
document.addEventListener("DOMContentLoaded", function () {

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
