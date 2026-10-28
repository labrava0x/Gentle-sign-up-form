// ==========================================================================
// Gentle Productions x La Brava - Interactive & Defensive Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Live Input Sanitization (Instant cleanup as you type)
    // ----------------------------------------------------------------------
    const firstNameInput = document.getElementById('first_name');
    const lastNameInput = document.getElementById('last_name');
    const phoneInput = document.getElementById('phone');

    // Instantly remove non-letters from name fields
    [firstNameInput, lastNameInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^A-Za-z\s]/g, '');
            });
        }
    });

    // Instantly remove letters/invalid chars from phone field
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/[^0-9\+\-\s\(\)]/g, '');
        });
    }

    // ----------------------------------------------------------------------
    // 2. Password Matching Validation
    // ----------------------------------------------------------------------
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const confirmGroup = confirmPasswordInput?.closest('.input-group');
    const errorMessage = confirmGroup?.querySelector('.error-message');

    function validatePassword() {
        if (!confirmPasswordInput || !passwordInput) return;

        if (confirmPasswordInput.value === '') {
            confirmPasswordInput.setCustomValidity('');
            if (errorMessage) errorMessage.textContent = '';
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            if (errorMessage) errorMessage.textContent = 'Passwords must match';
        } else {
            confirmPasswordInput.setCustomValidity('');
            if (errorMessage) errorMessage.textContent = '';
        }
    }

    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', validatePassword);
        confirmPasswordInput.addEventListener('input', validatePassword);
    }

    // ----------------------------------------------------------------------
    // 3. Client-Side Cooldown / Rate-Limiting & Anti-Spam Logic
    // ----------------------------------------------------------------------
    const form = document.getElementById('signup-form');
    const submitBtn = document.querySelector('.submit-btn');
    let isCoolingDown = false;

    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // ----------------------------------------------------------
            // A. Honeypot Anti-Spam Check
            // ----------------------------------------------------------
            const honeypot = document.getElementById('website_hp');
            if (honeypot && honeypot.value !== '') {
                // Silently block bots while pretending it succeeded
                console.warn('Spam bot detected via honeypot field.');
                form.reset();
                return;
            }

            // ----------------------------------------------------------
            // B. Cloudflare Turnstile Verification Check
            // ----------------------------------------------------------
            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
            if (turnstileResponse && !turnstileResponse.value) {
                alert('Please complete the security check to continue.');
                return;
            }

            // Ensure native HTML5 validation passes first
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (isCoolingDown) return;

            // Visual submission feedback
            submitBtn.textContent = 'ACCESS GRANTED ❤️';
            submitBtn.style.background = '#22c55e'; // Success green

            // Activate defensive cooldown
            isCoolingDown = true;
            setTimeout(() => {
                submitBtn.disabled = true;
                let seconds = 10;
                
                const countdown = setInterval(() => {
                    submitBtn.textContent = `COOLDOWN: ${seconds}s`;
                    seconds--;

                    if (seconds < 0) {
                        clearInterval(countdown);
                        submitBtn.disabled = false;
                        submitBtn.style.background = ''; // Reset gradient
                        submitBtn.textContent = 'Create Account';
                        isCoolingDown = false;

                        // Reset Turnstile widget for subsequent submissions
                        if (typeof turnstile !== 'undefined') {
                            turnstile.reset();
                        }
                    }
                }, 1000);
            }, 1000);
        });
    }
});