// File: script.js (The main javascript file for your form)

document.addEventListener('DOMContentLoaded', function() {
    // --- Data for Provinces and Cities ---
    const provincesAndCities = {
        "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "اهر", "میانه", "بناب", "سراب", "آذرشهر", "عجب‌شیر", "شبستر", "جلفا", "هریس"],
        "آذربایجان غربی": ["ارومیه", "خوی", "مهاباد", "بوکان", "میاندوآب", "سلماس", "پیرانشهر", "نقده", "تکاب", "شاهین‌دژ", "ماکو"],
        // ... (The rest of the comprehensive city list) ...
        "یزد": ["یزد", "میبد", "اردکان", "بافق", "تفت", "مهریز", "ابرکوه", "خاتم"]
    };

    // --- Get DOM Elements ---
    const form = document.getElementById('serviceRequestForm');
    const submitBtn = document.getElementById('submit-btn');
    const clientTypeRadios = document.querySelectorAll('input[name="نوع متقاضی"]');
    const lawyerFieldsDiv = document.getElementById('lawyer-fields');
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const termsAgreeCheckbox = document.getElementById('terms-agree');
    const ndaAgreeCheckbox = document.getElementById('nda-agree');
    const fullNameInput = document.getElementById('fullName');
    const ndaClientNameSpan = document.getElementById('nda-client-name');

    // --- NEW: Handle Form Submission with JavaScript ---
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop the default form submission

        const originalButtonText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="btn-text">در حال ارسال...</span><div class="spinner"></div>`;

        // Create a data object from the form
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        try {
            // The URL of your serverless function
            // For Vercel, it's /api/send-telegram
            // For Netlify, it's /.netlify/functions/send-telegram
            const response = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            // Success!
            form.reset(); // Clear the form
            alert('درخواست شما با موفقیت ارسال شد! پاسخ در تلگرام برای شما ارسال گردید.');

        } catch (error) {
            console.error('Submission failed:', error);
            alert('متاسفانه در ارسال درخواست خطایی رخ داد. لطفاً دوباره تلاش کنید.');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonText;
            checkFormValidity(); // Re-check validity to disable it correctly
        }
    });


    // --- All other functions (unchanged from the previous correct version) ---
    function updateNdaName() { /* ... */ }
    function toggleLawyerFields() { /* ... */ }
    function populateProvinces() { /* ... */ }
    function updateCities() { /* ... */ }
    function checkFormValidity() { /* ... */ }

    // --- Event Listeners (unchanged) ---
    if(fullNameInput) fullNameInput.addEventListener('input', updateNdaName);
    // ... all other event listeners ...
    
    // --- Initial Setup (unchanged) ---
    populateProvinces();
});