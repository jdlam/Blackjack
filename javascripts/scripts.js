function Deck() { // Deck constructor function

  // Defining each component of a card
  // The number/face value and the suit value
  var face = ['A', 'K', 'Q', 'J'];
  var numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  var suits = ['Club', 'Spade', 'Heart', 'Diamond'];

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
  updateConsole('The cards have been shuffled\nWe\'re ready to play');
}

// Cards are dealt out to the player and the dealer
Deck.prototype.dealCards = function dealCards() {

  // 2 cards each
  // player first, then dealer.
  for (var i=0; i<2; i++) {
    this.hit(thePlayer);
    thePlayer.generateHand(false);
    this.hit(theDealer);
    theDealer.generateHand(false);
  }
  updateConsole("Cards have been dealt!");
  thePlayer.evaluateCards();
  theDealer.evaluateCards();
}

// Hit function that gives a specified player a card
Deck.prototype.hit = function hit(player) {
  player.hand.push(this.cardsArray.shift());
}


// -----------------------------------------------------------------------------


// Player Constructor Function
function Player( name ) {
  this.name = name;
  this.hand = [];
  this.balance = 500;
  this.cardValue;
  this.blackjack = false;
  this.currentBet = 0;
  this.bust = false;
}

// Player places bet at the beginning of the game
Player.prototype.placeBet = function placeBet(bet) {
  var bet = parseInt(bet);
  if (bet > this.balance) {
    updateConsole("You don't have enough");
  } else {
    this.balance -= bet;
    this.currentBet += bet;
    updateBankConsole();
  }
}

// Function to evaluate the player's hand
Player.prototype.evaluateCards = function evaluateCards() {
  // creating my local variable singleValue and setting cardValue back to 0
  this.generateHand(false);
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

  if (thePlayer.blackjack === true && theDealer.blackjack === false) {
    playAudio();
    switchMenu(3);
  }
}

// evaluates cards into values
Player.prototype.faceValue = function faceValue(face) {
  if (face === "A") {
    return 11;
  } else if (face === "K" || face === "Q" || face === "J") {
    return 10;
  } else {
    return parseInt(face);
  }
}

// checks cards for aces, and converts their value from 11 to 1
// only used if the player has already busted with Aces set to 11
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

// The player decides to stay
Player.prototype.stay = function stay() {
  // Only thePlayer will be using the stay function
  // Therefore, the dealer's entire turn is within this function

  if (this.cardValue > 0) {
    theDealer.evaluateCards();
    while (theDealer.cardValue < 17 && theDealer.cardValue !== 0) {
      blackjackDeck.hit(theDealer);
      theDealer.evaluateCards();
    }
  }
  theDealer.generateHand(true);
  compareWin();
}

// Evaluates the players' hand for busting
Player.prototype.checkBust = function checkBust() {
  if (this.cardValue > 21) {
    updateConsole(this.name + " have busted!"); // change these to alerts
    this.cardValue = 0;
    this.bust = true;
    if (this.name !== "The Dealer") {
      switchMenu(3);
      compareWin();
      updateBankConsole();
    }
  }
}

// Evaluates for blackjack status
Player.prototype.checkBlackjack = function checkBlackjack() {
  if (this.cardValue === 21 && this.hand.length === 2) {
    this.blackjack = true;
  }
}

// resets the player's values and hand for the next round
Player.prototype.nextRound = function nextRound() {
  this.cardValue = 0;
  this.hand = [];
  this.blackjack = false;
  var player;
  if (this.name !== "The Dealer") {
    player = "player";
  } else {
    player = "dealer";
  }
  this.removeCardImages(player);
}

// generates the images for the player's cards into their hand
Player.prototype.generateHand = function generateHand(endGame) {

  var player;
  if (this.name !== "The Dealer") {
    player = "player";
  } else {
    player = "dealer";
  }

  this.removeCardImages(player);

  if (player !== "dealer" || endGame === true) {
    // call image for first card in hand
    this.callCardImage(this.hand, 0, player)
    if (thePlayer.blackjack === true) {
      updateConsole("You have blackjack!");
    }
  } else {
    // call image for the back of a card
    var backNode = $('<img>').attr('src', 'images/classic-cards/b1fv.png');
    backNode.attr('class', 'dealerCard card');
    backNode.css({left: '0vw'});
    $('.' + player).append(backNode);
  }

  for (i=1; i<this.hand.length; i++) {
    this.callCardImage(this.hand, i, player)
  }
}

// calls upon the image by generating a node with a specified path and appending it
Player.prototype.callCardImage = function callCardImage(image, counter, player) {
  var card = image[counter].split(' ');
  var cardCode = 0;
  // generates the value for the card code
  // It's stored such that A has the lowest number, and 2 has the highest
  // Then it's ordered by suit. Clubs, Spades, Hearts, and finally Diamonds
  // Therefore, the highest card code is the 2 of Diamonds, which is 52.png
  switch (card[0]) {
    case '2': cardCode += 4;
    case '3': cardCode += 4;
    case '4': cardCode += 4;
    case '5': cardCode += 4;
    case '6': cardCode += 4;
    case '7': cardCode += 4;
    case '8': cardCode += 4;
    case '9': cardCode += 4;
    case '10': cardCode += 4;
    case 'J': cardCode += 4;
    case 'Q': cardCode += 4;
    case 'K': cardCode += 4;
    case 'A': cardCode += 1;
      break;
  }
  switch (card[1]) {
    case 'Diamond': cardCode += 1;
    case 'Heart': cardCode += 1;
    case 'Spade': cardCode += 1;
    case 'Club': break;
  }
  var imageNode = $('<img>').attr('src', 'images/classic-cards/' + cardCode + '.png');
  imageNode.attr('class', player + 'Card card');
  imageNode.css({left: counter*3 + 'vw'})
  $('.' + player).append(imageNode);
  // append to whatever div or something idk
}

// removes the card images for a specified players
Player.prototype.removeCardImages = function removeCardImages(player) {
  $('img.' + player + 'Card').remove();
}


// -----------------------------------------------------------------------------


// Functions outside of the constructors/objects

// Compares both the player and the dealer to determines who won the round
function compareWin() {

  if ((thePlayer.blackjack === true && theDealer.blackjack === true) || (thePlayer.cardValue === theDealer.cardValue)) {
    // Tie scenario
    // push. Player receives his bet back
    thePlayer.balance += thePlayer.currentBet;
    updateConsole("You tied with the dealer!\nYou received your money back")
  } else if ((thePlayer.blackjack === true) || (thePlayer.cardValue > theDealer.cardValue)) {
    // Player wins
    thePlayer.balance += 2*thePlayer.currentBet;
    updateConsole("You won $" + 2*thePlayer.currentBet);
  } else if (thePlayer.cardValue > 21) {
    updateConsole("You've busted!");
  } else {
    // Dealer wins
    updateConsole("You lost...");
  }
  thePlayer.currentBet = 0;
  updateBankConsole();
  switchMenu(3);
}

// Binds events to each button
function bindButtons() {

  // Binds the value of the bet to each respective button
  var buttonId = ['#one', '#five', '#ten', '#twenty', '#fifty', '#hundred'];
  buttonId.map(function(button) {
    $(button).on('click', function() {
      thePlayer.placeBet(this.value);
    })
  })

  // Binds the dealCards function
  // Hides the preGame buttons while revealing the inGame buttons
  $('#deal').on('click', function() {
    if (thePlayer.balance === 0 && thePlayer.currentBet === 0) {
      updateConsole('Go find yo broke ass an ATM...');
    } else if (thePlayer.currentBet === 0) {
      updateConsole("You have to bet something to play...")
    } else {
      switchMenu(2);
      blackjackDeck.dealCards();
    }

  });

  // Checks if the player can or cannot hit
  // If he can hit, the player hits
  // If not, the player has some message that is displayed
  $('#hit').on('click', function() {
    blackjackDeck.hit(thePlayer);
    thePlayer.evaluateCards();
  })

  // Binds the stay function to the stay button
  $('#stay').on('click', function() {
    thePlayer.stay();
  })

  // Resets all values for both the player and the dealer except their current bank balance
  // Creates a new deck
  // Hides preGame buttons while revealing postGame buttons
  $('#playAgain').on('click', function() {
    thePlayer.nextRound();
    theDealer.nextRound();
    blackjackDeck = new Deck();
    blackjackDeck.shuffle();
    switchMenu(1);
  })

  $('#leave').on('click', function() {
    if (atTable) {
      updateConsole("You've left the table with $" + thePlayer.balance + "! Congratulations!");
      $('#playAgain').hide();
    } else {
      updateConsole("Give someone else a try!");
    }
  })

}

// creates the Bank Console Text
function createBankConsole() {
  $('.bank-console').append($('<div>').attr('class', 'balance').text("Balance: $" + thePlayer.balance));
  $('.bank-console').append($('<div>').attr('class', 'currentBet').text("Current Bet: $" + thePlayer.currentBet));
}

function updateBankConsole() {
  $('.balance').text("Balance: $" + thePlayer.balance);
  $('.currentBet').text("Current Bet: $" + thePlayer.currentBet);
}

function switchMenu(mode) {
  switch(mode) {
    case 1: // Pre-Game state
      $('.postGame').hide();
      $('.preGame').show();
      break;
    case 2: // In Game state
      $('.preGame').hide();
      $('.inGame').show();
      break;
    case 3: // Post-Game state
      $('.inGame').hide();
      $('.postGame').show();
      break;
  }
}

function updateConsole(message) {
  $('.text').text(message);
}

function loadAudio() {
  $('.audio').trigger('load');
  $('.audio').hide();
}

function playAudio() {
  $('.audio').trigger('play');
}

// -----------------------------------------------------------------------------


// Initializing game and declaring variables
var blackjackDeck = new Deck();
var thePlayer = new Player("You");
var theDealer = new Player("The Dealer");
var atTable = true;


$(document).ready(function() {
  switchMenu(1);
  $('.inGame').hide();
  createBankConsole();
  bindButtons();
  blackjackDeck.shuffle();
  loadAudio();


})
