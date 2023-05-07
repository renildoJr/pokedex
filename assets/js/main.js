const pokemonList = document.getElementById("pokemon-list")
const loadMoreButton = document.querySelector("#loadMoreButton")
const menuLinks = document.querySelectorAll(".nav-links  .menu li")
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
            pokeApi.getPokemon(id)
        }))
   })
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

menuLinks.forEach((link, i, linksArr)=>link.addEventListener("click", ()=>{
    detailsSections.forEach(detailsSection=>detailsSection.classList.remove("active"))
    linksArr.forEach(link=>link.classList.remove("selected"))
    link.classList.add("selected")
    detailsSections[i].classList.add("active")
}))

loadPokemonItens(offset, limit)

