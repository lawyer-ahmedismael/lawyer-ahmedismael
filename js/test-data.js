// اختبار تحميل البيانات من JSON
async function testDataLoading() {
    console.log('🔄 بدء اختبار تحميل البيانات...');
    
    try {
        const response = await fetch('data/lawyer-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ تم تحميل البيانات بنجاح:', data);
        
        // اختبار البيانات الأساسية
        console.log('👤 اسم المحامي (عربي):', data.personal_info.name_ar);
        console.log('👤 اسم المحامي (إنجليزي):', data.personal_info.name_en);
        console.log('📧 البريد الإلكتروني:', data.contact_info.email);
        console.log('📱 الهاتف:', data.contact_info.phone_eg);
        console.log('🏢 عدد الخدمات:', data.services.ar.length);
        console.log('💬 عدد شهادات العملاء:', data.testimonials.length);
        
        return data;
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        return null;
    }
}

// اختبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testDataLoading, 1000); // انتظار ثانية للتأكد من تحميل كل شيء
});

// إضافة إلى النافذة للاختبار اليدوي
window.testDataLoading = testDataLoading;
