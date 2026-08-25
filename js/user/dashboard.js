document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o Dashboard');
        window.location.href = '../../index.html';
        return;
    }

    const userName = document.getElementById('user-name');
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    userName.textContent = loggedUser.name;

    const userRentals = rentals.filter((rental) => {
        return rental.renterId === loggedUser.id;
    });

    const activeRentals = userRentals.filter((rental) => {
        return !rental.returnDate;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lateRentals = activeRentals.filter((rental) => {
        const dueDate = new Date(`${rental.dueDate}T00:00:00`);

        return dueDate < today;
    });

    const returnedRentals = userRentals.filter((rental) => {
        return rental.returnDate;
    });

    document.getElementById('active-rentals').textContent = activeRentals.length;

    document.getElementById('late-rentals').textContent = lateRentals.length;

    document.getElementById('total-rentals').textContent = returnedRentals.length;

    document.getElementById('my-books').textContent = activeRentals.length;

    const btnLogout = document.querySelector('.logout');

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../../index.html';
    });

    const modal = document.getElementById('menu-modal-function');
    const configurations = document.querySelector('.configurations');
    const preferences = document.querySelector('.preferences');

    configurations.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    preferences.addEventListener('click', () => {
        window.location.href = 'preferences.html';
    });
});