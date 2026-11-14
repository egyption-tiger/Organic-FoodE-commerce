// function scrollCategories(direction) {
//   const track = document.getElementById('categoriesTrack');
//   const scrollAmount = 290;
//   track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
// }



// const gamesSwiper = new Swiper("#categoriesTrack", {
//   slidesPerView: 3,
//   slidesPerGroup: 3,
//   spaceBetween: 24,
//   loop: true,
//   navigation: {
//     nextEl: ".swiper-button-next-custom",
//     prevEl: ".swiper-button-prev-custom",
//   },
//   breakpoints: {
//     0: { slidesPerView: 1, slidesPerGroup: 1 },
//     768: { slidesPerView: 2, slidesPerGroup: 2 },
//     1024: { slidesPerView: 3, slidesPerGroup: 3 },
//   }
// });






// const track = document.getElementById('categoriesTrack');
// const AUTO_DELAY = 4500; // كل كام مللي ثانية يقلب (1500 = ثانية ونص)
// let autoSlide;

// function getGap() {
//   return parseInt(getComputedStyle(track).gap) || 0;
// }

// // الخطوة = عرض كارت + المسافة
// function getStep() {
//   const card = track.querySelector('.category-card');
//   return card.offsetWidth + getGap();
// }

// // عدد الكروت الظاهرة حاليًا (5 ديسكتوب / 3 تابلت / 2 موبايل)
// function getVisibleCount() {
//   return Math.round((track.clientWidth + getGap()) / getStep());
// }

// function getMaxIndex() {
//   const total = track.querySelectorAll('.category-card').length;
//   return Math.max(0, total - getVisibleCount());
// }

// function getCurrentIndex() {
//   return Math.round(track.scrollLeft / getStep());
// }

// function goToIndex(index) {
//   track.scrollTo({ left: index * getStep(), behavior: 'smooth' });
// }

// function scrollCategories(direction) {
//   const max = getMaxIndex();
//   let next = getCurrentIndex() + direction;

//   if (next > max) next = 0;     // وصل للآخر: يرجع من الأول
//   if (next < 0) next = max;     // في الأول والضغط على السابق: يروح للآخر

//   goToIndex(next);
// }

// function startAutoSlide() {
//   stopAutoSlide();
//   autoSlide = setInterval(() => scrollCategories(1), AUTO_DELAY);
// }

// function stopAutoSlide() {
//   clearInterval(autoSlide);
// }

// // يقف لما الماوس فوق الصور ويكمل لما يخرج
// track.addEventListener('mouseenter', stopAutoSlide);
// track.addEventListener('mouseleave', startAutoSlide);

// // لما تضغط على الأسهم التايمر يبدأ من جديد
// document.querySelectorAll('.nav-arrows button').forEach(btn => {
//   btn.addEventListener('click', startAutoSlide);
// });

// startAutoSlide();



const track = document.getElementById('categoriesTrack');
const AUTO_DELAY = 5500;   // كل كام مللي ثانية يقلب
const ANIM_TIME = 500;     // مدة حركة السكرول
let autoSlide;
let isAnimating = false;

function getGap() {
  return parseFloat(getComputedStyle(track).gap) || 0;
}

// الخطوة = عرض كارت + المسافة
function getStep() {
  const card = track.querySelector('.category-card');
  return card.getBoundingClientRect().width + getGap();
}

// عدد الكروت الظاهرة (5 ديسكتوب / 3 تابلت / 2 موبايل)
function getVisibleCount() {
  return Math.round((track.clientWidth + getGap()) / getStep());
}

function canSlide() {
  return track.querySelectorAll('.category-card').length > getVisibleCount();
}

function scrollCategories(direction) {
  if (isAnimating || !canSlide()) return;
  isAnimating = true;

  const step = getStep();

  if (direction === 1) {
    // للأمام: يتحرك خطوة، وبعدها الكارت الأول ينتقل للآخر
    track.scrollTo({ left: step, behavior: 'smooth' });

    setTimeout(() => {
      track.appendChild(track.firstElementChild);
      track.scrollTo({ left: 0, behavior: 'instant' });
      isAnimating = false;
    }, ANIM_TIME);

  } else {
    // للخلف: الكارت الأخير ييجي في الأول، وبعدها يتحرك لمكانه
    track.prepend(track.lastElementChild);
    track.scrollTo({ left: step, behavior: 'instant' });
    track.scrollTo({ left: 0, behavior: 'smooth' });

    setTimeout(() => {
      isAnimating = false;
    }, ANIM_TIME);
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlide = setInterval(() => scrollCategories(1), AUTO_DELAY);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

// يقف لما الماوس فوق الصور ويكمل لما يخرج
track.addEventListener('mouseenter', stopAutoSlide);
track.addEventListener('mouseleave', startAutoSlide);

// لما تضغط على الأسهم التايمر يبدأ من جديد
document.querySelectorAll('.nav-arrows button').forEach(btn => {
  btn.addEventListener('click', startAutoSlide);
});

startAutoSlide();





(function () {
  const slides = Array.from(document.querySelectorAll('#promoMain .slide'));
  const main = document.getElementById('promoMain');
  const n = slides.length;
  const DELAY = 3000;   // كل كام مللي ثانية يقلب
  const ANIM = 600;     // نفس مدة الـ transition في الـ CSS
  let index = 0;
  let timer;
  let busy = false;

  // ترتيب أولي: الأولى ظاهرة والباقي برا على اليمين
  slides.forEach((s, i) => {
    s.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
  });

  // dir = 1 للأمام (الصورة تدخل من اليمين) | dir = -1 للخلف (تدخل من الشمال)
  function go(dir) {
    if (busy || n < 2) return;
    busy = true;

    const cur = slides[index];
    const nextIndex = (index + dir + n) % n;
    const nxt = slides[nextIndex];

    // الصورة الجاية تقف برا من الناحية الصح من غير حركة
    nxt.classList.add('no-anim');
    nxt.style.transform = `translateX(${dir * 100}%)`;
    void nxt.offsetWidth;                       // يطبّق التغيير فورًا
    nxt.classList.remove('no-anim');

    // الحالية تخرج والجاية تدخل
    cur.style.transform = `translateX(${-dir * 100}%)`;
    nxt.style.transform = 'translateX(0)';

    index = nextIndex;
    setTimeout(() => { busy = false; }, ANIM);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => go(1), DELAY);
  }
  function stopAuto() {
    clearInterval(timer);
  }

  document.getElementById('promoNext').addEventListener('click', () => { go(1); startAuto(); });
  document.getElementById('promoPrev').addEventListener('click', () => { go(-1); startAuto(); });

  main.addEventListener('mouseenter', stopAuto);
  main.addEventListener('mouseleave', startAuto);

  startAuto();
})();










(function () {
  const tabs = document.querySelectorAll('#filterTabs .filter-btn');
  const cards = document.querySelectorAll('#productsGrid .product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });
})();







(function () {
  const items = document.querySelectorAll('#cpList .cp-item');
  const products = document.querySelectorAll('#cpProductsGrid .cp-product');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');


      
    });
  });
})();



// // 
// (function () {
//   const wrapper = document.getElementById('testimonialWrapper');
//   const items = wrapper.querySelectorAll('.testimonial-item');
//   const dotsBox = document.getElementById('testimonialDots');
//   const DELAY = 2000; // كل ثانيتين
//   let index = 0;
//   let timer;

//   // إنشاء نقاط التنقل حسب عدد الـ testimonials
//   items.forEach((item, i) => {
//     const dot = document.createElement('button');
//     dot.classList.add('dot-btn');
//     if (i === 0) dot.classList.add('active');
//     dot.addEventListener('click', () => {
//       show(i);
//       startAuto();
//     });
//     dotsBox.appendChild(dot);
//   });
//   const dots = dotsBox.querySelectorAll('.dot-btn');

//   function show(i) {
//     items[index].classList.remove('active');
//     dots[index].classList.remove('active');

//     index = (i + items.length) % items.length;

//     items[index].classList.add('active');
//     dots[index].classList.add('active');
//   }

//   function startAuto() {
//     stopAuto();
//     timer = setInterval(() => show(index + 1), DELAY);
//   }
//   function stopAuto() {
//     clearInterval(timer);
//   }

//   wrapper.addEventListener('mouseenter', stopAuto);
//   wrapper.addEventListener('mouseleave', startAuto);

//   startAuto();
// })();



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




window.addEventListener("load", function () {
    const header = document.querySelector(".secHeader");
    const nav = document.querySelector(".dowenNav");
    if (!header || !nav) return;

    const triggerPoint = header.offsetHeight;

    function handleScroll() {
        if (window.scrollY > triggerPoint) {
            if (!nav.classList.contains("sticky")) {
                header.style.paddingBottom = (nav.offsetHeight + 10) + "px";
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