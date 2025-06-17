document.addEventListener('DOMContentLoaded', function() {
    // --- Data for Provinces and Cities ---
    const provincesAndCities = {
        "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "اهر", "میانه", "بناب", "سراب", "آذرشهر", "عجب‌شیر", "شبستر", "جلفا", "هریس", "بستان‌آباد", "ورزقان", "اسکو", "کلیبر", "ملکان", "هادی‌شهر"],
        "آذربایجان غربی": ["ارومیه", "خوی", "مهاباد", "بوکان", "میاندوآب", "سلماس", "پیرانشهر", "نقده", "تکاب", "شاهین‌دژ", "ماکو", "سردشت", "اشنویه", "چایپاره", "شوط"],
        "اردبیل": ["اردبیل", "پارس‌آباد", "مشگین‌شهر", "خلخال", "گرمی", "بیله‌سوار", "نمین", "نیر", "کوثر", "سرعین"],
        "اصفهان": ["اصفهان", "کاشان", "خمینی‌شهر", "نجف‌آباد", "شاهین‌شهر", "شهرضا", "فولادشهر", "مبارکه", "آران و بیدگل", "گلپایگان", "زرین‌شهر", "درچه", "فلاورجان", "لنجان", "نائین"],
        "البرز": ["کرج", "هشتگرد", "نظرآباد", "فردیس", "محمدشهر", "ماهدشت", "کمال‌شهر", "اشتهارد", "طالقان", "چهارباغ"],
        "ایلام": ["ایلام", "دهلران", "ایوان", "آبدانان", "دره‌شهر", "مهران", "سرابله", "چرداول", "بدره"],
        "بوشهر": ["بوشهر", "برازجان", "گناوه", "کنگان", "عسلویه", "خورموج", "دیر", "جم", "دشتی", "دشتستان", "تنگستان"],
        "تهران": ["تهران", "شهریار", "اسلام‌شهر", "قدس", "ملارد", "ورامین", "پاکدشت", "ری", "قرچک", "بومهن", "پردیس", "دماوند", "فیروزکوه", "رباط‌کریم", "گلستان", "نسیم‌شهر"],
        "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "فرخ‌شهر", "فارسان", "لردگان", "هفشجان", "جونقان", "سامان", "کیان"],
        "خراسان جنوبی": ["بیرجند", "قائن", "فردوس", "نهبندان", "طبس", "سربیشه", "بشرویه", "سرایان"],
        "خراسان رضوی": ["مشهد", "سبزوار", "نیشابور", "تربت حیدریه", "کاشمر", "قوچان", "تربت جام", "تایباد", "چناران", "فریمان", "گناباد", "سرخس", "بردسکن"],
        "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین", "جاجرم", "آشخانه", "فاروج", "گرمه"],
        "خوزستان": ["اهواز", "دزفول", "آبادان", "بندر ماهشهر", "اندیمشک", "خرمشهر", "ایذه", "شوشتر", "مسجد سلیمان", "بهبهان", "رامهرمز", "شوش", "شادگان", "باغ‌ملک"],
        "زنجان": ["زنجان", "ابهر", "خرمدره", "قیدار", "هیدج", "صائین‌قلعه", "سلطانیه"],
        "سمنان": ["سمنان", "شاهرود", "دامغان", "گرمسار", "مهدی‌شهر", "ایوانکی", "سرخه"],
        "سیستان و بلوچستان": ["زاهدان", "زابل", "ایرانشهر", "چابهار", "سراوان", "خاش", "کنارک", "نیک‌شهر", "میرجاوه", "راسک"],
        "فارس": ["شیراز", "کازرون", "جهرم", "مرودشت", "فسا", "لار", "داراب", "نورآباد ممسنی", "آباده", "اقلید", "استهبان", "نی‌ریز", "سپیدان"],
        "قزوین": ["قزوین", "تاکستان", "الوند", "آبیک", "محمدیه", "اقبالیه", "بوئین‌زهرا"],
        "قم": ["قم", "جعفریه", "کهک", "قنوات", "سلفچگان", "دستجرد"],
        "کردستان": ["سنندج", "سقز", "مریوان", "بانه", "کامیاران", "قروه", "دیواندره", "بیجار", "دهگلان"],
        "کرمان": ["کرمان", "سیرجان", "رفسنجان", "جیرفت", "بم", "زرند", "شهربابک", "بافت", "انار"],
        "کرمانشاه": ["کرمانشاه", "اسلام‌آباد غرب", "هرسین", "کنگاور", "جوانرود", "سنقر", "پاوه", "گیلانغرب", "صحنه"],
        "کهگیلویه و بویراحمد": ["یاسوج", "دوگنبدان", "دهدشت", "لیکک", "سی‌سخت", "چرام", "باشت"],
        "گلستان": ["گرگان", "گنبد کاووس", "علی‌آباد کتول", "بندر ترکمن", "آق‌قلا", "کردکوی", "بندر گز", "مینودشت", "کلاله", "رامیان", "آزادشهر", "مراوه‌تپه", "گمیشان"],
        "گیلان": ["رشت", "بندرانزلی", "لاهیجان", "لنگرود", "آستارا", "فومن", "صومعه‌سرا", "رودسر", "ماسال", "رضوانشهر", "آستانه اشرفیه", "سیاهکل", "شفت"],
        "لرستان": ["خرم‌آباد", "بروجرد", "دورود", "الیگودرز", "کوهدشت", "نورآباد", "ازنا", "پلدختر", "الشتر"],
        "مازندران": ["ساری", "بابل", "آمل", "قائم‌شهر", "بهشهر", "چالوس", "نوشهر", "بابلسر", "محمودآباد", "نکا", "رامسر", "جویبار", "فریدونکنار", "تنکابن"],
        "مرکزی": ["اراک", "ساوه", "خمین", "محلات", "دلیجان", "تفرش", "آشتیان", "شازند", "خنداب"],
        "هرمزگان": ["بندرعباس", "میناب", "دهبارز", "بندر لنگه", "قشم", "کیش", "حاجی‌آباد", "بستک", "بندر جاسک"],
        "همدان": ["همدان", "ملایر", "نهاوند", "اسدآباد", "تویسرکان", "بهار", "کبودرآهنگ", "رزن", "فامنین"],
        "یزد": ["یزد", "میبد", "اردکان", "بافق", "تفت", "مهریز", "ابرکوه", "خاتم", "اشکذر"]
    };

    // --- Get All DOM Elements ---
    const form = document.getElementById('serviceRequestForm');
    if (!form) {
        console.error("Fatal Error: Form element not found!");
        return; // Stop script if the main form is missing
    }
    const submitBtn = document.getElementById('submit-btn');
    const successMessageDiv = document.getElementById('success-message');
    const clientTypeRadios = document.querySelectorAll('input[name="نوع متقاضی"]');
    const lawyerFieldsDiv = document.getElementById('lawyer-fields');
    const individualNameFieldDiv = document.getElementById('individual-name-field');
    const fullNameInput = document.getElementById('fullName');
    const lawyerNameInput = document.getElementById('lawyerName');
    const licenseNumberInput = document.getElementById('licenseNumber');
    const ndaClientNameSpan = document.getElementById('nda-client-name');
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const termsAgreeCheckbox = document.getElementById('terms-agree');
    const ndaAgreeCheckbox = document.getElementById('nda-agree');

    // --- AJAX Form Submission Logic ---
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const originalButtonHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="btn-text">در حال ارسال...</span><div class="spinner"></div>`;

        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (key === 'خدمت') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        if (data['خدمت'] && Array.isArray(data['خدمت'])) {
            data['خدمت'] = data['خدمت'].join('، ');
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                form.reset(); 
                form.style.display = 'none';
                if(successMessageDiv) successMessageDiv.style.display = 'block';
            } else {
                throw new Error('پاسخ سرور موفقیت‌آمیز نبود.');
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('متاسفانه در ارسال درخواست خطایی رخ داد. لطفاً دوباره تلاش کنید.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonHTML;
        }
    });

    // --- Helper Function: Dynamic Name Insertion in NDA ---
    function updateNdaName() {
        if (!ndaClientNameSpan) return;
        const isLawyer = document.querySelector('input[name="نوع متقاضی"]:checked').value === 'lawyer';
        const nameSourceInput = isLawyer ? lawyerNameInput : fullNameInput;
        
        if (nameSourceInput) {
            const name = nameSourceInput.value.trim();
            ndaClientNameSpan.textContent = name ? name : "شما";
        }
    }

    // --- Helper Function: Conditional Fields Logic ---
    function toggleLawyerFields() {
        const isLawyer = document.querySelector('input[name="نوع متقاضی"]:checked').value === 'lawyer';
        
        if (lawyerFieldsDiv) lawyerFieldsDiv.classList.toggle('visible', isLawyer);
        if (individualNameFieldDiv) individualNameFieldDiv.classList.toggle('visible', !isLawyer);

        if (lawyerNameInput) lawyerNameInput.required = isLawyer;
        if (licenseNumberInput) licenseNumberInput.required = isLawyer;
        if (fullNameInput) fullNameInput.required = !isLawyer;

        updateNdaName();
    }

    // --- Helper Function: Province and City Dropdowns ---
    function populateProvinces() {
        if (!provinceSelect) return;
        provinceSelect.innerHTML = '<option value="">-- انتخاب استان --</option>';
        Object.keys(provincesAndCities).forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
    }

    function updateCities() {
        if (!provinceSelect || !citySelect) return;
        const selectedProvince = provinceSelect.value;
        citySelect.innerHTML = '<option value="">-- انتخاب شهر --</option>';
        citySelect.disabled = true;
        if (selectedProvince && provincesAndCities[selectedProvince]) {
            citySelect.disabled = false;
            provincesAndCities[selectedProvince].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }
    
    // --- Helper Function: Enable/Disable Submit Button ---
    function checkFormValidity() {
        if (!submitBtn || !termsAgreeCheckbox || !ndaAgreeCheckbox) return;
        submitBtn.disabled = !(termsAgreeCheckbox.checked && ndaAgreeCheckbox.checked);
    }
    
    // --- Attach All Event Listeners ---
    if(fullNameInput) fullNameInput.addEventListener('input', updateNdaName);
    if(lawyerNameInput) lawyerNameInput.addEventListener('input', updateNdaName);
    if(clientTypeRadios.length) clientTypeRadios.forEach(radio => radio.addEventListener('change', toggleLawyerFields));
    if(provinceSelect) provinceSelect.addEventListener('change', updateCities);
    if(termsAgreeCheckbox) termsAgreeCheckbox.addEventListener('change', checkFormValidity);
    if(ndaAgreeCheckbox) ndaAgreeCheckbox.addEventListener('change', checkFormValidity);
    
    // --- Initial Page Setup ---
    populateProvinces();
    toggleLawyerFields(); // Set the initial state of the form on page load
});