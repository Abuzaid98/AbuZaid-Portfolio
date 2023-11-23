"use strict ;"

// toggle icon bar

let menuIcon = document.querySelector("#menu-icon");
let nav = document.querySelector("nav");

menuIcon.addEventListener("click", function () {
    menuIcon.classList.toggle("fa-xmark");
    nav.classList.toggle("slide-nav");
})

// scrollbar line
window.addEventListener('scroll',()=> {
    let scrollBar = document.querySelector('.scrollBar')

    let scroll = document.documentElement.scrollTop;
    let totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (scroll / totalHeight) * 100;
    // console.log(scrolled)
    // console.log(scroll)
    // console.log(totalHeight)
    if(scrolled > 16){
        scrollBar.style.backgroundColor = '#AB1C3D' ;
        scrollBar.style.width = scrolled + "%";
    }else{
        scrollBar.style = `width:${scrolled}%; background-color:#007bff;`
    }
  })

// scroll section active link 

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".nav-link");


navLinks.forEach(function (navItem) {                        //navLink click nav slide
    navItem.addEventListener("click", function (e) {
        e.preventDefault();

        menuIcon.classList.toggle("fa-xmark");
        nav.classList.toggle("slide-nav");
        console.log("click");
    })
})

window.addEventListener("scroll", function () {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 200;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');



        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove("active-nav");
                document.querySelector("header nav a[href*=" + id + "]").classList.add("active-nav");
            })
        }
    })
})

// scroll reveal

ScrollReveal({
    reset: true,
    distance: "80px",
    duration: 2000,
    delay: 10
});
ScrollReveal().reveal(".my-image .pc , .all-about", { origin: "top" });
ScrollReveal().reveal(".all-text , .nav2 , .file-photo", { origin: "bottom" });
ScrollReveal().reveal("h2 ", { origin: "top" });
ScrollReveal().reveal(".contact-area form , .all-port-img , .all-type-work ", { origin: "bottom" });


//nav click scroll

document.querySelectorAll(".nav-link").forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        let top = this.getAttribute("href");
        let targetElement = document.querySelector(top);
        let hehe = targetElement.offsetTop;


        window.scrollTo({
            top: hehe - 80,
            behavior: "smooth"
        });

    });
});

// typed.js   text animate

let typed = new Typed('#element , #element2', {
    strings: [' Web Developer.', 'Frontend Developer.', "React JS Developer.", ' Web Developer.', 'Frontend Developer.', "React JS Developer."],
    typeSpeed: 50,
});

//portfolio click fade only specific project

$("#portfolio .col-4:has(.port-img)").fadeIn();

$("#portfolio button").click(function () {
    $("#portfolio button").removeClass("active")
    $(this).addClass("active")

    if ($(this).text() == "All Projects") {
        $("#portfolio .col-4:has(.port-img)").fadeIn();
    }
    else if ($(this).text() == "HTML, CSS & JS") {
        $("#portfolio .col-4:has(.port-img)").fadeOut();
        $("#portfolio .col-4:has(.html)").fadeIn();
    }
    else if ($(this).text() == "HTML, SASS & JS") {
        $("#portfolio .col-4:has(.port-img)").fadeOut();
        $("#portfolio .col-4:has(.sass)").fadeIn();
    }
    else if ($(this).text() == "Fetch API") {
        $("#portfolio .col-4:has(.port-img)").fadeOut();
        $("#portfolio .col-4:has(.api)").fadeIn();
    }
    else if ($(this).text() == "JavaScript") {
        $("#portfolio .col-4:has(.port-img)").fadeOut();
        $("#portfolio .col-4:has(.js)").fadeIn();
    }
    else if ($(this).text() == "React JS") {
        $("#portfolio .col-4:has(.port-img)").fadeOut();
        $("#portfolio .col-4:has(.react)").fadeIn();
    }


})





