// ================= GRID / LIST VIEW =================
document.addEventListener("DOMContentLoaded", function () {
    const grid    = document.querySelector(".scGrid");
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");

    if (!grid || !gridBtn || !listBtn) return;

    listBtn.addEventListener("click", function () {
        grid.classList.add("listView");
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });

    gridBtn.addEventListener("click", function () {
        grid.classList.remove("listView");
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });
});



// ================= SIDE MENU =================
document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("smOpen");
    const closeBtn = document.getElementById("smClose");
    const panel = document.getElementById("smPanel");
    const overlay = document.getElementById("smOverlay");

    if (!openBtn || !panel || !overlay) return;

    function openMenu() {
        panel.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeMenu() {
        panel.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
    });
});



// ================= STICKY HEADER =================
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".shopHeader");
    if (!header) return;

    const headerHeight = header.offsetHeight;   // ارتفاع الهيدر قبل ما يتثبّت

    // wrapper يحافظ على المساحة عشان الصفحة متقفزش لفوق
    const placeholder = document.createElement("div");
    header.parentNode.insertBefore(placeholder, header);

    function handleScroll() {
        if (window.scrollY > headerHeight) {
            if (!header.classList.contains("sticky")) {
                placeholder.style.height = headerHeight + "px";
                header.classList.add("sticky");
            }
        } else {
            header.classList.remove("sticky");
            placeholder.style.height = "0";
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
});



// shop.js — بيشتغل مع Bootstrap bundle (الـ offcanvas بقى من Bootstrap)
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Grid / List toggle ---------- */
    var grid    = document.getElementById('scGrid');
    var gridBtn = document.getElementById('gridBtn');
    var listBtn = document.getElementById('listBtn');

    function setView(isList) {
        grid.classList.toggle('listView', isList);
        listBtn.classList.toggle('active', isList);
        gridBtn.classList.toggle('active', !isList);
        try { localStorage.setItem('shopView', isList ? 'list' : 'grid'); } catch (e) {}
    }

    if (grid && gridBtn && listBtn) {
        gridBtn.addEventListener('click', function () { setView(false); });
        listBtn.addEventListener('click', function () { setView(true); });
        try { if (localStorage.getItem('shopView') === 'list') setView(true); } catch (e) {}
    }

    /* ---------- Sticky header ---------- */
    var header = document.getElementById('shopHeader');
    if (header) {
        // placeholder عشان الصفحة ماتنطش لما الهيدر يبقى fixed
        var spacer = document.createElement('div');
        header.parentNode.insertBefore(spacer, header);

        var offset = header.offsetHeight + 50;
        window.addEventListener('scroll', function () {
            var stick = window.scrollY > offset;
            if (stick && !header.classList.contains('sticky')) {
                spacer.style.height = header.offsetHeight + 'px';
                header.classList.add('sticky');
            } else if (!stick && header.classList.contains('sticky')) {
                header.classList.remove('sticky');
                spacer.style.height = '0';
            }
        }, { passive: true });
    }

    /* ---------- Burger بالكيبورد ---------- */
    var burger = document.querySelector('.shBurger');
    if (burger) {
        burger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burger.click(); }
        });
    }

    /* ---------- Back to top ---------- */
    var toTop = document.querySelector('.scToTop');
    if (toTop) {
        toTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});




// ================= SEARCH (header + sidebar) =================
document.addEventListener("DOMContentLoaded", function () {
    const headerForm  = document.querySelector(".shSearch");
    const headerInput = document.querySelector(".shSearch input");
    const sideInput   = document.querySelector(".scSearch input");
    const grid        = document.querySelector(".scGrid");
    if (!grid) return;

    // رسالة "مفيش نتائج"
    const noResult = document.createElement("p");
    noResult.className = "scNoResult";
    noResult.textContent = "No products found";
    noResult.style.cssText = "display:none;grid-column:1/-1;text-align:center;font-size:20px;padding:30px;";
    grid.appendChild(noResult);

    function doSearch(query) {
        const q = query.trim().toLowerCase();
        let found = 0;

        grid.querySelectorAll(".scCard").forEach(function (card) {
            const nameEl = card.querySelector(".scName");
            const name = nameEl ? nameEl.textContent.toLowerCase() : "";
            const match = name.includes(q);
            card.style.display = match ? "" : "none";
            if (match) found++;
        });

        noResult.style.display = found === 0 ? "block" : "none";
    }

    // السيرش اللي فوق
    if (headerInput) {
        headerInput.addEventListener("input", function () {
            doSearch(headerInput.value);
            if (sideInput) sideInput.value = headerInput.value;
        });
    }
    if (headerForm) {
        headerForm.addEventListener("submit", function (e) {
            e.preventDefault();               // يمنع إعادة تحميل الصفحة
            doSearch(headerInput.value);
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // سيرش السايدبار (بنفس الدالة)
    if (sideInput) {
        sideInput.addEventListener("input", function () {
            doSearch(sideInput.value);
            if (headerInput) headerInput.value = sideInput.value;
        });
    }

    // لو جاي من صفحة تانية: shop.html?search=tomato
    const param = new URLSearchParams(location.search).get("search");
    if (param) {
        if (headerInput) headerInput.value = param;
        doSearch(param);
    }
});