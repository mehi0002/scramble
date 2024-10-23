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
    
// ************ Message Bar **************
function Message(props){
  
  // *** Build ***
  return(
    <p id="message">{props.msg}</p>
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
          { props.strikes >= 3 ? <td className="alert">{props.strikes}</td> : <td>{props.strikes}</td> }
          <td>{props.passes}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ********** Scrambled Word Display **************
function WordDisplay(props){
  return(
    <p id="wordDisplay"> {props.word} </p>
  );
}

// ************** Guess Input *****************
function Guess(props){
  
  function submitHandler(e){
    e.preventDefault();
    console.log("submitting a guess...")
    props.submitGuess(props.guess, props.word, props.wordList);
  }

  function updateGuess(e){
    props.onGuessUpdate(e.target.value);
  } 

  return(
    <form onSubmit={submitHandler}>
      <input type="text" value={props.guess} onChange={updateGuess}></input>
    </form>
  );
}

// ************** Pass Button ******************
function PassButton(props){

  // Handlers
  function clickHandler(e){
    e.preventDefault();
    props.usePass(props.passes);   
  }

  // *** Build ***
  return(
    <form>
        <button disabled={props.disabled} onClick={clickHandler}>Pass</button>
    </form>
  );
}

// ************** Reset Button ******************
function ResetButton(props){

  // Handlers
  function clickHandler(e){
    e.preventDefault();
    console.log(`Clicked the reset button`);
    props.reset();   
  }

  // *** Build ***
  return(
    <form>
      <p>Game Over!</p>
      <button onClick={clickHandler}>Play Again?</button>
    </form>
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
  
  let shuffledWordList = [];
  let word = "";
  let scrambledWord = "";
  let newGame = true;
  const initialScore = 0;
  const initialStrikes = 0;
  const initialPasses = 3;
  const initialMessage = '';
  
  // *** States ***
  const [guess, setGuess] = React.useState('');
  const [message, setMessage] = React.useState(localStorage.getItem('message') || initialMessage);
  const [passes, setPasses] = React.useState(JSON.parse(localStorage.getItem('passes')) === null ? initialPasses : JSON.parse(localStorage.getItem('passes')));
  const [score, setScore] = React.useState(JSON.parse(localStorage.getItem('score')) || initialScore);
  const [strikes, setStrikes] = React.useState(JSON.parse(localStorage.getItem('strikes')) || initialStrikes);
  const [gameOver, setGameOver] = React.useState(JSON.parse(localStorage.getItem('gameOver')) || false);

  // *** Effects ***
  React.useEffect(() => {localStorage.setItem('score', score)}, [score]);
  React.useEffect(() => {localStorage.setItem('strikes', strikes)}, [strikes]);
  React.useEffect(() => {localStorage.setItem('passes', passes)}, [passes]);
  React.useEffect(() => {localStorage.setItem('gameOver', gameOver)}, [gameOver]);
  React.useEffect(() => {localStorage.setItem('message', message)}, [message]);

  // *** Functions ***
  // Save Game
  function saveGame(){
    console.log("Saving game data...");

    localStorage.setItem('shuffledWordList', JSON.stringify(shuffledWordList));
    localStorage.setItem('word', word);
    localStorage.setItem('scrambledWord', scrambledWord);
    localStorage.setItem('newGame', JSON.stringify(newGame));
  }

  // End Game
  function endGame(){
    console.log("ending the game...");

    setGameOver(true);
    scrambledWord = "";
    saveGame();
  }

  // Next Word 
  function nextWord(){

    if (shuffledWordList.length >= 2){
      console.log("getting the next word...");

      word = shuffledWordList[1];
      scrambledWord = shuffle(shuffledWordList[1]);
      shuffledWordList = shuffledWordList.filter( entry => entry != shuffledWordList[0]);
      saveGame();
    }
    else {
      console.log("out of words");
      endGame();
    }

  }

  // *** Handlers ***     

  // Update Guess
  function updateGuessHandler(guess){
    setGuess(guess);
  }

  // Submit Guess
  function submitGuessHandler(guess, word, wordList){
    console.log(`Guess: ${guess} - Answer: ${word}`);
    
    if (guess === word){                                  // *** correct answer **
      setScore(prevScore => prevScore + 1);                 
      
      if (wordList.length === 1){                         // end game if out of words
        setMessage("You win!");
        endGame();
      }
      else{                                                // continue to next word
        setMessage("Correct!");
        nextWord();
      }
      
    }
    else{                                                   // *** wrong answer ***
      setStrikes(prevStrikes => prevStrikes  + 1);

      if (strikes >= 2){                                    // 3 strikes, your out. End game
        setMessage("3 strikes, you're out!");
        endGame();
      }
      else                                                  // continue ot next word
        setMessage("Incorrrect!");
    }

    setGuess('');
    saveGame();
  }

  // Use Pass
  function usePassHandler(passes){
    console.log(`Using a Pass...`);
    
    setPasses(prevPasses => prevPasses - 1);                // Update passes
    setGuess('');
    setMessage('Passed');
    
    if (passes >= 1){
      
      if( shuffledWordList.length === 1 ){                  // End game if out of words
        setMessage("You win!");
        endGame();
      }
      else                                                  // go to next word
        nextWord();
    }

  }

  // Reset Game
  function resetGameHandler(){
    console.log(`Resetting game... `);

    localStorage.clear();

    setScore(initialScore);
    setStrikes(initialStrikes);
    setPasses(initialPasses);
    setGuess('');
    setMessage(initialMessage);
    setGameOver(false);
  }

  // *** On Load ***
  newGame = JSON.parse(localStorage.getItem('newGame'));    // Check if there is a game saved
  console.log(`New game?: ${newGame}`);

  if (newGame != false){                                    // No data, start a new game
    console.log("The dawn of a new game...");
    
    shuffledWordList = shuffle(wordList);
    word = shuffledWordList[0];
    scrambledWord = shuffle(word);
    newGame = false;
    saveGame();
  }
  else {                                                    // loading saved data
    console.log("Loading game data...");

    shuffledWordList = JSON.parse(localStorage.getItem('shuffledWordList'));
    word = localStorage.getItem('word');
    scrambledWord = localStorage.getItem('scrambledWord');
  }

  // *** Testing ***
  console.log(wordList);
  console.log(shuffledWordList);
  console.log(`Scramble: ${scrambledWord}`);
  console.log(`Answer: ${word}`);
  console.log(`Guess: ${guess}`);
  console.log(`Score: ${score}`);
  console.log(`Strikes: ${strikes}`);
  console.log(`Passes: ${passes}`);
  console.log(`Game Over?: ${gameOver}`);
  console.log(`New game? : ${newGame}`);

  // *** Build ***
  return(
    <article>

      <header>
        <h1>Scramble</h1>
        <Stats score={score} strikes={strikes} passes={passes} disabled={gameOver}/>
        <Message msg={message} />
        <WordDisplay word={scrambledWord} disabled={gameOver}/>
      </header>
      
      { gameOver ? 
        <ResetButton reset={resetGameHandler}/> :
        <>
          <Guess guess={guess} onGuessUpdate={updateGuessHandler} submitGuess={submitGuessHandler} word={word} wordList={shuffledWordList}/>
          {passes > 0 ? 
            <PassButton passes={passes} usePass={usePassHandler} disabled={false}/> :
            <PassButton passes={passes} usePass={usePassHandler} disabled={true}/>
          }
        </>
      }
      
    </article>
  );
      
}

root.render(
  <App />
);
