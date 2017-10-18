(function(){ // IIFEs avoid messy global variables

    var startButton = document.getElementById('start-game')

    // Constructor Function
    function HangMan(gameDiv) {
        this.dom = gameDiv      // reference to the game-container element
        this.active = false     // variable for determining game status
        this.wins = 0           // variable for tracking wins
        this.losses = 0         // variable for tracking losses
        this.state = {}         // variable for storing game-state
        
        // Binding 'this' pointer to the instance
        this.endGame = this.endGame.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.isGameOver = this.isGameOver.bind(this)
        this.revealLetter = this.revealLetter.bind(this)
        this.setup = this.setup.bind(this)
        this.updateCurrentWord = this.updateCurrentWord.bind(this)
        this.updateDisplay = this.updateDisplay.bind(this)
        
        // Set up start button
        this.startButton = this.dom.querySelector('.start-game')
        this.startButton.addEventListener('click', this.setup)
        
        // Add event listener for key strokes while game is focused on
        this.dom.addEventListener('keypress', this.handleKeyPress)
    }



    // Static Methods

    //  Array for holding the words/phrase
    HangMan.wordBank = [
        'this is a test', 
        'hangman can get complicated', 
        'handling phrases now', 
        'walking through a park'
    ]

    // Returns a set of references to HTML elements
    HangMan.elements = function(domRef) {
        return {
            wins: domRef.querySelector('.total-wins'),
            losses: domRef.querySelector('.total-losses'),
            word: domRef.querySelector('.current-word'),
            guesses: domRef.querySelector('.guesses-remaining'),
            incorrectGuesses: domRef.querySelector('.wrong-guesses'),
            status: domRef.querySelector('.game-status'),
        }
    }

    // Determines if a character is an alphabetic letter
    HangMan.isLetter = function(char) {
        return char.length === 1 && char.match(/[a-z]/i); // regular expression
    }

    // Returns a fresh set of state variables
    HangMan.newState = function() {
        return {
            currentWord: '',
            keyWord: HangMan.randomWord(), // Static functions can be invoked from the class root
            guessesRemaining: 10,
            incorrectGuesses: [],
        }
    }

    // Selects a random word from the bank and returns it 
    HangMan.randomWord = function() {
        return HangMan.wordBank[Math.floor(Math.random() * HangMan.wordBank.length)]
    }

    // Takes a word and returns a string with underscores for every letter in provided word
    HangMan.underScores = function(word) {
        
        var underScores = ''            // empty string to add underscores to

        for (var i=0, l=word.length; i<l;i++) {
            if (word[i] === ' ') {      // if current character is a space, then add a space
                underScores += ' '
            } else {                    // otherwise add an underscore
                underScores += '_'
            }
        }
        return underScores              // return the string
    }


    // Class Methods
    HangMan.prototype = {

        // handles all end game logic
        endGame: function() {
            this.active = false
            
            if (this.isWin()) {
                this.wins += 1
            } else {
                this.losses += 1
            }

            this.updateScore()
            this.startButton.classList.remove('hidden')
        },

        // returns true is win or loss conditions are met
        isGameOver() {
            return this.isWin() || this.isLoss()
        },
        
        // returns true if loss condition is met
        isLoss: function() {
            return this.state.guessesRemaining < 1
        },

        // returns true if win condition is met
        isWin: function() {
            return this.state.keyWord === this.state.currentWord
        },

        // the game flow 'operator'
        handleKeyPress: function(event) {
          
            if (!this.active) {  // Check if game is active
                
                if (event.key === 'Enter') {
                    this.setup() // Start the game if enter is pressed
                }
                return
            }            
            
            if (HangMan.isLetter(event.key)) { // Make sure the user pressed a letter key
                var letter = event.key.toLowerCase() // Just incase capslock is on...
                
                if (this.state.keyWord.includes(letter)) { // if guess was correct
                    this.revealLetter(letter)   // reveal all instances of the letter
                    
                } else { // if incorrect
                    if (!this.state.incorrectGuesses.includes(letter)) { // only counts if not already guessed
                        this.state.incorrectGuesses.push(letter)    // add letter to array
                        this.state.guessesRemaining--               // decrement guesses left
                    }
                    this.updateGuesses() // update DOM elements for guesses data
                }
                
                if (this.isGameOver()) {  // check for end game conditions
                    this.endGame() // handle either a win or a loss
                }
            }
        },

        // replace underscore with letter where match is found
        revealLetter: function(letter) {

            var keyWord = this.state.keyWord
            var currentWord = this.state.currentWord.split('') // split the word into an array
            
            for (var i=0, l=keyWord.length; i<l; i++) {
                if (keyWord[i] === letter) {    // if the current letter in keyWord matches letter variable
                    currentWord[i] = letter     // reassign the value at the current index to the value of letter
                }
            }

            this.state.currentWord = currentWord.join("")   // join array together and assign to currentWord
            this.updateCurrentWord()                        // update the html
        },

        // handles all logic for setting up and starting a new game
        setup: function() {
            this.startButton.classList.add('hidden')     // hide start button

            this.state = HangMan.newState()         // get fresh state object
            this.divs = HangMan.elements(this.dom)  // get html element references
            this.active = true                      // set game to active
            this.state.currentWord = HangMan.underScores(this.state.keyWord) // set currentWord to all underscores
            this.updateDisplay()                    // update all the neccesary data 
        },

        // assigns the value of currentWord to the DOM
        updateCurrentWord: function() {
            this.divs.word.innerHTML = this.state.currentWord
        },
        
        // updates the current word and the guessed letter on the DOM
        updateDisplay: function() {
            this.updateCurrentWord()
            this.updateGuesses()
        },

        // updates the DOM
        updateGuesses: function() {
            this.divs.guesses.innerHTML = this.state.guessesRemaining
            this.divs.incorrectGuesses.innerHTML = this.state.incorrectGuesses.join(",")
        },

        // updates the score-board elements on the DOM
        updateScore: function() {
            this.divs.wins.innerHTML = this.wins
            this.divs.losses.innerHTML = this.losses
        },
    }
    
    // Instantiate an instance of the class HangMan for each game found on the document
    // ( this handles mutliple games on one page)
    document.querySelectorAll('.game').forEach(function(game) {
        var hangman = new HangMan(game)
    })

}());