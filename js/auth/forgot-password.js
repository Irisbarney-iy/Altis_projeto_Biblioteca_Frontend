// cancelar temporario
document.addEventListener('DOMContentLoaded', () => {
    const btnCancelar = document.querySelector('.btn-cancelar');

    btnCancelar.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../../pages/auth/login.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const cpfInput = document.getElementById('cpf');
    const btnSalvar = document.querySelector('.btn-salvar');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.href = '../../pages/auth/change-password.html';
    });
});