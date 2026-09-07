const state = {
  title: "カード名",
  titleSize: 28,
  titleFill: "#ffffff",
  titleStroke: "#000000",
  starCount: 4,
  frame: "blue",
  attribute: "none",
  desc: "■このカードの説明を書いてください。\n■改行もできます。",
  descSize: 18,
  rawImageUrl: "",
  croppedImageUrl: ""
};

const els = {
  titleInput: document.getElementById("titleInput"),
  titleSizeInput: document.getElementById("titleSizeInput"),
  titleFillInput: document.getElementById("titleFillInput"),
  titleStrokeInput: document.getElementById("titleStrokeInput"),
  starCountInput: document.getElementById("starCountInput"),
  starCountLabel: document.getElementById("starCountLabel"),
  frameInput: document.getElementById("frameInput"),
  attributeInput: document.getElementById("attributeInput"),
  imageInput: document.getElementById("imageInput"),
  openCropBtn: document.getElementById("openCropBtn"),
  descInput: document.getElementById("descInput"),
  descSizeInput: document.getElementById("descSizeInput"),
  downloadBtn: document.getElementById("downloadBtn"),
  resetBtn: document.getElementById("resetBtn"),

  cardPreview: document.getElementById("cardPreview"),
  cardTitle: document.getElementById("cardTitle"),
  starRow: document.getElementById("starRow"),
  attributeBadge: document.getElementById("attributeBadge"),
  attributeSymbol: document.getElementById("attributeSymbol"),
  artImage: document.getElementById("artImage"),
  artPlaceholder: document.getElementById("artPlaceholder"),
  descText: document.getElementById("descText"),

  cropModal: document.getElementById("cropModal"),
  cropImage: document.getElementById("cropImage"),
  cancelCropBtn: document.getElementById("cancelCropBtn"),
  applyCropBtn: document.getElementById("applyCropBtn")
};

let cropper = null;

const attributeMap = {
  fire: { symbol: "火", className: "attr-fire" },
  water: { symbol: "水", className: "attr-water" },
  wind: { symbol: "風", className: "attr-wind" },
  thunder: { symbol: "雷", className: "attr-thunder" },
  earth: { symbol: "土", className: "attr-earth" },
  light: { symbol: "光", className: "attr-light" },
  dark: { symbol: "闇", className: "attr-dark" },
  neutral: { symbol: "無", className: "attr-neutral" }
};

function makeTextStroke(color) {
  return `
    -2px -2px 0 ${color},
     2px -2px 0 ${color},
    -2px  2px 0 ${color},
     2px  2px 0 ${color},
    -2px  0   0 ${color},
     2px  0   0 ${color},
     0   -2px 0 ${color},
     0    2px 0 ${color}
  `;
}

function renderStars() {
  els.starRow.innerHTML = "";

  for (let i = 0; i < state.starCount; i++) {
    const star = document.createElement("div");

    if (state.starCount === 5) {
      star.className = "star-shape rainbow-star";
    } else {
      star.className = "star-shape normal-star";
    }

    els.starRow.appendChild(star);
  }
}

function renderAttribute() {
  const badge = els.attributeBadge;
  badge.className = "attribute-badge";

  if (state.attribute === "none") {
    badge.classList.add("hidden");
    return;
  }

  badge.classList.remove("hidden");

  const attr = attributeMap[state.attribute];
  if (!attr) return;

  badge.classList.add(attr.className);
  els.attributeSymbol.textContent = attr.symbol;
}

function renderImage() {
  if (state.croppedImageUrl) {
    els.artImage.src = state.croppedImageUrl;
    els.artImage.parentElement.classList.add("has-image");
  } else {
    els.artImage.removeAttribute("src");
    els.artImage.parentElement.classList.remove("has-image");
  }
}

function updatePreview() {
  els.cardTitle.textContent = state.title || "カード名";
  els.cardTitle.style.fontSize = `${state.titleSize}px`;
  els.cardTitle.style.color = state.titleFill;
  els.cardTitle.style.textShadow = makeTextStroke(state.titleStroke);

  els.starCountLabel.textContent = state.starCount;
  renderStars();
  renderAttribute();
  renderImage();

  els.descText.textContent = state.desc || "";
  els.descText.style.fontSize = `${state.descSize}px`;

  els.cardPreview.className = `card theme-${state.frame}`;
}

function openCropModal() {
  if (!state.rawImageUrl) return;

  els.cropModal.classList.remove("hidden");
  els.cropImage.src = state.rawImageUrl;

  if (cropper) {
    cropper.destroy();
  }

  cropper = new Cropper(els.cropImage, {
    aspectRatio: 1,
    viewMode: 1,
    background: false,
    autoCropArea: 1,
    movable: true,
    zoomable: true,
    scalable: false,
    rotatable: false
  });
}

function closeCropModal() {
  els.cropModal.classList.add("hidden");
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

async function downloadCard() {
  const canvas = await html2canvas(els.cardPreview, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  });

  const imageUrl = canvas.toDataURL("image/png");

  const newWindow = window.open();

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>カード画像</title>
        <style>
          body {
            margin: 0;
            background: #111;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            color: white;
            font-family: sans-serif;
          }

          p {
            padding: 14px;
            text-align: center;
          }

          img {
            max-width: 95%;
            height: auto;
          }
        </style>
      </head>

      <body>
        <p>画像を長押しして「写真に保存」を選んでください。</p>
        <img src="${imageUrl}">
      </body>
      </html>
    `);

    newWindow.document.close();
  }
}

function resetAll() {
  state.title = "カード名";
  state.titleSize = 28;
  state.titleFill = "#ffffff";
  state.titleStroke = "#000000";
  state.starCount = 4;
  state.frame = "blue";
  state.attribute = "none";
  state.desc = "■このカードの説明を書いてください。\n■改行もできます。";
  state.descSize = 18;
  state.rawImageUrl = "";
  state.croppedImageUrl = "";

  els.titleInput.value = state.title;
  els.titleSizeInput.value = state.titleSize;
  els.titleFillInput.value = state.titleFill;
  els.titleStrokeInput.value = state.titleStroke;
  els.starCountInput.value = state.starCount;
  els.frameInput.value = state.frame;
  els.attributeInput.value = state.attribute;
  els.descInput.value = state.desc;
  els.descSizeInput.value = state.descSize;
  els.imageInput.value = "";
  els.openCropBtn.disabled = true;

  updatePreview();
}

/* ========= Events ========= */
els.titleInput.addEventListener("input", (e) => {
  state.title = e.target.value;
  updatePreview();
});

els.titleSizeInput.addEventListener("input", (e) => {
  state.titleSize = Number(e.target.value);
  updatePreview();
});

els.titleFillInput.addEventListener("input", (e) => {
  state.titleFill = e.target.value;
  updatePreview();
});

els.titleStrokeInput.addEventListener("input", (e) => {
  state.titleStroke = e.target.value;
  updatePreview();
});

els.starCountInput.addEventListener("input", (e) => {
  state.starCount = Number(e.target.value);
  updatePreview();
});

els.frameInput.addEventListener("change", (e) => {
  state.frame = e.target.value;
  updatePreview();
});

els.attributeInput.addEventListener("change", (e) => {
  state.attribute = e.target.value;
  updatePreview();
});

els.descInput.addEventListener("input", (e) => {
  state.desc = e.target.value;
  updatePreview();
});

els.descSizeInput.addEventListener("input", (e) => {
  state.descSize = Number(e.target.value);
  updatePreview();
});

els.imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    state.rawImageUrl = reader.result;
    els.openCropBtn.disabled = false;
    openCropModal();
  };
  reader.readAsDataURL(file);
});

els.openCropBtn.addEventListener("click", () => {
  openCropModal();
});

els.cancelCropBtn.addEventListener("click", () => {
  closeCropModal();
});

els.applyCropBtn.addEventListener("click", () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    width: 900,
    height: 900,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high"
  });

  state.croppedImageUrl = canvas.toDataURL("image/png");
  closeCropModal();
  updatePreview();
});

els.downloadBtn.addEventListener("click", async () => {
  await downloadCard();
});

els.resetBtn.addEventListener("click", () => {
  resetAll();
});

updatePreview();
