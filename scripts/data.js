
let sortField = 'city';
let sortOrder = 'sorter';


const flatForm = document.getElementById('flatForm');
if (flatForm) {

    flatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const newFlat = {
            id: Date.now(),
            city: document.getElementById('city').value,
            price: Number(document.getElementById('price').value),
            area: Number(document.getElementById('area').value),
            street: document.getElementById('streetname').value,
            houseNumber: document.getElementById('housenumber').value,
            hasAC: document.getElementById('ac').checked,
            yearBuilt: document.getElementById('yearbuilt').value,
            dateAvailable: document.getElementById('dateavailable').value,
            ownerEmail: currentUser ? currentUser.email : 'anonymous',
            isFavourite: false
        };

        let flats = JSON.parse(localStorage.getItem('flats')) || [];
        flats.push(newFlat);
        localStorage.setItem('flats', JSON.stringify(flats));

        alert('Flat added successfully!');
        this.reset();
        window.location.href = './all-flats.html';
    });
}


//ORDENAR
function sortTable(field) {
    if (sortField === field) {

        sortOrder = sortOrder === 'sorter' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'sorter';
    }
    renderTable();
}




function toggleFavourite(flatId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {

        alert('Please log in to manage favourites.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        if (!users[userIndex].favourites) {

            users[userIndex].favourites = [];
        }
        const favs = users[userIndex].favourites;
        const inFavs = favs.indexOf(flatId);
        if (inFavs === -1) {

            favs.push(flatId);
        } else {
            favs.splice(inFavs, 1);
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        renderTable();

        if (typeof initProfilePage === 'function')
            initProfilePage();

    }
}



//CRIAR TABELA DOS FLATS
function renderTable() {
    const tableBody = document.getElementById('flatsTableBody');
    if (!tableBody) return;

    let flats = JSON.parse(localStorage.getItem('flats')) || [];

    const filterCity = document.getElementById('filterCity').value.toLowerCase();
    const minPIn = Number(document.getElementById('minPrice').value) || 0;
    const maxPIn = Number(document.getElementById('maxPrice').value) || Infinity;
    const minP = minPIn ? (Number(minPIn) || 0) : 0;
    const maxP = maxPIn ? (Number(maxPIn) || Infinity) : Infinity;

    flats = flats.filter(flat => {
        const matchCity = flat.city.toLowerCase().includes(filterCity);
        const matchPrice = flat.price >= minP && flat.price <= maxP;
        return matchCity && matchPrice;
    });

    flats.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (['price', 'area', 'yearBuilt'].includes(sortField)) {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (valA < valB) return sortOrder === 'sorter' ? -1 : 1;
        if (valA > valB) return sortOrder === 'sorter' ? 1 : -1;
        return 0;
    });

    tableBody.innerHTML = '';
    if (flats.length === 0) {

        tableBody.innerHTML = '<tr><td colspan="8">No apartments found.</td></tr>';
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userFavs = (currentUser && currentUser.favourites) ? currentUser.favourites : [];

    flats.forEach(flat => {
        const isFav = userFavs.includes(flat.id);

        const table = `
            <tr>
            <td>${flat.city}</td>
            <td>${flat.street} ${flat.houseNumber}</td>
            <td>${flat.price}€</td>
            <td>${flat.area} m²</td>
            <td>${flat.yearBuilt}</td>
            <td>${flat.hasAC ? 'Yes' : 'No'}</td>
            <td>${flat.dateAvailable}</td>
            <td><button onclick="toggleFavourite(${flat.id})">${isFav ? '❤️' : '🤍'}</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', table);
    })
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {

        const element = document.element;
        const filterIds = ['filterCity', 'minPrice', 'maxPrice'];
        const formIds = ['city', 'price', 'area', 'streetname', 'housenumber', 'yearbuilt', 'dateavailable'];

        if (filterIds.includes(element.id)) {
            renderTable();
        }
        else if (formIds.includes(element.id)) {
            const form = document.getElementById('flatForm');
            if (form) {

                e.preventDefault();
                form.requestSubmit();
            }
        }
    }
});



//REGISTO

const registerForm = document.getElementById('registerForm');
if (registerForm) {

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {

            alert('Passwords do not match!');
            return;
        }

        const newUser = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: password,
            birthDate: document.getElementById('birthDate').value,
            favourites: []
        };

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('User registered successfully!');
        window.location.href = 'login.html';
    });
}


//RESET
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {

    resetBtn.addEventListener('click', function () {
        const emailConfirm = prompt("Enter your Email to confirm reset:");
        const dateConfirm = prompt("Enter your Birth Date (YYYY-MM-DD) to confirm reset:");
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let flats = JSON.parse(localStorage.getItem('flats')) || [];
        const userExists = users.find(user => user.email === emailConfirm && user.birthDate === dateConfirm);
        if (userExists) {

            const finalConfirm = confirm("Are you sure you want to reset all data? This action cannot be undone.");
            if (finalConfirm) {

                const updateUsers = users.filter(user => !(user.email === emailConfirm && user.birthDate === dateConfirm));
                localStorage.setItem('users', JSON.stringify(updateUsers));
                const updateFlats = flats.filter(flat => flat.ownerEmail !== emailConfirm);
                localStorage.setItem('flats', JSON.stringify(updateFlats));
                localStorage.removeItem('currentUser');
                alert('Data reset successfully! Your account and associated flats have been removed.');
                window.location.href = 'login.html';

            }
        } else {
            alert('Data reset failed. Information does not match our records.');
        }
    });
}


//LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail').value;
        const passwordInput = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passwordInput);
        if (user) {

            const sessionData = {
                ...user, loginAt: Date.now()
            };
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            alert('Login successful. Welcome back');
            window.location.href = 'index.html';
        }
        else {
            alert('Login failed. Invalid email or password.');
            console.log("Users in storage:", users);
        }
    });

}



//EXPIRAR DA SESSÃO
function checkSessionExpiration() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.loginAt) {

        const timeElapsed = Date.now() - currentUser.loginAt;
        const oneHour = 60 * 60 * 1000;
        if (timeElapsed > oneHour) {

            localStorage.removeItem('currentUser');
            alert('Session expired. Please log in again.');
            window.location.href = 'login.html';
        }
    }
}



//PERFIL
function initProfilePage() {
    const viewSection = document.getElementById('viewSection');
    const updateProfile = document.getElementById('updateProfile');

    if (!viewSection) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {

        window.location.href = 'login.html';
        return;
    }

    document.getElementById("viewName").textContent = currentUser.firstName + " " + (currentUser.lastName || '');
    document.getElementById("viewEmail").textContent = currentUser.email;
    document.getElementById("viewBirthDate").textContent = currentUser.birthDate;

    document.getElementById("editBtn").addEventListener('click', () => {
        document.getElementById("upName").value = currentUser.firstName + " " + (currentUser.lastName || '');
        document.getElementById("upEmail").value = currentUser.email;
        document.getElementById("upBirthDate").value = currentUser.birthDate;
        viewSection.style.display = 'none';
        updateProfile.style.display = 'block';
    });

    document.getElementById("cancelBtn").addEventListener('click', () => {
        updateProfile.style.display = 'none';
        viewSection.style.display = 'block';
    });

    const flatsList = document.getElementById("myFlatsList");
    if (flatsList) {

        const allFlats = JSON.parse(localStorage.getItem('flats')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const myFlats = allFlats.filter(flat => flat.ownerEmail === currentUser.email);

        flatsList.innerHTML = myFlats.length === 0 ? "<p>You have no flats listed.</p>" : "";

        myFlats.forEach(flat => {
            const card = `
            <div class="flat-item-card">
                    <h4>${flat.city}</h4>
                    <p>📍${flat.street}, ${flat.houseNumber} </p>
                    <p>📏Area: ${flat.area} m2 </p>
                    <p>📅 Built: ${flat.yearBuilt}</p>
                <div class="price"> ${flat.price}€ </div>
            </div>
            `;
            flatsList.insertAdjacentHTML('beforeend', card);
        });
    }
}


//UPDATE DO PERFIL
const updateForm = document.getElementById('updateForm');
if (updateForm) {

    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) return;

        const newPass = document.getElementById('upPassword').value;
        const confirmPass = document.getElementById('upConfirmPassword').value;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            if (newPass !== "" && newPass === confirmPass) {

                users[index].password = newPass;
            } else if (newPass !== confirmPass) {
                alert('Passwords do not match. Password not updated.');
                return;
            }

            const fullInputName = document.getElementById("upName").value.trim();
            const nameParts = fullInputName.split(' ');
            users[index].firstName = nameParts[0];
            users[index].lastName = nameParts.slice(1).join(' ');
            users[index].birthDate = document.getElementById("upBirthDate").value;

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[index]));
            alert('Profile updated successfully!');

            window.location.href = 'index.html';
        }
    });
}



//INICIAR
document.addEventListener('DOMContentLoaded', function () {
    checkSessionExpiration();
    initProfilePage();
    if (typeof renderTable === 'function') {

        renderTable();
    }
    if (typeof initHomePage === 'function') {

        initHomePage();
    }

});



