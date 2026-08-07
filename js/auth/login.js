// parte de verificação se o usuário existe
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inputs-form');

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioLogado = usuarios.find(user => user.email === email && user.password === password);

        if(usuarioLogado){
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            window.location.href = '../admin/dashboard.html'
        }else{
            alert('Email ou senha incorretos!')
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