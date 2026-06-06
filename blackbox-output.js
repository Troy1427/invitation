/* ========================================
   WEDDING INVITATION - FULL JAVASCRIPT
   10 Animations + RSVP Google Sheets
   ======================================== */

// ========================================
// VARIABEL UTAMA
// ========================================

// ✅ GANTI DENGAN URL GOOGLE APPS SCRIPT ANDA
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/GANTI_ID_DISINI/exec';

// Tanggal Pernikahan (GANTI TANGGAL ANDA)
const TANGGAL_NIKAH = new Date('2025-06-15T08:00:00');

let currentSlide = 0;
let musicPlaying = false;
let isLoaded = false;

// ========================================
// 1. LOADING ANIMATION
// ========================================

window.addEventListener('load', function() {
    // Simulasi loading
    setTimeout(function() {
        document.getElementById('loading').classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('loading').style.display = 'none';
            isLoaded = true;
        }, 1000);
    }, 2000);
});

// ========================================
// 2. BUKA UNDANGAN (Opening Overlay)
// ========================================

function bukaUndangan() {
    const overlay = document.getElementById('openingOverlay');
    const mainContent = document.getElementById('mainContent');
    const music = document.getElementById('bgMusic');
    
    // Animasi menutup overlay
    overlay.classList.add('closing');
    
    setTimeout(function() {
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Mulai musik (bisa jugamanual)
        // toggleMusic();
        
        // Jalankan scroll animation
        initScrollAnimations();
        
        // Mulai countdown
        startCountdown();
        
    }, 800);
}

// ========================================
// 3. TOGGLE MUSIC (Floating Button)
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
        music.play().catch(function(e) {
            console.log('Autoplay blocked: gunakan tombol untuk memutar musik');
        });
        icon.classList.remove('fa-music');
        icon.classList.add('fa-pause');
        musicPlaying = true;
    }
}

// ========================================
// 4. SMOOTH SCROLLING & FADE ANIMATIONS
// ========================================

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in, .text-reveal');
    
    const revealOnScroll = function() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        reveals.forEach(function(reveal) {
            const reveals = reveal.getBoundingClientRect().top;
            
            if (reveals < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Cek saat pertama kali load
}

// ========================================
// 5. PARALLAX BACKGROUND
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
// 6. COUNTDOWN TIMER
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
// 7. PHOTO SLIDER (Couple Section)
// ========================================

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    // Hapus kelas active dari slide sekarang
    slides[currentSlide].classList.remove('active');
    
    // Update index
    currentSlide += direction;
    
    // Loop jika di batas
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Tambah kelas active ke slide baru
    slides[currentSlide].classList.add('active');
    
    // Update dots jika ada
    if (dots.length > 0) {
        dots.forEach(function(dot) {
            dot.classList.remove('active');
        });
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    // Hapus dari semua
    slides[currentSlide].classList.remove('active');
    dots.forEach(function(dot) {
        dot.classList.remove('active');
    });
    
    // Set baru
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

// Auto slide setiap 5 detik
setInterval(function() {
    if (document.getElementById('mainContent') && document.getElementById('mainContent').style.display !== 'none') {
        changeSlide(1);
    }
}, 5000);

// ========================================
// 8. RSVP - GOOGLE SPREADSHEET
// ========================================

function KirimRSVP(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.btn-rsvp-submit');
    const message = document.getElementById('rsvpMessage');
    const originalHTML = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;
    
    // Data yang akan dikirim
    const data = {
        'Nama': document.getElementById('namaRSVP').value,
        'Kehadiran': document.getElementById('konfirmasiRSVP').value,
        'JumlahTamu': document.getElementById('jumlahRSVP').value,
        'Ucapan': document.getElementById('ucapanRSVP').value
    };
    
    // Kirim ke Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
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
        console.error('Error:', error);
        message.innerHTML = '❌ Terjadi kesalahan. Silakan coba lagi.';
        message.className = 'rsvp-message error';
    })
    .finally(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    });
}

// ========================================
// 9. UCAPAN TAMU (Local Storage - Demo)
// ========================================

function KirimUcapan(event) {
    event.preventDefault();
    
    const nama = document.getElementById('namaTamu').value;
    const ucapan = document.getElementById('ucapanTamu').value;
    const list = document.getElementById('ucapanList');
    
    if (nama && ucapan) {
        // Simpan ke localStorage
        const newUcapan = {
            nama: nama,
            ucapan: ucapan,
            waktu: new Date().toLocaleString('id-ID')
        };
        
        // Ambil yang sudah ada
        let ucapanList = JSON.parse(localStorage.getItem('ucapanList') || '[]');
        ucapanList.unshift(newUcapan); // Tambah di paling atas
        localStorage.setItem('ucapanList', JSON.stringify(ucapanList));
        
        // Tampilkan
        const item = document.createElement('div');
        item.className = 'ucapan-item';
        item.innerHTML = '<div class="ucapan-avatar"><i class="fas fa-user"></i></div><div class="ucapan-content"><span class="ucapan-nama">' + nama + '</span><span class="ucapan-text">' + ucapan + '</span><span class="ucapan-waktu">' + newUcapan.waktu + '</span></div>';
        
        list.insertBefore(item, list.firstChild);
        
        // Reset form
        document.getElementById('wishForm').reset();
        
        alert('Terima kasih atas ucapan Anda! 🙏');
    }
}

// Load ucapan dari localStorage saat page load
window.addEventListener('load', function() {
    const list = document.getElementById('ucapanList');
    if (list) {
        const ucapanList = JSON.parse(localStorage.getItem('ucapanList') || '[]');
        ucapanList.forEach(function(item) {
            const div = document.createElement('div');
            div.className = 'ucapan-item';
            div.innerHTML = '<div class="ucapan-avatar"><i class="fas fa-user"></i></div><div class="ucapan-content"><span class="ucapan-nama">' + item.nama + '</span><span class="ucapan-text">' + item.ucapan + '</span><span class="ucapan-waktu">' + item.waktu + '</span></div>';
            list.appendChild(div);
        });
    }
});

// ========================================
// 10. SMOOTH SCROLL FOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 11. SCROLL TO TOP BUTTON
// ========================================

window.addEventListener('scroll', function() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        if (window.pageYOffset > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// 12. RESPOSIVE MENU
// ========================================

function toggleMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
}

// ========================================
// INIT SEMUA FUNGSI SAAT DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Loading sudah di handle di window.load
    console.log('Wedding Invitation Loaded!');
});