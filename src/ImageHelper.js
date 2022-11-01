function ImageHelper(width, height, colorModel) {
    // properties
    this.image = null;
    this.canvas = null;
    this.ctx = null;
    this.data = null;

    if (colorModel == null) {
        this.colorModel = ImageHelper.COLOR_MODEL_RGB;
    } else {
        this.colorModel = colorModel;
    }

    if (width != null) {
        this.create(width, height);
    }

    if (colorModel === ImageHelper.COLOR_MODEL_BINARY) {
        this.arrBinaryColor = new Array(width * height);
    }
}

ImageHelper.COLOR_MODEL_RGB = 0;
ImageHelper.COLOR_MODEL_BINARY = 1;

ImageHelper.prototype.create = function (width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    this.width = width;
    this.height = height;
};

ImageHelper.prototype.setDimension = function (width, height) {
    this.create(width, height);
};

ImageHelper.prototype.load = function (url, callback) {
    this.onload = callback;
    this.image = new Image();
    var ref = this;
    this.image.onload = function () { ref.callbackImageLoaded(ref) };
    this.image.crossOrigin = "anonymous";
    this.image.src = url;
};

// WARN: the callback "this" object is the reference to js Image object. 
ImageHelper.prototype.callbackImageLoaded = function (ImageHelper) {
    ImageHelper.width = ImageHelper.image.width;
    ImageHelper.height = ImageHelper.image.height;
    ImageHelper.canvas = document.createElement('canvas');
    ImageHelper.canvas.width = ImageHelper.image.width;
    ImageHelper.canvas.height = ImageHelper.image.height;


    ImageHelper.ctx = ImageHelper.canvas.getContext("2d");
    ImageHelper.ctx.drawImage(ImageHelper.image, 0, 0);

    this.imageData = ImageHelper.ctx.getImageData(0, 0, ImageHelper.getWidth(), ImageHelper.getHeight());

    if (ImageHelper.onload != null) {
        ImageHelper.onload();
    }
};

ImageHelper.prototype.clone = function () {
    var image = new ImageHelper(this.getWidth(), this.getHeight(), this.colorModel);
    ImageHelper.copyColorArray(this, image);
    return image;
};

ImageHelper.prototype.update = function (color) {
    this.canvas.getContext("2d").putImageData(this.imageData, 0, 0);
};

ImageHelper.prototype.clear = function (color) {
    for (var y = 0; y < this.getHeight(); y++) {
        for (var x = 0; x < this.getWidth(); x++) {
            this.setIntColor(x, y, color);
        }
    }
};

ImageHelper.prototype.tranparentToColor = function (color) {
    for (var y = 0; y < this.getHeight(); y++) {
        for (var x = 0; x < this.getWidth(); x++) {
            if (this.getAlphaComponent(x, y) === 0) {
                this.setIntColor(x, y, color.r, color.g, color.b);
                this.setAlphaComponent(x, y, 255);
            }
        }
    }
};

ImageHelper.prototype.getColorModel = function () {
    return this.colorModel;
};

ImageHelper.prototype.getAlphaComponent = function (x, y) {
    var start = ((y * this.getWidth()) + x) * 4;
    return this.imageData.data[start + 3];
};


ImageHelper.prototype.setAlphaComponent = function (x, y, alpha) {
    var start = ((y * this.getWidth()) + x) * 4;
    this.imageData.data[start + 3] = alpha;
};

ImageHelper.prototype.getIntComponent0 = function (x, y) {
    var start = ((y * this.getWidth()) + x) * 4;
    return this.imageData.data[start];
};

ImageHelper.prototype.getIntComponent1 = function (x, y) {
    var start = ((y * this.getWidth()) + x) * 4;
    return this.imageData.data[start + 1];
};

ImageHelper.prototype.getIntComponent2 = function (x, y) {
    var start = ((y * this.getWidth()) + x) * 4;
    return this.imageData.data[start + 2];
};

ImageHelper.prototype.setIntColor = function (x, y, a1, a2, a3, a4) {
    if (a2 == null) {
        this.setIntColor1(x, y, a1);
    } else if (a3 == null && a4 == null) {
        this.setIntColor2(x, y, a1, a2);
    }
    else if (a4 == null) {
        this.setIntColor3(x, y, a1, a2, a3);
    }
    else {
        this.setIntColor4(x, y, a1, a2, a3, a4);
    }
};

ImageHelper.prototype.getIntColor = function (x, y) {
    var start = ((y * this.getWidth()) + x) * 4;

    return 0x100000000 +
        (this.imageData.data[start + 3] << 24) +
        (this.imageData.data[start] << 16) +
        (this.imageData.data[start + 1] << 8) +
        (this.imageData.data[start + 2]);
};

ImageHelper.prototype.setIntColor1 = function (x, y, color) {
    var a = (color & 0xFF000000) >>> 24;
    var r = (color & 0x00FF0000) >> 16;
    var g = (color & 0x0000FF00) >> 8;
    var b = color & 0x000000FF;
    this.setIntColor4(x, y, a, r, g, b);
};

ImageHelper.prototype.setBinaryColor = function (x, y, value) {
    var pos = ((y * this.getWidth()) + x);
    this.arrBinaryColor[pos] = value;
};

ImageHelper.prototype.getBinaryColor = function (x, y) {
    var pos = ((y * this.getWidth()) + x);
    return this.arrBinaryColor[pos];
};

ImageHelper.copyColorArray = function (imgSource, imgDestine) {

    if (imgSource.getColorModel() === imgDestine.getColorModel()) {
        switch (imgSource.getColorModel()) {
            case ImageHelper.COLOR_MODEL_RGB:
                for (let i = 0; i < imgSource.imageData.data.length; i++) {
                    imgDestine.imageData.data[i] = imgSource.imageData.data[i];
                }
                break;
            case ImageHelper.COLOR_MODEL_BINARY:
                for (let i = 0; i < imgSource.arrBinaryColor.length; i++) {
                    imgDestine.arrBinaryColor[i] = imgSource.arrBinaryColor[i];
                }
                break;
            default: ;
        }
    }
};

ImageHelper.prototype.drawRect = function (x, y, width, height, color) {
    for (let i = x; i < x + width; i++) {
        this.setIntColor(i, y, color);
        this.setIntColor(i, y + (height - 1), color);
    }

    for (let i = y; i < y + height; i++) {
        this.setIntColor(x, i, color);
        this.setIntColor(x + (width - 1), i, color);
    }
};

ImageHelper.prototype.fillRect = function (x, y, width, height, color) {
    for (var i = x; i < x + width; i++) {
        for (var j = y; j < y + height; j++) {
            if (i < this.getWidth() && j < this.getHeight()) {
                this.setIntColor(i, j, color);
            }
        }
    }
};

ImageHelper.prototype.setColorToAlpha = function (color, alpha) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            if ((this.getIntColor(x, y) & 0x00FFFFFF) === (color & 0x00FFFFFF)) {
                this.setAlphaComponent(x, y, alpha);
            }
        }
    }
};

ImageHelper.prototype.setAlphaToColor = function (color = 0xFFFFFFFF) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            if (this.getAlphaComponent(x, y) === 0) {
                this.setIntColor(x, y, color);
            }
        }
    }
};

ImageHelper.prototype.setIntColor2 = function (x, y, alpha, color) {
    var r = (color & 0x00FF0000) >> 16;
    var g = (color & 0x0000FF00) >> 8;
    var b = color & 0x000000FF;
    this.setIntColor4(x, y, alpha, r, g, b);
};

ImageHelper.prototype.setIntColor3 = function (x, y, r, g, b) {
    this.setIntColor4(x, y, 255, r, g, b);
};

ImageHelper.prototype.setIntColor4 = function (x, y, alpha, r, g, b) {
    var start = ((y * this.getWidth()) + x) * 4;
    this.imageData.data[start] = r;
    this.imageData.data[start + 1] = g;
    this.imageData.data[start + 2] = b;
    this.imageData.data[start + 3] = alpha;
};

ImageHelper.prototype.getWidth = function () {
    return this.width;
};

ImageHelper.prototype.getHeight = function () {
    return this.height;
};

ImageHelper.prototype.isValidPosition = function (x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        return true;
    }
    return false;
};

ImageHelper.prototype.draw = function (canvas, x, y, alphaCombination) {
    if (x == null) { x = 0; }
    if (y == null) { y = 0; }
    canvas.getContext("2d").putImageData(this.imageData, x, y);
};

ImageHelper.prototype.toBlob = function () {
    this.update();
    return ImageHelper.dataURItoBlob(this.canvas.toDataURL("image/png"));
};

ImageHelper.dataURItoBlob = function (dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

export default ImageHelper;