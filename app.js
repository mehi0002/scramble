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
  return(
    <input type="text" value={props.guess} onChange={props.onGuessUpdate}></input>
  );
}

// ************** Pass Button ******************
function PassButton(props){

  return(
    props.passes >= 1 ?
      <button onClick={props.updatePasses}>Pass</button> :
      <button disabled={true}>Pass</button>
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

  // *** States ***
  const [guess, setGuess] = React.useState('');
  const [passes, setPasses] = React.useState(5);
  const [score, setScore] = React.useState(0);
  const [strikes, setStrikes] = React.useState(3);
  const [shuffledWordList, setShuffledWordList] = React.useState(shuffle(wordList));
  const [word, setWord] = React.useState(shuffledWordList[0]);
  const [scrambledWord, setScrambledWord] = React.useState(shuffle(word));

  // *** Handlers ***     
  // function nextWordHandler(){
    
  //   if (shuffledWordList.length > 0){
  //     console.log("getting the next word...");
  //     setWord(shuffledWordList[0]);
  //     setScrambledWord( shuffle(word) );
  //     setShuffledWordList ( prevState => prevState.filter( entry => entry != word) );
  //   }
  // }
  
  // function onResetHandler(){

  //   console.log("initializing reset");
  //   setShuffledWordList( shuffle(wordList));
  //   nextWordHandler();

  // }

  function updateGuessHandler(e){
    setGuess(e.target.value);
  }

  function submitGuessHandler(e){

  }

  function usePassHandler(e){
    e.preventDefault();
    console.log(`Pass Button - ${passes}`);
    
    if (passes >= 1) {
      setPasses(prevState => prevState-1);
    }
    
  }

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
      <form>
        <Guess guess={guess} onGuessUpdate={updateGuessHandler} />
        <PassButton passes={passes} updatePasses={usePassHandler}/>
      </form>
    </>
  );
      
}

root.render(
  <App />
);
