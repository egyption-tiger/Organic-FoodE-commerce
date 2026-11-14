
document.addEventListener("DOMContentLoaded", function () {

    const KEY = "organicCart";
const IMG_BASE = location.pathname.includes("/index/") ? "../" : "./";

const cleanPath = p => String(p || "").replace(/^(\.\.?\/)+/, "");
    const VAT = 0.05;
    const DISCOUNT = 0.15;

    let cart = [];

    function loadCart() {
        try {
            cart = JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            cart = [];
        }
    }

    function saveCart() {
        localStorage.setItem(KEY, JSON.stringify(cart));
    }

    const money = n => "$" + n.toFixed(2);

    const itemsBox = document.getElementById("cartPageItems");

    if (!itemsBox) return;

    function calculate() {

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.qty, 0
        );

        const discount = subtotal * DISCOUNT;

        const vat = (subtotal - discount) * VAT;

        const total = subtotal - discount + vat;

        document.getElementById("pageSubtotal").textContent =
            money(subtotal);

        document.getElementById("pageDiscount").textContent =
            "- " + money(discount);

        document.getElementById("pageVat").textContent =
            money(vat);

        document.getElementById("pageTotal").textContent =
            money(total);
    }

    function render() {

        if (cart.length === 0) {

            itemsBox.innerHTML = `
                <div class="cartPageEmpty">
                    <i class="fa-solid fa-basket-shopping"
                       style="font-size:45px;color:#7CC000"></i>

                    <h3>Your Cart Is Empty</h3>

                    <p>Start shopping and add your favorite products.</p>
                </div>
            `;

            calculate();

            document.getElementById("goCheckout").style.display = "none";

            return;
        }

        document.getElementById("goCheckout").style.display = "block";

        itemsBox.innerHTML = cart.map(item => `

            <div class="cartPageItem">

                <div class="cartProductInfo">

                    <img src="${item.img}" alt="">

                    <div>
                        <h4>${item.name}</h4>

                        <button class="cartPageRemove"
                                data-id="${encodeURIComponent(item.id)}">
                            <i class="fa-solid fa-trash"></i>
                            Remove
                        </button>
                    </div>

                </div>

                <span class="cartPagePrice">
                    ${money(item.price)}
                </span>

                <div class="cartPageQty">

                    <button data-act="dec"
                            data-id="${encodeURIComponent(item.id)}">−</button>

                    <span>${item.qty}</span>

                    <button data-act="inc"
                            data-id="${encodeURIComponent(item.id)}">+</button>

                </div>

                <strong>
                    ${money(item.price * item.qty)}
                </strong>

            </div>

        `).join("");

        calculate();
    }

    itemsBox.addEventListener("click", function(e) {

        const qtyBtn = e.target.closest("[data-act]");
        const removeBtn = e.target.closest(".cartPageRemove");

        if (qtyBtn) {

            const id = decodeURIComponent(qtyBtn.dataset.id);

            const item = cart.find(x => x.id === id);

            if (!item) return;

            item.qty += qtyBtn.dataset.act === "inc" ? 1 : -1;

            if (item.qty <= 0) {
                cart = cart.filter(x => x.id !== id);
            }

            saveCart();
            render();
        }

        if (removeBtn) {

            const id = decodeURIComponent(removeBtn.dataset.id);

            cart = cart.filter(x => x.id !== id);

            saveCart();
            render();
        }

    });

    document.getElementById("clearCart").addEventListener("click", function() {

        if (!cart.length) return;

        if (confirm("Are you sure you want to clear your cart?")) {

            cart = [];

            saveCart();
            render();
        }

    });

    window.addEventListener("storage", function(e) {

        if (e.key === KEY) {
            loadCart();
            render();
        }

    });

    loadCart();
    render();

});





document.addEventListener("DOMContentLoaded", function () {

    const KEY = "organicCart";
    const VAT = 0.05;
    const DISCOUNT = 0.15;

    let cart = [];

    function loadCart() {
        try {
            cart = JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            cart = [];
        }
    }

    function saveCart() {
        localStorage.setItem(KEY, JSON.stringify(cart));
    }

    const money = n => "$" + n.toFixed(2);

    const itemsBox = document.getElementById("cartPageItems");
    if (!itemsBox) return;

    // ---------- السيرش ----------
    const searchForm  = document.querySelector(".shSearch");
    const searchInput = document.querySelector(".shSearch input");

    function getQuery() {
        return searchInput ? searchInput.value.trim().toLowerCase() : "";
    }

    // ---------- الحسابات (على كل السلة، مش على نتيجة البحث بس) ----------
    function calculate() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const discount = subtotal * DISCOUNT;
        const vat      = (subtotal - discount) * VAT;
        const total    = subtotal - discount + vat;

        document.getElementById("pageSubtotal").textContent = money(subtotal);
        document.getElementById("pageDiscount").textContent = "- " + money(discount);
        document.getElementById("pageVat").textContent      = money(vat);
        document.getElementById("pageTotal").textContent    = money(total);
    }

    // ---------- الرسم ----------
    function render() {

        // السلة فاضية فعلاً
        if (cart.length === 0) {
            itemsBox.innerHTML = `
                <div class="cartPageEmpty">
                    <i class="fa-solid fa-basket-shopping" style="font-size:45px;color:#7CC000"></i>
                    <h3>Your Cart Is Empty</h3>
                    <p>Start shopping and add your favorite products.</p>
                </div>`;
            calculate();
            document.getElementById("goCheckout").style.display = "none";
            return;
        }

        document.getElementById("goCheckout").style.display = "block";

        // فلترة حسب السيرش
        const q = getQuery();
        const list = q
            ? cart.filter(item => item.name.toLowerCase().includes(q))
            : cart;

        // مفيش نتائج للبحث
        if (list.length === 0) {
            itemsBox.innerHTML = `
                <div class="cartPageEmpty">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:45px;color:#7CC000"></i>
                    <h3>No products found</h3>
                    <p>No product in your cart matches "${q.replace(/[<>&"]/g, "")}".</p>
                </div>`;
            calculate();
            return;
        }

        itemsBox.innerHTML = list.map(item => `
            <div class="cartPageItem">
                <div class="cartProductInfo">
                    <img src="${item.img}" alt="">
                    <div>
                        <h4>${item.name}</h4>
                        <button class="cartPageRemove" data-id="${encodeURIComponent(item.id)}">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                </div>

                <span class="cartPagePrice">${money(item.price)}</span>

                <div class="cartPageQty">
                    <button data-act="dec" data-id="${encodeURIComponent(item.id)}">−</button>
                    <span>${item.qty}</span>
                    <button data-act="inc" data-id="${encodeURIComponent(item.id)}">+</button>
                </div>

                <strong>${money(item.price * item.qty)}</strong>
            </div>
        `).join("");

        calculate();
    }

    // ---------- أحداث السلة ----------
    itemsBox.addEventListener("click", function (e) {

        const qtyBtn    = e.target.closest("[data-act]");
        const removeBtn = e.target.closest(".cartPageRemove");

        if (qtyBtn) {
            const id   = decodeURIComponent(qtyBtn.dataset.id);
            const item = cart.find(x => x.id === id);
            if (!item) return;

            item.qty += qtyBtn.dataset.act === "inc" ? 1 : -1;
            if (item.qty <= 0) cart = cart.filter(x => x.id !== id);

            saveCart();
            render();
        }

        if (removeBtn) {
            const id = decodeURIComponent(removeBtn.dataset.id);
            cart = cart.filter(x => x.id !== id);
            saveCart();
            render();
        }
    });

    document.getElementById("clearCart").addEventListener("click", function () {
        if (!cart.length) return;
        if (confirm("Are you sure you want to clear your cart?")) {
            cart = [];
            saveCart();
            render();
        }
    });

    // ---------- أحداث السيرش ----------
    if (searchInput) {
        searchInput.addEventListener("input", render);   // بحث لحظي
    }
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();                           // يمنع reload الصفحة
            render();
        });
    }

    window.addEventListener("storage", function (e) {
        if (e.key === KEY) {
            loadCart();
            render();
        }
    });

    loadCart();
    render();
});