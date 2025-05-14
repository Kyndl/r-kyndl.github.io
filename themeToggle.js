    // === THEME TOGGLER ===
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    window.toggleTheme = function () {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    };