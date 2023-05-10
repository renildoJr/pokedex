const pokemonList = document.getElementById("pokemon-list")
const loadMoreButton = document.querySelector("#loadMoreButton")
const menuLinks = document.querySelectorAll(".nav-links .menu li")
const detailsSections = document.querySelectorAll(".details-section")
const maxRecords = 151
const limit = 5
let offset = 0;

function loadPokemonItens(offset, limit) {
   pokeApi.getPokemons(offset, limit).then((pokemons = [])=>{
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon type ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" 
                         alt="${pokemon.name}">
                </div>
            </li>
        `).join('')
        pokemonList.innerHTML+=newHtml

        pokemons = document.querySelectorAll(".pokemon")

        pokemons.forEach((pokemonLi, id)=>pokemonLi.addEventListener("click", ()=>{
            id+=1
            openModal(id)
        }))
   })
}

function openModal(id) {
    const pokemonModal = document.querySelector(".modal-container")

    pokemonModal.classList.remove("disable")
    pokemonList.parentElement.classList.add("disable")

    function exitModal () {
        pokemonModal.classList.add("disable")
        pokemonList.parentElement.classList.remove("disable")
    }

    pokeApi.getPokemon(id).then(pokemon => pokemonModal.innerHTML = `
        <section class="modal ${pokemon.type}">
            <header class="pokemon-header">
                <a class="btn" id="btn-return"><i class="fa-solid fa-arrow-left"></i></a>
                <h1 class="name">${pokemon.name}</h1>
                <span class="number">${pokemon.number}</span>
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img class="pokemon-img" src="${pokemon.photo}" alt="${pokemon.name}">
            </header>
            <main>
                <nav class="nav-links">
                    <ul class="menu">
                        <li class="selected">About</li>
                        <li>Base Stats</li>
                        <li>Evolution</li>
                        <li>Moves</li>
                    </ul>
                </nav>
                <section class="details-section">
                    <ul>
                        <li>Height <strong>${pokemon.height}</strong></li>
                        <li>Weight <strong>${pokemon.weight}</strong></li>
                        <li>Abilities <strong>${pokemon.abilities.map(ability=>ability).join(', ')}</strong></li>                    
                    </ul>
                </section>
                <section class="details-section active">
                    <ul class="stats-container">
                        <div class="status-names">
                            <li>HP</li>
                            <li>Attack</li>
                            <li>Defense</li>
                            <li>Sp. Atk</li>
                            <li>Sp. Def</li>
                            <li>Speed</li>
                            <li>Total</li>
                            <h2>Type defenses</h2>
                    <p>the effectiveness of each type on ${pokemon.name}</p>
                        </div>
                        <div class="status-values">
                            ${pokemon.stats.map((stat)=>`<li>${stat}</li>`).join("")}
                            ${pokemon.stats.reduce((acc, curr)=>acc + curr)} 
                        </div>
                    </ul>
                </section>
            </main>
        </section>
    
    `)
    
}

loadMoreButton.addEventListener('click', ()=>{
    offset += limit

    const qtdRecordsWidthNewxPage = offset + limit

    if(qtdRecordsWidthNewxPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadiItens(offset, limit);

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    }else {
        loadPokemonItens(offset, limit);
    }

})

function loadFunctions() {

    

    menuLinks.forEach((link, i, linksArr)=>link.addEventListener("click", ()=>{
        detailsSections.forEach(detailsSection=>detailsSection.classList.remove("active"))
        linksArr.forEach(link=>link.classList.remove("selected"))
        link.classList.add("selected")
        detailsSections[i].classList.add("active")
    }))
}


loadPokemonItens(offset, limit)

