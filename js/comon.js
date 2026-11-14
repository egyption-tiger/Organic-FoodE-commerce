// ================= CART (localStorage) =================
document.addEventListener("DOMContentLoaded", function () {

    const KEY = "organicCart";
    const VAT = 0.05;         // 5%
    const DISCOUNT = 0.15;    // 15%
    const OPEN_ON_ADD = true; // يفتح الكارت لما تضيف منتج

    const sidebar  = document.getElementById("cartSidebar");
    const overlay  = document.getElementById("cartOverlay");
    const itemsBox = document.getElementById("cartItems");
    if (!sidebar || !overlay || !itemsBox) return;

    // ---------- التخزين ----------
    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch (e) { return []; }
    }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
    }
    let cart = load();

    // ---------- أدوات ----------
    const money = n => "$" + n.toFixed(2);
    const toNum = t => parseFloat(String(t || "").replace(/[^0-9.]/g, "")) || 0;
    const esc = s => String(s).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    // ---------- فتح / قفل الكارت ----------
    function openCart() {
        sidebar.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeCart() {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    // ---------- الرقم فوق الأيقونة ----------
    function updateBadge() {
        const count = cart.reduce((sum, it) => sum + it.qty, 0);
        document.querySelectorAll(".apsolute, .shBadge").forEach(function (b) {
            b.textContent = count;
            b.style.display = count > 0 ? "" : "none";
            b.classList.add("badgeBump");
            setTimeout(() => b.classList.remove("badgeBump"), 250);
        });
    }

    // ---------- رسم الكارت ----------
    function render() {
        if (cart.length === 0) {
            itemsBox.innerHTML = '<p class="cartEmpty">السلة فاضية</p>';
        } else {
            itemsBox.innerHTML = cart.map(function (it) {
                return `
                <div class="cartItem">
                    <img src="${esc(it.img)}" alt="">
                    <div class="cartItemInfo">
                        <h5>${esc(it.name)}</h5>
                        <div class="cartPrice">
                            <span class="newP">${money(it.price)}</span>
                            ${it.oldPrice ? `<span class="oldP">${money(it.oldPrice)}</span>` : ""}
                        </div>
                        <div class="cartQtyRow">
                            <button class="cartQty" data-act="dec" data-id="${esc(it.id)}" aria-label="Decrease">−</button>
                            <span class="cartQtyNum">${it.qty}</span>
                            <button class="cartQty" data-act="inc" data-id="${esc(it.id)}" aria-label="Increase">+</button>
                        </div>
                    </div>
                    <button class="cartRemove" data-id="${esc(it.id)}" aria-label="Remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>`;
            }).join("");
        }

        // الحسابات
        const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
        const discount = subtotal * DISCOUNT;
        const vat      = (subtotal - discount) * VAT;
        const total    = subtotal - discount + vat;

        document.getElementById("cartSubtotal").textContent = money(subtotal);
        document.getElementById("cartVat").textContent      = money(vat);
        document.getElementById("cartDiscount").textContent = "- " + money(discount);
        document.getElementById("cartTotalVal").textContent = money(total);

        updateBadge();
    }

    // ---------- العمليات ----------
    function addFromCard(card) {
        const q = s => card.querySelector(s);

        const name  = (q(".product-name, .scName") || {}).textContent;
        const price = toNum((q(".price-new, .scPrice .new") || {}).textContent);
        const old   = toNum((q(".price-old, .scPrice .old") || {}).textContent);
        const imgEl = q(".img-default, .scImgDefault, .product-photo");
        if (!name || !price) return;

        const imgSrc = imgEl ? imgEl.getAttribute("src") : "";
        const id = card.dataset.id || (name.trim() + "|" + price + "|" + imgSrc);
        const found = cart.find(it => it.id === id);

        if (found) {
            found.qty++;
        } else {
            cart.push({
                id: id,
                name: name.trim(),
                price: price,
                oldPrice: old,
                img: imgSrc,
                qty: 1
            });
        }
        save();
        render();
        if (OPEN_ON_ADD) openCart();
    }

    function removeItem(id) {
        cart = cart.filter(it => it.id !== id);
        save();
        render();
    }

    function changeQty(id, delta) {
        const it = cart.find(x => x.id === id);
        if (!it) return;

        // لو الكمية هتوصل صفر نسأل قبل الحذف
        if (it.qty + delta <= 0) { askRemove(id); return; }

        it.qty += delta;
        save();
        render();
    }

    // ---------- نافذة التأكيد ----------
    const cOverlay = document.getElementById("confirmOverlay");
    const cYes = document.getElementById("confirmYes");
    const cNo  = document.getElementById("confirmNo");
    let pendingId = null;

    function askRemove(id) {
        // لو النافذة مش موجودة في الصفحة نستخدم confirm العادي
        if (!cOverlay) {
            if (confirm("هل أنت متأكد أنك تريد حذف هذا المنتج من السلة؟")) removeItem(id);
            return;
        }
        pendingId = id;
        cOverlay.classList.add("open");
    }
    function closeConfirm() {
        if (cOverlay) cOverlay.classList.remove("open");
        pendingId = null;
    }

    if (cOverlay && cYes && cNo) {
        cYes.addEventListener("click", function () {
            if (pendingId) removeItem(pendingId);
            closeConfirm();
        });
        cNo.addEventListener("click", closeConfirm);
        cOverlay.addEventListener("click", function (e) {
            if (e.target === cOverlay) closeConfirm();
        });
    }

    // ---------- الأحداث (delegation) ----------
    document.addEventListener("click", function (e) {

        // إضافة للسلة (index + shop)
        const addBtn = e.target.closest(".action-cart, .scActBtn[aria-label='Add to cart']");
        if (addBtn) {
            const card = addBtn.closest(".product-card, .scCard");
            if (card) addFromCard(card);
            return;
        }

        // حذف منتج (مع تأكيد)
        const rm = e.target.closest(".cartRemove");
        if (rm) { askRemove(rm.dataset.id); return; }

        // + / -
        const qty = e.target.closest(".cartQty");
        if (qty) {
            changeQty(qty.dataset.id, qty.dataset.act === "inc" ? 1 : -1);
            return;
        }

        // فتح الكارت من الأيقونة
        if (e.target.closest("#Shopping, .shCart")) {
            e.preventDefault();
            openCart();
            return;
        }

        // قفل الكارت
        if (e.target.closest("#cartClose") || e.target === overlay) closeCart();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (cOverlay && cOverlay.classList.contains("open")) closeConfirm();
            else closeCart();
        }
    });

    // مزامنة بين التابات / الصفحات
    window.addEventListener("storage", function (e) {
        if (e.key === KEY) { cart = load(); render(); }
    });

    render();
});



 