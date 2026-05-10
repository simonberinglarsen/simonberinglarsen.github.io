const boardElement = document.getElementById("board");
const lightSquareColor = "#a6825c";
const darkSquareColor = "#7f5332";
const blendedSquareColor = mixHexColors(lightSquareColor, darkSquareColor, 0.5);
const whitePieceColor = "#f4efe7";
const blackPieceColor = "#16110d";
const svgNamespace = "http://www.w3.org/2000/svg";
const piecePadding = 90;
const piecePathCache = new Map();
let focusedPosition = null;
let chessFont = null;

const initialBoard = parseFenBoard("r1bq1rk1/pp3ppp/2nbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R");

const glyphMap = {
  wK: "L",
  wQ: "W",
  wR: "T",
  wB: "V",
  wN: "M",
  wP: "O",
  bK: "L",
  bQ: "W",
  bR: "T",
  bB: "V",
  bN: "M",
  bP: "O"
};

function parseFenBoard(fenBoard) {
  return fenBoard.split("/").map((rank) => {
    const squares = [];

    rank.split("").forEach((symbol) => {
      if (/\d/.test(symbol)) {
        const emptyCount = Number(symbol);
        for (let index = 0; index < emptyCount; index += 1) {
          squares.push(null);
        }
        return;
      }

      const side = symbol === symbol.toUpperCase() ? "w" : "b";
      squares.push(`${side}${symbol.toUpperCase()}`);
    });

    return squares;
  });
}

function squareTone(rankIndex, fileIndex) {
  return (rankIndex + fileIndex) % 2 === 0 ? "light" : "dark";
}

function updateBoardSize() {
  const viewportLimit = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  const squareSize = Math.max(1, Math.floor(viewportLimit / 8));
  const boardSize = squareSize * 8;
  boardElement.style.width = `${boardSize}px`;
  boardElement.style.height = `${boardSize}px`;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHexColors(fromHex, toHex, amount) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const clampedAmount = Math.max(0, Math.min(1, amount));

  return rgbToHex({
    r: Math.round(from.r + (to.r - from.r) * clampedAmount),
    g: Math.round(from.g + (to.g - from.g) * clampedAmount),
    b: Math.round(from.b + (to.b - from.b) * clampedAmount)
  });
}

function squareBaseColor(tone) {
  return tone === "light" ? lightSquareColor : darkSquareColor;
}

function pieceBaseColor(side) {
  return side === "w" ? whitePieceColor : blackPieceColor;
}

function pieceShapeFadeDistance(pieceType) {
  return pieceType === "P" ? 5 : 2;
}

function pieceColorFadeDistance(pieceType) {
  return pieceType === "P" ? 5 : 2;
}

function squareName(rankIndex, fileIndex) {
  const file = String.fromCharCode(97 + fileIndex);
  const rank = String(8 - rankIndex);
  return `${file}${rank}`;
}

function loadFont(url) {
  return new Promise((resolve, reject) => {
    opentype.load(url, (error, font) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(font);
    });
  });
}

function createPieceSvg(glyphCharacter) {
  const cachedPiece = getPieceDefinition(glyphCharacter);

  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("class", "piece-svg");
  svg.setAttribute("viewBox", cachedPiece.viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute("d", cachedPiece.pathData);
  svg.appendChild(path);

  return svg;
}

function getPieceDefinition(glyphCharacter) {
  let cachedPiece = piecePathCache.get(glyphCharacter);

  if (!cachedPiece) {
    const glyph = chessFont.charToGlyph(glyphCharacter);
    const path = glyph.getPath(0, 0, 1000);
    const bounds = path.getBoundingBox();
    const width = bounds.x2 - bounds.x1;
    const height = bounds.y2 - bounds.y1;
    const size = Math.max(width, height) + piecePadding * 2;
    const centerX = (bounds.x1 + bounds.x2) / 2;
    const centerY = (bounds.y1 + bounds.y2) / 2;
    const viewBoxX = centerX - size / 2;
    const viewBoxY = centerY - size / 2;

    cachedPiece = {
      pathData: path.toPathData(2),
      viewBox: `${viewBoxX} ${viewBoxY} ${size} ${size}`,
      squarePathData: createSquarePathForViewBox(`${viewBoxX} ${viewBoxY} ${size} ${size}`),
      morphToSquare: null
    };

    cachedPiece.morphToSquare = flubber.interpolate(cachedPiece.pathData, cachedPiece.squarePathData);

    piecePathCache.set(glyphCharacter, cachedPiece);
  }

  return cachedPiece;
}

function parseViewBox(viewBox) {
  const [x, y, width, height] = viewBox.split(" ").map(Number);
  return { x, y, width, height };
}

function createSquarePathForViewBox(viewBox) {
  const { x, y, width, height } = parseViewBox(viewBox);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const halfSize = Math.min(width, height) * 0.22;
  const left = centerX - halfSize;
  const top = centerY - halfSize;
  const right = centerX + halfSize;
  const bottom = centerY + halfSize;

  return `M ${left} ${top} L ${right} ${top} L ${right} ${bottom} L ${left} ${bottom} Z`;
}

function updateSquareColors() {
  const squares = boardElement.querySelectorAll(".square");

  squares.forEach((square) => {
    const tone = square.dataset.tone;
    const baseColor = squareBaseColor(tone);
    const pieceSvg = square.querySelector(".piece-svg");
    const piecePath = square.querySelector(".piece-svg path");
    const pieceSide = square.dataset.pieceSide;
    const pieceGlyph = square.dataset.pieceGlyph;
    const pieceType = square.dataset.pieceType;

    if (!focusedPosition) {
      boardElement.classList.add("board-unfocused");
      square.style.backgroundColor = blendedSquareColor;
      if (pieceSvg && piecePath && pieceGlyph) {
        square.style.color = blendedSquareColor;
        pieceSvg.style.filter = "blur(2.5px)";
        piecePath.setAttribute("d", getPieceDefinition(pieceGlyph).morphToSquare(1));
      }
      return;
    }

    boardElement.classList.remove("board-unfocused");

    const rank = Number(square.dataset.rank);
    const file = Number(square.dataset.file);
    const distance = Math.hypot(rank - focusedPosition.rank, file - focusedPosition.file);
    const interpolation = Math.min(distance / 2, 1);
    square.style.backgroundColor = mixHexColors(baseColor, blendedSquareColor, interpolation);

    if (pieceSvg && piecePath && pieceSide && pieceGlyph && pieceType) {
      const basePieceColor = pieceBaseColor(pieceSide);
      const pieceColorInterpolation = Math.min(distance / pieceColorFadeDistance(pieceType), 1);
      const pieceShapeInterpolation = Math.min(distance / pieceShapeFadeDistance(pieceType), 1);
      const pieceBlurAmount = distance <= 1 ? 0 : Math.min((distance - 1) / 1, 1) * 2.5;
      square.style.color = mixHexColors(basePieceColor, blendedSquareColor, pieceColorInterpolation);
      pieceSvg.style.filter = `blur(${pieceBlurAmount}px)`;
      piecePath.setAttribute("d", getPieceDefinition(pieceGlyph).morphToSquare(pieceShapeInterpolation));
    }
  });
}

function renderBoard(position) {
  const fragment = document.createDocumentFragment();

  position.forEach((rank, rankIndex) => {
    rank.forEach((piece, fileIndex) => {
      const tone = squareTone(rankIndex, fileIndex);
      const square = document.createElement("div");
      square.className = `square ${tone}`;
      const name = squareName(rankIndex, fileIndex);

      if (piece) {
        const side = piece[0];
        const glyphCharacter = glyphMap[piece];
        square.appendChild(createPieceSvg(glyphCharacter));
        square.dataset.pieceSide = side;
        square.dataset.pieceGlyph = glyphCharacter;
        square.dataset.pieceType = piece[1];
      }

      square.dataset.rank = String(rankIndex);
      square.dataset.file = String(fileIndex);
      square.dataset.tone = tone;
      square.dataset.square = name;

      fragment.appendChild(square);
    });
  });

  boardElement.replaceChildren(fragment);
  updateSquareColors();
}

function setFocusedSquare(square) {
  if (!square) {
    focusedPosition = null;
    updateSquareColors();
    return;
  }

  const nextPosition = {
    rank: Number(square.dataset.rank),
    file: Number(square.dataset.file)
  };

  if (
    focusedPosition &&
    focusedPosition.rank === nextPosition.rank &&
    focusedPosition.file === nextPosition.file
  ) {
    return;
  }

  focusedPosition = nextPosition;
  updateSquareColors();
}

boardElement.addEventListener("pointermove", (event) => {
  const square = event.target.closest(".square");
  setFocusedSquare(square);
});

boardElement.addEventListener("pointerleave", () => {
  setFocusedSquare(null);
});

window.addEventListener("resize", updateBoardSize);

async function start() {
  chessFont = await loadFont("./OpenChessFont.ttf");
  updateBoardSize();
  renderBoard(initialBoard);
}

start().catch((error) => {
  console.error("Failed to initialize chess board SVG pieces.", error);
});
