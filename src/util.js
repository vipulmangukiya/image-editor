import ImageHelper from './ImageHelper';


export function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

export function getEventLocation(element, event) {
    var pos = getElementPosition(element);

    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

export function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function drawImageFromWebUrl(canvas, sourceurl) {
    var image = new ImageHelper();

    image.load(sourceurl, function () {
        image.draw(
            canvas,
            canvas.width / 2 - image.width / 2,
            canvas.height / 2 - image.height / 2
        );
    });
}

export function drawTransparentImageFromWebUrl(canvas, sourceurl) {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    var image = new ImageHelper();

    image.load(sourceurl, function () {
        image.setColorToAlpha(0, 0);
        image.draw(canvas,
            canvas.width / 2 - image.width / 2,
            canvas.height / 2 - image.height / 2
        );
    });
}

export function drawBgColorImageFromWebUrl(canvas, sourceurl, color) {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var image = new ImageHelper();

    image.load(sourceurl, function () {
        image.setColorToAlpha(0, 0);
        image.tranparentToColor(hexToRgb(color));
        image.draw(canvas,
            canvas.width / 2 - image.width / 2,
            canvas.height / 2 - image.height / 2
        );
    });
}
export function removeExtension(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

export function downloadPng(canvas, file) {
    const name = removeExtension(file.name);
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL();
    link.click();
}