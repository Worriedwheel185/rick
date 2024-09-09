const apiUrl = 'https://rickandmortyapi.com/api/';
const charactersButton = document.getElementById('characters-button');
const locationsButton = document.getElementById('locations-button');
const episodesButton = document.getElementById('episodes-button');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const contentContainer = document.getElementById('content-container');

// Almacena todos los resultados de cada categoría
let characters = [];
let locations = [];
let episodes = [];
let currentCategory = '';

// Función para obtener y mostrar todos los elementos de una categoría
async function fetchAllResults(url, category) {
    let nextPage = url;
    let results = [];

    while (nextPage) {
        try {
            const response = await fetch(nextPage);
            const data = await response.json();
            results = results.concat(data.results);
            nextPage = data.info.next; // Obtén la siguiente página si existe
        } catch (error) {
            console.error(`Error obteniendo ${category}:`, error);
            contentContainer.innerHTML = `<p>Error al obtener ${category}.</p>`;
            return;
        }
    }

    // Actualiza la lista de resultados de la categoría actual
    if (category === 'characters') {
        characters = results;
    } else if (category === 'locations') {
        locations = results;
    } else if (category === 'episodes') {
        episodes = results;
    }
    displayResults(results, category);
}

// Función para mostrar resultados
function displayResults(results, category) {
    contentContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar resultados
    results.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('card');
        if (category === 'characters') {
            card.innerHTML = `
                <img src="${result.image}" alt="${result.name}">
                <h3>${result.name}</h3>
                <p>Especie: ${result.species}</p>
                <p>Estado: ${result.status}</p>
            `;
        } else if (category === 'locations') {
            card.innerHTML = `
                <h3>${result.name}</h3>
                <p>Tipo: ${result.type}</p>
                <p>Dimensión: ${result.dimension}</p>
            `;
        } else if (category === 'episodes') {
            card.innerHTML = `
                <h3>${result.name}</h3>
                <p>Episodio: ${result.episode}</p>
                <p>Fecha de emisión: ${result.air_date}</p>
            `;
        }
        contentContainer.appendChild(card);
    });
}

// Función de búsqueda
function search() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredResults = [];
    if (currentCategory === 'characters') {
        filteredResults = characters.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );
    } else if (currentCategory === 'locations') {
        filteredResults = locations.filter(location =>
            location.name.toLowerCase().includes(searchTerm)
        );
    } else if (currentCategory === 'episodes') {
        filteredResults = episodes.filter(episode =>
            episode.name.toLowerCase().includes(searchTerm)
        );
    }
    displayResults(filteredResults, currentCategory);
}

// Event listeners para los botones
charactersButton.addEventListener('click', () => {
    currentCategory = 'characters';
    fetchAllResults(`${apiUrl}character`, 'characters');
});
locationsButton.addEventListener('click', () => {
    currentCategory = 'locations';
    fetchAllResults(`${apiUrl}location`, 'locations');
});
episodesButton.addEventListener('click', () => {
    currentCategory = 'episodes';
    fetchAllResults(`${apiUrl}episode`, 'episodes');
});
searchButton.addEventListener('click', search);
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        search();
    }
});

