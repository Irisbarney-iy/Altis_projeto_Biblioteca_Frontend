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

    // toda a parte do menu funcionau, o lateral
    const content = document.getElementById('content-function');
    const menuOcult = document.getElementById('menu-function');
    const returnIcon = document.getElementById('return-icon-function');
    const menuOcultClick = document.querySelector('.back-icon');
    menuOcultClick.addEventListener('click', () => {
        menuOcult.classList.add('active');
        returnIcon.classList.add('visible');
        content.classList.add('menu-hidden');
    })

    const menuVisibleClick = document.querySelector('.main-title');
    menuVisibleClick.addEventListener('click', () => {
        returnIcon.classList.remove('visible');
        menuOcult.classList.remove('active');
        content.classList.remove('menu-hidden')
    })
});