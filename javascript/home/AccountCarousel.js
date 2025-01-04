const carousel = document.querySelector(".account-carousel");
const slides = document.querySelectorAll(".account-slide");
const next = document.querySelectorAll(".form-switch-button");
const accountForm = document.getElementById("accountForm");

// Initialize currentSlide to 1 to show login section by default
let currentSlide = 1;

export default function AccountCarousel() {
    // Apply initial slide positions on page load
    initializeCarousel();
    initializePasswordToggles();

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

function initializePasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'password-input-wrapper';
        
        // Move input into wrapper
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'password-toggle-btn';
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-show" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-hide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
        
        wrapper.appendChild(toggleButton);
        
        // Add click handler
        toggleButton.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggleButton.classList.toggle('showing-password');
        });
    });
}