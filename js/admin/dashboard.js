document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Você precisa fazer login para acessar o Dashboard');
        window.location.href = '../auth/login.html';
        return; 
    }

    const btnLogout = document.querySelector('.btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = '../auth/login.html';
    });
});