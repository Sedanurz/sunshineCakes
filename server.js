require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// .env dosyasının okunduğunu kontrol et
console.log('EMAIL:', process.env.EMAIL);
console.log('PASS:', process.env.PASS);

// EMAIL ve PASS değerlerini kontrol et
if (!process.env.EMAIL || !process.env.PASS) {
    console.error('Hata: EMAIL veya PASS değerleri eksik. Lütfen .env dosyasını kontrol edin.');
    process.exit(1); // Sunucuyu durdur
}

// CORS'u etkinleştir
app.use(cors());

// Form verilerini almak için
app.use(express.urlencoded({ extended: true }));
// Statik dosyaları (HTML, CSS, JS) sunmak için
app.use(express.static('public'));

// Nodemailer yapılandırması
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// SMTP bağlantısını test et
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP Bağlantı Hatası:', error);
    } else {
        console.log('SMTP bağlantısı başarılı:', success);
    }
});

// İletişim formu için POST endpoint
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL,
        to: 'info@sunshine.com',
        subject: `Yeni Mesaj: ${name} - SunshineCakes`,
        text: `Ad: ${name}\nE-posta: ${email}\nMesaj: ${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8; border-radius: 10px;">
                <h1 style="color: #ec4899;">SunshineCakes - Yeni Mesaj</h1>
                <p><strong>Ad:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
                <p style="color: #666;">SunshineCakes ekibi olarak en kısa sürede size geri döneceğiz!</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('E-posta Gönderme Hatası:', error);
            res.send('E-posta gönderilemedi. Lütfen tekrar deneyin.');
        } else {
            console.log('E-posta gönderildi:', info.response);
            res.send('Mesajınız başarıyla gönderildi! En kısa sürede size geri döneceğiz.');
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});