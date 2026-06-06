/* ========================================
   WEDDING INVITATION - FULL JAVASCRIPT
   10 Animations + RSVP Google Sheets
   ======================================== */

// ========================================
// VARIABEL UTAMA - EDIT DI sini!
// ========================================

// ✅ GANTI: Google Apps Script URL (dari Cara 2 RSVP)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAinCnN9xx1swy5_Aqzn27mHnI4QRRBDCc3gKshKK_WMbHfFLnIQQR_RuWtTxgLXBi/exec';

// ✅ GANTI: Tanggal Pernikahan (format: YYYY-MM-DDTHH:MM:SS)
const TANGGAL_NIKAH = new Date('2027-03-12T08:00:00');

let currentSlide = 0;
let musicPlaying = false;
let isLoaded = false;

// ========================================
// 1. GUEST NAME FROM URL (?to=)
// ========================================

function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestElement = document.getElementById('guestName');
    
    if (guestName) {
        const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        guestElement.textContent = decodedName;
    } else {
        guestElement.textContent = 'Tamu Undangan';
    }
}

// ========================================
// 2. LOADING ANIMATION
// ========================================

window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loading').classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('loading').style.display = 'none';
            isLoaded = true;
        }, 1000);
    }, 2000);
});

// ========================================
// 3. BUKA UNDANGAN
// ========================================

function bukaUndangan() {
    const overlay = document.getElementById('openingOverlay');
    const mainContent = document.getElementById('mainContent');
    
    overlay.classList.add('closing');
    
    setTimeout(function() {
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        initScrollAnimations();
        startCountdown();
    }, 800);
}

// ========================================
// 4. TOGGLE MUSIC
// ========================================

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    
    if (musicPlaying) {
        music.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-music');
        musicPlaying = false;
    } else {
        music.play().catch(function(e) { console.log('Autoplay blocked'); });
        icon.classList.remove('fa-music');
        icon.classList.add('fa-pause');
        musicPlaying = true;
    }
}

// ========================================
// 5. SCROLL ANIMATIONS (Fade Up/Left/Right/Zoom)
// ========================================

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        reveals.forEach(function(reveal) {
            const rect = reveal.getBoundingClientRect().top;
            
            if (rect < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

// ========================================
// 6. PARALLAX BACKGROUND
// ========================================

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const layers = document.querySelectorAll('.parallax-layer');
    
    layers.forEach(function(layer) {
        const speed = layer.getAttribute('data-speed');
        layer.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
});

// ========================================
// 7. COUNTDOWN TIMER
// ========================================

function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = TANGGAL_NIKAH - now;
        
        if (distance < 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// 8. PHOTO SLIDER
// ========================================

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    
    slides[currentSlide].classList.remove('active');
    currentSlide += direction;
    
    if (currentSlide >= slides.length) currentSlide = 0;
    else if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
}

setInterval(function() {
    if (document.getElementById('mainContent') && document.getElementById('mainContent').style.display !== 'none') {
        changeSlide(1);
    }
}, 5000);

// ========================================
// 9. RSVP - GOOGLE SPREADSHEET
// ========================================

function kirimRSVP(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.btn-rsvp-submit');
    const message = document.getElementById('rsvpMessage');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;
    
    const data = {
        'Nama': document.getElementById('namaRSVP').value,
        'Kehadiran': document.getElementById('konfirmasiRSVP').value,
        'JumlahTamu': document.getElementById('jumlahRSVP').value,
        'Ucapan': document.getElementById('ucapanRSVP').value
    };
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            message.innerHTML = '🎉 ' + data.message;
            message.className = 'rsvp-message success';
            document.getElementById('rsvpForm').reset();
        } else {
            message.innerHTML = '❌ ' + data.message;
            message.className = 'rsvp-message error';
        }
    })
    .catch(error => {
        message.innerHTML = '❌ Terjadi kesalahan. Silakan coba lagi.';
        message.className = 'rsvp-message error';
    })
    .finally(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    });
}

// ========================================
// 10. UCAPAN TAMU (Local Storage)
// ========================================

function kirimUcapan(event) {
    event.preventDefault();
    
    const nama = document.getElementById('namaTamu').value;
    const ucapan = document.getElementById('ucapanTamu').value;
    const list = document.getElementById('ucapanList');
    
    if (nama && ucapan) {
        const newUcapan = { nama: nama, ucapan: ucapan, waktu: new Date().toLocaleString('id-ID') };
        
        let ucapanList = JSON.parse(localStorage.getItem('ucapanList') || '[]');
        ucapanList.unshift(newUcapan);
        localStorage.setItem('ucapanList', JSON.stringify(ucapanList));
        
        const item = document.createElement('div');
        item.className = 'ucapan-item';
        item.innerHTML = '<div class="ucapan-avatar"><i class="fas fa-user"></i></div><div class="ucapan-content"><span class="ucapan-nama">' + nama + '</span><span class="ucapan-text">' + ucapan + '</span><span class="ucapan-time">' + newUcapan.waktu + '</span></div>';
        
        list.insertBefore(item, list.firstChild);
        document.getElementById('wishForm').reset();
        alert('Terima kasih atas ucapan Anda! 🙏');
    }
}

// Load saved wishes on page load
function loadSavedWishes() {
    const list = document.getElementById('ucapanList');
    const ucapanList = JSON.parse(localStorage.getItem('ucapanList') || '[]');
    
    ucapanList.forEach(function(ucapan) {
        const item = document.createElement('div');
        item.className = 'ucapan-item';
        item.innerHTML = '<div class="ucapan-avatar"><i class="fas fa-user"></i></div><div class="ucapan-content"><span class="ucapan-nama">' + ucapan.nama + '</span><span class="ucapan-text">' + ucapan.ucapan + '</span><span class="ucapan-time">' + ucapan.waktu + '</span></div>';
        list.appendChild(item);
    });
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    getGuestName();
    loadSavedWishes();
    console.log('Wedding Invitation Ready!');
});
