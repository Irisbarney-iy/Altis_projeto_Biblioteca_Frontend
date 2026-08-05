document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inputs-form');
    const btnCancelar = document.querySelector('.btn-cancelar');

    const emailRecuperacao = localStorage.getItem('emailParaRecuperacao');
    if (!emailRecuperacao) {
        alert('Você precisa validar primeiro');
        window.location.href = 'forgot-password.html';
    }

    btnCancelar.addEventListener('click', () => {
        localStorage.removeItem('emailParaRecuperacao');
        window.location.href = 'login.html';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const novaSenha = document.getElementById('password').value;
        const confirmarNovaSenha = document.getElementById('confirm-password').value;

        if (novaSenha !== confirmarNovaSenha) {
            alert('As senhas são diferentes');
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const index = usuarios.findIndex(user => user.email === emailRecuperacao);

        if (index !== -1) {
            usuarios[index].senha = novaSenha;
            
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            localStorage.removeItem('emailParaRecuperacao');

            alert('Senha alterada');
            window.location.href = 'login.html';
        }
    });
});