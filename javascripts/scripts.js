function deck() { // Deck constructor function

  // Defining each component of a card
  // The number/face value and the suit value
  var face = ['A', 'K', 'Q', 'J'];
  var numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  var suits = ['&spades', '&clubs', '&hearts', '&diams'];

  this.cardsArray = [];
  // Creating all of the face cards
  for (var i=0; i<suits.length; i++) {
    for (var j=0; j<face.length; j++) {
      this.cardsArray.push(face[j] + " " + suits[i]);
    }
  }

  // Creating all of the number cards
  for (var i=0; i<suits.length; i++) {
    for (var j=0; j<numbers.length; j++) {
      this.cardsArray.push(numbers[j] + " " + suits[i]);
    }
  }
}

// Temporary function to list all of the cards within my deck
// Makes life easier in the midst of developing
deck.prototype.listCards = function listCards() {
  for (var i=0; i<this.cardsArray.length; i++) {
    console.log(this.cardsArray[i]);
  }
  console.log("The deck currently has", this.cardsArray.length, "cards");
};


// Shuffle function
deck.prototype.shuffle = function shuffle() {
  var shuffleIdx = this.cardsArray.length;
  var swapIdx;
  var temp;

  // This is what I would call a 3 point swap. Using 3 variables, one of which is temporary.

  while (shuffleIdx > 0) { // loop that iterates through every value of this.cardsArray
    swapIdx = Math.floor(Math.random() * shuffleIdx--);
    // swapIdx is defined as a random index between 0 and the shuffleIdx-1
    // Since shuffleIdx = this.cardsArray.length, it starts at 52
    // this.cardsArray[52] is undefined, since the index that has a value is 51
    temp = this.cardsArray[shuffleIdx]; // Declares temp to the value of the last unshuffled card
    this.cardsArray[shuffleIdx] = this.cardsArray[swapIdx]; // Sets the value of the last unshuffled card to a random card preceeding it in index number
    this.cardsArray[swapIdx] = temp; // Sets the card with the preceeding index to the value of the temp variable
  }
  console.log('The cards have been shuffled\nWe\'re ready to play');
}

deck.prototype.dealCards = function dealCards() {
  for (var i=0; i<2; i++) {
    theDealer.hand.push(this.cardsArray.shift());
    thePlayer.hand.push(this.cardsArray.shift());
  }
  console.log("Cards have been dealt");
}

function player() {
  this.hand = [];
  this.bank = 100;
}

var blackjackDeck = new deck();
var thePlayer = new player();
var theDealer = new player();
