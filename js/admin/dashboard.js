document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return; 
    }

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const dashboardTable = document.getElementById('dashboard-table');
    const totalBooks = document.getElementById('total-books');
    const activeRentals = document.getElementById('active-rentals');
    const monthlyRentals = document.getElementById('monthly-rentals');
    const criticalAlerts = document.getElementById('critical-alerts');

    function isLate(rental) {
        if (rental.returnDate) {
            return false;
        }

        const today = new Date();
        const dueDate = new Date(`${rental.dueDate}T00:00:00`);

        today.setHours(0, 0, 0, 0);

        return dueDate < today;
    }

    function updateCards() {
        const totalBooksCount = books.reduce((total, book) => {
            return total + book.totalStock;
        }, 0);

        totalBooks.textContent = totalBooksCount;

        const activeRentalsCount = rentals.filter((rental) => {
            return !rental.returnDate;
        });
        activeRentals.textContent = activeRentalsCount.length;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const monthlyRentalsCount = rentals.filter((rental) => {
            const rentalDate = new Date(
                `${rental.rentalDate}T00:00:00`
            );
            return (
                rentalDate.getMonth() === currentMonth &&
                rentalDate.getFullYear() === currentYear
            );
        });
        monthlyRentals.textContent = monthlyRentalsCount.length;

        const lateRentals = rentals.filter((rental) => {
            return isLate(rental);
        });
        criticalAlerts.textContent = lateRentals.length;
    }

    function renderDashboard() {
        dashboardTable.innerHTML = '';

        const lateRentals = rentals
            .filter((rental) => {
                return isLate(rental);
            })
            .sort((a, b) => {
                const dueDateA = new Date(
                    `${a.dueDate}T00:00:00`
                );
                const dueDateB = new Date(
                    `${b.dueDate}T00:00:00`
                );
                return dueDateA - dueDateB;
            })
            .slice(0, 5);

        if (lateRentals.length === 0) {
            dashboardTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhum empréstimo em atraso
                    </td>
                </tr>
            `;
            return;
        }

        lateRentals.forEach((rental) => {
            const row = document.createElement('tr');

            const dueDate = new Date(
                `${rental.dueDate}T00:00:00`
            );
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const difference =
                today.getTime() - dueDate.getTime();
            const lateDays = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );
            row.innerHTML = `
                <td>${rental.renter || '-'}</td>
                <td>${rental.book || '-'}</td>
                <td>${rental.rentalDate || '-'}</td>
                <td>${rental.dueDate || '-'}</td>
                <td>${rental.returnDate || '-'}</td>
                <td>
                    <span class="dashboard-status late">
                        Atrasado (${lateDays} dias)
                    </span>
                </td>
                <td>-</td>
            `;
            dashboardTable.appendChild(row);
        });
    }
    updateCards();
    renderDashboard();

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
    const content = document.getElementById('content-function');
    const menuOcult = document.getElementById('menu-function');
    const returnIcon = document.getElementById('return-icon-function');
    const menuOcultClick = document.querySelector('.back-icon');

    menuOcultClick.addEventListener('click', () => {
        menuOcult.classList.add('active');
        returnIcon.classList.add('visible');
        content.classList.add('menu-hidden');
    });

    const menuVisibleClick = document.querySelector('.main-title');
    menuVisibleClick.addEventListener('click', () => {
        returnIcon.classList.remove('visible');
        menuOcult.classList.remove('active');
        content.classList.remove('menu-hidden');
    });
});