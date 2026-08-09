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