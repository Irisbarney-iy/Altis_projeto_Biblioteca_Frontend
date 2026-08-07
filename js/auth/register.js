document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('.inputs-form');

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const cpf = document.getElementById('cpf').value;
        const nascimento = document.getElementById('data-nascimento').value;
        const endereco = document.getElementById('endereco').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if(senha !== confirmarSenha){
            alert('As senhas não são iguais')
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExistente = usuarios.find(user => user.email === email || user.cpf === cpf);

        if(usuarioExistente){
            alert('Esse usuário já existe')
            return;
        }

        const usuarioNovo = {nome, email, cpf, nascimento, endereco, senha};
        usuarios.push(usuarioNovo);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Cadastro feito')
        window.location.href = 'login.html';
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