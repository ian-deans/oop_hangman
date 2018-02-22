
class Letter {
  constructor( value ) {
    if (typeof value != 'string') {
      throw new Error('Constructor must be handed a string object.')
    }
    this._value = value.toUpperCase()
    this._revealed = false
  }

  get value() {
    return this.display()
  }

  // set value( newValue ) {
  //   return
  // }

  get revealed() {
    return this._revealed
  }

  match( userGuess ) {
    if ( userGuess.toUpperCase() === this._value ) {
      this.reveal()
      return true
    }
    return false
  }

  reveal() {
    this._revealed = true
  }

  display() {
    return this._revealed ? ` ${this._value} ` : ' _ '
  }
}

module.exports = Letter
