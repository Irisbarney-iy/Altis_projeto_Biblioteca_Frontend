document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inputs-form');
    const btnCancel = document.querySelector('.btn-cancel');

    const recuperyEmailtoChange = localStorage.getItem('recuperyEmail');
    if (!recuperyEmailtoChange) {
        alert('Você precisa validar primeiro');
        window.location.href = 'forgot-password.html';
    }

    btnCancel.addEventListener('click', () => {
        localStorage.removeItem('recuperyEmail');
        window.location.href = '../../index.html';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const newPassword = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm-password').value;

        if (newPassword !== passwordConfirm) {
            alert('As senhas são diferentes');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(user => user.email === recuperyEmailtoChange);

        if (index !== -1) {
            users[index].password = newPassword;
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem('recuperyEmail');

            alert('Senha alterada');
            window.location.href = '../../index.html';
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
        ocultIcon.src = '../../assets/icons/Invisible.svg'
    } else{
        inputPassword.type = 'password'
        ocultIcon.src = '../../assets/icons/visible.svg'
    }
});

const inputPasswordConfirm = document.getElementById('confirm-password');
const ocultConfirm = document.getElementById('ocult-button-functional-confirm');
const ocultIconConfirm = document.getElementById('ocult-icon-image-confirm');

ocultConfirm.addEventListener('click', ()=>{
    if(inputPasswordConfirm.type === 'password'){
        inputPasswordConfirm.type = 'text'
        ocultIconConfirm.src = '../../assets/icons/Invisible.svg'
    } else{
        inputPasswordConfirm.type = 'password'
        ocultIconConfirm.src = '../../assets/icons/visible.svg'
    }
});