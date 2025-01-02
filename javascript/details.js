class PetitionDetails {
    constructor() {
        this.petitionDetails = document.querySelector('.petition-details');
        this.totalSupporters = Number(this.petitionDetails?.getAttribute('data-supporters') || 0);
        this.targetSupporters = Number(this.petitionDetails?.getAttribute('data-target-supporters') || 0);
        this.alreadySigned = this.petitionDetails?.getAttribute('data-already-signed') === 'true';
        this.signButton = document.getElementById('sign-petition-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.shareModal = document.getElementById('share-modal');
        this.shareLinkInput = document.getElementById('share-link');
        this.copyLinkBtn = document.getElementById('copy-link-btn');
        this.closeModalBtns = document.querySelectorAll('.close-modal-btn');
        this.thankYouModal = document.getElementById('thank-you-modal');
        this.modalMessage = document.getElementById('modal-message');
        this.termsModal = document.getElementById('terms-modal');
        this.agreeCheckbox = document.getElementById('agree-checkbox');
        this.signConfirmBtn = document.getElementById('sign-confirm-btn');
        this.statusBadge = document.querySelector('.status-badge');
        this.supportSection = document.querySelector('.support-petition');

        this.initialize();
    }

    initialize() {
        this.updateProgressBar();
        this.setupEventListeners();
        this.checkPetitionStatus();
    }

    checkPetitionStatus() {
        if (!this.statusBadge || !this.signButton) return;

        const currentStatus = this.statusBadge.classList.contains('closed') ? 'closed' :
                            this.statusBadge.classList.contains('success') ? 'success' : 'active';

        // Only hide sign button if petition is closed
        if (currentStatus === 'closed' && this.supportSection) {
            this.supportSection.style.display = 'none';
        }
    }

    updateProgressBar() {
        const progress = Math.min((this.totalSupporters / this.targetSupporters) * 100, 100);
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }
    }

    setupEventListeners() {
        // Support button event listener
        this.signButton?.addEventListener('click', () => this.handleSignButtonClick());

        // Share functionality event listeners
        this.shareBtn?.addEventListener('click', () => this.handleShare());
        this.copyLinkBtn?.addEventListener('click', () => this.handleCopyLink());

        // Close buttons for all modals
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Terms and conditions checkbox
        this.agreeCheckbox?.addEventListener('change', () => {
            this.signConfirmBtn.disabled = !this.agreeCheckbox.checked;
        });

        // Confirm sign button in terms modal
        this.signConfirmBtn?.addEventListener('click', () => this.handlePetitionSign());

        // Modal outside click handlers
        [this.shareModal, this.termsModal, this.thankYouModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    handleSignButtonClick() {
        if (this.alreadySigned) {
            this.showThankYouModal("You have already signed this petition. Kindly check other petitions on the platform.");
        } else {
            this.showTermsModal();
        }
    }

    showTermsModal() {
        if (this.signButton.disabled) return;
        this.termsModal.classList.remove('hidden');
    }

    async handlePetitionSign() {
        if (this.signConfirmBtn.disabled) return;

        try {
            this.setSignButtonState(true, "Processing...");
            const petitionId = window.location.pathname.split('/').pop();
            const response = await fetch(`/petition/${petitionId}/sign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (response.ok) {
                this.alreadySigned = true;
                this.closeAllModals();
                this.showThankYouModal("Thank you for signing the petition!");
                
                // Update status if needed
                if (data.status === "success") {
                    this.updatePetitionStatus("success");
                }
                
                // Update supporter count
                this.totalSupporters++;
                this.updateProgressBar();
            } else if (response.status === 400) {
                this.closeAllModals();
                this.showThankYouModal(data.message);
            } else {
                console.error("Error signing petition:", data.message);
            }
        } catch (error) {
            console.error("Error signing petition:", error);
        } finally {
            this.setSignButtonState(false, "Support this Petition");
        }
    }

    setSignButtonState(disabled, text) {
        if (this.signButton) {
            this.signButton.disabled = disabled;
            this.signButton.textContent = text;
        }
    }

    showThankYouModal(message) {
        if (!this.thankYouModal) return;
        this.modalMessage.textContent = message;
        this.thankYouModal.classList.remove('hidden');
    }

    handleShare() {
        const currentUrl = window.location.href;
        this.shareLinkInput.value = currentUrl;
        this.shareModal.classList.remove('hidden');
    }

    async handleCopyLink() {
        try {
            await navigator.clipboard.writeText(this.shareLinkInput.value);
            this.updateCopyButton('<ion-icon name="checkmark-outline"></ion-icon> Copied!');
            setTimeout(() => {
                this.updateCopyButton('<ion-icon name="copy-outline"></ion-icon> Copy');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    updateCopyButton(innerHTML) {
        if (this.copyLinkBtn) {
            this.copyLinkBtn.innerHTML = innerHTML;
        }
    }

    closeAllModals() {
        [this.shareModal, this.termsModal, this.thankYouModal].forEach(modal => {
            modal?.classList.add('hidden');
        });
        // Reset checkbox and confirm button state
        if (this.agreeCheckbox) {
            this.agreeCheckbox.checked = false;
        }
        if (this.signConfirmBtn) {
            this.signConfirmBtn.disabled = true;
        }
    }

    updatePetitionStatus(status) {
        if (this.statusBadge) {
            // Remove existing status classes
            this.statusBadge.classList.remove('active', 'success', 'closed');
            
            // Add new status class
            this.statusBadge.classList.add(status);
            
            // Update icon and text
            const icon = status === 'success' ? 'checkmark-circle-outline' :
                        status === 'closed' ? 'ban' : 'radio-button-on';
            
            const text = status.charAt(0).toUpperCase() + status.slice(1);
            
            this.statusBadge.innerHTML = `
                <ion-icon name="${icon}"></ion-icon>
                ${text}
            `;

            // Hide support section only if status is closed
            if (status === 'closed' && this.supportSection) {
                this.supportSection.style.display = 'none';
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PetitionDetails();
});