document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o Dashboard');
        window.location.href = '../auth/login.html';
        return; 
    }

    const btnLogout = document.querySelector('.btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../auth/login.html';
    });
});