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

  // Handlers
  function clickHandler(e){
    e.preventDefault();
    
    if (props.wordList.length >0) {
      props.usePass(props.passes);
      props.nextWord(props.wordList)
    }
      
     
  }

  return(
    props.passes >= 1 ?
      <button onClick={clickHandler}>Pass</button> :
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
  const initialScore = 0;
  const initialStrikes = 3;
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

  // *** Handlers ***     
  function nextWordHandler(wordList){
    
    if (wordList.length >= 2){
      console.log("getting the next word...");
      
      setWord(wordList[1]);
      setScrambledWord( shuffle(wordList[1]) );
      setShuffledWordList ( wordList.filter( entry => entry != wordList[0]) );
    }
  }
  
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

  function resetHandler(){
    setReset(true);
  }

  function usePassHandler(passes){
    console.log(`Pass Button - ${passes}`);
    
    if (passes >= 1) {
      setPasses(passes - 1);

    }
    
  }

  if(reset){
    setShuffledWordList(shuffle(wordList));
    setWord(shuffledWordList[0]);
    setScrambledWord(shuffle(word));
    setShuffledWordList( prevState => prevState.filter(entry => entry != word));
    setScore(initialScore);
    setStrikes(initialStrikes);
    setPasses(initialPasses);
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
        <PassButton passes={passes} usePass={usePassHandler} wordList={shuffledWordList} nextWord={nextWordHandler} />
      </form>
    </>
  );
      
}

root.render(
  <App />
);
