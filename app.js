/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const root = ReactDOM.createRoot(document.getElementById('root'));
    
// ************* App Title ****************
function Title(props){
  return(
    <h1>{props.children}</h1>
  );
}

// ************* Stat Bar ****************
function Stats(props){

  // *** Build ***
  return(
    <table>
      <thead>
        <tr>
          <th>Score</th>
          <th>Strikes </th>
          <th>Passes </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.score}</td>
          <td className={props.style}>{props.strikes}</td>
          <td>{props.passes}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ************** Message Display *****************
function Message(props){
  return(
    <p id="message">{props.message}</p>
  );
}

// ********** Scrambled Word Display **************
function WordDisplay(props){
  return(
    <p id="wordDisplay"> {props.word} </p>
  );
}

// ************** Guess Input *****************
// Collect the user input and send to the main app upon submission
function Guess(props){
  const [guess, setGuess] = React.useState(props.guess || '');
  
  // *** Handlers ***
  function submitHandler(e){
    e.preventDefault();
    props.submitGuess(guess);
    setGuess('');
  }

  function updateGuess(e){
    setGuess(e.target.value);
  } 

  // *** Build ***
  return(
    <form onSubmit={submitHandler}>
      <input type="text" value={guess} onChange={updateGuess}></input>
    </form>
  );
}

// ************** Pass Button ******************
function PassButton(props){

  // *** Handlers ***
  function clickHandler(e){
    e.preventDefault();
    props.usePass(); 
  }

  // *** Build ***
  return(
    <button disabled={props.disabled} onClick={clickHandler}>Pass</button>
  );
}

// ***************** Reset Button ****************
function ResetButton(props){

 // *** Handlers ***
 function clickHandler(e){
  e.preventDefault();
  props.onReset(); 
}

// *** Build ***
return(
  <button onClick={clickHandler}>New Game?</button>
);
}

// ****************** Main App *******************
function App(){

  // *** Variables ***
  const wordList = [              
    'spray', 
    'amuse', 
    'write', 
    'jelly',
    'claim',
    'style',
    'fraud',
    'radio',
    'dress',
    'child'
  ];

  const initialScore = 0;
  const initialStrikes = 0;
  const maxStrikes = 3;
  const initialPasses = 3;
  const initialMessage = "Guess the scrambled word...";

  // *** States ***
  const [shuffledWordList, setShuffledWordList] = useLocalStorage('shuffledWordList', shuffle(wordList));
  const [word, setWord] = useLocalStorage('word', shuffledWordList[0]);
  const [scrambledWord, setScrambledWord] = useLocalStorage('scrambledWord', shuffle(word));
  const [passes, setPasses] = useLocalStorage('passes', initialPasses);
  const [score, setScore] = useLocalStorage('score', initialScore);
  const [strikes, setStrikes] = useLocalStorage('strikes', initialStrikes);
  const [gameOver, setGameOver] = useLocalStorage('gameOver', false);
  const [message, setMessage] = useLocalStorage('message', initialMessage);

  // *** Effects ***

  // Set up: Initialize game data in local storage
  React.useEffect( () => {                          
    localStorage.setItem('game', JSON.stringify({
      shuffledWordList,
      word,
      scrambledWord,
      passes,
      score,
      strikes,
      message,
      gameOver
    }));
  }

  );

  // Strike out
  React.useEffect( () => {                            // end game if max strikes
    if (strikes === maxStrikes){
      setMessage("3 strikes, you're out");
      endGame();
    }
    }, [strikes]);         

  // *** Functions ***

  // Use local storage
  function useLocalStorage(key, initialState) {
    const game = JSON.parse(localStorage.getItem('game'))
    return React.useState(game ? game[key] : initialState)
  }
  
  //End Game
  function endGame(msg){
    setGameOver(true);
  }

  // Check Guess
  function checkGuess(guess){
    
    if (guess.toLowerCase() === word.toLowerCase()){      // If correct, add a point and get the next word
      setMessage("Correct! Next word...");
      setScore(prevScore => prevScore + 1);
      nextWord();
    }
    else{
      setStrikes(prevStrikes => prevStrikes  + 1);        // If wrong, add a stike
      setMessage("Incorrrect! Try again...");
    }
  }
  
  // Next Word
  function nextWord(){
    
    if (shuffledWordList.length === 0){                   // If there are no words left, end the game
      setMessage("Game Over!");
      endGame();
    }
    else {      
      setWord(shuffledWordList[0]);                       // get the next word in the list
      setScrambledWord(shuffle(shuffledWordList[0]));
      setShuffledWordList ( prevState => prevState.filter( entry => entry != shuffledWordList[0]) );
    }

  }

  // *** Handlers ***     

  // Submit Guess
  function submitGuessHandler(guess){
    checkGuess(guess);
  }

  // Use Pass
  function usePassHandler(){
    setPasses(PrevState => PrevState - 1);
    nextWord(wordList);
    setMessage('Passed! your next word is...')
  }

  // Start a new game
  function resetGameHandler(){
    setShuffledWordList( shuffle(wordList) );
    nextWord();
    setScore(initialScore);
    setStrikes(initialStrikes);
    setPasses(initialPasses);
    setMessage(initialMessage);
    setGameOver(false);
  }

  // *** Build ***
  return(
    <article>
      <header>
        <Title>Scramble</Title>
        {strikes >= 3 ? 
          <Stats score={score} strikes={strikes} passes={passes} style='alert'/> :
          <Stats score={score} strikes={strikes} passes={passes} style=''/>
        }
        <Message message={message}/>
        <WordDisplay word={scrambledWord}/>
      </header>
    
      { gameOver ? 
        < ResetButton onReset={resetGameHandler}/> :
        <>
          <Guess submitGuess={submitGuessHandler} />
          <PassButton usePass={usePassHandler} disabled={ passes === 0 ? true : false} />
        </>
      }
      
    </article>
  );
      
}

root.render(
  <App />
);
