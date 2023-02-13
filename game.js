var level = 1; //default level


window.addEventListener('load', loaded);

function loaded() {

    document.querySelector('#start-button').addEventListener('click', function(){
        document.querySelector('#start-button').classList.toggle('on');

        if( document.querySelector('#start-button').classList.contains('on') ) {
            start_game();
        } else {
            end_game();
        }
    });

}

/**
 * Start game
 */
function start_game() {

    console.log('Start game');

    let selector = document.querySelectorAll('input[name=level]');
    selector.forEach(function(element) {
        if( element.checked ) {
            level = element.value;
            console.log('Level selected: ' + element.value);
        }
    });

    for( let i=0 ; i<100 ; i++ ) {
        console.log(random_number());
    }

}

/**
 * End game
 */
function end_game() {
    
    console.log('End game');

    document.querySelector('#start-button').classList.remove('on');



}

/**
 * Return a random number from 1 to 4
 */
function random_number() {

    return Math.floor(Math.random() * 4) + 1;

}
