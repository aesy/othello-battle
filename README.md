# Othello Battle

For a competition where each contestant implement a bot. The bots will then face eachother in a 
tournament, eliminating each other until one is victorious.  

## Rules 

* Only implement the abstract methods of Player.
* Don't access private members.
* Honour contracts, follow the documentation.
* An error occuring results in the player causing the error to lose the game.
* Making a move is limited to 5 seconds. Taking longer results in a loss.

## Instructions

### Make a fork

Click the fork button in the github interface

### Clone your fork

Clone your fork using [git](https://git-scm.com/downloads)

```sh
$ git clone <url-to-your-fork>
$ cd <your-fork>
```

### Install

Install the dependencies using [npm](https://nodejs.org/en/download/)

```sh
$ npm install
```

### Implement a player

Example:

```js
// #/src/bot/RandomBot.js
import { Player } from "../game/Player";

export class RandomBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        const randomMove = possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ];

        return { x: randomMove.x, y: randomMove.y };
    }

    clone() {
        return new RandomBot(this.name, this.color);
    }
}
```

### Try it out

Serve the application locally

```sh
$ npm start
```         

Visit `localhost:8080` in a browser 

### Push it

```sh
$ git add .
$ git commit -m "I made a new player implementation!"
$ git push
```

### Create a pull request 

A pull request can be made in your forked project UI on github
