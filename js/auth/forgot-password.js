document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('.inputs-form');
    const btnCancelar = document.querySelector('.btn-cancel');

    btnCancelar.addEventListener('click', ()=>{
        window.location.href = '../../index.html';
    });

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const cpf = document.getElementById('cpf').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const validUser = users.find(user => user.email === email && user.cpf === cpf);

        if(validUser){
            localStorage.setItem('recuperyEmail', email);
            window.location.href = 'change-password.html';
        }else {
            alert('Dados não válidos');
        }
    });
});

// parte de máscara de cpf
const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
    cpf = cpfInput.value.replace(/\D/g, '');

    if(cpf.length > 11){
        cpf = cpf.slice(0, 11);
    }
    else if(cpf.length >= 10){
        cpf = cpf.slice(0, 3) + '.' +
        cpf.slice(3, 6) + '.' +
        cpf.slice(6, 9) + '-' +
        cpf.slice(9, 11);
    }
    else if(cpf.length >= 7){
        cpf = cpf.slice(0, 3) + '.' +
        cpf.slice(3, 6) + '.' +
        cpf.slice(6);
    }
    else if(cpf.length >= 4){
        cpf = cpf.slice(0, 3) + '.' +
        cpf.slice(3);
    }

    cpfInput.value = cpf;
});