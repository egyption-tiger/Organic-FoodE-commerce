// بيحط الهيدر والفوتر والكارت في أي صفحة فيها #siteHeader و #siteFooter
(function () {
    const page = document.body.dataset.page || "";
    const act = name => (page === name ? " active" : "");

    const header = `
    <header class="shopHeader">
        <div class="shContainer">
            <div class="shMiddle">
                <div class="shLogoWrap">
                    <i class="fa-solid fa-bars shBurger" id="smOpen"></i>
                    <a href="../index.html" class="shLogo"><img src="../images/images01.png" alt="Organi"></a>
                </div>

                <form class="shSearch" action="shop.html" method="get">
                    <span class="shSearchCat">All |</span>
                    <input type="search" name="search" placeholder="What are you shopping for?">
                    <button type="submit" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>

                <div class="shIcons">
                    <a href="#" class="shIcon"><i class="fa-regular fa-user"></i></a>
                    <a href="#" class="shIcon"><i class="fa-regular fa-heart"></i></a>
                    <a href="#" class="shIcon shCart">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span class="shBadge">0</span>
                    </a>
                </div>
            </div>

            <nav class="shNav">
                <ul class="shMenu">
                    <li class="shItem"><a href="../index.html" class="shLink">Home</a></li>
                    <li class="shItem"><a href="./shop.html" class="shLink">Shop</a></li>
                    <li class="shItem"><a href="./blog.html" class="shLink${act("blog")}">Blog</a></li>
                    <li class="shItem">
                        <a href="./about.html" class="shLink${act("about")}">About</a>
                    </li>
                    <li class="shItem">
                        <a href="./faq.html" class="shLink${act("faq")}">FAQs</a>
                    </li>
                    <li class="shItem"><a href="./contact.html" class="shLink${act("contact")}">Contact</a></li>
                </ul>
            </nav>
        </div>
        <div class="shLine"></div>
    </header>`;

    const footer = `
    <footer class="organic-footer">
        <div class="footer-middle">
            <div class="container">
                <div class="row g-0">
                    <div class="col-12 col-md-6 col-lg-3 footer-column">
                        <div class="footer-widget">
                            <h4>Why People Like us</h4>
                            <p class="footer-description">We deliver fresh organic vegetables and fruits straight from our farm to your door.</p>
                            <a href="about.html" class="footer-button">View More <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 footer-column">
                        <div class="footer-widget">
                            <h4>Information</h4>
                            <ul class="footer-links">
                                <li><a href="about.html">About Us</a></li>
                                <li><a href="faq.html">FAQs</a></li>
                                <li><a href="blog.html">Blog</a></li>
                                <li><a href="contact.html">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 footer-column">
                        <div class="footer-widget">
                            <h4>My Account</h4>
                            <ul class="footer-links">
                                <li><a href="cart.html">Shopping Cart</a></li>
                                <li><a href="checkout.html">Checkout</a></li>
                                <li><a href="shop.html">Shop</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 footer-column">
                        <div class="footer-widget">
                            <h4>Contact Us</h4>
                            <ul class="contact-list">
                                <li><strong>Address:</strong> <span>1429 Netus Rd, NY 48247</span></li>
                                <li><strong>Email:</strong> <a href="mailto:Organi@gmail.com">Organi@gmail.com</a></li>
                                <li><strong>Phone:</strong> <a href="tel:+8748864174">(+87) 4886-4174</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p class="copyright">Copyright &copy; 2026 <span>ORGANI</span> Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- SIDE MENU -->
    <div class="smOverlay" id="smOverlay"></div>
    <aside class="smPanel" id="smPanel">
        <button class="smClose" id="smClose" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <ul class="smList">
            <li><a href="../index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="faq.html">FAQs</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </aside>

    <!-- CART SIDEBAR -->
    <div class="cartOverlay" id="cartOverlay"></div>
    <aside class="cartSidebar" id="cartSidebar">
        <div class="cartHead">
            <h4>Organic Products</h4>
            <button class="cartClose" id="cartClose" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cartItems" id="cartItems"></div>
        <div class="cartTotals">
            <div class="cartRow"><span>Subtotal:</span><span id="cartSubtotal">$0.00</span></div>
            <div class="cartRow"><span>Vat 5%:</span><span id="cartVat">$0.00</span></div>
            <div class="cartRow"><span>Discount 15%:</span><span id="cartDiscount">- $0.00</span></div>
            <div class="cartRow cartTotal"><span>Total:</span><span id="cartTotalVal">$0.00</span></div>
        </div>
        <div class="cartBtns">
            <a href="cart.html" class="cartBtn">VIEW CART</a>
            <a href="checkout.html" class="cartBtn">CHECKOUT</a>
        </div>
    </aside>`;

    const h = document.getElementById("siteHeader");
    const f = document.getElementById("siteFooter");
    if (h) h.innerHTML = header;
    if (f) f.innerHTML = footer;
})();