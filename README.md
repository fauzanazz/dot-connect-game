<a name="readme-top"></a>
<h1 align="center">Dot Connect Game</h1>

<br />
<div align="center">

<p align="center">
    Task IRK 5 : Dot Connect Game
    <br />
    <a href="https://github.com/ValentinoTriadi/Tubes2_OOP"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ValentinoTriadi/Tubes2_OOP">View Demo</a>
    ·
    <a href="https://github.com/ValentinoTriadi/Tubes2_OOP/issues">Report Bug</a>
    ·
    <a href="https://github.com/ValentinoTriadi/Tubes2_OOP/issues">Request Feature</a>
  </p>
</div>


## Table of Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)



## About The Project
<p align = "center">This website is used to play and solve dot Connect with working scoreboard. Also built in with color connect</p>


## Technologies Used
- Next JS
- ShadCN
- Tailwind CSS

## Features
- [x] 3 more Algorithm to Solve : Backtrack, BFS, IDDFS ( BONUS )
- [x] Animated Solution ( BONUS )
- [x] Color Connect Game ( BONUS )
- [x] Random Generation maps
- [x] Scoreboard
- [x] Authentication


## Alogrithm Used
All four algorithm used to solve Dot Connects are :
- Astar Algorithm : A* Search Algorithm standard for solving 2D grid based problem
- Backtrack Algorithm : Backtrack Algorithm is used to solve the problem by trying all possible solution
- BFS Algorithm : Breadth First Search Algorithm is used to solve the problem by exploring all possible solution
- IDDFS Algorithm : Iterative Deepening Depth First Search Algorithm is used to solve the problem by exploring all possible solution with limited depth

with each algorithm complexity :

| Algorithm | T(n)       | O(n) |
|-----------|------------|------|
| Astar     | O(n log n) | O(n) |
| BFS       | O(n)       | O(n) |
| DFS       | O(n)       | O(n) |
| IDDFS     | O(n)       | O(n) |


## Setup
1.  Clone the repo
```sh
git clone https://github.com/fauzanazz/dot-connect-game
```
2.  Open the project in your favorite IDE
3. Install NPM packages
```sh
npm install
```
4. Create .env file in the root directory and fill with auth secret and database url
5. Run the project
```sh
npm run dev
```
6. Open your browser and go to http://localhost:3000
7. Enjoy the game

## Project Status
Project is: _completed_


## Acknowledgements
- [Muhammad Fauzan Azhim - 13522153](https://github.com/fauzanazz)

## References
- [Color Connect Solver](https://stackoverflow.com/questions/23622068/algorithm-for-solving-flow-free-game)
- [Color Connect Generator](https://stackoverflow.com/questions/12926111/what-to-use-for-flow-free-like-game-random-level-creation)
- [Color Connect Astar Solver](https://mzucker.github.io/2016/08/28/flow-solver.html)