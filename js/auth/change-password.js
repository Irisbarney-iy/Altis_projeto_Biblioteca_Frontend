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

// parte do botão de ocultar e mostrar as informações
const inputPassword = document.getElementById('password');
const ocult = document.getElementById('ocult-button-functional');
const ocultIcon = document.getElementById('ocult-icon-image');

ocult.addEventListener('click', ()=>{
    if(inputPassword.type === 'password'){
        inputPassword.type = 'text'
        ocultIcon.src = '../../assets/icons/visible.svg'
    } else{
        inputPassword.type = 'password'
        ocultIcon.src = '../../assets/icons/invisible.svg'
    }
});

const inputPasswordConfirm = document.getElementById('confirm-password');
const ocultConfirm = document.getElementById('ocult-button-functional-confirm');
const ocultIconConfirm = document.getElementById('ocult-icon-image-confirm');

ocultConfirm.addEventListener('click', ()=>{
    if(inputPasswordConfirm.type === 'password'){
        inputPasswordConfirm.type = 'text'
        ocultIconConfirm.src = '../../assets/icons/visible.svg'
    } else{
        inputPasswordConfirm.type = 'password'
        ocultIconConfirm.src = '../../assets/icons/invisible.svg'
    }
});