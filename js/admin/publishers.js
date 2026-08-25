document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return; 
    }

    const publishersTable = document.getElementById('publishers-table');
    const searchInput = document.getElementById('search-input-function');
    const publishersPerPage = 8;
    let nowPage = 1;
    let publishers = JSON.parse(localStorage.getItem('publishers')) || [];
    let publishersView = [...publishers];

    function renderPublishers(publishersView) {
        publishersTable.innerHTML = '';
        publishersView.forEach((publisher) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${publisher.name || '-'}</td>
                <td>${publisher.email || '-'}</td>
                <td>${publisher.phone || '-'}</td>
                <td>${publisher.website || '-'}</td>
                <td class="buttons-actions">
                    <button class="button-edit" data-id="${publisher.id}"></button>
                    <button class="button-delete" data-id="${publisher.id}" title="Excluir"></button>
                </td>
            `;

            publishersTable.appendChild(row);
        });
    }

    const filterOptions = document.querySelectorAll('.filter-option');
    const filterMenu = document.getElementById('filter-menu-function');

    filterOptions.forEach((button) => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            const publishersFiltered = [...publishersView];

            if (filterType === 'az') {
                publishersFiltered.sort((a, b) => a.name.localeCompare(b.name));
            }

            if (filterType === 'za') {
                publishersFiltered.sort((a, b) => b.name.localeCompare(a.name));
            }

            publishersView = publishersFiltered;
            nowPage = 1;

            renderPage();
            filterMenu.classList.remove('active');
        });
    });
    
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        publishersView = publishers.filter((pub) => {
            return (
                (pub.name && pub.name.toLowerCase().includes(searchValue)) ||
                (pub.email && pub.email.toLowerCase().includes(searchValue)) ||
                (pub.phone && pub.phone.toLowerCase().includes(searchValue)) ||
                (pub.website && pub.website.toLowerCase().includes(searchValue))
            );
        });

        nowPage = 1;
        renderPage();
    });

    function renderPage() {
        const start = (nowPage - 1) * publishersPerPage;
        const end = start + publishersPerPage;

        const publishersPage = publishersView.slice(start, end);

        renderPublishers(publishersPage);
        updatePaginationInfo();
    }

    const backPagination = document.getElementById('back-pagination');
    const frontPagination = document.getElementById('front-pagination');

    frontPagination.addEventListener('click', () => {
        const totalPages = Math.ceil(publishersView.length / publishersPerPage);

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
        const totalPublishers = publishersView.length;

        if (totalPublishers === 0) {
            document.getElementById('pagination-info').textContent = 'Nenhuma editora encontrada';
            return;
        }

        const start = (nowPage - 1) * publishersPerPage + 1;
        const end = Math.min(nowPage * publishersPerPage, totalPublishers);

        document.getElementById('pagination-info').textContent =
            `Mostrando de ${start} a ${end} de ${totalPublishers} editoras`;
    }

    renderPage();

    const filterButton = document.getElementById('filter-button-function');
    filterButton.addEventListener('click', () => {
        filterMenu.classList.toggle('active');
    });

    const addButton = document.getElementById('add-button-function');
    const publisherModal = document.getElementById('publisher-modal-function');
    const closePublisherModal = document.getElementById('close-publisher-modal');
    const cancelPublisher = document.getElementById('cancel-publisher');
    const publisherForm = document.getElementById('publisher-form');
    const publisherModalTitle = document.querySelector('.publisher-modal-content h2');
    const publisherSubmitButton = publisherForm.querySelector('button[type="submit"]');

    let editingPublisherId = null;

    addButton.addEventListener('click', () => {
        editingPublisherId = null;
        publisherModalTitle.textContent = 'Nova Editora';
        publisherSubmitButton.textContent = 'Cadastrar';
        publisherForm.reset();
        publisherModal.classList.add('active');
    });

    function closeModal() {
        publisherModal.classList.remove('active');
        publisherForm.reset();
        editingPublisherId = null;
    }
    cancelPublisher.addEventListener('click', closeModal);
    publisherForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const publisherData = {
            name: document.getElementById('publisher-name').value,
            email: document.getElementById('publisher-email').value,
            phone: document.getElementById('publisher-phone').value,
            website: document.getElementById('publisher-website').value
        };
        if (editingPublisherId) {
            publishers = publishers.map((publisher) => {
                if (publisher.id === editingPublisherId) {
                    return {
                        ...publisher,
                        ...publisherData
                    };
                }
                return publisher;
            });
        } else {
            const newPublisher = {
                id: crypto.randomUUID(),
                ...publisherData
            };
            publishers.push(newPublisher);
        }
        localStorage.setItem(
            'publishers',
            JSON.stringify(publishers)
        );
        publishersView = [...publishers];
        nowPage = 1;
        renderPage();
        closeModal();
    });

    publishersTable.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (!button) {
            return;
        }

    const publisherId = button.dataset.id;

    if (button.classList.contains('button-edit')) {
        const publisher = publishers.find(
            (publisher) => publisher.id === publisherId
        );

        if (!publisher) {
            return;
        }

        editingPublisherId = publisherId;

        document.getElementById('publisher-name').value = publisher.name;
        document.getElementById('publisher-email').value = publisher.email;
        document.getElementById('publisher-phone').value = publisher.phone;
        document.getElementById('publisher-website').value = publisher.website;
        publisherModalTitle.textContent = 'Editar Editora';
        publisherSubmitButton.textContent = 'Salvar';

        publisherModal.classList.add('active');
    }

    if (button.classList.contains('button-delete')) {
        const publisher = publishers.find(
            (publisher) => publisher.id === publisherId
        );
        if (!publisher) {
            return;
        }
        const confirmation = confirm(
            `Tem certeza que deseja excluir a editora "${publisher.name}"?`
        );
        if (!confirmation) {
            return;
        }
        publishers = publishers.filter(
            (publisher) => publisher.id !== publisherId
        );
        localStorage.setItem(
            'publishers',
            JSON.stringify(publishers)
        );
        publishersView = [...publishers];
        const totalPages = Math.ceil(
            publishersView.length / publishersPerPage
        );
        if (nowPage > totalPages && totalPages > 0) {
            nowPage = totalPages;
        }
        renderPage();
    }
});

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