const themeSelector = document.getElementById('theme-selector');

// Function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

document.getElementById('light-theme-btn').addEventListener('click', function() {
  document.body.classList.remove('dark-theme');
});

document.getElementById('dark-theme-btn').addEventListener('click', function() {
  document.body.classList.add('dark-theme');
});


// Check and apply the saved theme from cookies on page load
const savedTheme = getCookie('theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
  themeSelector.value = savedTheme; // Set the dropdown to the saved theme
}
