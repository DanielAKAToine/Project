//HOME VERIFICA SE TEM LOGIN FEITO OU NÃO
function initHomePage() {
    const headerElement = document.getElementById('mainHeader');
    const authContent = document.getElementById('authContent');
    const guestContent = document.getElementById('guestContent');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (headerElement) {
        if (currentUser) {
            headerElement.innerHTML = `
            <div><strong>RendEase - Find your perfect flat with ease!</strong></div>
            <nav>
                <a href="./index.html">Home</a>
                <a href="./all-flats.html">All Flats</a>
                <a href="./new-flat.html">New Flat</a>
                <a href="./profile.html">Profile</a>
            </nav>
            <div>
            <span>Welcome, ${currentUser.firstName} ${currentUser.lastName}!</span>
            <button id="logoutBtn">Logout</button>
            </div>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = './index.html';
            });

            if (authContent) authContent.style.display = 'block';
            if (guestContent) guestContent.style.display = 'none';
            renderFavouriteFlats();
        } else {
            headerElement.innerHTML = `
            <div><strong>RendEase - Find your perfect flat with ease!</strong></div>
            <nav>
                <a href="./index.html">Home</a>
                <a href="./all-flats.html">All Flats</a>
                <a href="./login.html">Login</a>
                <a href="./register.html">Register</a>
            </nav>
            `;


            if (authContent) authContent.style.display = 'none';
            if (guestContent) guestContent.style.display = 'block';
        }
    }
}


//TABELA DOS FAVORITOS
function renderFavouriteFlats() {
    const tableBody = document.getElementById('favouriteFlatsTableBody');

    if (!tableBody) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allFlats = JSON.parse(localStorage.getItem('flats')) || [];

    if (!currentUser || !currentUser.favourites || currentUser.favourites.length === 0) {
        tableBody.innerHTML = '<tr><td>No favourite flats added yet.</td></tr>';
        return;
    }

    const myFavourites = allFlats.filter(flat => currentUser.favourites.includes(flat.id));
    tableBody.innerHTML = '';
    myFavourites.forEach(flat => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${flat.city}</td>
        <td>${flat.street} ${flat.houseNumber}</td>
        <td>${flat.price}</td>
        <td>${flat.area} m2</td>
        <td>${flat.yearBuilt}</td>
        <td><button onclick= "removeFavourite(${flat.id})">❌ Remove from Favourites</button></td>
        `;
        tableBody.appendChild(row);
    });
}


//REMOVER FAVORITOS
window.removeFavourite = function (id) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex !== -1) {
        users[userIndex].favourites = users[userIndex].favourites.filter(favId => Number(favId) !== Number(id));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        localStorage.setItem('users', JSON.stringify(users));
        renderFavouriteFlats();

        if (typeof renderTable === 'function') {
            renderTable();
        }
        alert("Flat removed from favourites!");

    }
}


