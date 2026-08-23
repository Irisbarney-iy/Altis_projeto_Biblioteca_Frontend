document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        alert('Você precisa fazer login para acessar o sistema');
        window.location.href = '../../index.html';
        return; 
    }
    // cria as linhas da tablela
    const usersTable = document.getElementById('users-table');
    const searchInput = document.getElementById('search-input-function');
    const usersPerPage = 8;
    let nowPage = 1;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let usersView =[...users];

    function renderUsers(usersView){
        usersTable.innerHTML = '';
        usersView.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.cpf}</td>
            <td><p class = "user-active ${user.active ? '' : 'false'}">${user.active ? 'Ativo' : 'Inativo'}</p></td>
            <td>
                <label class = "switch">
                    <input type = "checkbox" class = "status-checkbox" data-id = "${user.id}"
                        ${user.active ? 'checked':''}>
                    <span class = "circle"></span>
                </label>
            </td>
            `;

        usersTable.appendChild(row);
        });
        
        const statusCheckbox = document.querySelectorAll('.status-checkbox');

        statusCheckbox.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const userId = checkbox.dataset.id;
                const user = users.find((user) => {
                    return user.id === userId;
                });
                user.active = checkbox.checked;
                localStorage.setItem('users', JSON.stringify(users));
                const row = checkbox.closest('tr');
                const nameStatus = row.querySelector('.user-active');
                nameStatus.textContent = user.active ? 'Ativo' : 'Inativo';
                if(user.active === true){
                    nameStatus.classList.remove('false');
                }else{
                    nameStatus.classList.add('false');
                }
            });
        });
        
    }

    // filtros
    const filterOptions = document.querySelectorAll('.filter-option');

    filterOptions.forEach((button) => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            const usersFiltered = [...usersView];

            if (filterType === 'az') {
                usersFiltered.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            }

            if (filterType === 'za') {
                usersFiltered.sort((a, b) => {
                    return b.name.localeCompare(a.name);
                });
            }

            usersView = usersFiltered;
            nowPage = 1;
            
            renderPage();
            filterMenu.classList.remove('active');
            });
        });
    // barrinha de pesquisa
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        usersView = users.filter((user) => {
            return(
                user.name.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue) ||
                user.cpf.includes(searchValue) ||
                user.phone.includes(searchValue)
            );
        });

        nowPage = 1;
        
        renderPage();
        
    });

        function renderPage(){
        const start = (nowPage - 1) * usersPerPage;
        const end = start + usersPerPage;

        const usersPage = usersView.slice(start, end);

        renderUsers(usersPage);
        updatePaginationInfo();
    }

    const backPagination = document.getElementById('back-pagination');
    const frontPagination = document.getElementById('front-pagination');

    frontPagination.addEventListener('click', () => {
        const totalPages = Math.ceil(usersView.length / usersPerPage);

        if(nowPage < totalPages){
            nowPage++;
            renderPage();
        }
    });

    backPagination.addEventListener('click', () => {
        if(nowPage > 1){
            nowPage--;
            renderPage();
        }
    });

    function updatePaginationInfo(){
        const totalUsers = usersView.length;

        if(totalUsers === 0){
            document.getElementById('pagination-info').textContent = 
            'Nenhum usuario encontrado';
            return;
        }

        const start = (nowPage - 1) * usersPerPage + 1;
        const end = Math.min(nowPage * usersPerPage, totalUsers);

        document.getElementById('pagination-info').textContent =
            `Mostrando de ${start} a ${end} de ${totalUsers} usuários`;
    }

    renderPage();

    const filterButton = document.getElementById('filter-button-function');
    const filterMenu = document.getElementById('filter-menu-function');
    // fazer o menu do filtro aparecer
    filterButton.addEventListener('click', () => {
        filterMenu.classList.toggle('active');
    });
    // logout
    const btnLogout = document.querySelector('.logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = '../../index.html';
    });

    // parte pra abrir o menu, o de opções
    const modal = document.getElementById('menu-modal-function');
    const configurations = document.querySelector('.configurations');
    configurations.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    // toda a parte do menu funcionau, o lateral
    const content = document.getElementById('content-function');
    const menuOcult = document.getElementById('menu-function');
    const returnIcon = document.getElementById('return-icon-function');
    const menuOcultClick = document.querySelector('.back-icon');
    menuOcultClick.addEventListener('click', () => {
        menuOcult.classList.add('active');
        returnIcon.classList.add('visible');
        content.classList.add('menu-hidden');
    })

    const menuVisibleClick = document.querySelector('.main-title');
    menuVisibleClick.addEventListener('click', () => {
        returnIcon.classList.remove('visible');
        menuOcult.classList.remove('active');
        content.classList.remove('menu-hidden')
    })
});