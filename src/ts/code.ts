const WINDOW_WIDTH = 770;
const WINDOW_HEIGHT = 445;


figma.showUI(__html__, {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
});


enum Alignments {
    TOP = "TOP", BOTTOM = "BOTTOM", LEFT = "LEFT", RIGHT = "RIGHT", CENTER = "CENTER"
}


interface LineParameterTypes {
    left: number;
    top: number;
    node: SceneNode;
    direction: string;
    name: string;
    txtVerticalAlign: Alignments;
    txtHorizontalAlign: Alignments;
    lineVerticalAlign: Alignments;
    lineHorizontalAlign: Alignments;
    strokeCap: string;
}


const solidColor = (r = 255, g = 0, b = 0) => ({
    type: "SOLID",
    color: {
        r: r / 255,
        g: g / 255,
        b: b / 255
    }
});


const createLine = async options => {
    let line: LineNode;
    let rect: RectangleNode;
    let label: TextNode;
    let paddingTopBottom: number;
    let paddingLeftRight: number;
    let DIRECTION_MARGIN: number;
    let lineNodes: LineNode[];
    let measureLineWidth: number;
    let firstMeasureLine: LineNode;
    let secondMeasureLine: LineNode;
    let group: FrameNode;
    let textGroup: FrameNode;
    let boxLeft: number;
    let boxTop: number;
    let ySin: number;
    let yCos: number;
    let xSin: number;
    let xCos: number;
    let newY: number;
    let newX: number;
    let transformPosition: [[number, number, number], [number, number, number]];
    let halfGroupWidth: number;
    let halfGroupHeight: number;
    let {
        node, direction = "horizontal", name = "Group", txtVerticalAlign = Alignments.CENTER, txtHorizontalAlign = Alignments.CENTER, lineVerticalAlign = Alignments.LEFT, lineHorizontalAlign = Alignments.BOTTOM, strokeCap = "NONE"
    }: LineParameterTypes = options;

    const LINE_OFFSET = -3;

    const isHorizontal = direction === "horizontal";

    let nodeHeight = node.height;
    let nodeWidth = node.width;

    const heightOrWidth = isHorizontal ? nodeWidth : nodeHeight;

    if (heightOrWidth > 0.01) {
        // needed elements
        line = figma.createLine();
        rect = figma.createRectangle();
        label = figma.createText();

        paddingTopBottom = 5;
        paddingLeftRight = 10;

        // margin for top and bottom
        DIRECTION_MARGIN = 5;

        lineNodes = [line];

        // LINE
        line.rotation = isHorizontal ? 0 : 90;

        line.x = isHorizontal ? 0 : LINE_OFFSET;
        line.y = nodeHeight - (isHorizontal ? LINE_OFFSET : 0);

        line.strokes = [].concat(solidColor());

        line.resize(heightOrWidth, 0);

        if (strokeCap === "STANDARD") {
            measureLineWidth = Math.abs(LINE_OFFSET) * 2 + line.strokeWeight;

            if (measureLineWidth >= 0.01) {
                firstMeasureLine = figma.createLine();
                secondMeasureLine = figma.createLine();

                lineNodes.push(firstMeasureLine);
                lineNodes.push(secondMeasureLine);

                firstMeasureLine.strokes = [].concat(solidColor());
                secondMeasureLine.strokes = [].concat(solidColor());
                firstMeasureLine.resize(measureLineWidth, 0);
                secondMeasureLine.resize(measureLineWidth, 0);

                if (isHorizontal) {
                    firstMeasureLine.rotation = 90;
                    firstMeasureLine.x += 1;
                    firstMeasureLine.y += nodeHeight + Math.abs(LINE_OFFSET) * 2;

                    secondMeasureLine.rotation = 90;
                    secondMeasureLine.x += nodeWidth;
                    secondMeasureLine.y += nodeHeight + Math.abs(LINE_OFFSET) * 2;
                } else {
                    firstMeasureLine.x -= measureLineWidth;
                    firstMeasureLine.y += 1;

                    secondMeasureLine.x -= measureLineWidth;
                    secondMeasureLine.y += nodeHeight;
                }
            }
        } else {
            line.strokeCap = strokeCap as StrokeCap;
        }

        // LABEL
        label.characters = `${parseFloat(heightOrWidth.toString())
            .toFixed(0)}`;
        label.fontName = {
            family: "Inter",
            style: "Bold"
        };
        label.fontSize = 10;

        label.fills = [].concat(solidColor(255, 255, 255));

        // RECTANGLE
        rect.x = label.x - paddingLeftRight / 2;
        rect.y = label.y - paddingTopBottom / 2;
        rect.cornerRadius = 3;
        rect.resize(label.width + paddingLeftRight, label.height + paddingTopBottom);
        rect.fills = [].concat(solidColor());

        // grouping
        group = figma.group(lineNodes, node.parent);
        group.name = name;

        textGroup = figma.group([label, rect], group);
        textGroup.name = "label";

        // x, y for text box
        boxTop = paddingTopBottom / 2;
        boxLeft = paddingLeftRight / 2;

        // place text group
        if (isHorizontal) {
            textGroup.x += boxLeft + nodeWidth / 2 - textGroup.width / 2;
            textGroup.y += boxTop + nodeHeight - LINE_OFFSET - line.strokeWeight;

            // vertical text align
            if (txtVerticalAlign === Alignments.CENTER) {
                textGroup.y -= textGroup.height / 2;
            } else if (txtVerticalAlign === Alignments.BOTTOM) {
                textGroup.y += DIRECTION_MARGIN;
            } else if (txtVerticalAlign === Alignments.TOP) {
                textGroup.y -= textGroup.height + DIRECTION_MARGIN;
            }

            // horizontal text align
            if (txtHorizontalAlign === Alignments.CENTER) {
                textGroup.x += 0;
            } else if (txtHorizontalAlign === Alignments.LEFT) {
                textGroup.x -= nodeWidth / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
            } else if (txtHorizontalAlign === Alignments.RIGHT) {
                textGroup.x += nodeWidth / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
            }
        } else {
            textGroup.x += boxLeft + LINE_OFFSET;
            textGroup.y += boxTop;

            // vertical text align
            if (txtVerticalAlign === Alignments.CENTER) {
                textGroup.y += nodeHeight / 2 - textGroup.height / 2;
            } else if (txtVerticalAlign === Alignments.BOTTOM) {
                textGroup.y += nodeHeight - textGroup.height - DIRECTION_MARGIN;
            } else if (txtVerticalAlign === Alignments.TOP) {
                textGroup.y += DIRECTION_MARGIN;
            }

            // vertical text align
            if (txtHorizontalAlign === Alignments.CENTER) {
                textGroup.x -= textGroup.width / 2;
            } else if (txtHorizontalAlign === Alignments.LEFT) {
                textGroup.x -= textGroup.width + DIRECTION_MARGIN;
            } else if (txtHorizontalAlign === Alignments.RIGHT) {
                textGroup.x += DIRECTION_MARGIN;
            }
        }

        // line position
        halfGroupHeight = group.height / 2;
        halfGroupWidth = group.width / 2;

        transformPosition = node.relativeTransform;
        newX = transformPosition[0][2];
        newY = transformPosition[1][2];

        xCos = transformPosition[0][0];
        xSin = transformPosition[0][1];

        yCos = transformPosition[1][0];
        ySin = transformPosition[1][1];

        // horizonzal line position
        if (isHorizontal) {
            if (lineHorizontalAlign === Alignments.CENTER) {
                newY += (nodeHeight - group.height) / 2;
            } else if (lineHorizontalAlign === Alignments.TOP) {
                newY -= group.height / 2 - LINE_OFFSET + line.strokeWeight;
            }
            // BOTTOM
            else {
                newY += nodeHeight - group.height / 2 - LINE_OFFSET;
            }

            // check if element is rotated
            if (node.rotation > 0 || node.rotation < 0) {
                // reset
                newX = transformPosition[0][2];
                newY = transformPosition[1][2];

                // center
                if (lineHorizontalAlign === Alignments.CENTER) {
                    newY += ySin * (nodeHeight / 2 - halfGroupHeight);
                    newX -= yCos * (nodeHeight / 2 - halfGroupHeight);
                }
                // top
                else if (lineHorizontalAlign === Alignments.TOP) {
                    newY -= ySin * (halfGroupHeight - LINE_OFFSET + line.strokeWeight);
                    newX += yCos * (halfGroupHeight - LINE_OFFSET + line.strokeWeight);
                }
                // bottom
                else {
                    newY += ySin * (nodeHeight - halfGroupHeight - LINE_OFFSET);
                    newX -= yCos * (nodeHeight - halfGroupHeight - LINE_OFFSET);
                }
            }
        }
        // vertical line position
        else {
            if (lineVerticalAlign === Alignments.CENTER) {
                newX += (nodeWidth - group.width) / 2;
            } else if (lineVerticalAlign === Alignments.RIGHT) {
                newX += nodeWidth - group.width / 2 - LINE_OFFSET + line.strokeWeight;
            }
            // LEFT
            else {
                newX -= group.width / 2 - LINE_OFFSET;
            }

            // check if element is rotated
            if (node.rotation > 0 || node.rotation < 0) {
                // reset
                newX = transformPosition[0][2];
                newY = transformPosition[1][2];

                // center
                if (lineVerticalAlign === Alignments.CENTER) {
                    newY -= (xSin * (nodeWidth - group.width)) / 2;
                    newX += (xCos * (nodeWidth - group.width)) / 2;
                }
                // right
                else if (lineVerticalAlign === Alignments.RIGHT) {
                    newY -= xSin * (nodeWidth - halfGroupWidth - LINE_OFFSET + line.strokeWeight);
                    newX += xCos * (nodeWidth - halfGroupWidth - LINE_OFFSET + line.strokeWeight);
                }
                // left
                else {
                    newY += xSin * (halfGroupWidth - LINE_OFFSET);
                    newX -= xCos * (halfGroupWidth - LINE_OFFSET);
                }
            }
        }

        transformPosition = [
            [
                xCos, // cos
                xSin, // sin
                newX
            ], [
                yCos, // -sin
                ySin, // cos
                newY
            ]
        ];

        group.relativeTransform = transformPosition;
        group.locked = true;
        group.name = "measurements-" + node.name;

        return group;
    }
    return null;
};


async function main() {
    await figma.loadFontAsync({
        family: "Roboto",
        style: "Regular"
    });

    await figma.loadFontAsync({
        family: "Inter",
        style: "Bold"
    });
}


const isValidShape = node => node.type === "RECTANGLE" || node.type === "ELLIPSE" || node.type === "GROUP" || node.type === "TEXT" || node.type === "VECTOR" || node.type === "FRAME" || node.type === "FRAME";


async function createLineFromMessage({
    direction, align = Alignments.CENTER, strokeCap = "ARROW_LINES"
}) {
    let node;
    let verticalLine: FrameNode;
    let horizontalLine: FrameNode;
    let measureGroup: FrameNode;
    const nodes = [];

    for (node of figma.currentPage.selection) {
        if (isValidShape(node)) {
            if (direction === "vertical") {
                verticalLine = await createLine({
                    node,
                    direction,
                    strokeCap,
                    name: "vertical line",
                    lineVerticalAlign: Alignments[align]
                });

                if (verticalLine) {
                    nodes.push(verticalLine);
                }
            }

            if (direction === "horizontal") {
                horizontalLine = await createLine({
                    node,
                    direction,
                    strokeCap,
                    name: "horizontal line",
                    lineHorizontalAlign: Alignments[align]
                });

                if (horizontalLine) {
                    nodes.push(horizontalLine);
                }
            }

            if (nodes.length > 0) {
                measureGroup = figma.group(nodes, figma.currentPage);
                measureGroup.name = `📐 Measurements | ${nodes.length} Node${nodes.length > 1 ? "s" : ""}`;
            }
        }
    }
}


main()
    .then(() => {
        figma.ui.onmessage = async message => {
            if (message.action === "line-offset") {
                await figma.clientStorage.setAsync("line-offset", message.options.value);
            }

            if (message.action === "line") {
                figma.ui.postMessage({
                    type: "selection",
                    data: figma.currentPage.selection.length > 0
                });

                await createLineFromMessage({
                    direction: message.options.direction,
                    align: message.options.align,
                    strokeCap: message.options.strokeCap
                });
            }

            if (message.type === "cancel") {
                figma.closePlugin();
            }
        };
    });
