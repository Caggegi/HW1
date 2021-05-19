const article = document.querySelector("article#video-frame");
function showHome(){
    article.innerHTML=  "<section class='genre' id='preferiti'><h2>Preferiti</h2><div class='show-case'></div></section>"+
                        "<section class='genre' id='film'><h2>Film</h2><div class='show-case'></div></section>"+
                        "<section class='genre' id='musica'><h2>Musica</h2><div class='show-case'></div></section>"+
                        "<section class='genre' id='gameplay'><h2>Gameplay</h2><div class='show-case'></div></section>"+
                        "<section class='genre' id='altro'><h2>Altro</h2><div class='show-case'></div></section>";
    fetch("php/video_fetcher.php?modalita=preferiti").then(onJsonResponse).then(onPrefJson);
    fetch("php/video_fetcher.php?modalita=home").then(onJsonResponse).then(onVideoJson);
}

function onPrefJson(json){
    if(json.length===0)
        document.querySelector("section#preferiti").classList.add("hide");
    else{
        for(element of json){
            create_card(document.querySelector("section#preferiti div.show-case"), element, false);
        }
    }
}

function onJsonResponse(response){
    return response.json();
}

function onVideoJson(json){
    const video = [];
    for(element of json){
        video.push(element);
    }
    loadPage(video);
}

showHome();

let film=0;
let musica=0;
let gameplay=0;
let altro=0;

function loadPage(videoContent){
    for(let elemento of videoContent){
        if(elemento.tipo=='film'){
            film++;
        } else if(elemento.tipo=='musica'){
            musica++;
        } else if(elemento.tipo == 'gameplay'){
            gameplay++;
        } else{
            altro++;
        }
    }
    if(film===0){
        document.querySelector("section#film").classList.add("hide");
        document.querySelector("section#film").classList.remove("show");
    } else{
        document.querySelector("section#film").classList.remove("hide");
        document.querySelector("section#film").classList.add("show");
    }
    if(musica===0){
        document.querySelector("section#musica").classList.add("hide");
        document.querySelector("section#musica").classList.remove("show");
    } else{
        document.querySelector("section#musica").classList.remove("hide");
        document.querySelector("section#musica").classList.add("show");
    }
    if(gameplay===0){
        document.querySelector("section#gameplay").classList.add("hide");
        document.querySelector("section#gameplay").classList.remove("show");
    } else{
        document.querySelector("section#gameplay").classList.remove("hide");
        document.querySelector("section#gameplay").classList.add("show");
    }
    if(altro===0){
        document.querySelector("section#altro").classList.add("hide");
        document.querySelector("section#altro").classList.remove("show");
    } else{
        document.querySelector("section#altro").classList.remove("hide");
        document.querySelector("section#altro").classList.add("show");
    }
    
    for(let elemento of videoContent){
        let sezione=undefined;
        if(elemento.tipo=='film'){
            sezione = document.querySelector("section#film div.show-case");
        } else if(elemento.tipo=='musica'){
            sezione = document.querySelector("section#musica div.show-case");
        } else if(elemento.tipo == 'gameplay'){
            sezione = document.querySelector("section#gameplay div.show-case");
        } else{
            sezione = document.querySelector("section#altro div.show-case");
        }
        create_card(sezione, elemento, true);
    }
}



function create_card(sezione, elemento, preferiti){
    if(preferiti){
        _pref='preferiti';
        _img='https://raw.githubusercontent.com/Caggegi/mhw2/master/img/icons/heart-plus.svg';
    } else{
        _pref='rimuovi';
        _img='https://raw.githubusercontent.com/Caggegi/mhw2/master/img/icons/heart-minus.svg';
    }
    const linker = document.createElement("a");
    const carta = document.createElement("div");
    carta.classList.add("card");
    const immagine = document.createElement("img");
    immagine.src = elemento.immagine;
    immagine.classList.add("image");
    const about = document.createElement("div");
    const titolo = document.createElement("h5");
    titolo.textContent=elemento.titolo;
    const creator = document.createElement("p");
    creator.textContent=elemento.creator;
    const descrizione = document.createElement("p");
    descrizione.textContent=elemento.descrizione;
    descrizione.classList.add("hide");
    descrizione.classList.add("description");
    const plus = document.createElement("img");
    const info = document.createElement("img");
    plus.src=_img;
    plus.dataset.codice = elemento.id;
    plus.dataset.tipo = elemento.tipo;
    plus.classList.add(_pref);
    info.src="https://raw.githubusercontent.com/Caggegi/mhw2/master/img/icons/information.svg";
    info.dataset.codice = elemento.id;
    info.dataset.tipo = elemento.tipo;
    linker.appendChild(immagine);
    linker.href = "video_content.php?id="+elemento.id+"&src="+elemento.src;
    linker.classList.add("linker");
    carta.appendChild(linker);
    info.classList.add("info");
    about.appendChild(titolo);
    about.appendChild(creator);
    about.appendChild(descrizione);
    about.appendChild(plus);
    about.appendChild(info);
    carta.appendChild(about);
    carta.dataset.codice = elemento.id;
    carta.dataset.tipo = elemento.tipo;
    sezione.appendChild(carta);
    const not_favourites = document.querySelectorAll("div.card div img.rimuovi");
    for (let pulsante of not_favourites){
        pulsante.addEventListener("click", rimuoviPreferiti);
    }
    const favourites = document.querySelectorAll("div.card div img.preferiti");
    for (let pulsante of favourites){
        pulsante.addEventListener("click", aggiungiPreferiti);
    }
    const info_button = document.querySelectorAll("div.card div img.info");
    for (let button of info_button){
        button.addEventListener("click", mostraDescrizione);
    }
}

function onText(promise){
    return promise.text();
}

function aggiungiPreferiti(event){
    const add = new FormData();
    add.append("azione", "aggiungi");
    add.append("video_id", event.currentTarget.dataset.codice); 
    fetch("php/favourite_manager.php", {
        method:'post',
        body: add}).then(onText);
    showHome();
}


function rimuoviPreferiti(event){
    const remove = new FormData();
    remove.append("azione", "rimuovi");
    remove.append("video_id", event.currentTarget.dataset.codice); 
    fetch("php/favourite_manager.php", {
        method:'post',
        body: remove}).then(onText);
    showHome();
}