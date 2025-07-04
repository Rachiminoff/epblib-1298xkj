// Assuming `books` is already defined globally (from books.js)
const storedBooks = JSON.parse(localStorage.getItem("customBooks") || "[]");

// Combine the original books with stored books from localStorage
let allBooks = [...books, ...storedBooks];

const grid = document.getElementById("bookGrid");
const sidebar = document.getElementById("sidebar");
const mainTitle = document.getElementById("main-title");
const searchInput = document.getElementById("searchInput");

let currentCategory = "All";

function renderBooks(filter = "All", searchTerm = "") {
  grid.innerHTML = "";

  // Filter by category or show all
  let filtered = filter === "All"
    ? allBooks
    : allBooks.filter(book => book.category === filter);

  // Filter by search term (case-insensitive)
  if (searchTerm.trim() !== "") {
    const term = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(term) ||
      (book.description && book.description.toLowerCase().includes(term))
    );
  }

  // Sort alphabetically by title
  filtered.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

  // Update main title with count
  mainTitle.textContent =
    filter !== "All"
      ? `${filter} (${filtered.length})`
      : `Book Archive (${filtered.length})`;

  // Render each book
  filtered.forEach(book => {
    const el = document.createElement("div");
    el.className = "book";
    el.innerHTML = `
      <img src="${book.cover}" alt="${book.title} cover" />
      <h3>${book.title}</h3>
      <div class="links">
        ${book.epub ? `<a href="${book.epub}" target="_blank" onclick="event.stopPropagation()">EPUB</a>` : ""}
        ${book.pdf ? `<a href="${book.pdf}" target="_blank" onclick="event.stopPropagation()">PDF</a>` : ""}
      </div>
    `;
    el.addEventListener("click", () => openModal(book));
    grid.appendChild(el);
  });
}

// Sidebar category clicks
sidebar.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => {
    sidebar.querySelectorAll("li").forEach(x => x.classList.remove("active"));
    li.classList.add("active");
    currentCategory = li.dataset.category;
    renderBooks(currentCategory, searchInput.value);
  });
});

// Search input handler
searchInput.addEventListener("input", () => {
  renderBooks(currentCategory, searchInput.value);
});

// Modal elements
const modal = document.getElementById("modal");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLinks = document.querySelector(".modal-links");
const closeBtn = document.querySelector(".close");

// Open modal with book details
function openModal(book) {
  modalCover.src = book.cover;
  modalCover.alt = `${book.title} cover`;
  modalTitle.textContent = book.title;
  modalDescription.innerHTML = (book.description || "").replace(/\n/g, "<br>");
  modalLinks.innerHTML = "";

  if (book.epub) {
    const epubLink = document.createElement("a");
    epubLink.href = book.epub;
    epubLink.target = "_blank";
    epubLink.textContent = "EPUB";
    modalLinks.appendChild(epubLink);
  }
  if (book.pdf) {
    const pdfLink = document.createElement("a");
    pdfLink.href = book.pdf;
    pdfLink.target = "_blank";
    pdfLink.textContent = "PDF";
    modalLinks.appendChild(pdfLink);
  }

  modal.style.display = "block";
}

// Close modal on X click
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal clicking outside content
window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Initial render
renderBooks("All", "");
