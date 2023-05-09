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
                <section class="details-section active">
                    <ul>
                        <li>Species <strong>Seed</strong></li>
                        <li>Height <strong>${pokemon.height}</strong></li>
                        <li>Weight <strong>${pokemon.weight}</strong></li>
                        <li>Avilities <strong>Overgrow, Chlorophyl</strong></li>
                        <li><h2>Breeding</h2></li>
                        <li>Gender <strong>(icon) 87.5%  (icon) 12.5%</strong></li>
                        <li>Egg Groups <strong>Monster</strong></li>
                        <li>Egg Cycle <strong>Grass</strong></li>
                    </ul>
                    <span>Types defenses</span>
                    <p>The effectiveness of each type on Charmander</p>
                </section>
                <section class="details-section">
                    <ul>
                        <li>HP <strong>45 (bar)</strong></li>
                        <li>Attack <strong>45 (bar)</strong></li>
                        <li>Defense <strong>45 (bar)</strong></li>
                        <li>Sp. Atk <strong>45 (bar)</strong></li>
                        <li>Sp. Def <strong>45 (bar)</strong></li>
                        <li>Speed <strong>45 (bar)</strong></li>
                        <li>Total <strong>45 (bar)</strong></li>
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

