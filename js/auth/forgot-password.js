document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('.inputs-form');
    const btnCancelar = document.querySelector('.btn-cancelar');

    btnCancelar.addEventListener('click', ()=>{
        window.location.href = 'login.html';
    });

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const cpf = document.getElementById('cpf').value;
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioValido = usuarios.find(user => user.email === email && user.cpf === cpf);

        if(usuarioValido){
            localStorage.setItem('emailParaRecuperacao', email);
            window.location.href = 'change-password.html';
        }else {
            alert('Dados não válidos');
        }
    });
});