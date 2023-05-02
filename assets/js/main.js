const pokemonList = document.getElementById("pokemon-list")
const loadMoreButton = document.querySelector("#loadMoreButton")
const maxRecords = 151
const limit = 5
let offset = 0;

function loadPokemonItens(offset, limit) {
   pokeApi.getPokemons(offset, limit).then((pokemons = [])=>{
    console.log(pokemons)
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
        
   })
}

loadMoreButton.addEventListener('click', ()=>{
    offset += limit

    const qtdRecordsWidthNewxPage = offset + limit

    if(qtdRecordsWidthNewxPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, limit);

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    }else {
        loadPokemonItens(offset, limit);
    }


})

loadPokemonItens(offset, limit)