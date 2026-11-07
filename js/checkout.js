document.addEventListener("DOMContentLoaded", function () {

    const KEY = "organicCart";

    const VAT = 0.05;
    const DISCOUNT = 0.15;

    let cart = [];

    const productsBox = document.getElementById("checkoutProducts");
    const form = document.getElementById("checkoutForm");
    const orderSuccess = document.getElementById("orderSuccess");
    const placeOrder = document.getElementById("placeOrder");

    function loadCart() {
        try {
            cart = JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            cart = [];
        }
    }

    function money(value) {
        return "$" + Number(value).toFixed(2);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function calculate() {

        const subtotal = cart.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.qty), 0
        );

        const discount = subtotal * DISCOUNT;

        const vat = (subtotal - discount) * VAT;

        const total = subtotal - discount + vat;

        document.getElementById("checkoutSubtotal").textContent =
            money(subtotal);

        document.getElementById("checkoutDiscount").textContent =
            "- " + money(discount);

        document.getElementById("checkoutVat").textContent =
            money(vat);

        document.getElementById("checkoutTotal").textContent =
            money(total);

        return { subtotal, discount, vat, total };
    }

    function render() {

        if (cart.length === 0) {

            productsBox.innerHTML = `
                <div class="checkoutEmpty">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your cart is empty.</p>
                    <a href="./shop.html">Start Shopping</a>
                </div>
            `;

            calculate();

            placeOrder.disabled = true;

            return;
        }

        placeOrder.disabled = false;

        productsBox.innerHTML = cart.map(item => {

            return `
                <div class="checkoutProduct">

                    <div class="checkoutProductInfo">

                        <img src="${escapeHTML(item.img)}" alt="">

                        <div>
                            <h4>${escapeHTML(item.name)}</h4>
                            <span>Qty: ${Number(item.qty)}</span>
                        </div>

                    </div>

                    <strong>
                        ${money(Number(item.price) * Number(item.qty))}
                    </strong>

                </div>
            `;

        }).join("");

        calculate();
    }

    // تحديث الصفحة عند تغيير السلة في صفحة أخرى
    window.addEventListener("storage", function (e) {

        if (e.key === KEY) {
            loadCart();
            render();
        }

    });

    // تأكيد الطلب
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!form.reportValidity()) return;

        const totals = calculate();

        const formData = new FormData(form);

        const order = {

            orderNumber: "ORG-" + Date.now(),

            customer: {
                name: formData.get("fullName"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                city: formData.get("city"),
                address: formData.get("address"),
                postalCode: formData.get("postalCode")
            },

            payment: formData.get("payment"),

            notes: formData.get("orderNotes"),

            products: cart.map(item => ({ ...item })),

            totals: totals,

            date: new Date().toISOString()

        };

        // حفظ الطلب محلياً كتجربة
        localStorage.setItem(
            "lastOrganicOrder",
            JSON.stringify(order)
        );

        // تفريغ السلة بعد نجاح تسجيل الطلب التجريبي
        localStorage.removeItem(KEY);

        cart = [];

        form.hidden = true;

        orderSuccess.hidden = false;

        document.getElementById("orderNumber").textContent =
            "Order Number: " + order.orderNumber;

        window.scrollTo({
            top: orderSuccess.offsetTop - 100,
            behavior: "smooth"
        });

    });

    loadCart();
    render();

});