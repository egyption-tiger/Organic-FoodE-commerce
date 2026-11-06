
// ================= SCROLL REVEAL =================
document.addEventListener("DOMContentLoaded", function () {

    // كل السكاشن ما عدا الهيدر والهيرو (اللي بيظهروا من أول ما الصفحة تفتح)
    const sections = document.querySelectorAll(
        "section:not(.secHero), .categories-section, footer"
    );

    sections.forEach(function (sec) {
        sec.classList.add("reveal");
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);   // يظهر مرة واحدة بس
            }
        });
    }, {
        threshold: 0.15   // يظهر لما 15% من السكشن يبقى في الشاشة
    });

    sections.forEach(function (sec) {
        observer.observe(sec);
    });
});



// ================= REVEAL LEFT / RIGHT =================
document.addEventListener("DOMContentLoaded", function () {

    // [selector, direction]
    const items = [
        // Protein section
        [".protein-text", "left"],
        [".protein-media", "right"],

        // Categories + Products
        [".cp-sidebar", "left"],
        [".cp-products-box", "right"],

        // Quality section
        [".quality-left", "left"],
        [".quality-right", "right"],

        // Blog section
        [".blog-intro", "left"],
        [".blog-list", "right"],

        // Testimonial
        [".testimonial-img", "left"],
        [".testimonial-content", "right"],

        // Offers (الأول شمال، الأخير يمين)
        [".offer-card:nth-child(1)", "left"],
        [".offer-card:nth-child(3)", "right"],

        // Promo (الأول شمال، الأخير يمين)
        [".promo-card:nth-child(1)", "left"],
        [".promo-card:nth-child(3)", "right"]
    ];

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(function (item) {
        document.querySelectorAll(item[0]).forEach(function (el) {
            el.classList.add(item[1] === "left" ? "reveal-left" : "reveal-right");
            observer.observe(el);
        });
    });
});

// ================= STICKY NAVBAR =================
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".secHeader");
    const nav = document.querySelector(".dowenNav");
    const topNav = document.querySelector(".topNav");

    // نثبّت ارتفاع الهيدر عشان الصفحة متنطش لما الـ navbar تتحول fixed
    const navHeight = nav.offsetHeight + 10;      // 10 = الـ margin
    const triggerPoint = header.offsetHeight;      // ارتفاع الهيدر كله

    function handleScroll() {
        if (window.scrollY > triggerPoint) {
            if (!nav.classList.contains("sticky")) {
                header.style.paddingBottom = navHeight + "px";
                nav.classList.add("sticky");
            }
        } else {
            nav.classList.remove("sticky");
            header.style.paddingBottom = "0";
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
});

// ================= CART SIDEBAR =================
document.addEventListener("DOMContentLoaded", function () {
    const cartIcon = document.getElementById("Shopping");
    const sidebar  = document.getElementById("cartSidebar");
    const overlay  = document.getElementById("cartOverlay");
    const closeBtn = document.getElementById("cartClose");

    function openCart(){
        sidebar.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";   // يمنع سكرول الصفحة وراه
    }
    function closeCart(){
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    cartIcon.addEventListener("click", openCart);
    closeBtn.addEventListener("click", closeCart);
    overlay.addEventListener("click", closeCart);

    // يقفل بزرار Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeCart();
    });
});