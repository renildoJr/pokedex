const pokemonList = document.getElementById("pokemon-list");
const loadMoreButton = document.querySelector("#loadMoreButton");
const menuLinks = document.querySelectorAll(".nav-links .menu li");
const detailsSections = document.querySelectorAll(".details-section");
const pokemonHeader = document.querySelector(".pokemon-header");
const headerDynamicContent = document.querySelector(".header-dynamic-content");
const maxRecords = 151;
const limit = 5;
let offset = 0;

function loadPokemonItens(offset, limit) {
   pokeApi.getPokemons(offset, limit).then((pokemons = [])=>{
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon type ${pokemon.type}">
                <span class="number">#${leadingZeros(pokemon.number, maxRecords)}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" 
                         alt="${pokemon.name}">
                </div>
            </li>
        `).join('');

        pokemonList.innerHTML+=newHtml;
        pokemons = document.querySelectorAll(".pokemon");
        pokemons.forEach((pokemonLi, id)=>{pokemonLi.addEventListener("click", ()=>{
            openModal(id);
        })})
   })
}

function openModal(id) {
    headerDynamicContent.innerHTML="";
    pokemonHeader.className = "pokemon-header";
    
    const pokemonModal = document.querySelector(".modal-container");
    const btnReturn = document.querySelector("#btnReturn");

    btnReturn.addEventListener("click", exitModal);
    pokemonModal.classList.remove("disable");
    pokemonList.parentElement.classList.add("disable");

    function exitModal () {
        pokemonModal.classList.add("disable");
        pokemonList.parentElement.classList.remove("disable");
    }

    pokeApi.getPokemon(id).then(pokemon => {
        pokemonHeader.classList.add(`${pokemon.type}`);
        headerDynamicContent.innerHTML=`
            <h1 class="name">${pokemon.name}</h1>
            <span class="number">#${leadingZeros(pokemon.number, maxRecords)}</span>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img class="pokemon-img" src="${pokemon.photo}" alt="${pokemon.name}">
        `;

        detailsSections[0].innerHTML=`
            <ul>
                <li>Height <strong>${formatHeight(pokemon.height)}</strong></li>
                <li>Weight <strong>${formatWeight(pokemon.weight)}</strong></li>
                <li>Abilities <strong>${pokemon.abilities.map(ability=>ability).join(', ')}</strong></li>                    
            </ul>
        `;

        detailsSections[1].innerHTML=`
            <ul class="stats-container">
                <div class="status-names">
                    <li>HP</li>
                    <li>Attack</li>
                    <li>Defense</li>
                    <li>Sp. Atk</li>
                    <li>Sp. Def</li>
                    <li>Speed</li>
                    <li>Total</li>
                </div>
                <div class="status-values">
                    ${pokemon.stats.map((stat)=>`<li>${stat}</li>`).join("")}
                    ${pokemon.stats.reduce((acc, curr)=>acc + curr)} 
                </div>
                <div class="status-bars">
                    ${pokemon.stats.map((stat)=>createBar(stat)).join("")}
                </div>
            </ul>
        `;
    })
}

loadMoreButton.addEventListener('click', ()=>{
    offset += limit;
    const qtdRecordsWidthNewxPage = offset + limit;
    if(qtdRecordsWidthNewxPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadiItens(offset, limit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    }else {
        loadPokemonItens(offset, limit);
    }
})

menuLinks.forEach((link, i, linksArr)=>link.addEventListener("click", ()=>{
    detailsSections.forEach(detailsSection=>detailsSection.classList.remove("active"));
    linksArr.forEach(link=>link.classList.remove("selected"));
    link.classList.add("selected");
    detailsSections[i].classList.add("active");
}))

loadPokemonItens(offset, limit);

// Criação de Barras de Carregamento
function createBar(val) {
    const max = 120;
    const newVal = (val * 100 / max).toFixed(2);
    return newVal < 50 ? `<li style="width: ${newVal}%;"><span class="barFill" style="background:#F42A28"></span></li>` : `<li style="width: ${newVal}%"><span class="barFill" style="background:#53A063"></span></li>`;
}

// Zeros na Frente de Números
function leadingZeros(value, qnt) {
    qnt = qnt.toString().length;
    return value.toString().padStart(qnt, "0");
}

// Formatar Peso (libras e kilo)
function formatWeight(weight) {
    const stringWeight = weight.toString();
    const fmWeight = stringWeight.slice(0, -1)+"."+stringWeight.at(-1);
    const kgToLbs = fmWeight * 2.20462262185;
    return `${kgToLbs.toFixed(1)} (${fmWeight} kg)`;
}

// Formatar Altura (Pés e Polegadas e Centimetros)
function formatHeight(height) {
    height *= 10;
    const inches = height / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}' ${remainingInches}" (${height < 100 ? "0."+height : height} cm)`;
}
