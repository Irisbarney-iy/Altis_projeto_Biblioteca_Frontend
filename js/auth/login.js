// parte de verificação se o usuário existe
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inputs-form');

    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const rememberEmail = localStorage.getItem('rememberEmail');
    const rememberPassword = localStorage.getItem('rememberPassword');
    const remember = document.getElementById('remember');

    // verificador se existe localStorage
    if(rememberEmail && rememberPassword){
        inputEmail.value = localStorage.getItem('rememberEmail');
        inputPassword.value = localStorage.getItem('rememberPassword');
        remember.checked = true;
    }

    form.addEventListener('submit', (event)=>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(remember.checked){
            localStorage.setItem('rememberEmail', inputEmail.value);
            localStorage.setItem('rememberPassword', inputPassword.value);
        }else{
            localStorage.removeItem('rememberEmail');
            localStorage.removeItem('rememberPassword');
        }
        const adminEmail = 'admin@admin.com';
        const adminPassword = '12345678';
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if(adminEmail === email && adminPassword === password){
            const loggedAdmin = {email: adminEmail};
            localStorage.setItem('loggedUser', JSON.stringify(loggedAdmin));
            window.location.href = 'pages/admin/dashboard.html'
            return;
        }

        const loggedUser = users.find(user => user.email === email && user.password === password);

        if(loggedUser){
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            window.location.href = 'pages/user/dashboard.html'
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
        ocultIcon.src = 'assets/icons/visible.svg'
    } else{
        inputPassword.type = 'password'
        ocultIcon.src = 'assets/icons/Invisible.svg'
    }
});