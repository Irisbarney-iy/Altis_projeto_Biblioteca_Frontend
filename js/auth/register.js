document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('.inputs-form');

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cpf = document.getElementById('cpf').value;
        const phone = document.getElementById('phone').value;
        const birth = document.getElementById('date-birth').value;
        const address = document.getElementById('address').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm-password').value;

        if(password !== passwordConfirm){
            alert('As senhas não são iguais')
            return;
        }
 
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const trueUser = users.find(user => user.email === email || user.cpf === cpf || user.phone === phone);

        if(trueUser){
            alert('Esse usuário já existe')
            return;
        }

        const newUser = {name, email, cpf, phone, birth, address, password};
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro feito')
        window.location.href = '../../index.html';
    });
});


// parte de máscara do cpf
const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
    let cpf = cpfInput.value.replace(/\D/g, '');

    if(cpf.length > 11){
        cpf.slice(0, 11);
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

// máscara do telefone
const phoneInput = document.getElementById('phone');
phoneInput.value = '(85) 9 ';

phoneInput.addEventListener('input', () => {
    let phone = phoneInput.value.replace(/\D/g, '');

    phone = phone.slice(0, 11);
    let phoneNumber = phone.slice(3);

    if(phoneNumber.length >= 5){
        phoneNumber = phoneNumber.slice(0, 4) + '-' + phoneNumber.slice(4);
    }

    phoneInput.value = '(85) 9 ' + phoneNumber;
})

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
        ocultIcon.src = '../../assets/icons/Invisible.svg'
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
        ocultIconConfirm.src = '../../assets/icons/Invisible.svg'
    }
});