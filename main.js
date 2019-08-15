// Parameters


let FieldWidth = 4;
let FieldHeight = 4;

let Field = [];


//

// Document elements


let FieldElement;


//

// Element templates


let CellTemplate = (cellValue) => `
    <button class="game-cell">
        ${cellValue}
    </button>
`;

let EmptyCellTemplate = () => `
    <button class="game-cell_empty">
        0
    </button>
`;

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
        if (field[i] !== i + 1) {
            res = false;
        }
    }
    if (field[field.length - 1] !== 0) {
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

    Field = shuffled;

    RenderField();
}



function RenderField() {
    for (let i = 0; i < Field.length; i++) {
        let cellHtml;

        if (Field[i] === 0) {
            cellHtml = EmptyCellTemplate();
        } else {
            let cellValue = Field[i];
            cellHtml = CellTemplate(cellValue);
        }

        let cellElement = HtmlToElement(cellHtml);
        FieldElement.appendChild(cellElement);
    }
    // childNode[4].parentNode.insertBefore(childNode[4], childNode[3]);
}


