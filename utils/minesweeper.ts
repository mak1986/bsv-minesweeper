const numberOfRows = 8
const numberOfColumns = 8
const numberOfMines = 10


export const generateGrid = () => {
    const rows = []

    for (let i = 0; i < numberOfRows; i++) {
        const row = []

        for (let j = 0; j < numberOfColumns; j++) {
            const col = {
                mine: false,
                value: null,
                clicked: false,
                flaged: false
            }
            row.push(col)
        }

        rows.push(row)
    }

    const grid = {
        rows,
        result: null,
        flags: 0,
        mines: numberOfMines
    }

    addMines(grid)

    return grid
}

const updateNumberOfFlags = (grid)=>{
    let count = 0
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            if(grid.rows[i][j].flaged){
                count++
            }
        }
    }
    grid.flags = count
}

const addMines = (grid: any) => {
    //Add mines randomly
    let n = numberOfMines
    while (n > 0) {
        let row = Math.floor(Math.random() * numberOfRows);
        let col = Math.floor(Math.random() * numberOfColumns);

        const cell = grid.rows[row][col]

        if (!cell.mine) {
            cell.mine = true
            n--
        }
    }
}

const revealMines = (grid: any) => {
    //Highlight all mines in red
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            let cell = grid.rows[i][j];
            if (cell.mine) {
                cell.value = '💣';
            }
        }
    }
}

const checkLevelCompletion = (grid: any) => {
    let levelComplete = true;
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {

            if (!grid.rows[i][j].mine && grid.rows[i][j].value === null) {
                levelComplete = false
            }

        }
    }
    if (levelComplete) {
        // alert("You Win!");
        grid.result = 'won'
        revealMines(grid);
    }
}

export const flagCell = (grid: any, rowIndex: number, colIndex: number) => {
    if (grid.rows[rowIndex][colIndex].value === null) {
        grid.rows[rowIndex][colIndex].flaged = !grid.rows[rowIndex][colIndex].flaged
        updateNumberOfFlags(grid)
    }
}

export const clickCell = (grid: any, rowIndex: number, colIndex: number) => {
    //Check if the end-user clicked on a mine
    console.log(grid)
    const cell = grid.rows[rowIndex][colIndex]

    if(cell.flaged){
        return
    }

    if (cell.mine) {
        grid.result = 'lost'
        revealMines(grid);
    } else {
        cell.clicked = true;
        // Count and display the number of adjacent mines
        let mineCount = 0;
        //alert(cellRow + " " + cellCol);
        for (let i = Math.max(rowIndex - 1, 0); i <= Math.min(rowIndex + 1, 9); i++) {
            for (let j = Math.max(colIndex - 1, 0); j <= Math.min(colIndex + 1, 9); j++) {
                if (grid.rows[i] && grid.rows[i][j] && grid.rows[i][j].mine) mineCount++;
            }
        }
        cell.value = mineCount;
        if (mineCount == 0) {
            //Reveal all adjacent cells as they do not have a mine
            for (let i = Math.max(rowIndex - 1, 0); i <= Math.min(rowIndex + 1, 9); i++) {
                for (let j = Math.max(colIndex - 1, 0); j <= Math.min(colIndex + 1, 9); j++) {
                    //Recursive Call
                    if (grid.rows[i] && grid.rows[i][j] && grid.rows[i][j].value === null) clickCell(grid, i, j);
                }
            }
        }
        checkLevelCompletion(grid);
    }
}