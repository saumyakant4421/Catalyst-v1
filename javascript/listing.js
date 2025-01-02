// Handle custom dropdown functionality
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const items = dropdown.querySelectorAll('.dropdown-options li');

    // Toggle dropdown visibility
    selected.addEventListener('click', () => {
        const isExpanded = selected.getAttribute('aria-expanded') === 'true';
        options.style.display = isExpanded ? 'none' : 'block';
        selected.setAttribute('aria-expanded', String(!isExpanded));
    });

    // Handle option selection
    items.forEach(item => {
        item.addEventListener('click', () => {
            selected.textContent = item.textContent; // Update selected text
            selected.setAttribute('data-value', item.getAttribute('data-value')); // Store value
            options.style.display = 'none'; // Close dropdown
            selected.setAttribute('aria-expanded', 'false'); // Close state

            const value = item.getAttribute('data-value');
            if (dropdown.id === 'category-dropdown') {
                filterCategory(value);
            } else if (dropdown.id === 'sort-dropdown') {
                sortPetitions(value);
            }
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', e => {
        document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
            const options = dropdown.querySelector('.dropdown-options');
            const selected = dropdown.querySelector('.dropdown-selected');
            if (!dropdown.contains(e.target)) {
                options.style.display = 'none';
                selected.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Filtering logic
function filterCategory(category) {
    if (!category) {
        console.error("Invalid category selected.");
        updatePetitionGrid([]); // Clear grid
        return;
    }

    // Update the heading dynamically
    const heading = document.querySelector('.filter-container h1');
    heading.textContent = `Petitions in ${category}`;

    const petitionsGrid = document.querySelector('.petition-grid');
    petitionsGrid.innerHTML = '<p>Loading petitions...</p>'; // Show loading message

    fetch(`/listing/${encodeURIComponent(category)}`, { // Use correct route
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch petitions: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            // console.log("Filtered Data:", data);
            updatePetitionGrid(data.petitions);
        })
        .catch(error => {
            console.error("Error filtering category:", error);
            petitionsGrid.innerHTML = '<p>Failed to load petitions. Please try again later.</p>';
        });
}

// Sorting logic
function sortPetitions(order) {
    const currentCategory = document.querySelector('#category-dropdown .dropdown-selected').getAttribute('data-value') || '';

    if (!currentCategory || currentCategory === 'Filter by Category') {
        console.error("No category selected. Sorting cannot proceed.");
        alert("Please select a category before sorting.");
        return;
    }

    fetch(`/listing/${encodeURIComponent(currentCategory)}?sort=${encodeURIComponent(order)}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch sorted petitions: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            // console.log("Sorted Data:", data);
            updatePetitionGrid(data.petitions);
        })
        .catch(error => {
            console.error("Error sorting petitions:", error);
            const petitionsGrid = document.querySelector('.petition-grid');
            petitionsGrid.innerHTML = '<p>Failed to load sorted petitions. Please try again later.</p>';
        });
}

function updatePetitionGrid(petitions = []) {
    const petitionsGrid = document.querySelector('.petition-grid');
    petitionsGrid.innerHTML = ''; // Clear existing petitions

    if (petitions.length === 0) {
        petitionsGrid.innerHTML = '<p>No petitions found for this category and sort order.</p>';
        return;
    }

    petitions.forEach(petition => {
        const petitionCard = `
            <div class="petition-card">
                ${petition.verified === 'Y' ? `<span class="verified-icon"><img src="/verified4.png"></span>` : ''}
                <img class="petition-image" src="${petition.image || '/assets/default-image.jpg'}" alt="Petition Image" loading="lazy" onerror="this.src='/categorysection.png';">
                <h3 class="petition-title">${petition.title || 'Untitled'}</h3>
                <p class="petition-supporters">Supporters: ${petition.supporters?.length || 0}</p>
                <p class="petition-author">Author: ${petition.authors?.[0] || 'Unknown'}</p>
                <a href="/petition/${petition._id}" class="sign-btn">Sign Now</a>
            </div>
        `;
        petitionsGrid.insertAdjacentHTML('beforeend', petitionCard);
    });
}
