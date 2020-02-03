const addInsultButton  = document.querySelector('.submit-button');
const getInsultsButton = document.querySelector('.primary-button');
const sendMsg = document.querySelector('.send-msg');
const inputInsult = document.querySelector('#insult');
const inputPlay = document.querySelector('#play');
const displayInsults = document.querySelector('.products');
const baseURL = 'http://localhost:3000/api/product';

const insert = () => {
    const insult = inputInsult.value;
    const play = inputPlay.value;
    const url = baseURL + '?insult=' + insult + '&play=' + play;

    fetch(url, { method: 'POST' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        finalButtonMsg();
    });
}

const get = () => {
    fetch(baseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        displayInsult(data);
    });
}

const displayInsult = (insults) => {
    for(let i = 0; i < insults.length; i++) {
        let insultElem = document.createElement('p');
        let playElem = document.createElement('p');

        insultElem.innerHTML = insults[i].insult;
        playElem.innerHTML = insults[i].play;

        displayInsults.append(insultElem);
        displayInsults.append(playElem);
    }
}

const updateButtonMsg = event => {
    event.preventDefault();
    
    addInsultButton.classList.add('state-1', 'animated');

    setTimeout(insert, 2000);
};

const finalButtonMsg = () => {
    addInsultButton.classList.add('state-2');
  
    setTimeout(setInitialButtonState, 2000);
};

const setInitialButtonState = () => {
    addInsultButton.classList.remove('state-1', 'state-2', 'animated');
};


addInsultButton.addEventListener('click', updateButtonMsg);
getInsultsButton.addEventListener('click', get);