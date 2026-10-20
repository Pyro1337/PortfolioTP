/* ============================================================
   Portfolio — Iván Alfredo Sanchez Rojas
   Lenis + GSAP/ScrollTrigger (degradan sin JS: todo visible)
   ============================================================ */

(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasGSAP = typeof window.gsap !== "undefined";
    var hasST = typeof window.ScrollTrigger !== "undefined";

    /* ---------- Lenis: scroll suave ---------- */
    var lenis = null;
    if (!reduceMotion && typeof window.Lenis !== "undefined") {
        try {
            lenis = new Lenis({
                duration: 1.1,
                easing: function (t) {
                    return Math.min(1, 1.001 - Math.pow(2, -10 * t));
                },
                smoothWheel: true
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            if (hasGSAP && hasST) {
                lenis.on("scroll", ScrollTrigger.update);
            }
        } catch (e) {
            lenis = null;
        }
    }

    /* ---------- Header: estado al scrollear ---------- */
    var header = document.getElementById("siteHeader");
    var lastState = false;

    function onScrollHeader() {
        if (!header) return;
        var scrolled = window.scrollY > 40;
        if (scrolled !== lastState) {
            header.classList.toggle("is-scrolled", scrolled);
            lastState = scrolled;
        }
    }
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Menú móvil ---------- */
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("siteNav");

    function closeNav() {
        if (!toggle || !nav) return;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = toggle.getAttribute("aria-expanded") === "true";
            if (open) {
                closeNav();
            } else {
                toggle.setAttribute("aria-expanded", "true");
                toggle.setAttribute("aria-label", "Cerrar menú");
                nav.classList.add("is-open");
                document.body.style.overflow = "hidden";
            }
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeNav);
        });
    }

    /* ---------- Anclas suaves (via Lenis si existe) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var id = anchor.getAttribute("href");
            if (!id || id === "#") return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -70, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
            }
            history.replaceState(null, "", id);
        });
    });

    /* ---------- Fondo reactivo al ratón ---------- */
    var backdrop = document.querySelector(".backdrop");
    if (backdrop && !reduceMotion) {
        var pending = false;
        var mx = 0, my = 0;

        window.addEventListener("mousemove", function (e) {
            mx = (e.clientX / window.innerWidth) * 100;
            my = (e.clientY / window.innerHeight) * 100;
            if (!pending) {
                pending = true;
                requestAnimationFrame(function () {
                    backdrop.style.setProperty("--mx", mx + "%");
                    backdrop.style.setProperty("--my", my + "%");
                    pending = false;
                });
            }
        }, { passive: true });
    }

    /* ---------- Revelados al entrar en viewport ---------- */
    var reveals = document.querySelectorAll(".reveal");

    if (reduceMotion || !hasGSAP || !hasST) {
        // Sin animación: el contenido ya es visible por defecto.
        return;
    }

    // Solo ahora (con animaciones garantizadas) se ocultan para revelar.
    document.documentElement.classList.add("js");
    gsap.registerPlugin(ScrollTrigger);

    reveals.forEach(function (el) {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true
            }
        });
    });

    /* ---------- Entrada del hero ---------- */
    if (!reduceMotion) {
        var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
            .from(".hero .overline", { opacity: 0, y: 24, duration: 0.7 }, 0.15)
            .from(".hero__title", { opacity: 0, y: 40, duration: 0.95 }, 0.28)
            .from(".hero__lead", { opacity: 0, y: 26, duration: 0.8 }, 0.48)
            .from(".hero__actions .btn", { opacity: 0, y: 22, duration: 0.7, stagger: 0.1 }, 0.62)
            .from(".hero__stats .stat", { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, 0.78);
    }

    /* ---------- Contadores ---------- */
    var counters = document.querySelectorAll("[data-count]");

    counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var suffix = el.getAttribute("data-suffix") || "";

        if (reduceMotion || !hasST) {
            el.textContent = target.toFixed(decimals) + suffix;
            return;
        }

        var obj = { v: 0 };
        ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: function () {
                gsap.to(obj, {
                    v: target,
                    duration: 1.6,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = obj.v.toFixed(decimals) + suffix;
                    }
                });
            }
        });
    });

    /* ---------- Refresco seguro ---------- */
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });
})();
