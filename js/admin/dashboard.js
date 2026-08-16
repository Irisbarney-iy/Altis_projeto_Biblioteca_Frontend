document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o Dashboard');
        window.location.href = '../../index.html';
        return; 
    }

    const btnLogout = document.querySelector('.logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../../index.html';
    });

    // parte pra abrir o menu, o de opções
    const modal = document.getElementById('menu-modal-function');
    const configurations = document.querySelector('.configurations');
    configurations.addEventListener('click', () => {
        modal.classList.toggle('active');
    });
});