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
          <td>{props.strikes}</td>
          <td>{props.passes}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ********** Scrambled Word Display **************
function WordDisplay(props){
  return(
    <p> {props.word} </p>
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
    props.usePass(props.passes, props.wordList);   
  }

  // *** Build ***
  return(
    <form>
        <button onClick={clickHandler}>Pass</button>
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
    'treatment', 
    'abundant', 
    'mainstream', 
    'productive',
    'incentive',
    'sensitivity',
    'farewell',
    'fastidious',
    'classify',
    'history'
  ];
  
  let shuffledWordList = [];
  let word = "";
  let scrambledWord = "";
  let loaded = true;
  let newGame = true;
  const initialScore = 0;
  const initialStrikes = 0;
  const initialPasses = 3;
  
  
  // *** States ***
  // const [shuffledWordList, setShuffledWordList] = React.useState(shuffle(wordList));
  // const [word, setWord] = React.useState(shuffledWordList[0]);
  // const [scrambledWord, setScrambledWord] = React.useState(shuffle(word));
  const [guess, setGuess] = React.useState('');
  const [passes, setPasses] = React.useState(JSON.parse(localStorage.getItem('passes')) || initialPasses);
  const [score, setScore] = React.useState(JSON.parse(localStorage.getItem('score')) || initialScore);
  const [strikes, setStrikes] = React.useState(JSON.parse(localStorage.getItem('strikes')) || initialStrikes);
  const [gameOver, setGameOver] = React.useState(false);
  // const [reset, setReset] = React.useState(false);  
  // const [newGame, setNewGame] = React.useState(true); 

  // *** Functions ***
  function loadGame(){
    console.log("Loading game data...");

    shuffledWordList = JSON.parse(localStorage.getItem('shuffledWordList'));
    word = localStorage.getItem('word');
    scrambledWord = localStorage.getItem('scrambledWord');
    newGame = JSON.parse(localStorage.getItem('newGame'));
    // setScore(JSON.parse(localStorage.getItem('score')) );
    // setStrikes( JSON.parse(localStorage.getItem('strikes')) );
    // setPasses( JSON.parse(localStorage.getItem('passes')) );
    // setGameOver( JSON.parse(localStorage.getItem('gameOver')));

  }

  function saveGame(){
    console.log("Saving game data...");

    localStorage.setItem('shuffledWordList', JSON.stringify(shuffledWordList));
    localStorage.setItem('word', word);
    localStorage.setItem('scrambledWord', scrambledWord);
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('strikes', JSON.stringify(strikes));
    localStorage.setItem('passes', JSON.stringify(passes));
    localStorage.setItem('gameOver', JSON.stringify(gameOver));
    localStorage.setItem('newGame', JSON.stringify(newGame));
}

// function startNewGame(){
//   console.log("The dawn of a new game...");
//   localStorage.clear();

//   shuffledWordList = shuffle(wordList);
//   word = shuffledWordList[0];
//   scrambledWord = shuffle(word);
//   newGame = false;
//   saveGame();
//   setScore(0);
//   setStrikes(0);
//   setPasses(3);  
// }

  function nextWord(wordList){
    
    // if (wordList.length >= 2){
    //   console.log("getting the next word...");
    //   setWord(wordList[1]);
    //   setScrambledWord( shuffle(wordList[1]) );
    // }
    // else
    //   console.log("No more words - Game over!");

    // setShuffledWordList ( wordList.filter( entry => entry != wordList[0]) );

    if (wordList.length >= 2){
      console.log("getting the next word...");

      word = wordList[1];
      scrambledWord = shuffle(wordList[1]);
      shuffledWordList = wordList.filter( entry => entry != wordList[0]) ;
    }
    else
      setGameOver(true);

    saveGame();
  }

  // *** Handlers ***     

  // Update Guess
  function updateGuessHandler(guess){
    setGuess(guess);
  }

  // Submit Guess
  function submitGuessHandler(guess, word, wordList){
    console.log(`Guess: ${guess} - Answer: ${word}`);
    
    if (guess === word){
      console.log("correct!")
      setScore(prevScore => prevScore + 1);
      nextWord(wordList);
    }
    else{
      console.log("Incorrrect!");
      
      setStrikes(prevStrikes => prevStrikes  + 1);
      strikes >= 2 && setGameOver(true);
    }

    setGuess('');
    saveGame();
  }

  // Use Pass
  function usePassHandler(passes, wordList){
    console.log(`Pass Button - ${passes}`);
    
    setPasses(prevPasses => prevPasses - 1);
    setGuess('');
    
    if (passes > 1){
      nextWord(wordList);
      saveGame();
    }
    else 
      setGameOver(true);

  }

  function resetGameHandler(){
    console.log(`Resetting game... `);

    localStorage.clear();

    setScore(initialScore);
    setStrikes(initialStrikes);
    setPasses(initialPasses);
    setGuess('');
    setGameOver(false);
  }

  // // *** Game Reset ****
  // function resetGameHandler(){
  //   setShuffledWordList(shuffle(wordList));
  //   setWord(shuffledWordList[0]);
  //   setScrambledWord(shuffle(word));
  //   setShuffledWordList( prevState => prevState.filter(entry => entry != word));
  //   setScore(initialScore);
  //   setStrikes(initialStrikes);
  //   setPasses(initialPasses);
  // }

  // Disable and end game when out of words/strikes
  // if( strikes === 3 || shuffledWordList.length === 0){
  //   console.log("disabling gameplay...");
  //   setGuess("Game Over!");
  //   setGameOver(true);
  // }

  
  // if(newGame === true){
  //   console.log("The dawn of a new game...");
  //   localStorage.clear();

  //   shuffledWordList = shuffle(wordList);
  //   word = shuffledWordList[0];
  //   scrambledWord = shuffle(word);
  //   saveGame();
  //   setNewGame(prevState => !prevState);
  // }
  // else{
  //   loadGame();
  // }

  loadGame();
  console.log(`New game?: ${newGame}`);

  if (newGame != false){
    console.log("The dawn of a new game...");
    shuffledWordList = shuffle(wordList);
    word = shuffledWordList[0];
    scrambledWord = shuffle(word);
    newGame = false;
    saveGame();
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
  // console.log(`Game Over?: ${gameOver}`);
  console.log(`New game? : ${newGame}`);

  // *** Build ***

  return(
    <>
      <h1>Scramble</h1>

      <Stats score={score} strikes={strikes} passes={passes} disabled={gameOver}/>
      <WordDisplay word={scrambledWord} disabled={gameOver}/>
      
      { gameOver ? 
        <ResetButton reset={resetGameHandler}/> :
        <>
          <Guess guess={guess} onGuessUpdate={updateGuessHandler} submitGuess={submitGuessHandler} word={word} wordList={shuffledWordList}/>
          <PassButton passes={passes} usePass={usePassHandler} wordList={shuffledWordList} />
        </>
      }
      
    </>
  );
      
}

root.render(
  <App />
);
