const Letter = require('./Letter')
const Word = require('./Word')
const wordBank = require('../word_bank')
const inquirer = require('inquirer')

class HangMan {
  constructor( maxGuesses ) {
    if (typeof maxGuesses != 'number') {
      throw new Error('Must hand constructor an integer.')
    }
    this.round = 0
    this.wins = 0
    this.maxGuesses = maxGuesses
    this.setup()
  }

  get guessedLetters() {
    return this._guessedLetters
      .filter(letter => !letter.success)
      .map(letter => letter.value)
  }

  setup() {
    this.clearRoundData()
    this.generateWordObj()
  }

  clearRoundData() {
    this.guessesRemaining = this.maxGuesses
    this._guessedLetters = []
  }

  generateWordObj() {
    this.word = new Word(wordBank[Math.floor(Math.random() * wordBank.length)])
  }

  promptUser() {
    return inquirer.prompt([{
      type: 'input',
      name: 'guess',
      message: 'Guess a letter.'
    }])
  }

  _HUD() {
    console.log('+==========================================================================+')
    console.log(`\n ${this.word.value} `)
    console.log('')
    console.log(` Guesses Left: ${this.guessesRemaining}`)
    console.log(` Wrong Letters: ${this.guessedLetters}`)
    console.log('')
  }

  _title() {
    console.log("       __    __     __     __    __     ___     __     _     __     __     __        ")
    console.log("      |  |  |  |   /  \\   |  \\   | |  /  ___\\  |  \\   / |   /  \\   |  \\   | |  ")
    console.log("      |  |__|  |  / /\\ \\  |   \\  | | /  /  __  |   \\_/  |  / /\\ \\  |   \\  | | ")
    console.log("      |   __   | |  __  | |    \\ | ||  |  |_ | |        | |  __  | |    \\ | |      ")
    console.log("      |  |  |  | | |  | | |  |\\    | \\  \\__/ / |  |\\_/| | | |  | | |  |\\    |   ")
    console.log("      |__|  |__| |_|  |_| |__| \\___|  \\_____/  |__|   |_| |_|  |_| |__| \\___|\n   ")
    
  }

  _letterWasGuessed(guess) {
    let guessed = false
    this._guessedLetters.map(letter => {
      if (letter.value === guess) {
        guessed = true
      }
    })
    return guessed
  }

  letterWasGuessed(guess) {
    if (this._letterWasGuessed(guess)) {
      return this._startTurn()
    }
  }

  _processTurn(guess) {
//TODO: break this function into smaller functions
    // this.letterWasGuessed(guess)
    if (this._letterWasGuessed(guess)) {
      return this._startTurn()
    }

    const correctGuess = this.word.validateGuess(guess)

    if (correctGuess) {
      console.log('correct!')
      if (this.word.solved) {
    
        console.log('WIN!')
        return
      }

    } else {
      console.log('Wrong!')
      this.guessesRemaining--
      if (this.guessesRemaining < 1) {
    
        console.log("LOST!")
        return
      }
    }
    this._guessedLetters.push({value: guess, success: correctGuess})
    return this._startTurn()

  }

  _startTurn() {
    this._HUD()
    this.promptUser()
      .then(answer => {
        if (answer.guess) {
          if (answer.guess === 'quit') {
            console.log('\nQuitting...\n')
            return
          }
          const guess = answer.guess[0].toUpperCase()
          return this._processTurn(guess)    
        }
        return this._startTurn()
      })
  }

  start() {
    this._title()
    this._startTurn()
  }

}

module.exports = HangMan
