// Main Execution Block (Wrapped in IIFE)
(function() {
    try {
        let percent = 0;
        const percentDisplay = document.querySelector('.preloader-counter');

        if(!percentDisplay) return;

        const preloaderInterval = setInterval(() => {
            percent += Math.floor(Math.random() * 12) + 5;
            if (percent > 100) percent = 100;
            percentDisplay.innerText = percent + "%";
            
            if(window.gsap) gsap.to('.preloader-overlay', { height: percent + "%", duration: 0.1 });

            if (percent === 100) {
                clearInterval(preloaderInterval);
                initHeroReveal();
            }
        }, 80);

        function initHeroReveal() {
            if(!window.gsap) return;
            const tl = gsap.timeline();

            tl.to('.preloader', {
                yPercent: -100,
                duration: 1.2,
                ease: "power2.inOut",
                delay: 0.1
            })
            .set('.preloader', { display: 'none' })
            .to('body', { className: "" }, "-=0.5");

            // Sleek liquid/blur reveal for "MOMBASA MALL"
            const heroTitle = document.querySelector('.hero-title-edgy');
            if(heroTitle) {
                gsap.fromTo(heroTitle, 
                    { y: 50, filter: 'blur(20px)', opacity: 0, scale: 1.1 },
                    { y: 0, filter: 'blur(0px)', opacity: 1, scale: 1, duration: 2, ease: "power3.out" }
                );
            }
            const heroSubtitle = document.querySelectorAll('.hero-subtitle');
            if(heroSubtitle.length > 0) {
                gsap.fromTo(heroSubtitle, { y: 20, opacity: 0 }, { y:0, opacity: 1, duration: 1, delay: 0.8 });
            }
        }

        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
            if (window.gsap && window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0);
            }
        }

        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
        if (cursor && follower) {
            document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0 }); });
            gsap.ticker.add(() => { posX += (mouseX - posX) / 6; posY += (mouseY - posY) / 6; gsap.set(follower, { x: posX, y: posY }); });
            const interactables = document.querySelectorAll('.interactable, a, button, input');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
                el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
            });
        }

        // Ambient Orb 
        const orbs = document.querySelectorAll('.ambient-orb');
        if (window.gsap && orbs.length > 0) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 80;
                const y = (e.clientY / window.innerHeight - 0.5) * 80;
                gsap.to(orbs[0], { x: x * -1, y: y * -1, duration: 2, ease: "power2.out" });
                if (orbs[1]) gsap.to(orbs[1], { x: x * 1.5, y: y * 1.5, duration: 2.5, ease: "power2.out" });
            });
        }

        // Initialize SplitType globally
        try {
            const splitElements = document.querySelectorAll('.split-text');
            if (typeof SplitType !== 'undefined' && splitElements.length > 0) {
                splitElements.forEach(text => { new SplitType(text, { types: 'lines, words, chars' }); });
            }
        } catch (e) {
            console.warn("SplitType issue:", e);
        }

        if (window.gsap && window.ScrollTrigger) {
            
            const heroVideo = document.querySelector('.hero-bg video');
            if (heroVideo) {
                gsap.to(heroVideo, {
                    yPercent: 30,
                    ease: "none",
                    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
                });
            }

            const aboutChars = document.querySelectorAll('.about .char, .content-block h2 .char');
            if (aboutChars.length > 0) {
                gsap.to(aboutChars, {
                    y: 0, stagger: 0.02, duration: 1.2, ease: "back.out(1.5)",
                    scrollTrigger: { trigger: ".about-container", start: "top 75%", scrub: false }
                });
            }

            const paragraphs = document.querySelectorAll('p.split-text .line');
            if(paragraphs.length > 0) {
                gsap.from(paragraphs, {
                    y: 20, opacity: 0, stagger: 0.05, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: paragraphs[0].closest('section'), start: "top 75%" }
                });
            }

            const dirWrapper = document.querySelector(".directory-wrapper");
            if (dirWrapper) {
                const dirAmountToScroll = dirWrapper.scrollWidth - window.innerWidth + (window.innerWidth * 0.2);
                let proxy = { skew: 0, rotationY: 0 };
                let skewSetter = gsap.quickSetter(".panel", "skewX", "deg");
                let rotSetter = gsap.quickSetter(".panel", "rotationY", "deg");
                let clamp = gsap.utils.clamp(-10, 10);

                ScrollTrigger.create({
                  onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -150);
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                      proxy.skew = skew;
                      gsap.to(proxy, {skew: 0, duration: 1.2, ease: "elastic.out(1, 0.5)", overwrite: true, onUpdate: () => {
                              skewSetter(proxy.skew);
                              rotSetter(proxy.skew * 1.5);
                          }
                      });
                    }
                  }
                });

                gsap.to(dirWrapper, {
                    x: -dirAmountToScroll, ease: "none",
                    scrollTrigger: { trigger: ".directory", start: "top top", end: "+=" + dirAmountToScroll, pin: true, scrub: 1 }
                });
            }

            const playonTl = gsap.timeline({ scrollTrigger: { trigger: ".playon", start: "top 70%", end: "top 20%", scrub: 1 } });
            playonTl.to(".playon-video-wrapper", { clipPath: "inset(0% 0% 0% 0% round 0px)", rotation: 2, scale: 1.05, filter: "contrast(1.3) saturate(1.5)", duration: 2, ease: "power2.out" })
            .to(".playon-media", { scale: 1.1, rotation: -2, duration: 2, ease: "power2.out" }, 0);
            
            // Retail Showcase Stagger
            const showcaseItems = document.querySelectorAll('.showcase-item');
            if (showcaseItems.length > 0) {
                gsap.fromTo(showcaseItems, 
                    { y: 50, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.5)", scrollTrigger: { trigger: ".retail-showcase", start: "top 70%" } }
                );
            }

            const playonChars = document.querySelectorAll(".playon-info h2 .char");
            if (playonChars.length > 0) {
                gsap.to(playonChars, { y: 0, stagger: 0.03, ease: "back.out(2)", duration: 1.2, scrollTrigger: { trigger: ".playon-info", start: "top 75%" } });
            }

            // Global Parallax Images Logic (used heavily in gallery.html)
            const parallaxImages = document.querySelectorAll('.parallax-media');
            parallaxImages.forEach(img => {
                const speed = img.getAttribute('data-speed') || 0.2;
                gsap.to(img, {
                    yPercent: speed * 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

        }

        const btn = document.querySelector(".magnetic-btn");
        if(btn) {
            btn.addEventListener("mousemove", function(e) {
                const position = btn.getBoundingClientRect();
                const x = e.pageX - position.left - position.width / 2;
                const y = e.pageY - position.top - position.height / 2;
                const span = btn.querySelector("span");
                if (window.gsap) {
                    gsap.to(btn, { x: x * 0.3, y: y * 0.5, duration: 0.4, ease: "power2.out" });
                    if(span) gsap.to(span, { x: x * 0.15, y: y * 0.25, duration: 0.4, ease: "power2.out" });
                }
            });
            btn.addEventListener("mouseleave", function() {
                const span = btn.querySelector("span");
                if (window.gsap) {
                    gsap.to([btn, span], { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1.2, 0.3)" });
                }
            });
        }

    } catch (error) {
        console.error("Critical error in main.js setup:", error);
        document.querySelector('.preloader').style.display = 'none';
        document.querySelector('body').classList.remove('loading');
    }
})();
