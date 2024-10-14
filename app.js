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
      { props.passes >= 1 ?
        <button onClick={clickHandler}>Pass</button> :
        <button disabled={true}>Pass</button>
      }
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
  const initialScore = 0;
  const initialStrikes = 0;
  const initialPasses = 3;

  // *** States ***
  const [shuffledWordList, setShuffledWordList] = React.useState(shuffle(wordList));
  const [word, setWord] = React.useState(shuffledWordList[0]);
  const [scrambledWord, setScrambledWord] = React.useState(shuffle(word));
  const [guess, setGuess] = React.useState('');
  const [passes, setPasses] = React.useState(initialPasses);
  const [score, setScore] = React.useState(initialScore);
  const [strikes, setStrikes] = React.useState(initialStrikes);
  const [reset, setReset] = React.useState(false);

  // *** Functions ***
  function nextWord(wordList){
    
    if (wordList.length >= 2){
      console.log("getting the next word...");
      setWord(wordList[1]);
      setScrambledWord( shuffle(wordList[1]) );
    }
    else
      console.log("No more words - Game over!");

    setShuffledWordList ( wordList.filter( entry => entry != wordList[0]) );

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
      setGuess('');
      nextWord(wordList);
    }
    else{
      console.log("Incorrrect!");
      setStrikes(prevStrikes => prevStrikes  + 1);
      setGuess('');
    }
  }

  // Use Pass
  function usePassHandler(passes, wordList){
    console.log(`Pass Button - ${passes}`);
    
    passes >= 1 && setPasses(passes - 1);
    nextWord(wordList);

  }

  // *** Game Reset ****
  if(reset){
    setShuffledWordList(shuffle(wordList));
    setWord(shuffledWordList[0]);
    setScrambledWord(shuffle(word));
    setShuffledWordList( prevState => prevState.filter(entry => entry != word));
    setScore(initialScore);
    setStrikes(initialStrikes);
    setPasses(initialPasses);
  }

  // Disable and end game when out of words/strikes
  if( strikes === 3 || shuffledWordList.length === 0)
    console.log("disabling gameplay...");

  // *** Testing ***
  console.log(wordList);
  console.log(shuffledWordList);
  console.log(`Scramble: ${scrambledWord}`);
  console.log(`Answer: ${word}`);
  console.log(`Guess: ${guess}`);
  console.log(`Passes: ${passes}`);

  // *** Build ***

  return(
    <>
      <h1>Scramble</h1>
      <Stats score={score} strikes={strikes} passes={passes} />
      <WordDisplay word={scrambledWord}/>
      <Guess guess={guess} onGuessUpdate={updateGuessHandler} submitGuess={submitGuessHandler} word={word} wordList={shuffledWordList}/>
      <PassButton passes={passes} usePass={usePassHandler} wordList={shuffledWordList} />
    </>
  );
      
}

root.render(
  <App />
);
