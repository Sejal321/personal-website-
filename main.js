/* ═══════════════════════════════════════════
   CATALYST — Page-Flip Magazine Engine
   ═══════════════════════════════════════════ */

const pages = [...document.querySelectorAll(".page")];
const totalPages = pages.length;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const ctrlPage = document.getElementById("ctrlPage");
const tocBtn = document.getElementById("tocBtn");
const tocClose = document.getElementById("tocClose");
const toc = document.getElementById("toc");
const year = document.getElementById("year");

if (year) year.textContent = "2026";

let currentPage = 0;
let flipping = false;

const pageLabels = ["Cover", "pg. 01", "pg. 02", "pg. 03", "pg. 04", "pg. 05", "pg. 06"];

// ═══════ Z-INDEX MANAGEMENT ═══════
// Pages stack like a real magazine: cover on top, last page at the bottom.
// As pages flip (rotateY -180deg), they move behind the remaining stack.

function updateStack() {
  pages.forEach((page, i) => {
    // Unflipped pages stack with the current page on top
    if (i < currentPage) {
      page.style.zIndex = i; // flipped pages go to the back
    } else {
      page.style.zIndex = totalPages - i; // unflipped pages: current is highest
    }
  });

  ctrlPage.textContent = pageLabels[currentPage] || `pg. ${String(currentPage).padStart(2, "0")}`;
  prevBtn.disabled = currentPage <= 0;
  nextBtn.disabled = currentPage >= totalPages - 1;
}

// ═══════ FLIP FORWARD ═══════
function flipForward() {
  if (flipping || currentPage >= totalPages - 1) return;
  flipping = true;

  const page = pages[currentPage];
  page.classList.add("flipped");

  currentPage++;
  updateStack();

  setTimeout(() => { flipping = false; }, 700);
}

// ═══════ FLIP BACKWARD ═══════
function flipBackward() {
  if (flipping || currentPage <= 0) return;
  flipping = true;

  currentPage--;
  const page = pages[currentPage];
  page.classList.remove("flipped");

  updateStack();

  setTimeout(() => { flipping = false; }, 700);
}

// ═══════ GO TO SPECIFIC PAGE ═══════
function goToPage(target) {
  if (flipping) return;
  target = Math.max(0, Math.min(target, totalPages - 1));
  if (target === currentPage) return;

  // Instantly set state without animation for big jumps
  pages.forEach((page, i) => {
    page.style.transition = "none";
    if (i < target) {
      page.classList.add("flipped");
    } else {
      page.classList.remove("flipped");
    }
  });

  currentPage = target;
  updateStack();

  // Re-enable transitions after a frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pages.forEach((page) => {
        page.style.transition = "";
      });
    });
  });
}

// ═══════ BUTTON HANDLERS ═══════
nextBtn.addEventListener("click", flipForward);
prevBtn.addEventListener("click", flipBackward);

// ═══════ KEYBOARD ═══════
document.addEventListener("keydown", (e) => {
  if (toc.classList.contains("open")) {
    if (e.key === "Escape") toc.classList.remove("open");
    return;
  }
  if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); flipForward(); }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); flipBackward(); }
});

// ═══════ CLICK ON MAGAZINE TO FLIP ═══════
document.getElementById("magazine").addEventListener("click", (e) => {
  // Don't flip if clicking a link or button
  if (e.target.closest("a, button")) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  if (clickX > rect.width * 0.5) {
    flipForward();
  } else {
    flipBackward();
  }
});

// ═══════ TABLE OF CONTENTS ═══════
tocBtn.addEventListener("click", () => toc.classList.add("open"));
tocClose.addEventListener("click", () => toc.classList.remove("open"));

toc.querySelectorAll("[data-goto]").forEach((link) => {
  link.addEventListener("click", () => {
    const target = parseInt(link.dataset.goto, 10);
    toc.classList.remove("open");
    setTimeout(() => goToPage(target), 300);
  });
});

document.addEventListener("click", (e) => {
  if (toc.classList.contains("open") && !toc.contains(e.target) && e.target !== tocBtn) {
    toc.classList.remove("open");
  }
});

// ═══════ INIT ═══════
updateStack();
