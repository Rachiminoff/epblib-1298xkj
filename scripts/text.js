document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("textGrid");
  const searchInput = document.getElementById("searchInput");
  const mainTitle = document.getElementById("main-title");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.querySelector(".close");
  const sidebarItems = document.querySelectorAll("#sidebar li");

  let currentCategory = "All";

  function renderTexts() {
    grid.innerHTML = "";
    const search = searchInput.value.toLowerCase();
    const filtered = texts.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search);
      const matchesCategory = currentCategory === "All" || t.category === currentCategory;
      return matchesSearch && matchesCategory;
    });

    mainTitle.textContent = `Text Archive (${filtered.length})`;

    filtered.forEach(t => {
      const card = document.createElement("div");
      card.className = "textCard";
      card.textContent = t.title;
      card.addEventListener("click", () => {
        modalTitle.textContent = t.title;
        modalContent.textContent = t.content;
        modal.style.display = "flex";
      });
      grid.appendChild(card);
    });
  }

  searchInput.addEventListener("input", renderTexts);
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  sidebarItems.forEach(li => {
    li.addEventListener("click", () => {
      sidebarItems.forEach(i => i.classList.remove("active"));
      li.classList.add("active");
      currentCategory = li.dataset.category;
      renderTexts();
    });
  });

  renderTexts();
});
