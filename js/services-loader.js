// ملف لتحديث العناصر بالبيانات من JSON

// دالة لإنشاء عنصر قائمة الخدمات
function createServiceItem(service, index) {
    return `
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
                <a href="#contact" class="btn btn-outline">تواصل معنا</a>
            </div>
        </div>
    `;
}

// دالة لتحديث قائمة الخدمات
function updateServices() {
    if (!window.LawyerDataManager) return;
    
    const lawyerData = new window.LawyerDataManager();
    lawyerData.loadData().then(data => {
        if (!data) return;
        
        const servicesContainer = document.querySelector('.services-grid');
        if (!servicesContainer) return;
        
        const language = document.documentElement.lang || 'ar';
        const services = language === 'ar' ? data.services.ar : data.services.en;
        
        servicesContainer.innerHTML = services.map((service, index) => 
            createServiceItem(service, index)
        ).join('');
    });
}

// تشغيل تحديث الخدمات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateServices);
