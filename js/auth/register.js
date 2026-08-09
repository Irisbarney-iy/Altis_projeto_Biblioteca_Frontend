document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('.inputs-form');

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cpf = document.getElementById('cpf').value;
        const birth = document.getElementById('date-birth').value;
        const address = document.getElementById('address').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm-password').value;

        if(password !== passwordConfirm){
            alert('As senhas não são iguais')
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const trueUser = users.find(user => user.email === email || user.cpf === cpf);

        if(trueUser){
            alert('Esse usuário já existe')
            return;
        }

        const newUser = {name, email, cpf, birth, address, password};
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro feito')
        window.location.href = '../../index.html';
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