document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inputs-form');

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioLogado = usuarios.find(user => user.email === email && user.senha === senha);

        if(usuarioLogado){
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            window.location.href = '../admin/dashboard.html'
        }else{
            alert('Email ou senha incorretos!')
        }
    });
});

// botão de ocultar e ver a senha (Vou ajustar depois, porque fica quebrado e acabei aprendendo num vídeo)
let eyeIcon = document.querySelector('.fa-eye');

eyeIcon.addEventListener('click', ()=>{
    let inputSenha = document.querySelector('#senha')

    if(inputSenha.getAttribute('type') == 'password'){
        inputSenha.setAttribute('type', 'text');
    } else{
        inputSenha.setAttribute('type', 'password');
    }
});

