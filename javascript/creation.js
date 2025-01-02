document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('image');
    const fileName = document.querySelector('.file-name');
    const form = document.querySelector('form');
    const titleInput = document.querySelector('input[name="title"]');
    const descriptionInput = document.querySelector('textarea[name="description"]');
    const locationInput = document.querySelector('input[name="location"]');
    const authorInput = document.querySelector('input[name="petition_by"]');
    const petitionToInput = document.querySelector('input[name="petition_to"]');

    const charLimit = 75;
    const minTitleLength = 30;
    const maxDescriptionWords = 500;
    const maxLocationWords = 30;
    const maxAuthorWords = 30;
    const maxPetitionToWords = 80;

    // Error display elements
    const createErrorElement = (parent) => {
        const errorElement = document.createElement('p');
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '5px';
        parent.appendChild(errorElement);
        return errorElement;
    };

    // Create error elements for each field
    let fileError = document.querySelector('.file-error') || createErrorElement(fileInput.parentNode);
    let titleError = createErrorElement(titleInput.parentNode);
    let descriptionError = createErrorElement(descriptionInput.parentNode);
    let locationError = createErrorElement(locationInput.parentNode);
    let authorError = createErrorElement(authorInput.parentNode);
    let petitionToError = createErrorElement(petitionToInput.parentNode);

    // Character count display for title input
    const charCountDisplay = document.createElement('p');
    charCountDisplay.style.color = '#666';
    charCountDisplay.style.fontSize = '0.9rem';
    charCountDisplay.style.marginTop = '5px';
    charCountDisplay.textContent = `0/${charLimit} characters used.`;
    titleInput.parentNode.appendChild(charCountDisplay);

    // Update file name display on file selection
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
            fileError.textContent = "";
        } else {
            fileName.textContent = 'No file chosen';
        }
    });

    // Update character count on title input
    titleInput.addEventListener('input', () => {
        const currentLength = titleInput.value.length;
        charCountDisplay.textContent = `${currentLength}/${charLimit} characters used.`;
        titleError.textContent = currentLength < minTitleLength ? `Title must be at least ${minTitleLength} characters.` : '';
    });

    const clearForm = () => {
        // Reset all form inputs
        form.reset();

        // Reset file input display
        fileName.textContent = 'No file chosen';

        // Clear all error messages
        fileError.textContent = '';
        titleError.textContent = '';
        descriptionError.textContent = '';
        locationError.textContent = '';
        authorError.textContent = '';
        petitionToError.textContent = '';

        // Reset character count display
        charCountDisplay.textContent = `0/${charLimit} characters used.`;

        // Reset radio buttons and checkboxes
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });

        // Clear any custom styles or classes that might have been added
        form.querySelectorAll('input, textarea').forEach(input => {
            input.style.borderColor = '';
            input.classList.remove('error');
        });

        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    };

    const countWords = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let hasError = false;

        // File validation
        const file = fileInput.files[0];
        if (!file) {
            fileError.textContent = "Please upload an image.";
            hasError = true;
        } else {
            const validTypes = /jpeg|jpg|png|gif/;
            const fileType = file.type.split('/')[1];
            if (!validTypes.test(fileType)) {
                fileError.textContent = "Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.";
                hasError = true;
            }
        }

        // Title validation
        if (titleInput.value.length < minTitleLength) {
            titleError.textContent = `Title must be at least ${minTitleLength} characters.`;
            hasError = true;
        }

        // Description validation
        const descriptionWords = countWords(descriptionInput.value);
        if (descriptionWords > maxDescriptionWords) {
            descriptionError.textContent = `Description cannot exceed ${maxDescriptionWords} words.`;
            hasError = true;
        }

        // Location validation
        const locationWords = countWords(locationInput.value);
        if (locationWords > maxLocationWords) {
            locationError.textContent = `Location cannot exceed ${maxLocationWords} words.`;
            hasError = true;
        }

        // Author validation
        const authorWords = countWords(authorInput.value);
        if (authorWords > maxAuthorWords) {
            authorError.textContent = `Author cannot exceed ${maxAuthorWords} words.`;
            hasError = true;
        }

        // Petition To validation
        const petitionToWords = countWords(petitionToInput.value);
        if (petitionToWords > maxPetitionToWords) {
            petitionToError.textContent = `Petition To cannot exceed ${maxPetitionToWords} words.`;
            hasError = true;
        }

        if (!hasError) {
            try {
                const formData = new FormData(form);
                const response = await fetch('/petition/create', {
                    method: 'POST',
                    body: formData
                });
    
                if (response.ok) {
                    // Handle successful submission
                    window.location.href = '/petition/success';
                } else {
                    const errorData = await response.text();
                    // Redirect to error page
                    window.location.href = '/petition/error';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                window.location.href = '/petition/error';
            }
        }
    });
    
   
    // Clear button functionality
    const clearBtn = document.querySelector('.clear-btn');
    clearBtn.addEventListener('click', clearForm);
});
