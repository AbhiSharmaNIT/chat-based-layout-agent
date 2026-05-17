function updateRatios(node, artboardWidth, artboardHeight) {
  if (typeof node.x === "number") node.nx = node.x / artboardWidth;
  if (typeof node.y === "number") node.ny = node.y / artboardHeight;
  if (typeof node.width === "number") node.nw = node.width / artboardWidth;
  if (typeof node.height === "number") node.nh = node.height / artboardHeight;

  if (node.style?.visual?.fontSize) {
    node.fontSizeRatio = node.style.visual.fontSize / artboardHeight;
  }
}

function applyRuleBasedLayout(instruction, currentJson) {
  const json = structuredClone(currentJson);
  const lower = instruction.toLowerCase();

  const artboardId = json.rootNodes[0];
  const artboard = json.nodes[artboardId];

  const headline = json.nodes["text_1778486306230_8"];
  const subheadline = json.nodes["text_1778486136643_7"];
  const product = json.nodes["img_1778489515746_17"];
  const badgeCircle = json.nodes["circle_1778488914968_15"];
  const badgeText = json.nodes["text_1778489078397_16"];
  const bottomOffer = json.nodes["text_1778486004640_6"];
  const socialProof = json.nodes["text_1778486552508_9"];

  if (lower.includes("9:16") || lower.includes("story")) {
    artboard.width = 1080;
    artboard.height = 1920;
    artboard.data.preset = "instagram-story";

    headline.x = 100;
    headline.y = 260;
    headline.width = 880;
    headline.height = 260;

    subheadline.x = 150;
    subheadline.y = 560;
    subheadline.width = 780;

    socialProof.x = 390;
    socialProof.y = 150;

    badgeCircle.x = 100;
    badgeCircle.y = 720;

    badgeText.x = 128;
    badgeText.y = 735;

    product.x = 90;
    product.y = 920;
    product.width = 900;
    product.height = 370;

    bottomOffer.x = 300;
    bottomOffer.y = 1660;
  }

  if (lower.includes("headline") && lower.includes("top")) {
    headline.x = 120;
    headline.y = 80;
    headline.width = 840;
    headline.height = 210;

    subheadline.x = 170;
    subheadline.y = 310;

    socialProof.x = 430;
    socialProof.y = 35;

    badgeCircle.x = 100;
    badgeCircle.y = 430;

    badgeText.x = 128;
    badgeText.y = 445;

    product.x = 90;
    product.y = 580;

    bottomOffer.y = 960;
  }

  if (lower.includes("headline") && lower.includes("smaller")) {
    headline.style.visual.fontSize = 54;
    headline.height = 180;
  }

  if (lower.includes("badge") && lower.includes("higher")) {
    badgeCircle.y = Math.max(250, badgeCircle.y - 80);
    badgeText.y = Math.max(265, badgeText.y - 80);
  }

  if (lower.includes("product") && lower.includes("large")) {
    product.x = 80;
    product.y = 570;
    product.width = 900;
    product.height = 370;
  }

  Object.values(json.nodes).forEach((node) => {
    updateRatios(node, artboard.width, artboard.height);
  });

  return json;
}

export const updateLayout = async (req, res) => {
  try {
    const { instruction, currentJson } = req.body;

    const updatedJson = applyRuleBasedLayout(instruction, currentJson);

    res.json({
      updatedJson,
      explanation: `Done. I updated the layout based on: "${instruction}"`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};