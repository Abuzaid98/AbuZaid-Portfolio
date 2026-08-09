"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- theme toggle ----------

const themeToggle = document.querySelector("#themeToggle");
const rootEl = document.documentElement;

themeToggle.addEventListener("click", function () {
    const current = rootEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    rootEl.setAttribute("data-theme", next);
    try {
        localStorage.setItem("theme", next);
    } catch (e) { /* localStorage unavailable — theme just won't persist */ }
});

// ---------- toggle mobile nav ----------

let menuIcon = document.querySelector("#menu-icon");
let nav = document.querySelector("nav");

menuIcon.addEventListener("click", function () {
    menuIcon.classList.toggle("fa-xmark");
    nav.classList.toggle("slide-nav");
});

// ---------- scrollbar progress ----------

window.addEventListener('scroll', () => {
    let scrollBar = document.querySelector('.scrollBar');
    let scroll = document.documentElement.scrollTop;
    let totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = totalHeight > 0 ? (scroll / totalHeight) * 100 : 0;
    scrollBar.style.width = scrolled + "%";
});

// ---------- scroll section active link ----------

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (navItem) {
    navItem.addEventListener("click", function () {
        if (nav.classList.contains("slide-nav")) {
            menuIcon.classList.remove("fa-xmark");
            nav.classList.remove("slide-nav");
        }
    });
});

window.addEventListener("scroll", function () {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 200;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => links.classList.remove("active-nav"));
            document.querySelectorAll('header nav a[href="#' + id + '"]').forEach(link => {
                link.classList.add("active-nav");
            });
        }
    });
});

// ---------- smooth scroll (Lenis) ----------

let lenis = null;
if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
    });

    if (window.gsap) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

function scrollToTarget(top) {
    if (lenis) {
        lenis.scrollTo(top, { offset: 0 });
    } else {
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
}

document.querySelectorAll(".nav-link").forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        let targetSelector = this.getAttribute("href");
        let targetElement = document.querySelector(targetSelector);
        if (!targetElement) return;
        scrollToTarget(targetElement.offsetTop - 80);
    });
});

const goTopBtn = document.getElementById("goTopBtn");

goTopBtn.addEventListener("click", function () {
    scrollToTarget(0);
});

window.addEventListener("scroll", function () {
    goTopBtn.classList.toggle("is-visible", window.scrollY > 300);
});

// ---------- typed.js text animation ----------

new Typed('#typed-role', {
    strings: ['React.js Developer', 'Frontend Developer', 'Web Developer'],
    typeSpeed: 55,
    backSpeed: 30,
    backDelay: 1400,
    loop: true,
});

new Typed('#element2', {
    strings: [' React.js Developer.', 'Frontend Developer.', 'Web Developer.'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1400,
    loop: true,
});

// ---------- tech stack icons ----------

const DEVICON_BASE = "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons";

document.querySelectorAll(".tech-card").forEach(function (card) {
    const icon = card.dataset.icon;
    const variant = card.dataset.variant || "original";
    const name = card.dataset.name;

    const wrap = document.createElement("div");
    wrap.className = "tech-icon-wrap";

    const img = document.createElement("img");
    img.src = `${DEVICON_BASE}/${icon}/${icon}-${variant}.svg`;
    img.alt = name;
    img.loading = "lazy";
    wrap.appendChild(img);

    const label = document.createElement("span");
    label.textContent = name;

    card.appendChild(wrap);
    card.appendChild(label);
});

// ---------- GSAP scroll-triggered animations ----------

if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
        .from(".hero-kicker", { opacity: 0, y: 16, duration: .5 })
        .from(".terminal", { opacity: 0, y: 30, scale: .97, duration: .7 }, "-=.25")
        .from(".hero-lede", { opacity: 0, y: 16, duration: .5 }, "-=.3")
        .from(".hero-ctas a", { opacity: 0, y: 16, duration: .5, stagger: .12 }, "-=.3")
        .from(".hero-socials a", { opacity: 0, y: 10, duration: .4, stagger: .08 }, "-=.3")
        .from(".hero-portrait", { opacity: 0, x: 30, duration: .8 }, "-=.9");

    if (!prefersReducedMotion) {
        gsap.to(".hero-blob-1", {
            x: 40, y: 30, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(".hero-blob-2", {
            x: -30, y: -20, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
    }

    // generic section reveal
    gsap.utils.toArray(".section-head").forEach((el) => {
        gsap.from(el, {
            opacity: 0, y: 30, duration: .7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" }
        });
    });

    gsap.from(".file-photo", {
        opacity: 0, x: -30, duration: .8, ease: "power3.out",
        scrollTrigger: { trigger: ".file-photo", start: "top 85%" }
    });

    gsap.from(".all-about > *", {
        opacity: 0, y: 24, duration: .6, stagger: .08, ease: "power3.out",
        scrollTrigger: { trigger: ".all-about", start: "top 82%" }
    });

    // experience cards — settle-then-stagger entrance (the section's own signature moment)
    gsap.utils.toArray(".exp-card").forEach((card) => {
        if (prefersReducedMotion) {
            gsap.from(card, {
                opacity: 0, duration: .5, ease: "power1.out",
                scrollTrigger: { trigger: card, start: "top 85%" }
            });
            return;
        }

        gsap.timeline({ scrollTrigger: { trigger: card, start: "top 82%" } })
            .from(card, { opacity: 0, y: 50, scale: .94, duration: .8, ease: "power4.out" })
            .from(card.querySelector(".exp-mark"), {
                opacity: 0, scale: .5, rotate: -12, duration: .5, ease: "back.out(2.2)"
            }, "-=.45")
            .from(card.querySelectorAll(".exp-status, .exp-duration"), {
                opacity: 0, x: 16, duration: .45, stagger: .08, ease: "power3.out"
            }, "-=.4")
            .from(card.querySelectorAll(".exp-bullets li, .exp-desc, .exp-cert"), {
                opacity: 0, x: -18, duration: .45, stagger: .09, ease: "power3.out"
            }, "-=.25");
    });

    // timeline
    gsap.to(".timeline-line-fill", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline",
            start: "top 70%",
            end: "bottom 60%",
            scrub: .6,
        }
    });

    gsap.utils.toArray(".timeline-item").forEach((item) => {
        gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 78%" }
        })
            .from(item.querySelectorAll(".timeline-tag, h3, p, .timeline-tags"), {
                opacity: 0, y: 24, duration: .55, stagger: .08, ease: "power3.out"
            })
            .to(item, { duration: .01, onComplete: () => item.classList.add("is-active") }, 0)
            .to(item.querySelector(".timeline-marker"), {
                opacity: 1, scale: 1, duration: .5, ease: "back.out(2)"
            }, 0);
    });

    // tech stack icons — the restrained scroll-in treatment
    gsap.utils.toArray(".stack-grid").forEach((grid) => {
        gsap.to(grid.querySelectorAll(".tech-card"), {
            opacity: 1, y: 0, scale: 1, duration: .55, stagger: .06, ease: "back.out(1.7)",
            scrollTrigger: { trigger: grid, start: "top 85%" }
        });
    });

    // service cards
    gsap.from(".wrap-4 .ser", {
        opacity: 0, y: 30, duration: .6, stagger: .1, ease: "power3.out",
        scrollTrigger: { trigger: ".all-type-work", start: "top 82%" }
    });

    // project filter nav + cards
    gsap.from(".nav2", {
        opacity: 0, y: 20, duration: .5, ease: "power3.out",
        scrollTrigger: { trigger: ".nav2", start: "top 88%" }
    });

    gsap.utils.toArray(".p-img").forEach((card) => {
        gsap.from(card, {
            opacity: 0, y: 30, duration: .6, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" }
        });
    });

    // contact links
    gsap.from(".contact-links a", {
        opacity: 0, y: 24, duration: .5, stagger: .08, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-links", start: "top 85%" }
    });
} else {
    // fallback: no animation library — just make sure content is visible
    document.querySelectorAll(".tech-card").forEach(el => {
        el.style.opacity = 1;
        el.style.transform = "none";
    });
    document.querySelectorAll(".timeline-marker").forEach(el => {
        el.style.opacity = 1;
        el.style.transform = "none";
    });
    document.querySelector(".timeline-line-fill").style.height = "100%";
}

// ---------- filter projects by category ----------

$("#projects button").click(function () {
    const category = $(this).text().trim().toLowerCase();
    $("#projects button").removeClass("active");
    $(this).addClass("active");

    const $items = $(".port-img");
    const $parents = $items.parent();
    let completed = 0;
    const total = $parents.length;

    $parents.stop(true, true).fadeOut(200, function () {
        completed++;
        if (completed === total) {
            if (category === "all projects") {
                $parents.fadeIn(200);
            } else {
                $items.each(function () {
                    const itemCategory = $(this).data("category")?.toLowerCase();
                    if (itemCategory === category) {
                        $(this).parent().fadeIn(200);
                    }
                });
            }
        }
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
});

// ---------- age + footer year ----------

$(document).ready(function () {
    var birthDate = new Date(1998, 5, 8);
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    $('#my-age').text(age);

    document.getElementById('current-year').textContent = new Date().getFullYear();
});
