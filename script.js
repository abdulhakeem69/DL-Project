document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        lerp: 0.05,
        smooth: true,
        direction: 'vertical'
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: 0, 
                    duration: 1.2, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
                });
            }
        });
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    const menuToggle = document.querySelector(".mobile-toggle");
    const mainHeader = document.querySelector("#main-header")
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const menuTl = gsap.timeline({ 
        paused: true, 
        reversed: true,
        onReverseComplete: () => {
            mainHeader.style.mixBlendMode = "difference";
        } 
    });

    menuTl
        .to(mobileMenu, { 
            duration: 0.5, 
            autoAlpha: 1, 
            ease: "power3.inOut" 
        })
        .to(mobileLinks, { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power4.out" 
        });

    menuToggle.addEventListener('click', () => {
        if (menuTl.reversed()) {
            menuTl.play(); 
            menuToggle.textContent = "Close"; 
            document.body.style.overflow = "hidden"; 
            mainHeader.style.mixBlendMode = "normal";
        } else {
            menuTl.reverse(); 
            menuToggle.textContent = "Menu"; 
            document.body.style.overflow = "auto"; 
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuTl.reverse();
            menuToggle.textContent = "Menu";
            document.body.style.overflow = "auto";
        });
    });

    // 2. Preloader
    const preloader = document.getElementById('preloader');
    const loaderLogo = document.querySelector('.loader-logo');
    const loaderLineEl = document.querySelector('.loader-line');

    document.body.style.overflow = 'hidden';

    gsap.set(loaderLogo, { yPercent: 100, autoAlpha: 0 }); 
    gsap.set(loaderLineEl, { scaleX: 0, transformOrigin: "left" }); 

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = '';
            document.body.style.cursor = 'none';
            preloader.style.display = 'none'; 
        }
    });

    tl
        .to(loaderLogo, { 
            duration: 1.2, 
            yPercent: 0, 
            autoAlpha: 1, 
            ease: "power4.out" 
        })
        .to(loaderLineEl, { 
            duration: 1.5, 
            scaleX: 1, 
            ease: "expo.inOut" 
        }, "-=0.8")
        .to([loaderLogo, loaderLineEl], { 
            duration: 0.6, 
            yPercent: -100, 
            autoAlpha: 0, 
            stagger: 0.1, 
            ease: "power2.in" 
        })
        .to(preloader, { 
            duration: 1.2, 
            yPercent: -100, 
            ease: "power4.inOut" 
        })
        .from("#hero .reveal-text", { 
            y: 100, 
            opacity: 0, 
            duration: 1.5, 
            stagger: 0.1, 
            ease: "power3.out" 
        }, "-=0.8");

    ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top", 
        pin: true,
        pinSpacing: false 
    });

    // 4. Horizontal Scroll
    const gallerySection = document.getElementById("horizontal-gallery");
    const galleryTrack = document.querySelector(".gallery-track");

    if (gallerySection && galleryTrack) {
        let scrollTween = gsap.to(galleryTrack, {
            x: () => -(galleryTrack.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: gallerySection,
                start: "top top",
                end: () => "+=" + (galleryTrack.scrollWidth - window.innerWidth),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }

    const revealElements = document.querySelectorAll(".reveal-text, .reveal-card, .section-label");
    
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.from(".reveal-image img", {
        scrollTrigger: {
            trigger: ".reveal-image",
            start: "top 80%",
            scrub: 1.5
        },
        scale: 1.2,
        y: 50
    });
    
    // 6. Before/After Slider Logic
    const sliderCards = document.querySelectorAll('.ba-slider-card');
    
    sliderCards.forEach(card => {
        const container = card.querySelector('.ba-image-container');
        const beforeWrapper = card.querySelector('.ba-image-before-wrapper');
        const handle = card.querySelector('.ba-slider-handle');
        
        if(!container || !beforeWrapper || !handle) return;

        const positions = [50, 100, 0]; 
        let sIndex = 0;

        beforeWrapper.style.transition = "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        handle.style.transition = "left 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

        const updateSlider = () => {
            const targetPercent = positions[sIndex];
            beforeWrapper.style.width = `${targetPercent}%`;
            handle.style.left = `${targetPercent}%`;
            sIndex++;
            if (sIndex >= positions.length) sIndex = 0;
        };

        beforeWrapper.style.width = `50%`;
        handle.style.left = `50%`;
        sIndex = 1; 

        container.addEventListener('click', (e) => {
            e.preventDefault(); 
            updateSlider();
        });
    });

    const baTrack = document.querySelector('.ba-carousel-track');
    const baNext = document.querySelector('.ba-nav-next');
    const baPrev = document.querySelector('.ba-nav-prev');
    let baIndex = 0;
    const baCount = document.querySelectorAll('.ba-slider-card').length;

    if(baTrack) {
        function updateBaCarousel() {
            baTrack.style.transform = `translateX(-${baIndex * 100}%)`;
        }
        baNext.addEventListener('click', () => {
            if(baIndex < baCount - 1) { baIndex++; updateBaCarousel(); }
        });
        baPrev.addEventListener('click', () => {
            if(baIndex > 0) { baIndex--; updateBaCarousel(); }
        });
    }

    // 7. Testimonial Slider
    const tSlides = document.querySelectorAll('.testimonial-slide');
    const tNext = document.querySelector('.t-next');
    const tPrev = document.querySelector('.t-prev');
    let tIndex = 0;

    if (tSlides.length > 0) {
        function updateTestimonial() {
            tSlides.forEach(s => s.classList.remove('active'));
            tSlides[tIndex].classList.add('active');
        }
        tNext.addEventListener('click', () => {
            tIndex = (tIndex + 1) % tSlides.length;
            updateTestimonial();
        });
        tPrev.addEventListener('click', () => {
            tIndex = (tIndex - 1 + tSlides.length) % tSlides.length;
            updateTestimonial();
        });
    }

    // 8. Custom Cursor
    if (matchMedia('(pointer:fine)').matches) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorCircle = document.querySelector('.cursor-circle');
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
        });

        const interactives = document.querySelectorAll('.interactive');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
        });
    }

    /* --- 9. PROJECT MODAL LOGIC (NEW) --- */
    
    const projectsDB = [
        {
            id: 1,
            category: "Residential / Apartment",
            title: "Apartemen Minimalis Jepang",
            description: "Menggabungkan estetika Zen Jepang dengan fungsionalitas modern. Penggunaan kayu oak muda, pencahayaan hangat tersembunyi, dan tata letak tatami modern menciptakan ruang yang menenangkan di tengah hiruk pikuk kota. Fokus utama adalah pada 'Ma' (ruang negatif) untuk memberikan kesan luas pada unit apartemen terbatas.",
            images: [
                "assets/jepang/1.jpg",
                "assets/jepang/3.jpg",
                "assets/jepang/4.jpg",
                "assets/jepang/5.jpeg",
                "assets/jepang/6.jpeg",
                "assets/jepang/2.jpg",
                "assets/jepang/7.jpeg",
            ]
        },
        {
            id: 2,
            category: "Residential / Interior",
            title: "Interior Modern Natural",
            description: "Penerapan gaya modern yang dipadukan dengan elemen natural yang dominan. Penggunaan kisi-kisi kayu (wood slats) vertikal pada dinding ruang tamu memberikan tekstur yang kuat sekaligus menciptakan ilusi ruangan yang lebih tinggi. Didukung dengan pencahayaan warm-light untuk suasana hunian yang hangat dan nyaman.",
            images: [
                "assets/modern-natural/1.jpg",
                "assets/modern-natural/2.jpg",
                "assets/modern-natural/4.jpg",
                "assets/modern-natural/5.jpg",
                "assets/modern-natural/3.jpg",
            ]
        },
        {
            id: 3,
            category: "Residential / Master Bedroom",
            title: "Interior Modern Kontemporer",
            description: "Desain interior bergaya kontemporer dengan palet warna monokrom dan aksen marmer. Pada kamar tidur utama, kami menggunakan backdrop panel dinding dengan garis tegas dan pencahayaan tidak langsung (indirect lighting) untuk menciptakan kesan mewah, bersih, dan eksklusif.",
            images: [
                "assets/modern-kontemporer/1.jpg",
                "assets/modern-kontemporer/3.jpg",
                "assets/modern-kontemporer/4.jpeg",
                "assets/modern-kontemporer/5.jpeg",
                "assets/modern-kontemporer/6.jpeg",
                "assets/modern-kontemporer/2.jpg",
            ]
        },
        {
            id: 4,
            category: "Portfolio / Gallery",
            title: "Eksplorasi Karya Kami",
            description: "Jelajahi spektrum lengkap desain kami. Dari kenyamanan residensial hingga fungsionalitas komersial, setiap proyek adalah bukti komitmen kami terhadap estetika, kualitas material, dan personalisasi ruang. Temukan inspirasi dari berbagai gaya yang telah kami wujudkan.",
            images: [
                "assets/jepang/1.jpg",
                "assets/jepang/3.jpg",
                "assets/jepang/4.jpg",
                "assets/jepang/5.jpeg",
                "assets/jepang/6.jpeg",
                "assets/jepang/2.jpg",
                "assets/jepang/7.jpeg",
                "assets/modern-natural/1.jpg",
                "assets/modern-natural/2.jpg",
                "assets/modern-natural/4.jpg",
                "assets/modern-natural/5.jpg",
                "assets/modern-natural/3.jpg",
                "assets/modern-kontemporer/2.jpg",
                "assets/modern-kontemporer/1.jpg",
                "assets/modern-kontemporer/3.jpg",
                "assets/dokter-gigi.jpg",              
                "assets/ruang-manajer.jpg",
                "assets/random1.jpg",
                "assets/random2.jpg",
                "assets/random3.jpg",
                "assets/random4.jpg",
                "assets/random5.jpg",
                "assets/random6.jpg",
                "assets/random7.jpg",
                "assets/random8.jpg",
                "assets/random9.jpg",
                "assets/random10.jpg",
                "assets/random11.jpg",
                "assets/random12.jpg",
                "assets/random13.jpg",
            ],
        }
    ];

    const modal = document.getElementById('project-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');
    const mCategory = document.getElementById('m-category');
    const mTitle = document.getElementById('m-title');
    const mDesc = document.getElementById('m-desc');
    const mGallery = document.getElementById('m-gallery');
    const detailButtons = document.querySelectorAll('.btn-detail');

    const modalTl = gsap.timeline({ paused: true });

    // Setup Animation Sequence
    modalTl
        .set(modal, { autoAlpha: 1 }) // Ubah visibilitas
        .to(modalOverlay, { opacity: 1, duration: 0.6, ease: "power2.inOut" })
        .to(modalContent, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

    // Open Modal Function
    const openModal = (project) => {
        lenis.stop(); // Matikan scroll website utama
        document.body.style.overflow = 'hidden'; // Kunci scrollbar body native
        
        modal.classList.remove("hidden");
        
        // Isi Konten
        mCategory.textContent = project.category;
        mTitle.textContent = project.title;
        mDesc.textContent = project.description;
        
        // Reset Gallery
        mGallery.innerHTML = ''; 
        
        // Inject Images (Collage Logic)
        project.images.forEach((imgSrc, index) => {
            const imgWrapper = document.createElement('div');
            // Kita bungkus img dalam div wrapper jika ingin efek tambahan, tapi img langsung juga oke untuk masonry
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Project Image ${index + 1}`;
            img.classList.add('modal-gallery-img');
            
            mGallery.appendChild(img);
        });

        modalTl.play(); // Mainkan animasi buka

        // Animasi Gambar Muncul satu per satu (Stagger)
        // Kita beri sedikit delay agar layout masonry sempat render
        setTimeout(() => {
             gsap.to('.modal-gallery-img', {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.15, // Jeda antar gambar
                ease: "power3.out",
                overwrite: true
            });
        }, 100);
    };

    // Close Modal Function
    const closeModal = () => {
        modalTl.reverse().then(() => {
            lenis.start(); // Nyalakan lagi scroll website
            document.body.style.overflow = ''; 
            mGallery.innerHTML = ''; 
            gsap.set(modal, { autoAlpha: 0 });
            gsap.set('.modal-gallery-img', { opacity: 0, y: 30 }); // Reset posisi gambar
        });
    };

    // Event Listeners
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.getAttribute('data-id'));
            const project = projectsDB.find(p => p.id === id);
            
            if (project) {
                openModal(project);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    const contactBtn = document.getElementById('btn-open-contact');
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.querySelector('.contact-close');
    const contactOverlay = contactModal.querySelector('.modal-overlay');
    const contactContent = document.querySelector('.contact-modal-content'); 
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('btn-submit');
    const btnText = submitBtn.querySelector('span');

    const contactTl = gsap.timeline({ paused: true });

    // Animasi Buka Modal
    contactTl
        .set(contactModal, { autoAlpha: 1 })
        .to(contactOverlay, { opacity: 1, duration: 0.4, ease: "power2.inOut" })
        .to(contactContent, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }, "-=0.2");

    // Buka Modal
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.stop(); // Stop scroll
        contactModal.classList.remove("hidden", "invisible");
        contactTl.play();
    });

    // Tutup Modal
    const closeContact = () => {
        contactTl.reverse().then(() => {
            lenis.start(); // Resume scroll
            contactModal.classList.add("hidden", "invisible");
            contactForm.reset(); 
            // Reset Button Style
            submitBtn.disabled = false;
            btnText.textContent = "KIRIM PESAN";
            submitBtn.classList.remove('bg-green-500', 'bg-red-500');
            submitBtn.classList.add('bg-white');
        });
    };

    contactClose.addEventListener('click', closeContact);
    contactOverlay.addEventListener('click', closeContact);

    // --- LOGIKA PENGIRIMAN EMAIL (REAL) ---
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Ubah tombol jadi Loading
        btnText.textContent = "MENGIRIM...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";

        // 2. Kirim via EmailJS
        // Ganti 'SERVICE_ID' dan 'TEMPLATE_ID' dengan ID dari dashboard EmailJS Anda
        emailjs.sendForm('service_0w047em', 'template_4elvoij', this)
            .then(function() {
                // SUKSES
                console.log('SUCCESS!');
                btnText.textContent = "TERKIRIM!";
                submitBtn.classList.remove('bg-white');
                submitBtn.classList.add('bg-green-500', 'text-white'); // Hijau saat sukses
                
                setTimeout(() => {
                    closeContact();
                }, 1500);
            }, function(error) {
                // GAGAL
                console.log('FAILED...', error);
                btnText.textContent = "GAGAL";
                submitBtn.classList.remove('bg-white');
                submitBtn.classList.add('bg-red-500', 'text-white'); // Merah saat gagal
                
                setTimeout(() => {
                    btnText.textContent = "COBA LAGI";
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    submitBtn.classList.remove('bg-red-500');
                    submitBtn.classList.add('bg-white');
                }, 2000);
            });
    });
});