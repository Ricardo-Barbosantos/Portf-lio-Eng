/* ==============================
   NAVBAR SCROLL EFFECT
============================== */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  },
  { passive: true },
);

/* ==============================
   MOBILE MENU
============================== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

/* ==============================
   LAZY LOAD VÍDEOS — CLICK TO PLAY
   Vídeos do Google Drive só carregam
   quando o usuário clica no play.
   Página abre INSTANTÂNEA.
============================== */
document.querySelectorAll(".video-placeholder[data-src]").forEach((placeholder) => {
  const src = placeholder.dataset.src;
  if (!src || src.includes("ID_DO_VIDEO")) return; // ID ainda não definido

  placeholder.addEventListener("click", () => {
    const wrapper = placeholder.parentElement;

    // Spinner enquanto o iframe carrega
    placeholder.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;color:var(--accent);">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="animation:spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
        </svg>
        <span style="font-size:.8rem;font-weight:600;color:var(--text-muted)">Carregando…</span>
      </div>`;

    // Cria o iframe apenas agora (lazy)
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.allow = "autoplay; encrypted-media; fullscreen";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.style.cssText = "width:100%;height:100%;border:none;display:block;";

    iframe.onload = () => {
      placeholder.remove();
    };

    wrapper.appendChild(iframe);
  }, { once: true });
});

// Animação do spinner
if (!document.getElementById("spin-style")) {
  const s = document.createElement("style");
  s.id = "spin-style";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

/* ==============================
   SCROLL REVEAL
============================== */
const revealEls = document.querySelectorAll(
  ".creative-card, .experience-card, .tool-card, .contact-card, .result-highlight, .result-photo-card, .section-title, .section-sub, .section-label, .more-work-text, .btn-large",
);

revealEls.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ==============================
   STAGGER ANIMATION FOR GRIDS
============================== */
const grids = document.querySelectorAll(
  ".creatives-grid, .tools-grid, .contact-cards, .results-photo-grid",
);
grids.forEach((grid) => {
  const children = grid.querySelectorAll(
    ".creative-card, .tool-card, .contact-card, .result-photo-card",
  );
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ==============================
   SMOOTH ANCHOR SCROLL
============================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ==============================
   CAROUSEL LOGIC
============================== */
const resultGrid = document.getElementById("resultsCarousel");
const dotsArr = document.querySelectorAll(".dot");

if (resultGrid) {
  const updateDots = () => {
    const scrollLeft = resultGrid.scrollLeft;
    const itemWidth = resultGrid.querySelector("img").offsetWidth + 12; // width + gap
    const index = Math.round(scrollLeft / itemWidth);
    dotsArr.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  resultGrid.addEventListener("scroll", updateDots);

  // Auto-scroll logic deleted for cleaner experience as per "remove setinhas" request
}

/* ==============================
   LIGHTBOX
============================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");

if (resultGrid && lightbox && lightboxImg) {
  const allResultImgs = resultGrid.querySelectorAll("img");

  allResultImgs.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.classList.remove("zoomed"); // Reset zoom on open
      lightbox.style.display = "flex";
      lightbox.scrollTop = 0; // Reset scroll
    });
  });

  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();
    lightboxImg.classList.toggle("zoomed");
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.classList.remove("zoomed");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.style.display = "none";
  });
}
