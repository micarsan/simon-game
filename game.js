var play_status = 'stop'; // Whats state (show, input or stop)
var level; // time between items of sequence
var sequence = [];
var score = 0;
var user_secuence = 0; //index key of sequence for user play
var buttons = ['red','green','yellow','blue']; //buttons order


window.addEventListener('load', loaded);

function loaded() {

    // Start button
    document.querySelector('#start-button').addEventListener('click', function(){

        document.querySelector('#start-button').classList.toggle('on');

        if( document.querySelector('#start-button').classList.contains('on') ) {
            start_game();
        } else {
            end_game();
        }
    });

    // Buttons events
    buttons.forEach( ( element ) => {
        document.getElementById(element).addEventListener('click', ()=>{
            button_pushed( document.getElementById(element) );
        });
    });

}

/**
 * Start game
 */
function start_game() {

    console.log('Start game');

    // Get level selector and set (time) level global var
    let selector = document.querySelectorAll('input[name=level]');
    selector.forEach( function(element) {
        if( element.checked ) {
            level = 1200 / element.value; // Set level
            console.log('Level selected: ' + element.value);
        }
    });

    // Clean last playing status
    document.getElementById('game').classList.remove('user_input');
    score = 0;
    document.getElementById('display').innerHTML = score;
    

    // Start
    add_sequence_and_play();
}

/**
 * Add new element to sequence and play
 */
function add_sequence_and_play() {
    
    play_status = 'show';
    
    // Add first element to sequence
    sequence.push(random_number());

    play_sequence();
}

/**
 * End game
 */
function end_game() {
    
    console.log('End game');

    play_status = 'stop';

    document.getElementById('game').classList.remove('user_input');
    document.querySelector('#start-button').classList.remove('on');

    user_secuence = 0;
    sequence = [];

}

/**
 * Return a random number from 0 to 3
 */
function random_number() {
    return Math.floor(Math.random() * 4);
}

/**
 * Play sequence
 */
function play_sequence(){

    console.log('playing secuence');
    play_status = 'show';

    // Play sequence
    for( let i = 0 ; i<sequence.length ; i++ ) {

        let button_id = sequence[i];

        setTimeout( () => {
            button_on( document.querySelector('#'+buttons[button_id]) );
        }, level*i);
    }

    // Get user input
    setTimeout( () => {
        user_input();
    }, level*( sequence.length ) );

}

/**
 * Set button (element node) active and inactive for visual play
 */
function button_on(element) {
    
    element.classList.add('on');
    setTimeout( () => {
        element.classList.remove('on');
    }, level/2);

}

/**
 * Check button pushed and secuence
 */
function button_pushed(element) {
    
    if( play_status === 'input' ) {

        console.log("\n ### button_pushed");
        console.log('user_secuence: ' + user_secuence);
        console.log('sequence[user_secuence]: ' + sequence[user_secuence]);
        console.log('element.value: ' + element.value);
        
        if( sequence[user_secuence] == element.value) { // ok

            score++;
            document.getElementById('display').innerHTML = score;
            
            // Check if is the last of sequence
            if( user_secuence+1 == sequence.length ) {

                console.log('## Last element');
                user_secuence = 0;
                play_status = '';
                document.getElementById('game').classList.remove('user_input');

                setTimeout( () => {
                    add_sequence_and_play();
                }, level/2);

            } else {
                user_secuence++;
            }

        } else { //fail

            console.log('fail');
            end_game();
            return false;
            
        }
    }
}



/**
 * User input (wait for user input and check)
 */
function user_input() {

    play_status = 'input';

    document.getElementById('game').classList.add('user_input');


}