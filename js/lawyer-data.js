// قراءة وعرض بيانات المحامي من ملف JSON
class LawyerDataManager {
    constructor() {
        this.data = null;
        this.language = document.documentElement.lang || 'ar';
    }

    // تحميل البيانات من ملف JSON
    async loadData() {
        try {
            const response = await fetch('data/lawyer-data.json');
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات المحامي:', error);
            return null;
        }
    }

    // تحديث عنوان الصفحة
    updatePageTitle() {
        if (!this.data) return;
        
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
            const title = this.language === 'ar' ? this.data.personal_info.title_ar : this.data.personal_info.title_en;
            titleElement.textContent = `${name} | ${title}`;
        }

        // تحديث meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const description = this.language === 'ar' ? this.data.personal_info.description_ar : this.data.personal_info.description_en;
            metaDesc.setAttribute('content', description);
        }
    }

    // تحديث اسم العلامة التجارية
    updateBrandName() {
        if (!this.data) return;
        
        const brandElements = document.querySelectorAll('.brand-text');
        const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
        
        brandElements.forEach(element => {
            element.textContent = name;
        });
    }

    // تحديث قسم Hero
    updateHeroSection() {
        if (!this.data) return;
        
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (heroTitle) {
            const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
            const title = this.language === 'ar' ? this.data.personal_info.title_ar : this.data.personal_info.title_en;
            heroTitle.innerHTML = `${name}<br>${title}`;
        }

        if (heroSubtitle) {
            const subtitle = this.language === 'ar' ? this.data.personal_info.hero_subtitle_ar : this.data.personal_info.hero_subtitle_en;
            heroSubtitle.textContent = subtitle;
        }

        // تحديث الإحصائيات
        this.updateStats();
        
        // تحديث شارات الثقة
        this.updateTrustBadges();
    }

    // تحديث الإحصائيات
    updateStats() {
        if (!this.data) return;
        
        const stats = document.querySelectorAll('.stat');
        if (stats.length >= 3) {
            // عدد القضايا
            const casesNumber = stats[0]?.querySelector('.stat-number');
            const casesText = stats[0]?.querySelector('.stat-text');
            if (casesNumber) casesNumber.textContent = this.data.personal_info.cases_completed;
            if (casesText) {
                casesText.textContent = this.language === 'ar' ? 'قضية مُنجزة بنجاح' : 'Successfully Completed Cases';
            }

            // نسبة الرضا
            const satisfactionNumber = stats[1]?.querySelector('.stat-number');
            const satisfactionText = stats[1]?.querySelector('.stat-text');
            if (satisfactionNumber) satisfactionNumber.textContent = this.data.personal_info.satisfaction_rate;
            if (satisfactionText) {
                satisfactionText.textContent = this.language === 'ar' ? 'نسبة رضا العملاء' : 'Client Satisfaction Rate';
            }

            // سنوات الخبرة
            const experienceNumber = stats[2]?.querySelector('.stat-number');
            const experienceText = stats[2]?.querySelector('.stat-text');
            if (experienceNumber) experienceNumber.textContent = this.data.personal_info.experience_years;
            if (experienceText) {
                experienceText.textContent = this.language === 'ar' ? 'سنة خبرة قانونية' : 'Years of Experience';
            }
        }
    }

    // تحديث شارات الثقة
    updateTrustBadges() {
        if (!this.data) return;
        
        const badgesContainer = document.querySelector('.trust-badges');
        if (!badgesContainer) return;

        const badges = this.language === 'ar' ? this.data.trust_badges.ar : this.data.trust_badges.en;
        badgesContainer.innerHTML = '';

        badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.innerHTML = `
                <i class="${badge.icon}"></i>
                <span>${badge.text}</span>
            `;
            badgesContainer.appendChild(badgeElement);
        });
    }

    // تحديث قسم من نحن
    updateAboutSection() {
        if (!this.data) return;
        
        const aboutTitle = document.querySelector('.about-title');
        const aboutDescription = document.querySelector('.about-description');
        
        if (aboutTitle) {
            const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
            const prefix = this.language === 'ar' ? '' : 'About ';
            aboutTitle.textContent = `${prefix}${name}`;
        }

        if (aboutDescription) {
            const description = this.language === 'ar' ? this.data.personal_info.description_ar : this.data.personal_info.description_en;
            aboutDescription.textContent = description;
        }

        // تحديث المؤهلات
        this.updateCredentials();
        
        // تحديث الميزات
        this.updateFeatures();
        
        // تحديث فلسفة العمل
        this.updatePhilosophy();
    }

    // تحديث المؤهلات
    updateCredentials() {
        if (!this.data) return;
        
        const credentials = document.querySelectorAll('.credential');
        
        // المؤهلات العلمية
        if (credentials[0]) {
            const educationList = credentials[0].querySelector('p');
            if (educationList) {
                const education = this.language === 'ar' ? this.data.qualifications.education_ar : this.data.qualifications.education_en;
                educationList.innerHTML = education.join('<br>');
            }
        }

        // العضويات
        if (credentials[1]) {
            const membershipsList = credentials[1].querySelector('p');
            if (membershipsList) {
                const memberships = this.language === 'ar' ? this.data.qualifications.memberships_ar : this.data.qualifications.memberships_en;
                membershipsList.innerHTML = memberships.join('<br>');
            }
        }
    }

    // تحديث فلسفة العمل
    updatePhilosophy() {
        if (!this.data) return;
        
        const philosophyText = document.querySelector('.credential:last-child p');
        if (philosophyText) {
            const philosophy = this.language === 'ar' ? this.data.philosophy.text_ar : this.data.philosophy.text_en;
            philosophyText.textContent = philosophy;
        }
    }

    // تحديث الميزات
    updateFeatures() {
        if (!this.data) return;
        
        const featuresContainer = document.querySelector('.about-features ul');
        if (!featuresContainer) return;

        const features = this.language === 'ar' ? this.data.features.ar : this.data.features.en;
        featuresContainer.innerHTML = '';

        features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresContainer.appendChild(li);
        });
    }

    // تحديث معلومات التواصل
    updateContactInfo() {
        if (!this.data) return;
        
        // البريد الإلكتروني
        const emailElements = document.querySelectorAll('[href*="mailto"], .contact-item p, .footer-contact p');
        emailElements.forEach(element => {
            if (element.textContent.includes('@') || element.href?.includes('mailto:')) {
                if (element.href) {
                    element.href = `mailto:${this.data.contact_info.email}`;
                }
                if (element.textContent.includes('@')) {
                    element.textContent = this.data.contact_info.email;
                }
            }
        });

        // الهاتف
        const phoneElements = document.querySelectorAll('.contact-item p');
        phoneElements.forEach(element => {
            if (element.textContent.includes('+20')) {
                element.textContent = this.data.contact_info.phone_eg;
            }
        });

        // العنوان
        const addressElements = document.querySelectorAll('.contact-item p');
        const address = this.language === 'ar' ? this.data.contact_info.address_ar : this.data.contact_info.address_en;
        addressElements.forEach(element => {
            if (element.innerHTML.includes('<br>') && (element.textContent.includes('القاهرة') || element.textContent.includes('Cairo'))) {
                element.innerHTML = address.replace(/،/g, ',').replace(/\s*،\s*/g, '<br>');
            }
        });

        // ساعات العمل
        const workingHoursElements = document.querySelectorAll('.contact-item p');
        const workingHours = this.language === 'ar' ? this.data.contact_info.working_hours_ar : this.data.contact_info.working_hours_en;
        workingHoursElements.forEach(element => {
            if (element.innerHTML.includes('<br>') && (element.textContent.includes('الاثنين') || element.textContent.includes('Monday'))) {
                element.innerHTML = workingHours.replace(/،/g, '<br>');
            }
        });
    }

    // تحديث روابط التواصل الاجتماعي
    updateSocialLinks() {
        if (!this.data) return;
        
        const socialLinks = document.querySelectorAll('.social-icon, .social-link');
        
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (!icon) return;

            if (icon.classList.contains('fa-whatsapp')) {
                link.href = this.data.social_media.whatsapp;
            } else if (icon.classList.contains('fa-telegram')) {
                link.href = this.data.social_media.telegram;
            } else if (icon.classList.contains('fa-linkedin')) {
                link.href = this.data.social_media.linkedin;
            } else if (icon.classList.contains('fa-facebook')) {
                link.href = this.data.social_media.facebook;
            }
        });

        // تحديث زر WhatsApp العائم
        const whatsappFloat = document.querySelector('.whatsapp-btn');
        if (whatsappFloat) {
            whatsappFloat.href = this.data.social_media.whatsapp;
        }
    }

    // تحديث شهادات العملاء
    updateTestimonials() {
        if (!this.data) return;
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            if (index >= this.data.testimonials.length) return;
            
            const testimonial = this.data.testimonials[index];
            const content = card.querySelector('.testimonial-content p');
            const authorName = card.querySelector('.author-info h4');
            const caseType = card.querySelector('.author-info span');
            
            if (content) {
                content.textContent = this.language === 'ar' ? testimonial.text_ar : testimonial.text_en;
            }
            
            if (authorName) {
                authorName.textContent = this.language === 'ar' ? testimonial.author_ar : testimonial.author_en;
            }
            
            if (caseType) {
                caseType.textContent = this.language === 'ar' ? testimonial.case_type_ar : testimonial.case_type_en;
            }
        });
    }

    // تحديث تذييل الصفحة
    updateFooter() {
        if (!this.data) return;
        
        const footerBrand = document.querySelector('.footer-brand h3');
        if (footerBrand) {
            const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
            footerBrand.textContent = name;
        }

        const footerDescription = document.querySelector('.footer-brand p');
        if (footerDescription) {
            const title = this.language === 'ar' ? this.data.personal_info.title_ar : this.data.personal_info.title_en;
            footerDescription.textContent = title;
        }

        // حقوق النشر
        const copyright = document.querySelector('.footer-bottom-content p');
        if (copyright && copyright.textContent.includes('2025')) {
            const name = this.language === 'ar' ? this.data.personal_info.name_ar : this.data.personal_info.name_en;
            const rightsText = this.language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved';
            copyright.textContent = `© 2025 ${name}. ${rightsText}.`;
        }
    }

    // تحديث جميع البيانات
    async updateAllData() {
        await this.loadData();
        if (!this.data) return;

        this.updatePageTitle();
        this.updateBrandName();
        this.updateHeroSection();
        this.updateAboutSection();
        this.updateContactInfo();
        this.updateSocialLinks();
        this.updateTestimonials();
        this.updateFooter();
        
        console.log('تم تحديث جميع بيانات المحامي من ملف JSON');
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const lawyerData = new LawyerDataManager();
    lawyerData.updateAllData();
});

// تصدير الكلاس للاستخدام في ملفات أخرى
window.LawyerDataManager = LawyerDataManager;
