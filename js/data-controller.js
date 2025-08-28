// ملف التحكم الرئيسي لعرض البيانات
class DataController {
    constructor() {
        this.data = null;
        this.isArabic = document.documentElement.lang === 'ar' || document.dir === 'rtl';
        this.init();
    }

    async init() {
        try {
            console.log('🚀 بدء تحميل البيانات...');
            await this.loadData();
            await this.updateAllContent();
            console.log('✅ تم تحديث جميع البيانات بنجاح!');
        } catch (error) {
            console.error('❌ خطأ في التحكم بالبيانات:', error);
        }
    }

    async loadData() {
        try {
            const response = await fetch('./data/lawyer-data.json');
            if (!response.ok) {
                throw new Error(`خطأ HTTP: ${response.status}`);
            }
            this.data = await response.json();
            console.log('📋 البيانات المحملة:', this.data);
        } catch (error) {
            console.error('❌ فشل في تحميل البيانات:', error);
            throw error;
        }
    }

    getText(key) {
        if (!this.data) return '';
        const parts = key.split('.');
        let value = this.data;
        
        for (const part of parts) {
            value = value?.[part];
        }
        
        if (typeof value === 'object' && value !== null) {
            return this.isArabic ? value.ar || value.ar || '' : value.en || value.en || '';
        }
        
        return value || '';
    }

    updateElement(selector, content, isHTML = false) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (isHTML) {
                el.innerHTML = content;
            } else {
                el.textContent = content;
            }
        });
    }

    updateAttribute(selector, attribute, value) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.setAttribute(attribute, value);
        });
    }

    async updateAllContent() {
        if (!this.data) {
            console.warn('⚠️ لا توجد بيانات للتحديث');
            return;
        }

        // تحديث عنوان الصفحة
        this.updatePageTitle();
        
        // تحديث المحتوى الأساسي
        this.updateBasicInfo();
        
        // تحديث معلومات التواصل
        this.updateContactInfo();
        
        // تحديث الشبكات الاجتماعية
        this.updateSocialMedia();
        
        // تحديث الخدمات
        this.updateServices();
        
        // تحديث شهادات العملاء
        this.updateTestimonials();
        
        // تحديث الإحصائيات
        this.updateStats();
    }

    updatePageTitle() {
        const name = this.isArabic ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
        const title = this.isArabic ? this.data.personal_info.title_ar : this.data.personal_info.title_en;
        document.title = `${name} | ${title}`;
    }

    updateBasicInfo() {
        const name = this.isArabic ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
        const title = this.isArabic ? this.data.personal_info.title_ar : this.data.personal_info.title_en;
        const description = this.isArabic ? this.data.personal_info.description_ar : this.data.personal_info.description_en;

        // تحديث الاسم في الشعار والعلامة التجارية
        this.updateElement('.brand-text, .footer-brand h3', name);
        
        // تحديث العنوان الرئيسي
        this.updateElement('h1.hero-title', `${name}\n${title}`, true);
        this.updateElement('.about-title', name);
        
        // تحديث الوصف
        this.updateElement('.hero-subtitle, .about-description', description);
        this.updateElement('.footer-brand p', title);
    }

    updateContactInfo() {
        // البريد الإلكتروني
        this.updateElement('[href*="mailto"], .contact-email', this.data.contact_info.email);
        this.updateAttribute('a[href*="mailto"]', 'href', `mailto:${this.data.contact_info.email}`);
        
        // الهاتف
        this.updateElement('.contact-phone', this.data.contact_info.phone_eg);
        
        // العنوان
        const address = this.isArabic ? this.data.contact_info.address_ar : this.data.contact_info.address_en;
        this.updateElement('.contact-address', address.replace(/،/g, '\n'), true);
        
        // ساعات العمل
        const workingHours = this.isArabic ? this.data.contact_info.working_hours_ar : this.data.contact_info.working_hours_en;
        this.updateElement('.working-hours', workingHours.replace(/،/g, '\n'), true);
    }

    updateSocialMedia() {
        // WhatsApp
        this.updateAttribute('a[href*="wa.me"], .whatsapp-btn', 'href', this.data.social_media.whatsapp);
        
        // Telegram
        this.updateAttribute('a[href*="telegram"], a[href*="t.me"]', 'href', this.data.social_media.telegram);
        
        // LinkedIn
        this.updateAttribute('a[href*="linkedin"]', 'href', this.data.social_media.linkedin);
        
        // Facebook
        this.updateAttribute('a[href*="facebook"]', 'href', this.data.social_media.facebook);
    }

    updateServices() {
        const servicesContainer = document.querySelector('.services-grid');
        if (!servicesContainer) return;

        const services = this.isArabic ? this.data.services.ar : this.data.services.en;
        
        servicesContainer.innerHTML = services.map(service => `
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                <div class="service-action">
                    <a href="#contact" class="btn btn-outline">${this.isArabic ? 'تواصل معنا' : 'Contact Us'}</a>
                </div>
            </div>
        `).join('');
    }

    updateTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            if (index >= this.data.testimonials.length) return;
            
            const testimonial = this.data.testimonials[index];
            const content = card.querySelector('.testimonial-content p');
            const authorName = card.querySelector('.author-info h4');
            const caseType = card.querySelector('.author-info span');
            
            if (content) {
                content.textContent = this.isArabic ? testimonial.text_ar : testimonial.text_en;
            }
            
            if (authorName) {
                authorName.textContent = this.isArabic ? testimonial.author_ar : testimonial.author_en;
            }
            
            if (caseType) {
                caseType.textContent = this.isArabic ? testimonial.case_type_ar : testimonial.case_type_en;
            }
        });
    }

    updateStats() {
        const stats = document.querySelectorAll('.stat');
        if (stats.length >= 3) {
            // عدد القضايا
            const casesNumber = stats[0]?.querySelector('.stat-number');
            const casesText = stats[0]?.querySelector('.stat-text');
            if (casesNumber) casesNumber.textContent = this.data.personal_info.cases_completed;
            if (casesText) {
                casesText.textContent = this.isArabic ? 'قضية مُنجزة بنجاح' : 'Successfully Completed Cases';
            }

            // نسبة الرضا
            const satisfactionNumber = stats[1]?.querySelector('.stat-number');
            const satisfactionText = stats[1]?.querySelector('.stat-text');
            if (satisfactionNumber) satisfactionNumber.textContent = this.data.personal_info.satisfaction_rate;
            if (satisfactionText) {
                satisfactionText.textContent = this.isArabic ? 'نسبة رضا العملاء' : 'Client Satisfaction Rate';
            }

            // سنوات الخبرة
            const experienceNumber = stats[2]?.querySelector('.stat-number');
            const experienceText = stats[2]?.querySelector('.stat-text');
            if (experienceNumber) experienceNumber.textContent = this.data.personal_info.experience_years;
            if (experienceText) {
                experienceText.textContent = this.isArabic ? 'سنة خبرة قانونية' : 'Years of Experience';
            }
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    window.dataController = new DataController();
});

// تصدير للاستخدام العام
window.DataController = DataController;
