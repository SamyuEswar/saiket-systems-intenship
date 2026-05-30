// Pixabay Clone JS

const searchInput = document.getElementById('search-input');
const searchContainer = document.getElementById('search-container');
const tabs = document.querySelectorAll('.nav-tabs button');

// Focus effect for search bar
searchInput.addEventListener('focus', () => {
  searchContainer.classList.add('focused');
});

searchInput.addEventListener('blur', () => {
  searchContainer.classList.remove('focused');
});

// Simulate typing effect on load
const placeholderTexts = [
  "Search for all images on Pixabay",
  "Try 'backgrounds'",
  "Try 'nature wallpapers'",
  "Try 'office'"
];

let idx = 0;
setInterval(() => {
  idx = (idx + 1) % placeholderTexts.length;
  searchInput.setAttribute('placeholder', placeholderTexts[idx]);
}, 3000);

// Filter tab active state
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
