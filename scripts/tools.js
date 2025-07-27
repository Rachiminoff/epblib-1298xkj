// === Discount Calculator Modal Logic ===
const openDiscountBtn = document.getElementById('openDiscountModal');
const closeDiscountBtn = document.getElementById('closeDiscountModal');
const discountModal = document.getElementById('discountModal');
const discountForm = document.getElementById('discountForm');
const resultBox = document.getElementById('resultBox');
const amountSaved = document.getElementById('amountSaved');
const finalPrice = document.getElementById('finalPrice');

openDiscountBtn.addEventListener('click', () => {
  discountModal.classList.add('show');
  discountModal.setAttribute('aria-hidden', 'false');
  discountForm.reset();
  resultBox.style.display = 'none';
  document.getElementById('originalPrice').focus();
});

closeDiscountBtn.addEventListener('click', () => {
  discountModal.classList.remove('show');
  discountModal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', e => {
  if (e.target === discountModal) {
    discountModal.classList.remove('show');
    discountModal.setAttribute('aria-hidden', 'true');
  }
});

discountForm.addEventListener('submit', e => {
  e.preventDefault();

  const original = parseFloat(document.getElementById('originalPrice').value);
  const discount = parseFloat(document.getElementById('discountPercent').value);

  if (isNaN(original) || isNaN(discount) || original < 0 || discount < 0 || discount > 100) {
    alert("Please enter valid positive numbers (0-100 for discount).");
    return;
  }

  const saved = (original * (discount / 100)).toFixed(2);
  const final = (original - saved).toFixed(2);

  amountSaved.textContent = `₱${saved}`;
  finalPrice.textContent = `₱${final}`;
  resultBox.style.display = 'block';
});

// === Password Generator Modal Logic ===
const openPasswordBtn = document.getElementById('openPasswordModal');
const passwordModal = document.getElementById('modalPassword');
const passwordCloseBtn = passwordModal.querySelector('.close-btn');

const passLengthInput = document.getElementById('passLength');
const includeLowercase = document.getElementById('includeLowercase');
const includeUppercase = document.getElementById('includeUppercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const generatePasswordBtn = document.getElementById('generatePassword');
const passwordResult = document.getElementById('passwordResult');

openPasswordBtn.addEventListener('click', () => {
  passwordModal.classList.add('show');
  passwordModal.setAttribute('aria-hidden', 'false');
  passwordResult.textContent = '';
});

passwordCloseBtn.addEventListener('click', () => {
  passwordModal.classList.remove('show');
  passwordModal.setAttribute('aria-hidden', 'true');
  passwordResult.textContent = '';
});

window.addEventListener('click', e => {
  if (e.target === passwordModal) {
    passwordModal.classList.remove('show');
    passwordModal.setAttribute('aria-hidden', 'true');
    passwordResult.textContent = '';
  }
});

function generatePassword(length, options) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{}|;:",.<>?/`~';

  let chars = '';
  if (options.lowercase) chars += lowercase;
  if (options.uppercase) chars += uppercase;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  if (chars.length === 0) return '';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

generatePasswordBtn.addEventListener('click', e => {
  e.preventDefault();

  const length = parseInt(passLengthInput.value, 10);
  if (isNaN(length) || length < 4 || length > 64) {
    alert('Please enter a length between 4 and 64.');
    return;
  }

  const options = {
    lowercase: includeLowercase.checked,
    uppercase: includeUppercase.checked,
    numbers: includeNumbers.checked,
    symbols: includeSymbols.checked,
  };

  const pwd = generatePassword(length, options);
  if (pwd === '') {
    alert('Please select at least one character type.');
    return;
  }

  passwordResult.textContent = pwd;
  passwordResult.focus();
});

// === Markdown Previewer logic ===
const markdownInput = document.getElementById('markdownInput');
const markdownPreview = document.getElementById('markdownPreview');
const markdownModal = document.getElementById('markdownModal');
const openMarkdownBtn = document.getElementById('openMarkdownModal');
const markdownCloseBtn = markdownModal.querySelector('.close-btn');

openMarkdownBtn.addEventListener('click', () => {
  markdownModal.classList.add('show');
  markdownModal.setAttribute('aria-hidden', 'false');
  markdownInput.value = '';
  markdownPreview.innerHTML = '';
  markdownInput.focus();
});

markdownCloseBtn.addEventListener('click', () => {
  markdownModal.classList.remove('show');
  markdownModal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', e => {
  if (e.target === markdownModal) {
    markdownModal.classList.remove('show');
    markdownModal.setAttribute('aria-hidden', 'true');
  }
});

// Load marked library from CDN and set up live preview
function loadMarked(callback) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  script.onload = callback;
  document.head.appendChild(script);
}

loadMarked(() => {
  markdownInput.addEventListener('input', () => {
    const markdownText = markdownInput.value;
    markdownPreview.innerHTML = marked.parse(markdownText);
  });
});

//Diary
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("diaryModal");
  const openBtn = document.getElementById("openDiaryModal");
  const closeBtn = document.getElementById("closeDiaryModal");
  const diaryTextarea = document.getElementById("diaryText");
  const diaryDateInput = document.getElementById("diaryDate");
  const saveBtn = document.getElementById("saveDiary");
  const deleteBtn = document.getElementById("deleteDiary");
  const exportBtn = document.getElementById("exportDiaryBtn");

  // Open modal and initialize
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    // Default date: today
    if (!diaryDateInput.value) {
      diaryDateInput.valueAsDate = new Date();
    }
    loadEntry(diaryDateInput.value);
    diaryDateInput.focus();
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });

  // Load entry when date changes
  diaryDateInput.addEventListener("change", () => {
    loadEntry(diaryDateInput.value);
  });

  // Load entry from localStorage for a given date (YYYY-MM-DD)
  function loadEntry(date) {
    if (!date) {
      diaryTextarea.value = "";
      return;
    }
    const entry = localStorage.getItem("diary_" + date);
    diaryTextarea.value = entry || "";
  }

  // Save current entry under selected date
  saveBtn.addEventListener("click", () => {
    const date = diaryDateInput.value;
    if (!date) {
      alert("Please select a date.");
      return;
    }
    const content = diaryTextarea.value.trim();
    if (!content) {
      alert("Cannot save an empty entry.");
      return;
    }
    localStorage.setItem("diary_" + date, content);
    alert(`Entry saved for ${date}.`);
  });

  // Delete entry for selected date
  deleteBtn.addEventListener("click", () => {
    const date = diaryDateInput.value;
    if (!date) {
      alert("Please select a date.");
      return;
    }
    if (localStorage.getItem("diary_" + date) === null) {
      alert("No entry found to delete for this date.");
      return;
    }
    if (confirm(`Delete entry for ${date}? This cannot be undone.`)) {
      localStorage.removeItem("diary_" + date);
      diaryTextarea.value = "";
      alert("Entry deleted.");
    }
  });

  // Export all diary entries
  exportBtn.addEventListener("click", () => {
    const format = prompt("Export format? Enter 'json' or 'csv':", "json");
    if (format === "json" || format === "csv") {
      exportEntries(format);
    } else {
      alert("Invalid format. Please enter 'json' or 'csv'.");
    }
  });

  function exportEntries(format) {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("diary_")) {
        const date = key.slice(6);
        const content = localStorage.getItem(key);
        entries.push({ date, content });
      }
    }

    if (entries.length === 0) {
      alert("No diary entries to export.");
      return;
    }

    // Sort by date ascending
    entries.sort((a, b) => a.date.localeCompare(b.date));

    if (format === "json") {
      const jsonStr = JSON.stringify(entries, null, 2);
      downloadFile("diary_entries.json", "application/json", jsonStr);
    } else if (format === "csv") {
      let csv = "Date,Content\n";
      entries.forEach(({ date, content }) => {
        // Escape quotes for CSV
        const safeContent = `"${content.replace(/"/g, '""')}"`;
        csv += `${date},${safeContent}\n`;
      });
      downloadFile("diary_entries.csv", "text/csv", csv);
    }
  }

  function downloadFile(filename, mimeType, content) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
});

//converter
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("convertModal");
  const openBtn = document.getElementById("openConvertModal");
  const closeBtn = document.getElementById("closeConvertModal");
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const status = document.getElementById("status");

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // Close if clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Enable convert button when file selected
  fileInput.addEventListener("change", () => {
    convertBtn.disabled = !fileInput.files.length;
    status.textContent = "";
  });

  // Convert to PDF
  convertBtn.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();

    reader.onload = () => {
      try {
        let rows = [];

        if (ext === "json") {
          const json = JSON.parse(reader.result);

          if (!Array.isArray(json)) throw new Error("JSON must be an array.");
          if (json.length === 0) throw new Error("JSON array is empty.");

          const headers = Object.keys(json[0]);
          rows.push(headers);

          json.forEach(obj => {
            const row = headers.map(key => String(obj[key] ?? ""));
            rows.push(row);
          });

        } else if (ext === "csv" || ext === "txt") {
          rows = parseCSV(reader.result);
        } else {
          throw new Error("Unsupported file format.");
        }

        generatePDF(rows, file.name);
        status.textContent = "✅ PDF generated.";
      } catch (err) {
        status.textContent = "❌ Error: " + err.message;
      }
    };

    reader.onerror = () => {
      status.textContent = "❌ Failed to read file.";
    };

    reader.readAsText(file);
  });

  function closeModal() {
    modal.style.display = "none";
    fileInput.value = "";
    convertBtn.disabled = true;
    status.textContent = "";
  }

  function parseCSV(text) {
    const lines = text.trim().split("\n");
    return lines.map(line =>
      line
        .split(",")
        .map(cell => cell.replace(/^"|"$/g, "").trim())
    );
  }

  function generatePDF(rows, filename) {
    const doc = new window.jspdf.jsPDF("p", "pt");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const colCount = rows[0].length;
    const colWidth = (pageWidth - 2 * margin) / colCount;

    doc.setFontSize(10);
    let y = margin;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!Array.isArray(row)) {
        throw new Error(`Row ${i + 1} is not a valid array.`);
      }

      // Wrap each cell's content
      const wrappedCells = row.map(cell => doc.splitTextToSize(String(cell), colWidth));
      const maxLines = Math.max(...wrappedCells.map(cell => cell.length));
      const rowHeight = maxLines * 14; // approx line height

      // Page break if needed
      if (y + rowHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Draw text
      for (let j = 0; j < wrappedCells.length; j++) {
        const x = margin + j * colWidth;
        doc.text(wrappedCells[j], x, y);
      }

      y += rowHeight;
    }

    const safeName = filename.replace(/\.[^/.]+$/, "") + ".pdf";
    doc.save(safeName);
  }
});