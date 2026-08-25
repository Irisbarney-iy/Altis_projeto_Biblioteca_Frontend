document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return; 
    }

    const rentalsTable = document.getElementById('rentals-table');
    const searchInput = document.getElementById('search-input-function');
    const rentalsPerPage = 8;
    let nowPage = 1;
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    let rentalsView = [...rentals];

    function renderRentals(rentalsView) {
        rentalsTable.innerHTML = '';
        rentalsView.forEach((rental) => {
            const row = document.createElement('tr');

            let statusClass = '';
            let statusText = '';

            switch (rental.status) {
                case 'del-in-time':
                    statusClass = 'del-in-time';
                    statusText = 'Entregue no prazo';
                    break;
                case 'del-late':
                    statusClass = 'del-late';
                    statusText = 'Entregue com atraso';
                    break;
                case 'in-term':
                    statusClass = 'in-term';
                    statusText = 'No prazo';
                    break;
                case 'late':
                    statusClass = 'late';
                    statusText = 'Atrasado';
                    break;
                default:
                    statusClass = rental.statusClass || '';
                    statusText = rental.statusText || rental.status || '';
            }

            row.innerHTML = `
                <td>${rental.renter}</td>
                <td>${rental.book}</td>
                <td>${rental.rentalDate}</td>
                <td>${rental.dueDate}</td>
                <td>${rental.returnDate || '-'}</td>
                <td><span class="rental-status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="button-renove" data-id="${rental.id}">Renovar</button>
                    <button class="button-devolut-return" data-id="${rental.id}" title="Devolver"></button>
                </td>
            `;

            rentalsTable.appendChild(row);
        });
    }

    // filtros
    const filterOptions = document.querySelectorAll('.filter-option');
    const filterMenu = document.getElementById('filter-menu-function');

    filterOptions.forEach((button) => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            const rentalsFiltered = [...rentalsView];

            if (filterType === 'az') {
                rentalsFiltered.sort((a, b) => a.renter.localeCompare(b.renter));
            }

            if (filterType === 'za') {
                rentalsFiltered.sort((a, b) => b.renter.localeCompare(a.renter));
            }

            rentalsView = rentalsFiltered;
            nowPage = 1;

            renderPage();
            filterMenu.classList.remove('active');
        });
    });

    // barrinha de pesquisa
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        rentalsView = rentals.filter((rental) => {
            return (
                rental.renter.toLowerCase().includes(searchValue) ||
                rental.book.toLowerCase().includes(searchValue) ||
                rental.rentalDate.includes(searchValue) ||
                rental.dueDate.includes(searchValue)
            );
        });

        nowPage = 1;
        renderPage();
    });

    function renderPage() {
        const start = (nowPage - 1) * rentalsPerPage;
        const end = start + rentalsPerPage;

        const rentalsPage = rentalsView.slice(start, end);

        renderRentals(rentalsPage);
        updatePaginationInfo();
    }

    const backPagination = document.getElementById('back-pagination');
    const frontPagination = document.getElementById('front-pagination');

    frontPagination.addEventListener('click', () => {
        const totalPages = Math.ceil(rentalsView.length / rentalsPerPage);

        if (nowPage < totalPages) {
            nowPage++;
            renderPage();
        }
    });

    backPagination.addEventListener('click', () => {
        if (nowPage > 1) {
            nowPage--;
            renderPage();
        }
    });

    function updatePaginationInfo() {
        const totalRentals = rentalsView.length;

        if (totalRentals === 0) {
            document.getElementById('pagination-info').textContent = 'Nenhum empréstimo encontrado';
            return;
        }

        const start = (nowPage - 1) * rentalsPerPage + 1;
        const end = Math.min(nowPage * rentalsPerPage, totalRentals);

        document.getElementById('pagination-info').textContent =
            `Mostrando de ${start} a ${end} de ${totalRentals} empréstimos`;
    }

    renderPage();

    const filterButton = document.getElementById('filter-button-function');
    filterButton.addEventListener('click', () => {
        filterMenu.classList.toggle('active');
    });
    
    const addButton = document.getElementById('add-button-function');
    const rentalModal = document.getElementById('rental-modal-function');
    const cancelRental = document.getElementById('cancel-rental');
    const rentalForm = document.getElementById('rental-form');
    const rentalRenter = document.getElementById('rental-renter');
    const rentalBook = document.getElementById('rental-book');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const books = JSON.parse(localStorage.getItem('books')) || [];

    function loadUsersSelect() {
        rentalRenter.innerHTML = `
            <option value="" selected disabled>
                Selecione um usuário
            </option>
        `;

        users.forEach((user) => {
            if (!user.active) {
                return;
            }
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;

            rentalRenter.appendChild(option);
        });
    }

    function loadBooksSelect() {
        rentalBook.innerHTML = `
            <option value="" selected disabled>
                Selecione um livro
            </option>
        `;

        books.forEach((book) => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = book.title;
            rentalBook.appendChild(option);
        });
    }

    addButton.addEventListener('click', () => {
        loadUsersSelect();
        loadBooksSelect();
        rentalModal.classList.add('active');
    });

    cancelRental.addEventListener('click', () => {
        rentalModal.classList.remove('active');
        rentalForm.reset();
    });

    rentalForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const renterId = rentalRenter.value;
        const bookId = rentalBook.value;
        const rentalDate = document.getElementById('rental-date').value;
        const dueDate = document.getElementById('rental-due-date').value;
        const selectedUser = users.find((user) => {
            return user.id === renterId;
        });
        const selectedBook = books.find((book) => {
            return book.id === bookId;
        });
        if (!selectedUser || !selectedBook) {
            alert('Selecione um usuário e um livro');
            return;
        }
        if (selectedBook.inUse >= selectedBook.totalStock) {
            alert('Não há exemplares disponíveis deste livro');
            return;
        }

        const newRental = {
            id: crypto.randomUUID(),
            renterId: selectedUser.id,
            renter: selectedUser.name,
            bookId: selectedBook.id,
            book: selectedBook.title,
            rentalDate: rentalDate,
            dueDate: dueDate,
            returnDate: null,
            status: 'in-term'
        };

        rentals.push(newRental);
        selectedBook.inUse++;
        localStorage.setItem('rentals', JSON.stringify(rentals));
        localStorage.setItem('books', JSON.stringify(books));
        rentalsView = [...rentals];
        nowPage = 1;
        renderPage();
        rentalForm.reset();
        rentalModal.classList.remove('active');
    });

    rentalsTable.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (!button) {
            return;
        }

        const rentalId = button.dataset.id;

        // botão de renovar
        if (button.classList.contains('button-renove')) {
            const rental = rentals.find((rental) => rental.id === rentalId);

            if (!rental) {
                return;
            }

            if (rental.returnDate) {
                alert('Não é possível renovar um empréstimo já devolvido');
                return;
            }

            const newDueDate = prompt(
                'Digite a nova data de devolução no formato YYYY-MM-DD:',
                rental.dueDate
            );

            if (!newDueDate) {
                return;
            }

            rental.dueDate = newDueDate;
            rental.status = 'in-term';

            localStorage.setItem(
                'rentals',
                JSON.stringify(rentals)
            );

            rentalsView = [...rentals];
            renderPage();
        }

        // botão de devolução
        if (button.classList.contains('button-devolut-return')) {
            const rental = rentals.find((rental) => rental.id === rentalId);

            if (!rental) {
                return;
            }

            if (rental.returnDate) {
                alert('Este livro já foi devolvido');
                return;
            }

            const confirmed = confirm(
                `Deseja confirmar a devolução do livro "${rental.book}"?`
            );

            if (!confirmed) {
                return;
            }

            const today = new Date();
            const returnDate = today.toISOString().split('T')[0];

            rental.returnDate = returnDate;

            if (returnDate > rental.dueDate) {
                rental.status = 'del-late';
            } else {
                rental.status = 'del-in-time';
            }

            const book = books.find((book) => book.id === rental.bookId);

            if (book && book.inUse > 0) {
                book.inUse--;
            }

            localStorage.setItem(
                'rentals',
                JSON.stringify(rentals)
            );

            localStorage.setItem(
                'books',
                JSON.stringify(books)
            );

            rentalsView = [...rentals];
            renderPage();
        }
    });

    // botão sair
    const btnLogout = document.querySelector('.logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../../index.html';
    });

    // menu usuário
    const modal = document.getElementById('menu-modal-function');
    const configurations = document.querySelector('.configurations');
    configurations.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    // menu lateral
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