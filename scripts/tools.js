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
