// State management
let currentPetitionId = null;

// Scroll Container Function
export function scrollContainer(direction, type) {
    const container = document.getElementById(`${type}-petitions-container`);
    const scrollAmount = 320; // Width of card + gap
    
    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Update button states after scroll
    setTimeout(() => {
        updateScrollButtons(type);
    }, 500);
}

// Update Scroll Buttons Function
function updateScrollButtons(type) {
    const container = document.getElementById(`${type}-petitions-container`);
    const section = container.closest('.scroll-container');
    const leftButton = section.querySelector('.scroll-button.left');
    const rightButton = section.querySelector('.scroll-button.right');
    
    // Update left button
    if (container.scrollLeft <= 0) {
        leftButton.style.display = 'none';
    } else {
        leftButton.style.display = 'flex';
    }
    
    // Update right button
    if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
        rightButton.style.display = 'none';
    } else {
        rightButton.style.display = 'flex';
    }
}

// Delete Modal Functions
function openDeleteModal(petitionId, title) {
    currentPetitionId = petitionId;
    document.getElementById('petitionTitle').textContent = title;
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

async function confirmDelete() {
    try {
        const response = await fetch(`/petition/${currentPetitionId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeDeleteModal();
            // Refresh the page to update the view
            window.location.reload();
        } else {
            alert('Failed to delete petition. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the petition.');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll buttons
    updateScrollButtons('created');
    updateScrollButtons('signed');
    
    // Add scroll event listeners
    ['created', 'signed'].forEach(type => {
        const container = document.getElementById(`${type}-petitions-container`);
        container.addEventListener('scroll', () => updateScrollButtons(type));
    });
    
    // Add click handlers for scroll buttons
    document.querySelectorAll('.scroll-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const direction = button.classList.contains('left') ? 'left' : 'right';
            const type = button.closest('section').classList.contains('created-petitions') ? 'created' : 'signed';
            scrollContainer(direction, type);
        });
    });
    
    // Add click handlers for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const petitionId = button.dataset.petitionId;
            const petitionTitle = button.dataset.petitionTitle;
            openDeleteModal(petitionId, petitionTitle);
        });
    });
    
    // Add click handler for modal close
    document.getElementById('deleteModal').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            closeDeleteModal();
        }
    });
    
    // Add click handlers for modal buttons
    document.querySelector('.cancel-btn').addEventListener('click', closeDeleteModal);
    document.querySelector('.confirm-delete-btn').addEventListener('click', confirmDelete);
});