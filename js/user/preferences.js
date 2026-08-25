document.addEventListener('DOMContentLoaded', () => {

    const loggedUser = JSON.parse(
        localStorage.getItem('loggedUser')
    );
    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return;
    }
    const languageSelect =
        document.getElementById('language-select');
    const savedLanguage =
        localStorage.getItem('language');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
    }
    languageSelect.addEventListener('change', () => {
        const selectedLanguage =
            languageSelect.value;
        localStorage.setItem(
            'language',
            selectedLanguage
        );
    });
});