/* ==========================================================================
   ANJALI CHAUHAN PORTFOLIO SCRIPTING ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. Preloader Loader Bar Simulation
       -------------------------------------------------------------------------- */
    const loadingScreen = document.getElementById('loading-screen');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercentage = document.getElementById('loader-percentage');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Short delay for smoothness
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                // Initiate page reveals
                setTimeout(revealOnScroll, 100);
            }, 300);
        }
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.textContent = `${progress}%`;
    }, 50);

    /* --------------------------------------------------------------------------
       2. Custom Cursor Glow Tracker
       -------------------------------------------------------------------------- */
    const cursorGlow = document.getElementById('cursor-glow');
    
    // Disable custom cursor glow on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        cursorGlow.style.display = 'none';
    } else {
        document.addEventListener('mousemove', (e) => {
            // Add a small frame delay check for smoother rendering
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }

    /* --------------------------------------------------------------------------
       3. Header Scroll Styling & Scroll-to-Top Button
       -------------------------------------------------------------------------- */
    const header = document.querySelector('.header');
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // Sticky Header effect
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll to Top visibility
        if (scrollPos > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* --------------------------------------------------------------------------
       4. Responsive Navigation Menu Drawer
       -------------------------------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close drawer on click of nav-link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* --------------------------------------------------------------------------
       5. Interactive Canvas Background Particles (Hero)
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('home');
    
    let particlesArray = [];
    const maxParticles = 60;
    
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };
    
    // Resize Canvas to fit Hero wrapper
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    // Mouse coordinates relative to Hero canvas
    heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Particle Blueprints
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            
            // Randomly select one of our theme neon colors
            const colors = ['rgba(168, 85, 247, 0.45)', 'rgba(59, 130, 246, 0.45)', 'rgba(6, 182, 212, 0.45)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            // Out of bounds boundary collision check
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            // Move particle
            this.x += this.vx;
            this.y += this.vy;
            
            // Mouse Interaction (attract/push)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    // Pull particles gently
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx / dist * force * 1.5;
                    this.y -= dy / dist * force * 1.5;
                }
            }
        }
    }
    
    // Initialize Particles array
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Connect particles close to each other with a thin line
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    const alpha = (100 - dist) / 100 * 0.15;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation Main Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    /* --------------------------------------------------------------------------
       6. Dynamic Headline Typing Animation
       -------------------------------------------------------------------------- */
    const typingText = document.getElementById('typing-text');
    const professions = [
        "Computer Science Student",
        "Java Full Stack Developer",
        "AI & ML Enthusiast",
        "Problem Solver"
    ];
    
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentWord = professions[wordIdx];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deletes faster
        } else {
            typingText.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120; // Normal writing pace
        }
        
        // Word typing cycle logic
        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word before deleting
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % professions.length;
            typingSpeed = 400; // Pause briefly before writing next word
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Trigger typing effect after load delay
    setTimeout(typeEffect, 1200);

    /* --------------------------------------------------------------------------
       7. Scroll Reveal & Intersection Observer Animations
       -------------------------------------------------------------------------- */
    
    // A. Entrance Reveals (fade-up, fade-in, slide)
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('reveal-visible');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);



    // C. Achievement Count-Up numerical animation
    const counterNumbers = document.querySelectorAll('.counter-num');
    
    const countersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'), 10);
                let current = 0;
                const duration = 2000; // 2 seconds animation
                const increment = Math.ceil(target / (duration / 16)); // ~60fps
                
                const updateCount = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + "+";
                    } else {
                        counter.textContent = current;
                        requestAnimationFrame(updateCount);
                    }
                };
                
                updateCount();
                countersObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.2 });
    
    counterNumbers.forEach(counter => {
        countersObserver.observe(counter);
    });

    /* --------------------------------------------------------------------------
       8. Active Navigation Section Highlighting
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' }); // Activates section when it covers viewport center
    
    sections.forEach(section => {
        navObserver.observe(section);
    });

    /* --------------------------------------------------------------------------
       9. Form Validation & Submit Simulation
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const submitText = submitBtn.querySelector('span');
        
        const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
        if (!accessKeyInput || accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
            // Fallback to mailto link if key is not configured yet
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Opening your email client to send message...';
            
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';
            submitText.textContent = 'Redirecting...';

            setTimeout(() => {
                const mailtoLink = `mailto:anjalichauhan2720@gmail.com?subject=Contact from Portfolio (${name})&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
                window.location.href = mailtoLink;
                
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
                submitText.textContent = 'Send Message';
                contactForm.reset();
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 6000);
            }, 1000);
            return;
        }

        // Show loading state
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.7';
        submitText.textContent = 'Sending Message...';
        
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you, your message was sent successfully!';
                contactForm.reset();
            } else {
                console.log(response);
                formStatus.className = 'form-status error';
                formStatus.textContent = json.message || 'Something went wrong. Please try again.';
            }
        })
        .catch(error => {
            console.log(error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Network error. Please check your connection and try again.';
        })
        .then(() => {
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.opacity = '1';
            submitText.textContent = 'Send Message';
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 6000);
        });
    });

    /* --------------------------------------------------------------------------
       10. Certificate Modal / Viewer Logic
       -------------------------------------------------------------------------- */
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalIframe = document.getElementById('cert-modal-iframe');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalLoader = document.getElementById('cert-modal-loader');
    const certModalFallback = document.getElementById('cert-modal-fallback');
    const fallbackCertName = document.getElementById('fallback-cert-name');
    const fallbackMetaIssuer = document.getElementById('fallback-meta-issuer');
    const fallbackPathCode = document.getElementById('fallback-path-code');
    const certButtons = document.querySelectorAll('.cert-btn');
    const certModalOverlay = certModal.querySelector('.cert-modal-overlay');

    // Show fallback card if file does not exist
    function showFallback(title, issuer, src) {
        fallbackCertName.textContent = title;
        fallbackMetaIssuer.textContent = issuer;
        fallbackPathCode.textContent = src;
        certModalFallback.classList.remove('hidden');
    }

    // Open Modal
    function openCertificate(btn) {
        const src = btn.getAttribute('data-cert-src');
        const title = btn.getAttribute('data-cert-title');
        const issuer = btn.getAttribute('data-cert-issuer');

        // Reset display states
        certModalImg.classList.add('hidden');
        certModalIframe.classList.add('hidden');
        certModalFallback.classList.add('hidden');
        certModalLoader.classList.add('active');
        certModal.classList.add('active');
        document.body.classList.add('modal-open');

        const isPdf = src.toLowerCase().endsWith('.pdf');

        if (isPdf) {
            const loadPdfDirectly = () => {
                certModalLoader.classList.remove('active');
                certModalIframe.src = src;
                certModalIframe.classList.remove('hidden');
            };

            // If running on a web server, check file existence via fetch first
            if (window.location.protocol !== 'file:') {
                fetch(src, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            loadPdfDirectly();
                        } else {
                            certModalLoader.classList.remove('active');
                            showFallback(title, issuer, src);
                        }
                    })
                    .catch(() => {
                        // Fetch failed (network error), fallback to direct load
                        loadPdfDirectly();
                    });
            } else {
                // local file protocol, skip fetch due to CORS
                loadPdfDirectly();
            }
        } else {
            // Setup image object to test loading
            const imgTest = new Image();
            
            imgTest.onload = function() {
                certModalLoader.classList.remove('active');
                certModalImg.src = src;
                certModalImg.alt = title;
                certModalImg.classList.remove('hidden');
            };

            imgTest.onerror = function() {
                // Loading failed, show fallback credential card
                certModalLoader.classList.remove('active');
                showFallback(title, issuer, src);
            };

            imgTest.src = src;
        }
    }

    // Close Modal
    function closeCertificate() {
        certModal.classList.remove('active');
        if (!featuresModal.classList.contains('active') && !resumeModal.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
        // Clean src to prevent loading old image/pdf on next open
        setTimeout(() => {
            certModalImg.src = '';
            certModalIframe.src = '';
            certModalImg.classList.add('hidden');
            certModalIframe.classList.add('hidden');
            certModalFallback.classList.add('hidden');
        }, 400); // match transition time
    }

    certButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCertificate(btn);
        });
    });

    certModalClose.addEventListener('click', closeCertificate);
    certModalOverlay.addEventListener('click', closeCertificate);

    // Keyboard support: Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeCertificate();
        }
    });

    /* --------------------------------------------------------------------------
       11. Project Features Modal Logic
       -------------------------------------------------------------------------- */
    const featuresModal = document.getElementById('features-modal');
    const featuresModalTitle = document.getElementById('features-modal-title');
    const featuresModalList = document.getElementById('features-modal-list');
    const featuresModalClose = document.getElementById('features-modal-close');
    const featuresModalOverlay = featuresModal.querySelector('.features-modal-overlay');
    const featuresTriggers = document.querySelectorAll('.btn-features-trigger');

    function openFeatures(btn) {
        const title = btn.getAttribute('data-project-title');
        const featuresJSON = btn.getAttribute('data-project-features');
        
        let features = [];
        try {
            features = JSON.parse(featuresJSON);
        } catch (e) {
            console.error('Failed to parse project features', e);
        }

        // Set title
        featuresModalTitle.textContent = title;

        // Clear list and populate
        featuresModalList.innerHTML = '';
        features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            featuresModalList.appendChild(li);
        });

        // Open modal and lock scroll
        featuresModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeFeatures() {
        featuresModal.classList.remove('active');
        if (!certModal.classList.contains('active') && !resumeModal.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    featuresTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openFeatures(btn);
        });
    });

    featuresModalClose.addEventListener('click', closeFeatures);
    featuresModalOverlay.addEventListener('click', closeFeatures);

    // Keyboard support: Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && featuresModal.classList.contains('active')) {
            closeFeatures();
        }
    });

    /* --------------------------------------------------------------------------
       12. Resume Modal Logic
       -------------------------------------------------------------------------- */
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalIframe = document.getElementById('resume-modal-iframe');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalOverlay = resumeModal.querySelector('.resume-modal-overlay');

    function openResume() {
        const resumePath = 'assets/Anjali_Chauhan_Resume.pdf';
        resumeModalIframe.src = resumePath;
        resumeModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeResume() {
        resumeModal.classList.remove('active');
        if (!certModal.classList.contains('active') && !featuresModal.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
        // Reset iframe src when closed
        setTimeout(() => {
            resumeModalIframe.src = '';
        }, 400);
    }

    if (viewResumeBtn) {
        viewResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openResume();
        });
    }

    resumeModalClose.addEventListener('click', closeResume);
    resumeModalOverlay.addEventListener('click', closeResume);

    // Keyboard Escape Key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResume();
        }
    });
});

