document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.querySelector('.btn-logout');

    btnLogout.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../auth/login.html';
    });
});