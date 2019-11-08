const initialState = Object.freeze({
    width: 7,
    height: 6,
    board: Array.from(Array(6), () => Array(7).fill(' ')),
    p1: 'x',
    p2: 'y',
    activePlayer: 'x',
    againstAI: true,
})

const cloneState = old => Object.assign({}, old);

const draw = (state, {drawActivePLayer, drawBoard, winner, drawWinner}) => {
    console.clear();
    console.log(winner ? drawWinner(winner) : drawActivePLayer())
    console.log(drawBoard())

    if (!winner) {
        if(state.againstAI && state.activePlayer === state.p2) {
            doMove(state, randomMove(state.width))
        } else {
            process.openStdin().once('data', function(d) {
                const input = d.toString().trim()
    
                doMove(state, parseInt(input))
            })
        }
    }
}

const update = state => draw(
    state,
    {
        drawActivePLayer: () => `active player: ${state.activePlayer}`,
        drawBoard: () => `${state.board.map(row => row.join('|')).join("\n")}${"\n"}${[...Array(state.width)].map((_, i) => i).join(' ')}`,
        winner: detectWinner(state),
        drawWinner: winner => `${winner} has won!`,
    }
)

const doMove = (state, column) => {
    const [newState, doneMove] = fillBoard(state, column)
    doneMove && (newState.activePlayer = swapPlayers(state))
    return update(newState);
}

const fillBoard = (state, column) => {
    if (column < 0 || column >= state.width) {
        return [state, false]
    }

    const newState = cloneState(state)
    const row = freeRow(newState.board, column)

    if (row < 0 || row >= state.height) {
        return [state, false]
    }

    newState.board[row][column] = state.activePlayer

    return [newState, boardsAreEqual(state.board)(newState.board)]
}

const boardsAreEqual = b1 => b2 => JSON.stringify(b1) === JSON.stringify(b2)

const swapPlayers = state => state.activePlayer === state.p1 ? state.p2 : state.p1

const columnByIndex = (board, column) => board.map(row => row[column])

const freeRow = (board, column) => columnByIndex(board, column).filter(cell => cell === ' ').length - 1

const detectWinner = ({board, width, height}) => {
    const chkLine = (a,b,c,d) => ((a != ' ') && (a == b) && (a == c) && (a == d))

    // down
    for (r = 0; r < 3; r++)
        for (c = 0; c < width; c++)
            if (chkLine(board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]))
                return board[r][c]

    // right
    for (r = 0; r < height; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]))
                return board[r][c]

    // down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]))
                return board[r][c]

    // down-left
    for (r = 3; r < height; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]))
                return board[r][c]

    return undefined
}

const randomMove = (width) => Math.floor(Math.random() * (width - 1));

update(initialState)
