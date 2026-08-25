document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return; 
    }

    const booksTable = document.getElementById('books-table');
    const searchInput = document.getElementById('search-input-function');
    const booksPerPage = 8;
    let nowPage = 1;
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let booksView = [...books];
    let editingBookId = null;

    function renderBooks(booksView) {
        booksTable.innerHTML = '';

        booksView.forEach((book) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${book.title || '-'}</td>
                <td>${book.author || '-'}</td>
                <td>${book.releaseDate || '-'}</td>
                <td>${book.totalStock ?? '-'}</td>
                <td>${book.inUse ?? 0}</td>
                <td>${book.publisher || '-'}</td>
                <td class="buttons-actions">
                    <button class="button-edit" data-id="${book.id}"></button>
                    <button class="button-delete" data-id="${book.id}" title="Excluir"></button>
                </td>
            `;

            booksTable.appendChild(row);
        });
    }

    const filterOptions = document.querySelectorAll('.filter-option');
    const filterMenu = document.getElementById('filter-menu-function');

    filterOptions.forEach((button) => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            const booksFiltered = [...booksView];

            if (filterType === 'az') {
                booksFiltered.sort((a, b) =>
                    (a.title || '').localeCompare(b.title || '')
                );
            }

            if (filterType === 'za') {
                booksFiltered.sort((a, b) =>
                    (b.title || '').localeCompare(a.title || '')
                );
            }

            booksView = booksFiltered;
            nowPage = 1;

            renderPage();
            filterMenu.classList.remove('active');
        });
    });

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();

        booksView = books.filter((book) => {
            return (
                (book.title && book.title.toLowerCase().includes(searchValue)) ||
                (book.author && book.author.toLowerCase().includes(searchValue)) ||
                (book.publisher && book.publisher.toLowerCase().includes(searchValue))
            );
        });

        nowPage = 1;
        renderPage();
    });

    function renderPage() {
        const start = (nowPage - 1) * booksPerPage;
        const end = start + booksPerPage;

        const booksPage = booksView.slice(start, end);

        renderBooks(booksPage);
        updatePaginationInfo();
    }
    const backPagination = document.getElementById('back-pagination');
    const frontPagination = document.getElementById('front-pagination');
    frontPagination.addEventListener('click', () => {
        const totalPages = Math.ceil(booksView.length / booksPerPage);

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
        const totalBooks = booksView.length;

        if (totalBooks === 0) {
            document.getElementById('pagination-info').textContent =
                'Nenhum livro encontrado';
            return;
        }

        const start = (nowPage - 1) * booksPerPage + 1;
        const end = Math.min(nowPage * booksPerPage, totalBooks);

        document.getElementById('pagination-info').textContent =
            `Mostrando de ${start} a ${end} de ${totalBooks} livros`;
    }

    renderPage();

    const filterButton = document.getElementById('filter-button-function');

    filterButton.addEventListener('click', () => {
        filterMenu.classList.toggle('active');
    });

    const addButton = document.getElementById('add-button-function');
    const bookModal = document.getElementById('book-modal-function');
    const cancelBook = document.getElementById('cancel-book');
    const bookForm = document.getElementById('book-form');
    const publisherSelect = document.getElementById('book-publisher');
    const modalTitle = document.querySelector('.modal-header h2');

    function loadPublishersSelect(selectedPublisherId = null) {
        const publishers =
            JSON.parse(localStorage.getItem('publishers')) || [];

        publisherSelect.innerHTML = `
            <option value="" disabled>
                Selecione uma editora
            </option>
        `;

        publishers.forEach((publisher) => {
            const option = document.createElement('option');

            option.value = publisher.id;
            option.textContent = publisher.name;

            if (publisher.id === selectedPublisherId) {
                option.selected = true;
            }

            publisherSelect.appendChild(option);
        });
    }

    addButton.addEventListener('click', () => {
        editingBookId = null;
        bookForm.reset();

        loadPublishersSelect();

        modalTitle.textContent = 'Novo Livro';
        bookModal.classList.add('active');
    });

    cancelBook.addEventListener('click', () => {
        bookModal.classList.remove('active');
        bookForm.reset();

        editingBookId = null;
        modalTitle.textContent = 'Novo Livro';
    });

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const publishers =
            JSON.parse(localStorage.getItem('publishers')) || [];

        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const releaseDate =
            document.getElementById('book-release-date').value;
        const totalStock =
            Number(document.getElementById('book-stock').value);

        const publisherId = publisherSelect.value;

        const selectedPublisher = publishers.find((publisher) => {
            return publisher.id === publisherId;
        });

        if (!selectedPublisher) {
            alert('Selecione uma editora válida');
            return;
        }

        if (editingBookId) {
            const bookIndex = books.findIndex((book) => {
                return book.id === editingBookId;
            });

            books[bookIndex] = {
                ...books[bookIndex],
                title: title,
                author: author,
                releaseDate: releaseDate,
                totalStock: totalStock,
                publisherId: selectedPublisher.id,
                publisher: selectedPublisher.name
            };

            alert('Livro atualizado com sucesso!');
        }

        else {
            const newBook = {
                id: crypto.randomUUID(),
                title: title,
                author: author,
                releaseDate: releaseDate,
                totalStock: totalStock,
                inUse: 0,
                publisherId: selectedPublisher.id,
                publisher: selectedPublisher.name
            };

            books.push(newBook);

            alert('Livro cadastrado com sucesso!');
        }

        localStorage.setItem(
            'books',
            JSON.stringify(books)
        );

        booksView = [...books];
        nowPage = 1;

        renderPage();

        bookForm.reset();
        editingBookId = null;

        modalTitle.textContent = 'Novo Livro';
        bookModal.classList.remove('active');
    });

    booksTable.addEventListener('click', (event) => {
        const editButton = event.target.closest('.button-edit');
        const deleteButton = event.target.closest('.button-delete');

        if (editButton) {
            const bookId = editButton.dataset.id;

            const book = books.find((book) => {
                return book.id === bookId;
            });

            if (!book) {
                return;
            }

            editingBookId = book.id;

            document.getElementById('book-title').value =
                book.title;
            document.getElementById('book-author').value =
                book.author;
            document.getElementById('book-release-date').value =
                book.releaseDate;
            document.getElementById('book-stock').value =
                book.totalStock;
            loadPublishersSelect(book.publisherId);

            modalTitle.textContent = 'Editar Livro';

            bookModal.classList.add('active');
        }

        if (deleteButton) {
            const bookId = deleteButton.dataset.id;

            const book = books.find((book) => {
                return book.id === bookId;
            });

            if (!book) {
                return;
            }

            const confirmation = confirm(
                `Tem certeza que deseja excluir o livro "${book.title}"?`
            );

            if (!confirmation) {
                return;
            }

            books = books.filter((book) => {
                return book.id !== bookId;
            });

            localStorage.setItem(
                'books',
                JSON.stringify(books)
            );

            booksView = [...books];

            const totalPages = Math.ceil(
                booksView.length / booksPerPage
            );

            if (nowPage > totalPages && nowPage > 1) {
                nowPage--;
            }

            renderPage();

            alert('Livro excluído com sucesso!');
        }
    });

    const btnLogout = document.querySelector('.logout');

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../../index.html';
    });

    // menu do usuário
    const modal = document.getElementById('menu-modal-function');
    const configurations = document.querySelector('.configurations');
    const preferences = document.querySelector('.preferences');

    configurations.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    preferences.addEventListener('click', () => {
        window.location.href = 'preferences.html';
    });

    // menu lateral
    const content = document.getElementById('content-function');
    const menuOcult = document.getElementById('menu-function');
    const returnIcon =
        document.getElementById('return-icon-function');

    const menuOcultClick =
        document.querySelector('.back-icon');

    menuOcultClick.addEventListener('click', () => {
        menuOcult.classList.add('active');
        returnIcon.classList.add('visible');
        content.classList.add('menu-hidden');
    });

    const menuVisibleClick =
        document.querySelector('.main-title');

    menuVisibleClick.addEventListener('click', () => {
        returnIcon.classList.remove('visible');
        menuOcult.classList.remove('active');
        content.classList.remove('menu-hidden');
    });
});