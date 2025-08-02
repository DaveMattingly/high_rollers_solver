#High Rollers Solver

This project acts as a solver and calculator for the bonus game of the game show [High Rollers](https://en.wikipedia.org/wiki/High_Rollers) (1974-76, 78-80, 87-88).  

Based on the game [Shut the Box](https://en.wikipedia.org/wiki/Shut_the_box), contestants were presented with the number 1 through 9, which they needed to eliminate by rolling two dice.  After every roll, the contestants eliminated numbers summing to the total of the dice roll.  Gameplay continued until the contestant either won by eliminating all numbers, or lost by rolling a number that they could not eliminate.

In addition, if a contestant rolled doubles, they were given an insurance marker, which served as an extra life, allowing them to reroll the dice if they rolled a number that they couldn't eliminate.  Note that the contestants were given the insurance marker immediately, allowing for cases such as rolling 12, earning an insurance marker, and immediately given the insurance marker back because they did not have numbers equalling 12 left to eliminate.

This project was developed using Node.js, SQLite, and React, and consists of three scripts:

##node/generate.js

This script calculates the winning chances and best moves for all possible combinations of numbers and quantity of insurance markers, and saves them in a SQLite database for future use.

##node/query.js

This opens up a port and listens for data from the React UI.  When it receives data, it reads the database and returns chance/best move information.

##solver/

The web page front end.  Choose the configuration of numbers still on the board and how many insurance markers you have, and it will tell you both the odds of victory at this moment and the best move for each possible roll.