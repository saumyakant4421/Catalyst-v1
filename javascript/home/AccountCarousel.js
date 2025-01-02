const carousel = document.querySelector(".account-carousel");
const slides = document.querySelectorAll(".account-slide");
const next = document.querySelectorAll(".form-switch-button");
const accountForm = document.getElementById("accountForm");

// Initialize currentSlide to 1 to show login section by default
let currentSlide = 1;

export default function AccountCarousel() {
    // Apply initial slide positions on page load
    initializeCarousel();

    next.forEach((next) => {
        next.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSlides();
        });
    });

    accountForm.addEventListener("submit", handleFormSubmission);
}

function initializeCarousel() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add("register-reveal");
            slide.classList.remove("register-hide");
        } else {
            slide.classList.add("register-hide");
            slide.classList.remove("register-reveal");
        }
    });
}

function toggleSlides() {
    currentSlide = currentSlide === 0 ? 1 : 0;
    
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.remove("register-hide");
            slide.classList.add("register-reveal");
        } else {
            slide.classList.remove("register-reveal");
            slide.classList.add("register-hide");
        }
    });
}