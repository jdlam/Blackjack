![Blackjack!](http://www.casinocashjourney.com/images/Blackjack%2012.jpg)

## Blackjack
- A blackjack game made by Jonathan Lam
- With $500 to start, you play 1v1 vs the house
- Just open the webpage or index.html, and the game will automatically start

## Approach
- I used two different types of objects
  - The deck
  - The players
- The game is initialized when you open the page, and everything is instantly created
- The deck will deal cards to the players, so the players hold the cards within their own "hand" array
- Using player methods, cards are evaluated and the game updates accordingly

## User Stories
- User clicks on betting amount buttons
  - The bank console is updated to represent how much the user is betting for this round
  - User is presented with a start the game or deal cards button
- User clicks on the deal cards button
  - Cards are dealt to each player
  - Dealer has one card face down
  - User is presented with hit or stay buttons
- User clicks the hit button
  - User is dealt another card
  - Presented with either hit or stay buttons again
- User clicks the stay button
  - The dealer hits until he's above 16 or busts
  - Dealer and User values are compared after if dealer hasn't busted
  - The result is updated to the screen
- User clicks the Play Again button
  - The user's internal values are reset, except for the current balance
  - The user can update his/her current bet, and press deal cards
- User clicks the Leave Table button
  - The user gets up from the table
  - The user is not allowed to play another round
  - The in game console is updated with a congratulations message

## How it works
- As stated above, the deck and the players are made through constructor functions
- Each have their own methods, which are executed via buttons on the screen
- The menu updates with regard to which phase of the game you are in
  - The Betting Phase
  - The Hit or Stay Phase
  - The "Should I Cash Out?" Phase

## Goals for the future
- Cleaning up the interface even more
- Adding more graphics
- Adding multiple players

## Technologies Used
- HTML
- CSS
- JavaScript and jQuery

## Notes
- Author: Jonathan Lam
- Last updated: 8/9/2015
- Try to find the easter egg in the game
