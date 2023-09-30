/*
 * @Author: Satya
 * @Date: 2020-11-25 15:31:15
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-23 09:46:16
 * doc: 单文件
 */

/** @module 修改Scratch2.0位图以在Scratch3.0中使用  */
class BitmapAdapter {
  /**
   * @param {?function} makeImage HTML图像构造函数。 测试可以提供
   * @param {?function} makeCanvas HTML canvas构造函数。 测试可以提供.
   */
  constructor(makeImage, makeCanvas) {
    this._makeImage = makeImage ? makeImage : () => new Image();
    this._makeCanvas = makeCanvas
      ? makeCanvas
      : () => document.createElement("canvas");
  }

  // 返回带有调整大小图像的画布
  resize(image, newWidth, newHeight) {
    // 分两步调整大小，首先匹配宽度，然后匹配高度，以保留最近邻采样
    const stretchWidthCanvas = this._makeCanvas();
    stretchWidthCanvas.width = newWidth;
    stretchWidthCanvas.height = image.height;
    let context = stretchWidthCanvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.drawImage(
      image,
      0,
      0,
      stretchWidthCanvas.width,
      stretchWidthCanvas.height
    );
    const stretchHeightCanvas = this._makeCanvas();
    stretchHeightCanvas.width = newWidth;
    stretchHeightCanvas.height = newHeight;
    context = stretchHeightCanvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.drawImage(
      stretchWidthCanvas,
      0,
      0,
      stretchHeightCanvas.width,
      stretchHeightCanvas.height
    );
    return stretchHeightCanvas;
  }

  /**
   * 转换分辨率位图.
   * @param {!string} dataURI 位图的Base64编码图像数据
   * @param {!function} callback 如果转换成功，则返回更新的dataURI的节点样式回调
   */
  convertResolution1Bitmap(dataURI, callback) {
    const image = this._makeImage();
    image.src = dataURI;
    image.onload = () => {
      callback(
        null,
        this.resize(image, image.width * 2, image.height * 2).toDataURL()
      );
    };
    image.onerror = () => {
      callback("图像加载失败");
    };
  }

  /**
   * 给定上传项目的宽度/高度，在Scratch 3.0中，图像的返回宽度/高度将被调整为
   * @param {!number} oldWidth 原始宽度
   * @param {!number} oldHeight 原始高度
   * @return {object} 新宽度，新高度的数组
   */
  getResizedWidthHeight(oldWidth, oldHeight) {
    const STAGE_WIDTH = 480;
    const STAGE_HEIGHT = 360;
    // 比率
    const STAGE_RATIO = STAGE_WIDTH / STAGE_HEIGHT;

    // 如果两个尺寸都小于或等于相应的平台尺寸，则将两个尺寸都加倍
    if (oldWidth <= STAGE_WIDTH && oldHeight <= STAGE_HEIGHT)
      return { width: oldWidth * 2, height: oldHeight * 2 };

    // 如果两个尺寸都不大于对应的载物台尺寸的2x，则这是一个中间图像，请按原样返回
    if (oldWidth <= STAGE_WIDTH * 2 && oldHeight <= STAGE_HEIGHT * 2)
      return { width: oldWidth, height: oldHeight };

    const imageRatio = oldWidth / oldHeight;
    // 否则，找出如何调整大小 宽图像
    if (imageRatio >= STAGE_RATIO)
      return { width: STAGE_WIDTH * 2, height: (STAGE_WIDTH * 2) / imageRatio };

    // 在这种情况下:
    // - 较宽的图像，但宽度与高度的比例不大，因此将其宽度调整为双载物台尺寸会导致高度过大而无法容纳两倍的载物台高度
    // - 正方形图片仍大于舞台尺寸的至少两倍，因此请选择两个尺寸较小的尺寸（以适合）
    // - A tall image
    // 在上述任何一种情况下，请调整图像大小以适合高度以使舞台高度加倍
    return { width: STAGE_HEIGHT * 2 * imageRatio, height: STAGE_HEIGHT * 2 };
  }

  /**
   * 给定位图数据，请根据需要调整大小。
   * 当有位图需要导入画布时，需要调用importBitmap函数
   * @param {ArrayBuffer | string} fileData 位图的Base64编码图像数据（文件内容或文件uri）
   * Int8Array , Uint8Array , byteLength:32865
   * @param {string} fileType 此文件的MIME类型，如 image/png
   * @returns {Promise} Resolves to 调整大小的图像数据 base64格式
   */
  importBitmap(fileData, fileType) {
    console.log("导入位图 importBitmap:", fileData, fileType);
    let dataURI = ""; // 存储图片base64格式
    /**
     * 如果传入的是ArrayBuffer格式
     * 格式化base64格式的图像 ArrayBuffer转Base64
     * ArrayBuffer ---> 转成类型化数组以正常读取 --> 转成普通字符串 --> 转成base64字符串
     */
    if (fileData instanceof ArrayBuffer)
      dataURI = `data:${fileType};base64,${Utility.arrayBufferToBase64(
        fileData
      )}`;

    //创建图像对象
    return new Promise((resolve, reject) => {
      const image = this._makeImage();
      image.src = dataURI;
      image.onload = () => {
        //判断图像大小与舞台之间的关系，看是否需要使用canvas进行缩放处理
        const newSize = this.getResizedWidthHeight(image.width, image.height);
        //不需要缩放，使用原始大小
        if (newSize.width === image.width && newSize.height === image.height) {
          resolve(Utility.base64ToUintArray(dataURI));
        } else {
          //根据舞台大小调整大小，并修改文件内容
          const resizedDataURI = this.resize(
            image,
            newSize.width,
            newSize.height
          ).toDataURL();
          resolve(Utility.base64ToUintArray(resizedDataURI));
        }
      };
      image.onerror = () => {
        reject("Image load failed");
      };
    });
  }
}

/**
 * @module svg文件转换的入口，可以将svg文件转换为scratch可识别，浏览器可兼容
 */
class SvgRenderer {
  /**
   * Create a quirks-mode SVG renderer for a particular canvas.
   * @param {HTMLCanvasElement} [canvas] 要绘制的可选canvas元素。 如果未提供，则渲染器将创建一个新画布.
   * @constructor
   */
  constructor(canvas) {
    this._canvas = canvas || document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
    this._measurements = { x: 0, y: 0, width: 0, height: 0 };
    this._cachedImage = null;
    this.loaded = false;
  }

  /**
   * @returns {!HTMLCanvasElement} this renderer's target canvas.
   */
  get canvas() {
    return this._canvas;
  }

  /**
   * 从字符串加载SVG并进行测量.
   * @param {string} svgString String of SVG data to draw in quirks-mode.
   * @return {object} SVG的自然大小（以Scratch单位为单位）.
   */
  measure(svgString) {
    this.loadString(svgString);
    return this._measurements;
  }

  /**
   * @return {Array<number>} the natural size, in Scratch units, of this SVG.
   */
  get size() {
    return [this._measurements.width, this._measurements.height];
  }

  /**
   * @return {Array<number>} SVG视图框的偏移量（左上角）.
   */
  get viewOffset() {
    return [this._measurements.x, this._measurements.y];
  }

  /**
   * 加载SVG字符串并对其进行规范化。 绘制/测量之前的所有步骤.
   * @param {!string} svgString svg内容
   */
  loadString(svgString) {
    // 新的svg字符串使缓存的图像无效
    this._cachedImage = null;

    // 将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document
    const parser = new DOMParser();
    //转换SVG中的标签文件 在解析之前，修正svg文件
    svgString = Utility.fixupSvgString(svgString);

    // 返回一个 SVGDocument 对象，同时也是一个 Document 对象。
    // parser = new DOMParser();
    // doc = parser.parseFromString(stringContainingXMLSource, "image/svg+xml");

    this._svgDom = parser.parseFromString(svgString, "text/xml");
    if (
      this._svgDom.childNodes.length < 1 ||
      this._svgDom.documentElement.localName !== "svg"
    ) {
      throw new Error("Document does not appear to be SVG.");
    }
    this._svgTag = this._svgDom.documentElement;
    //转换SVG元素的StrokeWidth
    transformStrokeWidths(this._svgTag, window);
    //对图片进行样式设置
    this._transformImages(this._svgTag);

    if (!this._svgTag.getAttribute("viewBox")) {
      // Renderer expects a view box.
      this._transformMeasurements();
    } else if (
      !this._svgTag.getAttribute("width") ||
      !this._svgTag.getAttribute("height")
    ) {
      this._svgTag.setAttribute("width", this._svgTag.viewBox.baseVal.width);
      this._svgTag.setAttribute("height", this._svgTag.viewBox.baseVal.height);
    }
    this._measurements = {
      width: this._svgTag.viewBox.baseVal.width,
      height: this._svgTag.viewBox.baseVal.height,
      x: this._svgTag.viewBox.baseVal.x,
      y: this._svgTag.viewBox.baseVal.y,
    };
  }

  /**
   * 加载SVG字符串，对其进行规范化，并为进行（同步）渲染做准备.
   * @param {!string} svgString SVG数据的字符串 to draw in quirks-mode.
   * @param {Function} [onFinish] - 加载SVG并可以呈现时调用的可选回调.
   */
  loadSVG(svgString, onFinish) {
    this.loadString(svgString);
    this._createSVGImage(onFinish);
  }

  /**
   * 当前加载的SVG字符串创建<img>元素，然后在加载后调用回调.
   * @param {Function} [onFinish] - 加载<img>后调用的可选回调.
   */
  _createSVGImage(onFinish) {
    if (this._cachedImage === null) this._cachedImage = new Image();
    const img = this._cachedImage;

    img.onload = () => {
      this.loaded = true;
      if (onFinish) onFinish();
    };
    const svgText = this.toString(true /* shouldInjectFonts */);
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
    this.loaded = false;
  }

  /**
   * @param {string} [tagName] svg tag to search for (or collect all elements if not given)
   * @return {Array} a list of elements with the given tagname in _svgTag
   */
  _collectElements(tagName) {
    const elts = [];
    const collectElements = (domElement) => {
      if (
        (domElement.localName === tagName || typeof tagName === "undefined") &&
        domElement.getAttribute
      ) {
        elts.push(domElement);
      }
      for (let i = 0; i < domElement.childNodes.length; i++) {
        collectElements(domElement.childNodes[i]);
      }
    };
    collectElements(this._svgTag);
    return elts;
  }

  /**
   * Fix SVGs to match appearance in Scratch 2, which used nearest neighbor scaling for bitmaps
   * within SVGs.
   */
  _transformImages() {
    const imageElements = this._collectElements("image");

    // For each image element, set image rendering to pixelated
    const pixelatedImages =
      "image-rendering: optimizespeed; image-rendering: pixelated;";
    for (const elt of imageElements) {
      if (elt.getAttribute("style")) {
        elt.setAttribute(
          "style",
          `${pixelatedImages} ${elt.getAttribute("style")}`
        );
      } else {
        elt.setAttribute("style", pixelatedImages);
      }
    }
  }

  /**
   * Find the largest stroke width in the svg. If a shape has no
   * `stroke` property, it has a stroke-width of 0. If it has a `stroke`,
   * it is by default a stroke-width of 1.
   * This is used to enlarge the computed bounding box, which doesn't take
   * stroke width into account.
   * @param {SVGSVGElement} rootNode The root SVG node to traverse.
   * @return {number} The largest stroke width in the SVG.
   */
  _findLargestStrokeWidth(rootNode) {
    let largestStrokeWidth = 0;
    const collectStrokeWidths = (domElement) => {
      if (domElement.getAttribute) {
        if (domElement.getAttribute("stroke")) {
          largestStrokeWidth = Math.max(largestStrokeWidth, 1);
        }
        if (domElement.getAttribute("stroke-width")) {
          largestStrokeWidth = Math.max(
            largestStrokeWidth,
            Number(domElement.getAttribute("stroke-width")) || 0
          );
        }
      }
      for (let i = 0; i < domElement.childNodes.length; i++) {
        collectStrokeWidths(domElement.childNodes[i]);
      }
    };
    collectStrokeWidths(rootNode);
    return largestStrokeWidth;
  }

  /**
   * Transform the measurements of the SVG.
   * In Scratch 2.0, SVGs are drawn without respect to the width,
   * height, and viewBox attribute on the tag. The exporter
   * does output these properties - but they appear to be incorrect often.
   * To address the incorrect measurements, we append the DOM to the
   * document, and then use SVG's native `getBBox` to find the real
   * drawn dimensions. This ensures things drawn in negative dimensions,
   * outside the given viewBox, etc., are all eventually drawn to the canvas.
   * I tried to do this several other ways: stripping the width/height/viewBox
   * attributes and then drawing (Firefox won't draw anything),
   * or inflating them and then measuring a canvas. But this seems to be
   * a natural and performant way.
   */
  _transformMeasurements() {
    // Append the SVG dom to the document.
    // This allows us to use `getBBox` on the page,
    // which returns the full bounding-box of all drawn SVG
    // elements, similar to how Scratch 2.0 did measurement.
    const svgSpot = document.createElement("span");
    // Clone the svg tag. This tag becomes unusable/undrawable in browsers
    // once it's appended to the page, perhaps for security reasons?
    const tempTag = this._svgTag.cloneNode(/* deep */ true);
    let bbox;
    try {
      svgSpot.appendChild(tempTag);
      document.body.appendChild(svgSpot);
      // Take the bounding box.
      bbox = tempTag.getBBox();
    } finally {
      // Always destroy the element, even if, for example, getBBox throws.
      document.body.removeChild(svgSpot);
      svgSpot.removeChild(tempTag);
    }

    // Enlarge the bbox from the largest found stroke width
    // This may have false-positives, but at least the bbox will always
    // contain the full graphic including strokes.
    // If the width or height is zero however, don't enlarge since
    // they won't have a stroke width that needs to be enlarged.
    let halfStrokeWidth;
    if (bbox.width === 0 || bbox.height === 0) {
      halfStrokeWidth = 0;
    } else {
      halfStrokeWidth = this._findLargestStrokeWidth(this._svgTag) / 2;
    }
    const width = bbox.width + halfStrokeWidth * 2;
    const height = bbox.height + halfStrokeWidth * 2;
    const x = bbox.x - halfStrokeWidth;
    const y = bbox.y - halfStrokeWidth;

    // Set the correct measurements on the SVG tag
    this._svgTag.setAttribute("width", width);
    this._svgTag.setAttribute("height", height);
    this._svgTag.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
  }

  /**
   * Serialize the active SVG DOM to a string.
   * @param {?boolean} shouldInjectFonts True if fonts should be included in the SVG as
   *     base64 data.
   * @returns {string} String representing current SVG data.
   */
  toString(shouldInjectFonts) {
    const serializer = new XMLSerializer();
    let string = serializer.serializeToString(this._svgDom);
    // if (shouldInjectFonts) {
    //     string = inlineSvgFonts(string);
    // }
    return string;
  }

  /**
   * Synchronously draw the loaded SVG to this renderer's `canvas`.
   * @param {number} [scale] - Optionally, also scale the image by this factor.
   */
  draw(scale) {
    if (!this.loaded) throw new Error("SVG image has not finished loading");
    this._drawFromImage(scale);
  }

  /**
   * Asynchronously draw the (possibly non-loaded) SVG to a canvas.
   * @param {number} [scale] - Optionally, also scale the image by this factor.
   * @param {Function} [onFinish] - An optional callback to call when the draw operation is complete.
   * @deprecated Use the `loadSVG` and public `draw` method instead.
   */
  _draw(scale, onFinish) {
    // Convert the SVG text to an Image, and then draw it to the canvas.
    if (this._cachedImage === null) {
      this._createSVGImage(() => {
        this._drawFromImage(scale);
        onFinish();
      });
    } else {
      this._drawFromImage(scale);
      onFinish();
    }
  }

  /**
   * Draw to the canvas from a loaded image element.
   * @param {number} [scale] - Optionally, also scale the image by this factor.
   **/
  _drawFromImage(scale) {
    if (this._cachedImage === null) return;

    const ratio = Number.isFinite(scale) ? scale : 1;
    const bbox = this._measurements;
    this._canvas.width = bbox.width * ratio;
    this._canvas.height = bbox.height * ratio;
    if (this._canvas.width <= 0 || this._canvas.height <= 0) return;
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.scale(ratio, ratio);
    this._context.drawImage(this._cachedImage, 0, 0);
    // Reset the canvas transform after drawing.
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    // Set the CSS style of the canvas to the actual measurements.
    this._canvas.style.width = bbox.width;
    this._canvas.style.height = bbox.height;
  }
}

window.KidSvgRenderer = {
  BitmapAdapter: new BitmapAdapter(),
  SVGRenderer: new SvgRenderer(),
};

// /** @module 修改Scratch2.0位图以在Scratch3.0中使用  */
// class BitmapAdapter {
//   /**
//    * @param {?function} makeImage HTML图像构造函数。 测试可以提供
//    * @param {?function} makeCanvas HTML canvas构造函数。 测试可以提供.
//    */
//   constructor(makeImage, makeCanvas) {
//     this._makeImage = makeImage ? makeImage : () => new Image();
//     this._makeCanvas = makeCanvas
//       ? makeCanvas
//       : () => document.createElement("canvas");

//     console.log("kid-svg-renderer BitmapAdapter.js");
//   }

//   // 返回带有调整大小图像的画布
//   resize(image, newWidth, newHeight) {
//     // 分两步调整大小，首先匹配宽度，然后匹配高度，以保留最近邻采样
//     const stretchWidthCanvas = this._makeCanvas();
//     stretchWidthCanvas.width = newWidth;
//     stretchWidthCanvas.height = image.height;
//     let context = stretchWidthCanvas.getContext("2d");
//     context.imageSmoothingEnabled = false;
//     context.drawImage(
//       image,
//       0,
//       0,
//       stretchWidthCanvas.width,
//       stretchWidthCanvas.height
//     );
//     const stretchHeightCanvas = this._makeCanvas();
//     stretchHeightCanvas.width = newWidth;
//     stretchHeightCanvas.height = newHeight;
//     context = stretchHeightCanvas.getContext("2d");
//     context.imageSmoothingEnabled = false;
//     context.drawImage(
//       stretchWidthCanvas,
//       0,
//       0,
//       stretchHeightCanvas.width,
//       stretchHeightCanvas.height
//     );
//     return stretchHeightCanvas;
//   }

//   /**
//    * 转换分辨率位图.
//    * @param {!string} dataURI 位图的Base64编码图像数据
//    * @param {!function} callback 如果转换成功，则返回更新的dataURI的节点样式回调
//    */
//   convertResolution1Bitmap(dataURI, callback) {
//     const image = this._makeImage();
//     image.src = dataURI;
//     image.onload = () => {
//       callback(
//         null,
//         this.resize(image, image.width * 2, image.height * 2).toDataURL()
//       );
//     };
//     image.onerror = () => {
//       callback("图像加载失败");
//     };
//   }

//   /**
//    * 给定上传项目的宽度/高度，在Scratch 3.0中，图像的返回宽度/高度将被调整为
//    * @param {!number} oldWidth 原始宽度
//    * @param {!number} oldHeight 原始高度
//    * @return {object} 新宽度，新高度的数组
//    */
//   getResizedWidthHeight(oldWidth, oldHeight) {
//     const STAGE_WIDTH = 480;
//     const STAGE_HEIGHT = 360;
//     // 比率
//     const STAGE_RATIO = STAGE_WIDTH / STAGE_HEIGHT;

//     // 如果两个尺寸都小于或等于相应的平台尺寸，则将两个尺寸都加倍
//     if (oldWidth <= STAGE_WIDTH && oldHeight <= STAGE_HEIGHT) {
//       return { width: oldWidth * 2, height: oldHeight * 2 };
//     }

//     // 如果两个尺寸都不大于对应的载物台尺寸的2x，则这是一个中间图像，请按原样返回
//     if (oldWidth <= STAGE_WIDTH * 2 && oldHeight <= STAGE_HEIGHT * 2) {
//       return { width: oldWidth, height: oldHeight };
//     }

//     const imageRatio = oldWidth / oldHeight;
//     // 否则，找出如何调整大小
//     if (imageRatio >= STAGE_RATIO) {
//       // 宽图像
//       return { width: STAGE_WIDTH * 2, height: (STAGE_WIDTH * 2) / imageRatio };
//     }
//     // 在这种情况下:
//     // - 较宽的图像，但宽度与高度的比例不大，因此将其宽度调整为双载物台尺寸会导致高度过大而无法容纳两倍的载物台高度
//     // - 正方形图片仍大于舞台尺寸的至少两倍，因此请选择两个尺寸较小的尺寸（以适合）
//     // - A tall image
//     // 在上述任何一种情况下，请调整图像大小以适合高度以使舞台高度加倍
//     return { width: STAGE_HEIGHT * 2 * imageRatio, height: STAGE_HEIGHT * 2 };
//   }

//   /**
//    * 给定位图数据，请根据需要调整大小。
//    * 当有位图需要导入画布时，需要调用importBitmap函数
//    * @param {ArrayBuffer | string} fileData 位图的Base64编码图像数据（文件内容或文件uri）
//    * Int8Array , Uint8Array , byteLength:32865
//    * @param {string} fileType 此文件的MIME类型，如 image/png
//    * @returns {Promise} Resolves to 调整大小的图像数据 base64格式
//    */
//   importBitmap(fileData, fileType) {
//     console.log("导入位图 importBitmap:", fileData, fileType);
//     let dataURI = ""; // 存储图片base64格式
//     /**
//      * 如果传入的是ArrayBuffer格式
//      * 格式化base64格式的图像 ArrayBuffer转Base64
//      * ArrayBuffer ---> 转成类型化数组以正常读取 --> 转成普通字符串 --> 转成base64字符串
//      */
//     if (fileData instanceof ArrayBuffer)
//       dataURI = `data:${fileType};base64,${Utility.arrayBufferToBase64(
//         fileData
//       )}`;

//     //创建图像对象
//     return new Promise((resolve, reject) => {
//       const image = this._makeImage();
//       image.src = dataURI;
//       image.onload = () => {
//         //判断图像大小与舞台之间的关系，看是否需要使用canvas进行缩放处理
//         const newSize = this.getResizedWidthHeight(image.width, image.height);
//         //不需要缩放，使用原始大小
//         if (newSize.width === image.width && newSize.height === image.height) {
//           resolve(Utility.base64ToUintArray(dataURI));
//         } else {
//           //根据舞台大小调整大小，并修改文件内容
//           const resizedDataURI = this.resize(
//             image,
//             newSize.width,
//             newSize.height
//           ).toDataURL();
//           resolve(Utility.base64ToUintArray(resizedDataURI));
//         }
//       };
//       image.onerror = () => {
//         reject("Image load failed");
//       };
//     });
//   }
// }

// /**
//  * @module svg文件转换的入口，可以将svg文件转换为scratch可识别，浏览器可兼容
//  */
// class SvgRenderer {
//   /**
//    * Create a quirks-mode SVG renderer for a particular canvas.
//    * @param {HTMLCanvasElement} [canvas] 要绘制的可选canvas元素。 如果未提供，则渲染器将创建一个新画布.
//    * @constructor
//    */
//   constructor(canvas) {
//     this._canvas = canvas || document.createElement("canvas");
//     this._context = this._canvas.getContext("2d");
//     this._measurements = { x: 0, y: 0, width: 0, height: 0 };
//     this._cachedImage = null;
//     this.loaded = false;
//   }

//   /**
//    * @returns {!HTMLCanvasElement} this renderer's target canvas.
//    */
//   get canvas() {
//     return this._canvas;
//   }

//   /**
//    * 从字符串加载SVG并进行测量.
//    * @param {string} svgString String of SVG data to draw in quirks-mode.
//    * @return {object} SVG的自然大小（以Scratch单位为单位）.
//    */
//   measure(svgString) {
//     this.loadString(svgString);
//     return this._measurements;
//   }

//   /**
//    * @return {Array<number>} the natural size, in Scratch units, of this SVG.
//    */
//   get size() {
//     return [this._measurements.width, this._measurements.height];
//   }

//   /**
//    * @return {Array<number>} SVG视图框的偏移量（左上角）.
//    */
//   get viewOffset() {
//     return [this._measurements.x, this._measurements.y];
//   }

//   /**
//    * 加载SVG字符串并对其进行规范化。 绘制/测量之前的所有步骤.
//    * @param {!string} svgString svg内容
//    * @param {?boolean} fromVersion2 是否是scratch2.0产生的svg文件
//    */
//   loadString(svgString, fromVersion2) {
//     // New svg string invalidates the cached image
//     this._cachedImage = null;

//     // Parse string into SVG XML.
//     const parser = new DOMParser();
//     //转换SVG中的标签文件
//     svgString = fixupSvgString(svgString);
//     this._svgDom = parser.parseFromString(svgString, "text/xml");
//     if (
//       this._svgDom.childNodes.length < 1 ||
//       this._svgDom.documentElement.localName !== "svg"
//     ) {
//       throw new Error("Document does not appear to be SVG.");
//     }
//     this._svgTag = this._svgDom.documentElement;
//     if (fromVersion2) {
//       // Fix gradients. Scratch 2 exports no x2 when x2 = 0, but
//       // SVG default is that x2 is 1. This must be done before
//       // transformStrokeWidths since transformStrokeWidths affects
//       // gradients.
//       // 修改渐变色 gradients
//       this._transformGradients();
//     }
//     //转换SVG元素的StrokeWidth
//     transformStrokeWidths(this._svgTag, window);
//     //对图片进行样式设置
//     this._transformImages(this._svgTag);
//     if (fromVersion2) {
//       // 将SVG中的文本转为可识别的文本信息
//       //   this._transformText();
//       //scratch 2.0中的svg中没有width height viewbox，导致解析错误
//       //通过getBBox获得真实svg位置
//       this._transformMeasurements();
//       // 设置连接点和断点为round
//       this._setGradientStrokeRoundedness();
//     } else if (!this._svgTag.getAttribute("viewBox")) {
//       // Renderer expects a view box.
//       this._transformMeasurements();
//     } else if (
//       !this._svgTag.getAttribute("width") ||
//       !this._svgTag.getAttribute("height")
//     ) {
//       this._svgTag.setAttribute("width", this._svgTag.viewBox.baseVal.width);
//       this._svgTag.setAttribute("height", this._svgTag.viewBox.baseVal.height);
//     }
//     this._measurements = {
//       width: this._svgTag.viewBox.baseVal.width,
//       height: this._svgTag.viewBox.baseVal.height,
//       x: this._svgTag.viewBox.baseVal.x,
//       y: this._svgTag.viewBox.baseVal.y,
//     };
//   }

//   /**
//    * Load an SVG string, normalize it, and prepare it for (synchronous) rendering.
//    * @param {!string} svgString String of SVG data to draw in quirks-mode.
//    * @param {?boolean} fromVersion2 True if we should perform conversion from version 2 to version 3 svg.
//    * @param {Function} [onFinish] - An optional callback to call when the SVG is loaded and can be rendered.
//    */
//   loadSVG(svgString, fromVersion2, onFinish) {
//     this.loadString(svgString, fromVersion2);
//     this._createSVGImage(onFinish);
//   }

//   /**
//    * 当前加载的SVG字符串创建<img>元素，然后在加载后调用回调.
//    * @param {Function} [onFinish] - 加载<img>后调用的可选回调.
//    */
//   _createSVGImage(onFinish) {
//     if (this._cachedImage === null) this._cachedImage = new Image();
//     const img = this._cachedImage;

//     img.onload = () => {
//       this.loaded = true;
//       if (onFinish) onFinish();
//     };
//     const svgText = this.toString(true /* shouldInjectFonts */);
//     img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
//     this.loaded = false;
//   }

//   /**
//    * @param {string} [tagName] svg tag to search for (or collect all elements if not given)
//    * @return {Array} a list of elements with the given tagname in _svgTag
//    */
//   _collectElements(tagName) {
//     const elts = [];
//     const collectElements = (domElement) => {
//       if (
//         (domElement.localName === tagName || typeof tagName === "undefined") &&
//         domElement.getAttribute
//       ) {
//         elts.push(domElement);
//       }
//       for (let i = 0; i < domElement.childNodes.length; i++) {
//         collectElements(domElement.childNodes[i]);
//       }
//     };
//     collectElements(this._svgTag);
//     return elts;
//   }

//   /**
//    * Fix SVGs to comply with SVG spec. Scratch 2 defaults to x2 = 0 when x2 is missing, but
//    * SVG defaults to x2 = 1 when missing.
//    */
//   _transformGradients() {
//     const linearGradientElements = this._collectElements("linearGradient");

//     // For each gradient element, supply x2 if necessary.
//     for (const gradientElement of linearGradientElements) {
//       if (!gradientElement.getAttribute("x2")) {
//         gradientElement.setAttribute("x2", "0");
//       }
//     }
//   }

//   /**
//    * Fix SVGs to match appearance in Scratch 2, which used nearest neighbor scaling for bitmaps
//    * within SVGs.
//    */
//   _transformImages() {
//     const imageElements = this._collectElements("image");

//     // For each image element, set image rendering to pixelated
//     const pixelatedImages =
//       "image-rendering: optimizespeed; image-rendering: pixelated;";
//     for (const elt of imageElements) {
//       if (elt.getAttribute("style")) {
//         elt.setAttribute(
//           "style",
//           `${pixelatedImages} ${elt.getAttribute("style")}`
//         );
//       } else {
//         elt.setAttribute("style", pixelatedImages);
//       }
//     }
//   }

//   /**
//    * Find the largest stroke width in the svg. If a shape has no
//    * `stroke` property, it has a stroke-width of 0. If it has a `stroke`,
//    * it is by default a stroke-width of 1.
//    * This is used to enlarge the computed bounding box, which doesn't take
//    * stroke width into account.
//    * @param {SVGSVGElement} rootNode The root SVG node to traverse.
//    * @return {number} The largest stroke width in the SVG.
//    */
//   _findLargestStrokeWidth(rootNode) {
//     let largestStrokeWidth = 0;
//     const collectStrokeWidths = (domElement) => {
//       if (domElement.getAttribute) {
//         if (domElement.getAttribute("stroke")) {
//           largestStrokeWidth = Math.max(largestStrokeWidth, 1);
//         }
//         if (domElement.getAttribute("stroke-width")) {
//           largestStrokeWidth = Math.max(
//             largestStrokeWidth,
//             Number(domElement.getAttribute("stroke-width")) || 0
//           );
//         }
//       }
//       for (let i = 0; i < domElement.childNodes.length; i++) {
//         collectStrokeWidths(domElement.childNodes[i]);
//       }
//     };
//     collectStrokeWidths(rootNode);
//     return largestStrokeWidth;
//   }

//   /**
//    * Find all instances of a URL-referenced `stroke` in the svg. In 2.0, all gradient strokes
//    * have a round `stroke-linejoin` and `stroke-linecap`... for some reason.
//    */
//   _setGradientStrokeRoundedness() {
//     const elements = this._collectElements();

//     for (const elt of elements) {
//       if (!elt.style) continue;
//       const stroke = elt.style.stroke || elt.getAttribute("stroke");
//       if (stroke && stroke.match(/^url\(#.*\)$/)) {
//         elt.style["stroke-linejoin"] = "round";
//         elt.style["stroke-linecap"] = "round";
//       }
//     }
//   }

//   /**
//    * Transform the measurements of the SVG.
//    * In Scratch 2.0, SVGs are drawn without respect to the width,
//    * height, and viewBox attribute on the tag. The exporter
//    * does output these properties - but they appear to be incorrect often.
//    * To address the incorrect measurements, we append the DOM to the
//    * document, and then use SVG's native `getBBox` to find the real
//    * drawn dimensions. This ensures things drawn in negative dimensions,
//    * outside the given viewBox, etc., are all eventually drawn to the canvas.
//    * I tried to do this several other ways: stripping the width/height/viewBox
//    * attributes and then drawing (Firefox won't draw anything),
//    * or inflating them and then measuring a canvas. But this seems to be
//    * a natural and performant way.
//    */
//   _transformMeasurements() {
//     // Append the SVG dom to the document.
//     // This allows us to use `getBBox` on the page,
//     // which returns the full bounding-box of all drawn SVG
//     // elements, similar to how Scratch 2.0 did measurement.
//     const svgSpot = document.createElement("span");
//     // Clone the svg tag. This tag becomes unusable/undrawable in browsers
//     // once it's appended to the page, perhaps for security reasons?
//     const tempTag = this._svgTag.cloneNode(/* deep */ true);
//     let bbox;
//     try {
//       svgSpot.appendChild(tempTag);
//       document.body.appendChild(svgSpot);
//       // Take the bounding box.
//       bbox = tempTag.getBBox();
//     } finally {
//       // Always destroy the element, even if, for example, getBBox throws.
//       document.body.removeChild(svgSpot);
//       svgSpot.removeChild(tempTag);
//     }

//     // Enlarge the bbox from the largest found stroke width
//     // This may have false-positives, but at least the bbox will always
//     // contain the full graphic including strokes.
//     // If the width or height is zero however, don't enlarge since
//     // they won't have a stroke width that needs to be enlarged.
//     let halfStrokeWidth;
//     if (bbox.width === 0 || bbox.height === 0) {
//       halfStrokeWidth = 0;
//     } else {
//       halfStrokeWidth = this._findLargestStrokeWidth(this._svgTag) / 2;
//     }
//     const width = bbox.width + halfStrokeWidth * 2;
//     const height = bbox.height + halfStrokeWidth * 2;
//     const x = bbox.x - halfStrokeWidth;
//     const y = bbox.y - halfStrokeWidth;

//     // Set the correct measurements on the SVG tag
//     this._svgTag.setAttribute("width", width);
//     this._svgTag.setAttribute("height", height);
//     this._svgTag.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
//   }

//   /**
//    * Serialize the active SVG DOM to a string.
//    * @param {?boolean} shouldInjectFonts True if fonts should be included in the SVG as
//    *     base64 data.
//    * @returns {string} String representing current SVG data.
//    */
//   toString(shouldInjectFonts) {
//     const serializer = new XMLSerializer();
//     let string = serializer.serializeToString(this._svgDom);
//     // if (shouldInjectFonts) {
//     //     string = inlineSvgFonts(string);
//     // }
//     return string;
//   }

//   /**
//    * Synchronously draw the loaded SVG to this renderer's `canvas`.
//    * @param {number} [scale] - Optionally, also scale the image by this factor.
//    */
//   draw(scale) {
//     if (!this.loaded) throw new Error("SVG image has not finished loading");
//     this._drawFromImage(scale);
//   }

//   /**
//    * Asynchronously draw the (possibly non-loaded) SVG to a canvas.
//    * @param {number} [scale] - Optionally, also scale the image by this factor.
//    * @param {Function} [onFinish] - An optional callback to call when the draw operation is complete.
//    * @deprecated Use the `loadSVG` and public `draw` method instead.
//    */
//   _draw(scale, onFinish) {
//     // Convert the SVG text to an Image, and then draw it to the canvas.
//     if (this._cachedImage === null) {
//       this._createSVGImage(() => {
//         this._drawFromImage(scale);
//         onFinish();
//       });
//     } else {
//       this._drawFromImage(scale);
//       onFinish();
//     }
//   }

//   /**
//    * Draw to the canvas from a loaded image element.
//    * @param {number} [scale] - Optionally, also scale the image by this factor.
//    **/
//   _drawFromImage(scale) {
//     if (this._cachedImage === null) return;

//     const ratio = Number.isFinite(scale) ? scale : 1;
//     const bbox = this._measurements;
//     this._canvas.width = bbox.width * ratio;
//     this._canvas.height = bbox.height * ratio;
//     if (this._canvas.width <= 0 || this._canvas.height <= 0) return;
//     this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
//     this._context.scale(ratio, ratio);
//     this._context.drawImage(this._cachedImage, 0, 0);
//     // Reset the canvas transform after drawing.
//     this._context.setTransform(1, 0, 0, 1, 0, 0);
//     // Set the CSS style of the canvas to the actual measurements.
//     this._canvas.style.width = bbox.width;
//     this._canvas.style.height = bbox.height;
//   }
// }

// window.KidSvgRenderer = {
//   BitmapAdapter: new BitmapAdapter(),
//   SVGRenderer: new SvgRenderer(),
// };
