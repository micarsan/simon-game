var play_status = 'stop'; // Whats state (show, input or stop)
var level; // time between items of sequence
var sequence = [];
var score = 0;
var user_secuence = 0; //index key of sequence for user play
var buttons = ['red','green','yellow','blue']; //buttons order


window.addEventListener('load', loaded);
window.addEventListener('resize', on_resize);


function loaded() {

    // Set size
    on_resize();

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

    // Init storage
    init_storage();


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
            level = 900 / element.value; // Set level
            console.log('Level selected: ' + element.value);
        }
    });

    // Clean last playing status
    document.getElementById('game').classList.remove('user_input');
    score = 0;
    document.getElementById('display').innerHTML = 0;
    

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

    // Launch modal for storage score
    show_modal('insert_score');

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
            play_sound(button_id);
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

        // play audio
        play_sound(element.value);
        
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
                }, level);

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

/**
 * Play a sound (id is key of buttons array)
 */
function play_sound(id) {

    let sound = new Audio('sounds/'+ id +'.mp3').play();

}

/**
 * Events on size change
 */
function on_resize() {

    let window_width = window.innerWidth;
    let window_height = window.innerHeight;

    if( window_width > window_height ) {
        // Set size to height
        document.getElementById('game').style.width = (window_height*0.8) + 'px';
        document.getElementById('game').style.height = (window_height*0.8) + 'px';
    } else {
        // Set size to width
        document.getElementById('game').style.width = (window_width*0.8) + 'px';
        document.getElementById('game').style.height = (window_width*0.8) + 'px';
    }
}

/**
 * Modal
 */

// muestra el modal con la cabecera y cuerpo recibidos
function show_modal(id) {

    //mostramos y animamos
    document.getElementById(id).style.display = 'flex';
    setTimeout(() => {
        document.getElementById(id).classList.add('active');
    }, 50);

    if( id == 'insert_score') {
        document.getElementById('modal_score').innerHTML = document.getElementById('display').innerHTML;
    }
}


//cierra el modal (con su animación)
function close_modal() {
    document.querySelectorAll('.modal').forEach( function(element) {
        element.classList.remove('active');
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 600);
    });
}


/**
 * BDD
 */

var store = window.localStorage;
var score_list = []
var _tbody = document.querySelector("#score_table tbody");


function init_storage() {
  
  if (store.getItem("score_list") == null) {
    store.setItem("score_list", JSON.stringify(score_list));
  }
  score_list = JSON.parse( store.getItem("score_list") );

  console.table(score_list);
}

function sort_score_list(){
    let arr = score_list;
    score_list = arr.sort((a,b) => {
        if ( a.score < b.score ){
          return 1;
        }
        if ( a.score > b.score ){
          return -1;
        }
        return 0;
      });
}

function show_score() {
    show_modal('score_table');
    _tbody.innerHTML="";
    sort_score_list();

    score_list.forEach(element => {
        add_to_score_list(element);
    });
}

function add_to_score_list(score){
  let newElement = document.querySelector("#score_field").content.cloneNode(true);
  newElement.querySelector(".score").innerText  = score.score;
  newElement.querySelector(".name").innerText  = score.name;
  newElement.querySelector(".date").innerText  = score.date;
  _tbody.appendChild(newElement);
}

function save(data) {
  const name = data.querySelector("[name=name]").value;
  const score = parseInt(document.getElementById('display').innerHTML);
  const date_time = new Date();
  const score_field = {
    score: score,
    name: name, 
    date: ('0' + date_time.getDate()).slice(-2) + '/' + ('0' + (date_time.getMonth() + 1)).slice(-2) + '/' + date_time.getFullYear()
  };
  score_list.push( score_field );

  store.setItem("score_list", JSON.stringify(score_list));  
  
  document.querySelector('#insert_score').classList.remove('active');
  setTimeout(() => {
    document.querySelector('#insert_score').style.display = 'none';
  }, 600);

  show_score();
  name.value="";
  return false;
}

// when click on score, show score table
document.getElementById('display').addEventListener('click', show_score);

window.addEventListener('offline', (event) => {
  console.log("The network connection has been lost.");
});