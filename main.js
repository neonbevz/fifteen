// Parameters


let FieldWidth = 4;
let FieldHeight = 4;


//

// Variables


let Direction = Object.freeze({"none": 1, "right": 2, "up": 3, "left": 4, "down": 5});
let GameAnimationState = Object.freeze({"idle": 1, "animating": 2});

let CurrentGameAnimationState = GameAnimationState.idle;

let FieldElement;

let Field = [];


//

// Element templates


let CellTemplate = (cellId, cellValue) => `
    <button id="${cellId}" class="game-cell" onclick="OnCellClick(this)">
        <div class="game-cell__animated-content">
            ${cellValue}
        </div>
    </button>
`;

let EmptyCellTemplate = (cellId) => `
    <button id="${cellId}" class="game-cell_empty">
        0
    </button>
`;


//

// Cell class


function Cell(cellId, value, element) {
    this.cellId = cellId;
    this.value = value;
    this.element = element;
}


//

// OnLoad


window.onload = function () {
    FieldElement = document.getElementById('game-field');
    GenerateField();
};


//


function HtmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}


function ShuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * @return {boolean}
 */
function FieldIsWinning(field) {
    let res = true;
    for (let i = 0; i < field.length - 1; i++) {
        if (field[i].value !== i + 1) {
            res = false;
        }
    }
    if (field[field.length - 1].value !== 0) {
        res = false;
    }

    return res;
}

function ClearField() {
    Field.length = 0; // Clear the array

    while (FieldElement.firstChild) {
        FieldElement.removeChild(FieldElement.firstChild);
    }
}

function GenerateField() {
    let numbers = [...Array(FieldWidth * FieldHeight).keys()];
    let shuffled = ShuffleArray(numbers);

    while (FieldIsWinning(shuffled)) {
        shuffled = ShuffleArray(numbers);
    }

    ClearField();

    for (let y = 0; y < FieldHeight; y++) {
        Field.push([]);

        for (let x = 0; x < FieldWidth; x++) {
            // Field[y].push(shuffled[y * FieldWidth + x]);
            let id = y * FieldWidth + x;
            let value = shuffled[id];

            // Create HTML element

            let cellHtml = value === 0 ? EmptyCellTemplate("cell-" + value) : CellTemplate("cell-" + value, value);
            let cellElement = HtmlToElement(cellHtml);
            FieldElement.appendChild(cellElement);

            //

            let newCell = new Cell(id, value, cellElement);
            Field[y].push(newCell);
        }
    }

    RenderField();
}


function RenderField() {
    // for (let y = 0; y < FieldHeight; y++) {
    //     for (let x = 0; x < FieldWidth; x++) {
    //         let cellHtml;
    //
    //         if (Field[y][x].value === 0) {
    //             cellHtml = EmptyCellTemplate();
    //         } else {
    //             let cellValue = Field[y][x].value;
    //             cellHtml = CellTemplate("cell-" +, cellValue);
    //         }
    //
    //         let cellElement = HtmlToElement(cellHtml);
    //         FieldElement.appendChild(cellElement);
    //     }
    // }
    // childNode[4].parentNode.insertBefore(childNode[4], childNode[3]);
}


/**
 * @return {boolean}
 */
function OnCellClick(cell) {
    let cellValue = parseInt(cell.firstElementChild.innerHTML);
    if (cellValue !== 0 && CurrentGameAnimationState === GameAnimationState.idle) {
        let cellPositionX, cellPositionY;
        for (let y = 0; y < FieldHeight; y++) {
            for (let x = 0; x < FieldWidth; x++) {
                if (Field[y][x].value === cellValue) {
                    cellPositionX = x;
                    cellPositionY = y;
                    break;
                }
            }
        }
        let emptyNeighborDirection = FindEmptyNeighbor(cellPositionX, cellPositionY);

        if (emptyNeighborDirection === Direction.none) {
            return false;
        } else {
            SwapCells([cellPositionX, cellPositionY], emptyNeighborDirection);
        }
        return true;
    } else {
        return false;
    }
}


/**
 * @return {number}
 */
function FindEmptyNeighbor(cellPositionX, cellPositionY) {
    // console.log(cellPositionX, cellPositionY);
    if (cellPositionY > 0 && Field[cellPositionY - 1][cellPositionX].value === 0) {
        // return [cellPositionX, cellPositionY - 1];
        return Direction.up;
    } else if (cellPositionY < FieldHeight - 1 && Field[cellPositionY + 1][cellPositionX].value === 0) {
        // return [cellPositionX, cellPositionY + 1];
        return Direction.down;
    } else if (cellPositionX > 0 && Field[cellPositionY][cellPositionX - 1].value === 0) {
        // return [cellPositionX - 1, cellPositionY];
        return Direction.left;
    } else if (cellPositionX < FieldWidth - 1 && Field[cellPositionY][cellPositionX + 1].value === 0) {
        // return [cellPositionX + 1, cellPositionY];
        return Direction.right;
    } else {
        // return [];
        return Direction.none;
    }
}


function SwapCells(cellPosition, emptyCellDirection) {
    let emptyCellPosition;

    switch (emptyCellDirection) {
        case Direction.right:
            emptyCellPosition = [cellPosition[0] + 1, cellPosition[1]];
            break;
        case Direction.up:
            emptyCellPosition = [cellPosition[0], cellPosition[1] - 1];
            break;
        case Direction.left:
            emptyCellPosition = [cellPosition[0] - 1, cellPosition[1]];
            break;
        case Direction.down:
            emptyCellPosition = [cellPosition[0], cellPosition[1] + 1];
            break;
    }

    let cell = Field[cellPosition[1]][cellPosition[0]];
    let emptyCell = Field[emptyCellPosition[1]][emptyCellPosition[0]];

    let temp = document.createElement("div");

    cell.element.parentNode.insertBefore(temp, cell.element);
    emptyCell.element.parentNode.insertBefore(cell.element, emptyCell.element);
    temp.parentNode.insertBefore(emptyCell.element, temp);
    temp.parentNode.removeChild(temp);

    let cellChild = cell.element.firstElementChild;
    switch (emptyCellDirection) {
        case Direction.right:
            cellChild.style.transform = 'translateX(-100%)';
            cellChild.offsetHeight; // Trick the engine into activating the transition
            cellChild.style.transform = 'translateX(0)';
            break;
        case Direction.up:
            cellChild.style.transform = 'translateY(100%)';
            cellChild.offsetHeight; // Trick the engine into activating the transition
            cellChild.style.transform = 'translateY(0)';
            break;
        case Direction.left:
            cellChild.style.transform = 'translateX(100%)';
            cellChild.offsetHeight; // Trick the engine into activating the transition
            cellChild.style.transform = 'translateX(0)';
            break;
        case Direction.down:
            cellChild.style.transform = 'translateY(-100%)';
            cellChild.offsetHeight; // Trick the engine into activating the transition
            cellChild.style.transform = 'translateY(0)';
            break;
    }

    Field[cellPosition[1]][cellPosition[0]] = emptyCell;
    Field[emptyCellPosition[1]][emptyCellPosition[0]] = cell;
}

