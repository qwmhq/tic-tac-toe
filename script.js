const gameBoard = (() => {
    let gameBoard = [];

})();

const playerFactory = (side) => {
    let getSide = () => side;
    return {getSide};
}

