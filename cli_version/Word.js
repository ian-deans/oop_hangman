const Letter = require('./Letter')

class Word {
  constructor( value ) {
    this._value = value.toUpperCase()
    this._solved = false
    this.buildLetters()
  }

  get value() {
    return this.display()
  }

  get solved() {
    return this._solved
  }

  buildLetters() {
    this._letters = this._value
      .split('')
      .map(letter => new Letter(letter))
  }

  display() {
    let displayString = ''
    this._letters.forEach(letter => 
      displayString += letter.value)
    return displayString    
  }

  validateGuess(guess) {
    let success = false
    this._letters.forEach(letter => {
      if (letter.match(guess)) {
        success = true
      }
    })
    if (success) {
      if (this.isSolved()) {
        this._solved = true
      }
    }
    return success
  }

  isSolved() {
    let solved = true
    this._letters.forEach(letter => {
      if (!letter.revealed) {
        solved = false
      }
    })
    return solved
  }
}

module.exports = Word
