async function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayPokemon(pokemon) {
    const pokemonDetails = document.getElementById('pokemonDetails');
    pokemonDetails.innerHTML = `
        <div class="card">
            <div class="card-header">
                ${pokemon.name.toUpperCase()}
            </div>
            <div class="card-body">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="img-fluid mb-3">
                <h5 class="card-title">Abilities:</h5>
                <ul>
                    ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                </ul>
                <h5 class="card-title">Types:</h5>
                <ul>
                    ${pokemon.types.map(type => `<li>${type.type.name}</li>`).join('')}
                </ul>
                <h5 class="card-title">Stats:</h5>
                <ul>
                    ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

const teamList = document.getElementById('teamList');

function addPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(pokemon => {
            const card = createPokemonCard(pokemon);
            const teamCardsContainer = document.getElementById('teamCardsContainer');
            teamCardsContainer.appendChild(card);
        })
        .catch(error => console.error('Error fetching Pokémon data:', error));
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;
    image.classList.add('card-img-top');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = pokemon.name.toUpperCase();

    const abilities = document.createElement('p');
    abilities.classList.add('card-text');
    abilities.textContent = `Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`;

    const types = document.createElement('p');
    types.classList.add('card-text');
    types.textContent = `Types: ${pokemon.types.map(type => type.type.name).join(', ')}`;

    cardBody.appendChild(title);
    cardBody.appendChild(abilities);
    cardBody.appendChild(types);

    card.appendChild(image);
    card.appendChild(cardBody);

    return card;
}

function startBattle() {
    const pokemon1Id = document.getElementById('pokemon1').value;
    const pokemon2Id = document.getElementById('pokemon2').value;

    if (!pokemon1Id || !pokemon2Id) {
        alert('Please select both Pokémon for the battle.');
        return;
    }


    Promise.all([
        fetchPokemonData(pokemon1Id),
        fetchPokemonData(pokemon2Id)
    ]).then(([pokemon1, pokemon2]) => {

        const battleLog = document.getElementById('battleLog');
        battleLog.innerHTML = '';

        displayPokemonInfo(pokemon1, 'pokemon1');
        displayPokemonInfo(pokemon2, 'pokemon2');

        simulateBattle(pokemon1, pokemon2);
    }).catch(error => {
        console.error('Error fetching Pokémon data:', error);
    });
}

function fetchPokemonData(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return fetch(url).then(response => response.json());
}

function displayPokemonInfo(pokemon, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h4>${pokemon.name.toUpperCase()}</h4>
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>Attack: ${pokemon.stats[1].base_stat}</p>
        <p>Defense: ${pokemon.stats[2].base_stat}</p>
        <!-- Add more stats as needed -->
    `;
}

function startBattle() {
    const pokemon1Id = document.getElementById('pokemon1').value;
    const pokemon2Id = document.getElementById('pokemon2').value;

    if (!pokemon1Id || !pokemon2Id) {
        alert('Please select both Pokémon for the battle.');
        return;
    }

    Promise.all([
        fetchPokemonData(pokemon1Id),
        fetchPokemonData(pokemon2Id)
    ]).then(([pokemon1, pokemon2]) => {
        const battleLog = document.getElementById('battleLog');
        battleLog.innerHTML = '';

        displayPokemonInfo(pokemon1, 'pokemon1');
        displayPokemonInfo(pokemon2, 'pokemon2');

        simulateBattle(pokemon1, pokemon2);
    }).catch(error => {
        console.error('Error fetching Pokémon data:', error);
    });
}

function fetchPokemonData(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return fetch(url).then(response => response.json());
}

function displayPokemonInfo(pokemon, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h4>${pokemon.name.toUpperCase()}</h4>
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>Attack: ${pokemon.stats[1].base_stat}</p>
        <p>Defense: ${pokemon.stats[2].base_stat}</p>
        <!-- Add more stats as needed -->
    `;
}

window.onload = function() {
    populatePokemonOptions('pokemon1');
    populatePokemonOptions('pokemon2');
};

async function populatePokemonOptions(selectId) {
    const selectElement = document.getElementById(selectId);

    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();
        const pokemonList = data.results;

        pokemonList.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.name;
            option.textContent = pokemon.name.toUpperCase();
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
}

function simulateBattle(pokemon1, pokemon2) {
    const battleLog = document.getElementById('battleLog');

    let turn = 1;
    while (pokemon1.stats[0].base_stat > 0 && pokemon2.stats[0].base_stat > 0) {
        const attacker = turn % 2 === 1 ? pokemon1 : pokemon2;
        const defender = turn % 2 === 1 ? pokemon2 : pokemon1;

        const damage = calculateDamage(attacker.stats[1].base_stat, defender.stats[2].base_stat); // Simplified damage calculation
        defender.stats[0].base_stat -= damage;

        const logEntry = `${attacker.name} attacks ${defender.name} for ${damage} damage.<br>`;
        battleLog.innerHTML += logEntry;

        turn++;
    }

    const winner = pokemon1.stats[0].base_stat > 0 ? pokemon1 : pokemon2;
    const loser = pokemon1.stats[0].base_stat > 0 ? pokemon2 : pokemon1;

    const battleResult = `${winner.name.toUpperCase()} wins!<br>${loser.name.toUpperCase()} fainted.`;
    battleLog.innerHTML += battleResult;
}

function calculateDamage(attackerAttack, defenderDefense) {
    return Math.max(1, Math.floor(attackerAttack - defenderDefense * 0.5));
}

document.getElementById('searchButton').addEventListener('click', searchPokemon);