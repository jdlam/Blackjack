function Deck() { // Deck constructor function

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
Deck.prototype.listCards = function listCards() {
  for (var i=0; i<this.cardsArray.length; i++) {
    console.log(this.cardsArray[i]);
  }
  console.log("The deck currently has", this.cardsArray.length, "cards");
};


// Shuffle function
Deck.prototype.shuffle = function shuffle() {
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


// Cards are dealt out to the player and the dealer
Deck.prototype.dealCards = function dealCards() {

  // 2 cards each
  // player first, then dealer.
  for (var i=0; i<2; i++) {
    this.hit(thePlayer);
    this.hit(theDealer);
  }
  console.log("Cards have been dealt");
  thePlayer.evaluateCards();
  theDealer.evaluateCards();
}

Deck.prototype.hit = function hit(player) {
  player.hand.push(this.cardsArray.shift());
}

// -----------------------------------------------------------------------------

// Player Constructor Function

function Player( name ) {
  this.name = name;
  this.hand = [];
  this.bank = 100;
  this.cardValue;
  this.blackjack = false;
  this.currentBet = 0;
  this.bust = false;
}

// Player places bet at the beginning of the game
Player.prototype.placeBet = function placeBet(bet) {
  var bet = parseInt(bet);
  if (bet > this.bank) {
    console.log("You don't have enough");
  } else {
    this.bank -= bet;
    this.currentBet += bet;
    console.log("Your current bet is: " + this.currentBet);
  }
}

// Function to evaluate the player's hand

Player.prototype.evaluateCards = function evaluateCards() {

  // creating my local variable singleValue and setting cardValue back to 0
  var singleValue = [];
  this.cardValue = 0;

  for (var i=0; i<this.hand.length; i++) {
    // Each card is split into 2 strings, the face/number, and then the suit
    // Then it's pushed into the array singleValue
    singleValue.push(this.faceValue(this.hand[i].split(' ')[0]));
    this.cardValue += singleValue[i]; // each value is added to this.cardValue
  }

  // if busted, then double checking for any Aces
  this.checkAces(singleValue);

  // checks the player's cardValue to see if they busted or not
  this.checkBust();
  this.checkBlackjack();
}

Player.prototype.faceValue = function faceValue(face) {// converts cards into values
  if (face === "A") {
    return 11;
  } else if (face === "K" || face === "Q" || face === "J") {
    return 10;
  } else {
    return parseInt(face);
  }
}

Player.prototype.checkAces = function checkAces(singleValue) {
  if (this.cardValue > 21) {
    // If there are aces, then it re-evaluates the cardValue
    // adjustedValues checks for Aces, and converts them to a value of 1
    if (singleValue.indexOf(11) !== -1) {
      singleValue[singleValue.indexOf(11)] = 1;
    }

    // resets the cardValue to 0, then adds the values of adjusted singleValue again
    this.cardValue = 0;
    for (var i=0; i<singleValue.length; i++) {
      this.cardValue += singleValue[i];
    }
  }
}

Player.prototype.stay = function stay() {
  // Only thePlayer will be using the stay function
  // Therefore, the dealer's entire turn is within this function

  theDealer.evaluateCards();
  while (theDealer.cardValue < 17 && theDealer.cardValue !== 0) {
    blackjackDeck.hit(theDealer);
    theDealer.evaluateCards();
    console.log('Dealer while loop finished')
  }
  compareWin();
}

// Evaluates the players' hand for busting
Player.prototype.checkBust = function checkBust() {
  if (this.cardValue > 21) {
    console.log(this.name + " has busted!"); // change these to alerts
    this.cardValue = 0;
    this.bust = true;
    alert(this.name + " has busted!");
  } else {
    console.log(this.name + " has not busted! Keep playing playa");
  }
}

Player.prototype.checkBlackjack = function checkBlackjack() {
  if (this.cardValue === 21 && this.hand.length === 2) {
    this.blackjack = true;
  }
}

// -----------------------------------------------------------------------------

// Functions outside of the constructors/objects

function compareWin() {
  // Checks win conditions between the player and the dealer
  console.log(thePlayer.name + ": " + thePlayer.cardValue);
  console.log(theDealer.name + ": " + theDealer.cardValue);



  if ((thePlayer.blackjack === true && theDealer.blackjack === true) || (thePlayer.cardValue === theDealer.cardValue)) {
    // Tie
    // push. Player receives his bet back
    thePlayer.bank += thePlayer.currentBet;
    thePlayer.currentBet = 0;
    console.log("You tied with the dealer!\nYou received your money back")
  } else if ((thePlayer.blackjack === true) || (thePlayer.cardValue > theDealer.cardValue)) {
    // Player wins
    thePlayer.bank += 2*thePlayer.currentBet;
    console.log("You won $" + 2*thePlayer.currentBet)
    thePlayer.currentBet = 0;
  } else {
    // Dealer wins
    thePlayer.currentBet = 0;
    console.log("You lost...")
  }
  $('.inGame').hide();
  $('.postGame').show();
}

function bindButtons() {
  var buttonId = ['#one', '#five', '#ten', '#twenty', '#fifty'];
  buttonId.map(function(button) {
    $(button).on('click', function() {
      thePlayer.placeBet(this.value);
    })
  })

  $('#deal').on('click', function() {
    blackjackDeck.dealCards();
    $('.inGame').show();
    $('.preGame').hide();
  });

  $('#hit').on('click', function() {
    if (!thePlayer.bust) {
      blackjackDeck.hit(thePlayer);
      thePlayer.evaluateCards();
    } else {
      alert("You've busted, and cannot hit anymore...")
    }

  })

  $('#stay').on('click', function() {
    thePlayer.stay();
  })

  $('#playAgain').on('click', function() {
    var playersArray = [thePlayer, theDealer];
    for (var i=0; i<playersArray.length; i++) {
      playersArray[i].cardValue = 0;
      playersArray[i].hand = [];
      playersArray[i].blackjack = false;
    }
    blackjackDeck = new Deck();
    $('.postGame').hide();
    $('.preGame').show();
  })

  $('#leave').on('click', function() {

  })

}



  var blackjackDeck = new Deck();
  var thePlayer = new Player("Jon");
  var theDealer = new Player("Dealer");


// Runs all of the necessary functions to set up the game
$(document).ready(function() {
  $('.inGame').hide();
  $('.postGame').hide();
  bindButtons();
  blackjackDeck.shuffle();

})
