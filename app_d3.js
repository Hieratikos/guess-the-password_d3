document.addEventListener('DOMContentLoaded', () => {
    let wordCount = 10;
    let guessCount = 4;
    let password = '';
    const start = d3.select('#start')
        .on("click", function(){
            toggleClasses(d3.select('#start-screen'), 'hide', 'show');
            toggleClasses(d3.select('#game-screen'), 'hide', 'show');
            startGame();
    });

    function toggleClasses(selection){
        for (let i = 0; i < arguments.length; i++){
            let classIsSet = selection.classed(arguments[i]);
            selection.classed(arguments[i], !classIsSet);
        }
    }

    function startGame() {
        // get random words and append them to the DOM
        const wordList = d3.select("#word-list");
        //remove "wordCount" as the second parameter, and assign it as the default value for the second parameter for getRandomValues
        let randomWords = getRandomValues(words);
        randomWords.forEach((word) => {
            wordList
                .append("li")
                .text(word);
        });
        // set a secret password and the guess count display
        password = getRandomValues(randomWords, 1)[0];
        console.log(password);
        setGuessCount(guessCount);
        // add update listener for clicking on a word
        wordList.on('click', updateGame);
    }

    let getRandomValues = (array, numVals=wordCount) => shuffle(array).slice(0,numVals);

    function shuffle(array) {
        var arrayCopy = array.slice();
        for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
            // generate a random index between 0 and idx1 (inclusive)
            var idx2 = Math.floor(Math.random() * (idx1 + 1));
            // swap elements at idx1 and idx2
            [arrayCopy[idx1],arrayCopy[idx2]] = [arrayCopy[idx2],arrayCopy[idx1]]; //one line swap; keep the return statement on a separate line since an assignment happens here
        }
        return arrayCopy;
    }

    function setGuessCount(newCount) {
        guessCount = newCount;
        d3.select("#guesses-remaining")
            .text(`Guesses remaining: ${guessCount}.`);
    }

    function updateGame() {
        let tgt = d3.select(d3.event.target);
        if (tgt.node().tagName === "LI" && !tgt.classed("disabled")) {
            // grab guessed word, check it against password, update view
            let guess = tgt.text();
            let similarityScore = compareWords(guess, password);
            tgt.classed("disabled", true)
                .text(`${guess} --> Matching Letters: ${similarityScore}`);
            setGuessCount(guessCount - 1);

            // check whether the game is over
            if (similarityScore === password.length) {
                toggleClasses(d3.select("#winner"), 'hide', 'show');
                d3.select(this).on('click', null);
            } else if (guessCount === 0) {
                toggleClasses(d3.select("#loser"), 'hide', 'show');
                d3.select(this).on('click', null);
            }
        }
    }

    function compareWords(word1, word2) {
        if (word1.length !== word2.length) throw "Words must have the same length";
        let count = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] === word2[i]) count++;
        }
        return count;
    }
});