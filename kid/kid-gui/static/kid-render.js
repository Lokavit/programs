/*
 * @Author: Satya
 * @Date: 2020-12-18 15:12:51
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-25 12:02:48
 * doc:渲染相关，单文件形式
 */

/** @description RenderConstants.js */
const ID_NONE = -1;
const SKIN_SHARE_SOFT_LIMIT = 301;
const Events = {
  /**
   * @description 本机SizeChanged事件
   * @event RenderWebGL#event:NativeSizeChanged
   * @type {object}
   * @property {Array<int>} newSize - 渲染器的新大小
   */
  NativeSizeChanged: "NativeSizeChanged",
};

/**
 * @module 矩形.用于创建和比较与轴对齐的矩形的实用程序
 * @description 矩形总是被初始化为“最大可能的矩形”。 使用下面的init *方法之一来设置特定的矩形
 */
class Rectangle {
  constructor() {
    this.left = -Infinity;
    this.right = Infinity;
    this.bottom = -Infinity;
    this.top = Infinity;
    console.warn("k-r.js class Rectangle 矩形的构造函数");
  }

  /**
   * 根据给定的坐标范围初始化一个 矩形.
   * @param {number} left 矩形的左边界.
   * @param {number} right 矩形的右边界.
   * @param {number} bottom 矩形的下边界.
   * @param {number} top 矩形的上边界.
   */
  initFromBounds(left, right, bottom, top) {
    console.warn("k-r.js 初始化一个矩形");
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
  }

  /**
   * 在一组点周围将矩形初始化为最小AABB.
   * @param {Array<Array<number>>} points Array of [x, y] points.
   */
  initFromPointsAABB(points) {
    console.warn("k-r.js 在一组点周围将矩形初始化为最小AABB");
    this.left = Infinity;
    this.right = -Infinity;
    this.top = -Infinity;
    this.bottom = Infinity;

    for (let i = 0; i < points.length; i++) {
      const x = points[i][0];
      const y = points[i][1];
      if (x < this.left) {
        this.left = x;
      }
      if (x > this.right) {
        this.right = x;
      }
      if (y > this.top) {
        this.top = y;
      }
      if (y < this.bottom) {
        this.bottom = y;
      }
    }
  }

  /**
   * 将矩形初始化为以模型矩阵转换为中心，以0 x 0为中心的1单位正方形.
   * @param {Array.<number>} m 4x4矩阵，通.
   * @tutorial Rectangle-AABB-Matrix
   */
  initFromModelMatrix(m) {
    console.warn(
      "k-r.js 将矩形初始化为以模型矩阵转换为中心，以0 x 0为中心的1单位正方形"
    );
    // 在2D空间中，我们将很快使用2x2“左上”比例尺和旋转子矩阵，同时存储和放置1x2“右上”位置矢量.
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];

    // "Transform" a (0.5, 0.5) 向量由比例尺和旋转矩阵组成，但求和每个分量的绝对值，而不使用带符号的值.
    const x = Math.abs(0.5 * m[0 * 4 + 0]) + Math.abs(0.5 * m[1 * 4 + 0]);
    const y = Math.abs(0.5 * m[0 * 4 + 1]) + Math.abs(0.5 * m[1 * 4 + 1]);

    // 并将它们添加到位置组件中将初始化我们的Rectangle.
    this.left = -x + m30;
    this.right = x + m30;
    this.top = y + m31;
    this.bottom = -y + m31;
  }

  /**
   * 确定此矩形是否与其他矩形相交.
   * 请注意，这是一个比较，假设Rectangle已使用kid-space边界或点进行了初始化.
   * @param {!Rectangle} other 矩形检查是否相交.
   * @return {boolean} 如果此矩形与其他相交，则为真.
   */
  intersects(other) {
    console.warn("k-r.js 确定此矩形是否与其他矩形相交");
    return (
      this.left <= other.right &&
      other.left <= this.right &&
      this.top >= other.bottom &&
      other.top >= this.bottom
    );
  }

  /**
   * 确定此矩形是否完全包含其他一些矩形.
   * 请注意，这是一个比较，假设Rectangle已使用kid-space边界或点进行了初始化.
   * @param {!Rectangle} other 矩形检查是否完全包含.
   * @return {boolean} 如果此矩形完全包含其他矩形，则为真.
   */
  contains(other) {
    console.warn("k-r.js 确定此矩形是否完全包含其他一些矩形");
    return (
      other.left > this.left &&
      other.right < this.right &&
      other.top < this.top &&
      other.bottom > this.bottom
    );
  }

  /**
   * 将矩形夹到边界.
   * @param {number} left Left clamp.
   * @param {number} right Right clamp.
   * @param {number} bottom Bottom clamp.
   * @param {number} top Top clamp.
   */
  clamp(left, right, bottom, top) {
    console.warn("k-r.js 将矩形夹到边界");
    this.left = Math.max(this.left, left);
    this.right = Math.min(this.right, right);
    this.bottom = Math.max(this.bottom, bottom);
    this.top = Math.min(this.top, top);

    this.left = Math.min(this.left, right);
    this.right = Math.max(this.right, left);
    this.bottom = Math.min(this.bottom, top);
    this.top = Math.max(this.top, bottom);
  }

  /**
   * 将矩形推出整数范围.
   */
  snapToInt() {
    console.warn("k-r.js 将矩形推出整数范围");
    this.left = Math.floor(this.left);
    this.right = Math.ceil(this.right);
    this.bottom = Math.floor(this.bottom);
    this.top = Math.ceil(this.top);
  }

  /**
   * 计算两个边界矩形的交点.如果它们不相交，可能是不可能的盒子.
   * @param {Rectangle} a 一个矩形
   * @param {Rectangle} b 其他矩形
   * @param {?Rectangle} result 所得的存储矩形（如果要覆盖一个，则可以安全地传递a或b）
   * @returns {Rectangle} resulting rectangle
   */
  static intersect(a, b, result = new Rectangle()) {
    console.warn("k-r.js 计算两个边界矩形的交点");
    result.left = Math.max(a.left, b.left);
    result.right = Math.min(a.right, b.right);
    result.top = Math.min(a.top, b.top);
    result.bottom = Math.max(a.bottom, b.bottom);

    return result;
  }

  /**
   * 计算两个边界矩形的并集.
   * @param {Rectangle} a One rectangle
   * @param {Rectangle} b Other rectangle
   * @param {?Rectangle} result A resulting storage rectangle  (safe to pass
   *                            a or b if you want to overwrite one)
   * @returns {Rectangle} resulting rectangle
   */
  static union(a, b, result = new Rectangle()) {
    console.warn("k-r.js 计算两个边界矩形的并集");
    result.left = Math.min(a.left, b.left);
    result.right = Math.max(a.right, b.right);
    // Scratch Space - +y is up
    result.top = Math.max(a.top, b.top);
    result.bottom = Math.min(a.bottom, b.bottom);
    return result;
  }

  /**
   * @return {number} 矩形的宽.
   */
  get width() {
    console.warn("k-r.js 矩形的宽");
    return Math.abs(this.left - this.right);
  }

  /**
   * @return {number} 矩形的高.
   */
  get height() {
    console.warn("k-r.js 矩形的高");
    return Math.abs(this.top - this.bottom);
  }
}

/**
 * @fileoverview
 * A representation of a Skin's silhouette that can test if a point on the skin renders a pixel where it is drawn.
 * 皮肤轮廓的表示形式，可以测试皮肤上的点是否在绘制点处渲染了像素
 */

/**
 * <canvas> element 用于从外观位图数据更新剪影数据.
 * @type {CanvasElement}
 */
let __SilhouetteUpdateCanvas;

/**
 * 内部辅助函数（希望编译器可以内联）。 从轮廓数据中获取一个像素，如果超出边界则为0.
 * @private
 * @param {Silhouette} silhouette - 具有数据的宽度和高度
 * @param {number} x - x
 * @param {number} y - y
 * @return {number} x / y位置的Alpha值
 */
const getPoint = (
  { _width: width, _height: height, _colorData: data },
  x,
  y
) => {
  console.warn("k-r.js 内部辅助函数");
  // 如果超出范围，则为0，否则从数据中读取.
  return x >= width || y >= height || x < 0 || y < 0
    ? 0
    : data[(y * width + x) * 4 + 3];
};

/**
 * 用于线性插值的4个角采样的内存缓冲区
 */
const __cornerWork = [
  new Uint8ClampedArray(4),
  new Uint8ClampedArray(4),
  new Uint8ClampedArray(4),
  new Uint8ClampedArray(4),
];

/**
 * 从给定轮廓在x / y局部纹理位置获取颜色.将颜色值乘以alpha以进行正确的混合.
 * @param {Silhouette} The 剪影样本.
 * @param {number} x 纹理的X位置 (0-1).
 * @param {number} y 纹理的Y位置 (0-1).
 * @param {Uint8ClampedArray} dst 彩色4b空间.
 * @return {Uint8ClampedArray} dst矢量.
 */
const getColor4b = (
  { _width: width, _height: height, _colorData: data },
  x,
  y,
  dst
) => {
  console.warn("k-r.js 从给定轮廓在x/y局部纹理位置获取颜色");
  // 如果超出范围，则为0，否则从数据中读取.
  if (x >= width || y >= height || x < 0 || y < 0) return dst.fill(0);

  const offset = (y * width + x) * 4;
  // 预乘alpha
  const alpha = data[offset + 3] / 255;
  dst[0] = data[offset] * alpha;
  dst[1] = data[offset + 1] * alpha;
  dst[2] = data[offset + 2] * alpha;
  dst[3] = data[offset + 3];
  return dst;
};

/**
 * 从给定轮廓在x / y局部纹理位置获取颜色.
 * 不要将颜色值乘以alpha，因为已经完成了.
 * @param {Silhouette} The 剪影样本.
 * @param {number} x X position of texture (0-1).
 * @param {number} y Y position of texture (0-1).
 * @param {Uint8ClampedArray} dst A color 4b space.
 * @return {Uint8ClampedArray} The dst vector.
 */
const getPremultipliedColor4b = (
  { _width: width, _height: height, _colorData: data },
  x,
  y,
  dst
) => {
  console.warn("k-r.js 从给定轮廓在x/y局部纹理位置获取颜色");
  // 如果超出范围，则为0，否则从数据中读取.
  if (x >= width || y >= height || x < 0 || y < 0) return dst.fill(0);

  const offset = (y * width + x) * 4;
  dst[0] = data[offset];
  dst[1] = data[offset + 1];
  dst[2] = data[offset + 2];
  dst[3] = data[offset + 3];
  return dst;
};

class Silhouette {
  constructor() {
    /**
     * 代表当前皮肤数据的数据宽度.
     * @type {number}
     */
    this._width = 0;

    /**
     * 代表当前皮肤数据的数据高度.
     * @type {number}
     */
    this._height = 0;

    /**
     * 代表皮肤轮廓形状的数据.
     * @type {Uint8ClampedArray}
     */
    this._colorData = null;

    // 默认情况下，假定轮廓不包含预乘的图像数据，因此当获得颜色时，我们希望将其乘以其Alpha通道. 将_getColor指向要相乘的函数的版本.
    this._getColor = getColor4b;

    this.colorAtNearest = this.colorAtLinear = (_, dst) => dst.fill(0);

    console.warn("k-r.js class Silhouette 轮廓", this);
  }

  /**
   * 使用皮肤的bitmapData更新此轮廓.
   * @param {ImageData|HTMLCanvasElement|HTMLImageElement} bitmapData 皮肤上的图像，画布或其他元素
   * @param {boolean} isPremultiplied 如果源位图数据是预乘的（例如来自readPixels），则为true.
   */
  update(bitmapData, isPremultiplied = false) {
    console.warn("k-r.js 使用皮肤的bitmapData更新此轮廓");
    let imageData;
    if (bitmapData instanceof ImageData) {
      // 如果直接交给ImageData，请直接使用.
      imageData = bitmapData;
      this._width = bitmapData.width;
      this._height = bitmapData.height;
    } else {
      // 在我们的更新画布上绘制其他内容，并从中轮询图像数据.
      const canvas = Silhouette._updateCanvas();
      const width = (this._width = canvas.width = bitmapData.width);
      const height = (this._height = canvas.height = bitmapData.height);
      const ctx = canvas.getContext("2d");

      if (!(width && height)) {
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmapData, 0, 0, width, height);
      imageData = ctx.getImageData(0, 0, width, height);
    }

    if (isPremultiplied) {
      this._getColor = getPremultipliedColor4b;
    } else {
      this._getColor = getColor4b;
    }

    this._colorData = imageData.data;
    // 删除您的自定义覆盖的“未初始化”颜色函数，使原型自行工作
    delete this.colorAtNearest;
    delete this.colorAtLinear;
  }

  /**
   * 使用"nearest neighbor"从给定局部位置的轮廓中采样颜色
   * @param {twgl.v3} vec [x,y] texture space (0-1)
   * @param {Uint8ClampedArray} dst The memory buffer to store the value in. (4 bytes)
   * @returns {Uint8ClampedArray} dst
   */
  colorAtNearest(vec, dst) {
    console.warn("k-r.js 使用nearest neighbor从给定局部位置的轮廓中采样颜色");
    return this._getColor(
      this,
      Math.floor(vec[0] * (this._width - 1)),
      Math.floor(vec[1] * (this._height - 1)),
      dst
    );
  }

  /**
   * 使用给定的局部位置从轮廓中采样颜色 "linear interpolation"
   * @param {twgl.v3} vec [x,y] texture space (0-1)
   * @param {Uint8ClampedArray} dst The memory buffer to store the value in. (4 bytes)
   * @returns {Uint8ClampedArray} dst
   */
  colorAtLinear(vec, dst) {
    console.warn(
      "k-r.js 使用给定的局部位置从轮廓中采样颜色linear interpolation"
    );
    const x = vec[0] * (this._width - 1);
    const y = vec[1] * (this._height - 1);

    const x1D = x % 1;
    const y1D = y % 1;
    const x0D = 1 - x1D;
    const y0D = 1 - y1D;

    const xFloor = Math.floor(x);
    const yFloor = Math.floor(y);

    const x0y0 = this._getColor(this, xFloor, yFloor, __cornerWork[0]);
    const x1y0 = this._getColor(this, xFloor + 1, yFloor, __cornerWork[1]);
    const x0y1 = this._getColor(this, xFloor, yFloor + 1, __cornerWork[2]);
    const x1y1 = this._getColor(this, xFloor + 1, yFloor + 1, __cornerWork[3]);

    dst[0] =
      x0y0[0] * x0D * y0D +
      x0y1[0] * x0D * y1D +
      x1y0[0] * x1D * y0D +
      x1y1[0] * x1D * y1D;
    dst[1] =
      x0y0[1] * x0D * y0D +
      x0y1[1] * x0D * y1D +
      x1y0[1] * x1D * y0D +
      x1y1[1] * x1D * y1D;
    dst[2] =
      x0y0[2] * x0D * y0D +
      x0y1[2] * x0D * y1D +
      x1y0[2] * x1D * y0D +
      x1y1[2] * x1D * y1D;
    dst[3] =
      x0y0[3] * x0D * y0D +
      x0y1[3] * x0D * y1D +
      x1y0[3] * x1D * y0D +
      x1y1[3] * x1D * y1D;

    return dst;
  }

  /**
   * 使用最近的邻居测试纹理坐标是否接触到轮廓.
   * @param {twgl.v3} vec A texture coordinate.
   * @return {boolean} If the nearest pixel has an alpha value.
   */
  isTouchingNearest(vec) {
    console.warn("k-r.js 使用最近的邻居测试纹理坐标是否接触到轮廓");
    if (!this._colorData) return;
    return (
      getPoint(
        this,
        Math.floor(vec[0] * (this._width - 1)),
        Math.floor(vec[1] * (this._height - 1))
      ) > 0
    );
  }

  /**
   * 测试以查看线性插值中使用的4个像素中的任何一个是否接触轮廓.
   * @param {twgl.v3} vec A texture coordinate.
   * @return {boolean} Any of the pixels have some alpha.
   */
  isTouchingLinear(vec) {
    console.warn(
      "k-r.js 测试以查看线性插值中使用的4个像素中的任何一个是否接触轮廓"
    );
    if (!this._colorData) return;
    const x = Math.floor(vec[0] * (this._width - 1));
    const y = Math.floor(vec[1] * (this._height - 1));
    return (
      getPoint(this, x, y) > 0 ||
      getPoint(this, x + 1, y) > 0 ||
      getPoint(this, x, y + 1) > 0 ||
      getPoint(this, x + 1, y + 1) > 0
    );
  }

  /**
   * 获取Silhouettes重用的canvas元素以更新其数据.
   * @private
   * @return {CanvasElement} A canvas to draw bitmap data to.
   */
  static _updateCanvas() {
    console.warn("k-r.js 获取Silhouettes重用的canvas元素以更新其数据");
    if (typeof __SilhouetteUpdateCanvas === "undefined") {
      __SilhouetteUpdateCanvas = document.createElement("canvas");
    }
    return __SilhouetteUpdateCanvas;
  }
}

/**
 * @module WebGL渲染上下文为创建着色器
 */
class ShaderManager {
  /**
   * @param {WebGLRenderingContext} gl
   * @constructor
   */
  constructor(gl) {
    this._gl = gl;

    /**
     * 到目前为止已编译的所有着色器的缓存，按需填充.
     * @type {Object<ShaderManager.DRAW_MODE, Array<ProgramInfo>>}
     * @private
     */
    this._shaderCache = {};
    for (const modeName in ShaderManager.DRAW_MODE) {
      if (ShaderManager.DRAW_MODE.hasOwnProperty(modeName))
        this._shaderCache[modeName] = [];
    }
    console.warn("k-r.js class ShaderManager", this);
  }

  /**
   * 获取着色器以获取一组特定的活动效果.如有必要，构建着色器
   * @param {ShaderManager.DRAW_MODE} drawMode Draw normally, silhouette, etc.
   * @param {int} effectBits Bitmask representing the enabled effects.
   * @returns {ProgramInfo} The shader's program info.
   */
  getShader(drawMode, effectBits) {
    console.warn(
      "k-r.js 获取着色器以获取一组特定的活动效果.如有必要，构建着色器"
    );
    const cache = this._shaderCache[drawMode];
    if (drawMode === ShaderManager.DRAW_MODE.silhouette) {
      // Silhouette模式不受这些影响.
      effectBits &= ~(
        ShaderManager.EFFECT_INFO.color.mask |
        ShaderManager.EFFECT_INFO.brightness.mask
      );
    }
    let shader = cache[effectBits];
    if (!shader) {
      shader = cache[effectBits] = this._buildShader(drawMode, effectBits);
    }
    return shader;
  }

  /**
   * 为一组特定的活动效果构建着色器.
   * @param {ShaderManager.DRAW_MODE} drawMode 正常绘制，轮廓等.
   * @param {int} effectBits 代表启用效果的位掩码.
   * @returns {ProgramInfo} 新着色器的程序信息.
   * @private
   */
  _buildShader(drawMode, effectBits) {
    console.warn("k-r.js 为一组特定的活动效果构建着色器");
    const numEffects = ShaderManager.EFFECTS.length;

    const defines = [`#define DRAW_MODE_${drawMode}`];
    for (let index = 0; index < numEffects; ++index) {
      if ((effectBits & (1 << index)) !== 0) {
        defines.push(`#define ENABLE_${ShaderManager.EFFECTS[index]}`);
      }
    }

    const definesText = `${defines.join("\n")}\n`;
    // html <script>着色器类型，在此处通过id获取其内容
    const vsFullText =
      definesText + document.getElementById("vertexShader").textContent;
    const fsFullText =
      definesText + document.getElementById("fragmentShader").textContent;

    return twgl.createProgramInfo(this._gl, [vsFullText, fsFullText]);
  }
}

/**
 * @typedef {object} ShaderManager.Effect
 * @prop {int} mask - “ effectBits”中的位代表效果.
 * @prop {function} converter - 转换函数采用Kid值（通常在0..100或-100..100范围内）并将其映射到对着色器有用的值。 此映射可能不可逆.
 * @prop {boolean} shapeChanges - 效果是否可以改变绘制的形状.
 */

/**
 * 将每个效果名称映射到有关该效果的信息.
 * @enum {ShaderManager.Effect}
 */
ShaderManager.EFFECT_INFO = {
  /** Color effect */
  color: {
    uniformName: "u_color",
    mask: 1 << 0,
    converter: (x) => (x / 200) % 1,
    shapeChanges: false,
  },
  /** Fisheye 鱼眼 effect */
  fisheye: {
    uniformName: "u_fisheye",
    mask: 1 << 1,
    converter: (x) => Math.max(0, (x + 100) / 100),
    shapeChanges: true,
  },
  /** Whirl 旋转 effect */
  whirl: {
    uniformName: "u_whirl",
    mask: 1 << 2,
    converter: (x) => (-x * Math.PI) / 180,
    shapeChanges: true,
  },
  /** Pixelate 像素化 effect */
  pixelate: {
    uniformName: "u_pixelate",
    mask: 1 << 3,
    converter: (x) => Math.abs(x) / 10,
    shapeChanges: true,
  },
  /** Mosaic 镶嵌 effect */
  mosaic: {
    uniformName: "u_mosaic",
    mask: 1 << 4,
    converter: (x) => {
      x = Math.round((Math.abs(x) + 10) / 10);
      /** @todo cap by Math.min(srcWidth, srcHeight) */
      return Math.max(1, Math.min(x, 512));
    },
    shapeChanges: true,
  },
  /** Brightness 亮度 effect */
  brightness: {
    uniformName: "u_brightness",
    mask: 1 << 5,
    converter: (x) => Math.max(-100, Math.min(x, 100)) / 100,
    shapeChanges: false,
  },
  /** Ghost effect */
  ghost: {
    uniformName: "u_ghost",
    mask: 1 << 6,
    converter: (x) => 1 - Math.max(0, Math.min(x, 100)) / 100,
    shapeChanges: false,
  },
};

/**
 * 每个受支持效果的名称.
 * @type {Array}
 */
ShaderManager.EFFECTS = Object.keys(ShaderManager.EFFECT_INFO);

/**
 * 可用的绘制模式.
 * @readonly
 * @enum {string}
 */
ShaderManager.DRAW_MODE = {
  /** 正常绘制。 其输出将使用预乘alpha. */
  default: "default",
  /** 使用非预乘的alpha进行绘制。 对于将像素从GL读取到ImageData对象中很有用. */
  straightAlpha: "straightAlpha",
  /** 使用纯色绘制轮廓. */
  silhouette: "silhouette",
  /** 仅绘制可绘制对象中与特定颜色匹配的部分. */
  colorMask: "colorMask",
  /** Draw a line with caps. */
  line: "line",
};

/**
 * @fileoverview
 * 用于将纹理坐标转换为表示着色器如何应用效果的另一个纹理坐标的实用程序
 */
/**
 * @const {number} 纹理坐标在0到1之间。0.5是中心位置
 */
const CENTER_X = 0.5;

/**
 * @const {number} 纹理坐标在0到1之间。0.5是中心位置
 */
const CENTER_Y = 0.5;

// color conversions grabbed from https://gist.github.com/mjackson/5311256

/**
 * 将RGB颜色值转换为HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
const rgbToHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
};

/**
 * 使用变化的“ t”值调用hslToRgb的辅助函数，以从p / q / t颜色空间计算中获得红色绿色和蓝色值
 * @param {number} p vector coordinates
 * @param {number} q vector coordinates
 * @param {number} t vector coordinates
 * @return {number} amount of r/g/b byte
 */
const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

/**
 * 将HSL颜色值转换为RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
const hslToRgb = ([h, s, l]) => {
  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
};

class EffectTransform {
  /**
   * 给定可绘制对象的效果均匀，就地变换颜色。 将应用重影和颜色和亮度效果.
   * @param {Drawable} drawable The drawable to get uniforms from.
   * @param {Uint8ClampedArray} inOutColor The color to transform.
   * @param {number} [effectMask] A bitmask for which effects to use. Optional.
   * @returns {Uint8ClampedArray} dst filled with the transformed color
   */
  static transformColor(drawable, inOutColor, effectMask) {
    console.warn(
      "k-r.js 给定可绘制对象的效果均匀，就地变换颜色。 将应用重影和颜色和亮度效果"
    );
    // 如果颜色是完全透明的，请不要尝试任何变换.
    if (inOutColor[3] === 0) return inOutColor;

    let effects = drawable.enabledEffects;
    if (typeof effectMask === "number") effects &= effectMask;
    const uniforms = drawable.getUniforms();

    const enableColor = (effects & ShaderManager.EFFECT_INFO.color.mask) !== 0;
    const enableBrightness =
      (effects & ShaderManager.EFFECT_INFO.brightness.mask) !== 0;

    if (enableColor || enableBrightness) {
      // gl_FragColor.rgb /= gl_FragColor.a + epsilon;
      // 在此，我们将除以（先前预乘的）alpha以确保为部分透明像素正确计算HSV.
      // 着色器中存在epsilon，因为除以0（完全透明的像素）会弄乱计算.
      // 我们在这里使用Uint8ClampedArray进行此操作，因此除以0只会得到255。我们稍后再乘以0，因此不会影响结果.
      const alpha = inOutColor[3] / 255;
      inOutColor[0] /= alpha;
      inOutColor[1] /= alpha;
      inOutColor[2] /= alpha;

      const hsl = rgbToHsl(inOutColor);

      if (enableColor) {
        // 该代码强制灰度值稍微饱和，以便可以看到一些轻微的色调变化
        const minL = 0.11 / 2.0;
        const minS = 0.09;
        if (hsl[2] < minL) {
          hsl[0] = 0;
          hsl[1] = 1;
          hsl[2] = minL;
        } else if (hsl[1] < minS) {
          hsl[0] = 0;
          hsl[1] = minS;
        }

        hsl[0] = (uniforms.u_color + hsl[0] + 1) % 1;
      }

      if (enableBrightness)
        hsl[2] = Math.min(1, hsl[2] + uniforms.u_brightness);

      inOutColor.set(hslToRgb(hsl));
      // 现在我们做相反的事情，再次乘以Alpha.
      inOutColor[0] *= alpha;
      inOutColor[1] *= alpha;
      inOutColor[2] *= alpha;
    }

    if ((effects & ShaderManager.EFFECT_INFO.ghost.mask) !== 0) {
      inOutColor[0] *= uniforms.u_ghost;
      inOutColor[1] *= uniforms.u_ghost;
      inOutColor[2] *= uniforms.u_ghost;
      inOutColor[3] *= uniforms.u_ghost;
    }

    return inOutColor;
  }

  /**
   * 将纹理坐标转换为在应用着色器效果后将选择的纹理坐标.
   * @param {Drawable} drawable 要模拟其效果的drawable.
   * @param {twgl.v3} vec 要转换的纹理坐标.
   * @param {twgl.v3} dst 存储输出坐标的地方.
   * @return {twgl.v3} dst-通过效果转换后的坐标.
   */
  static transformPoint(drawable, vec, dst) {
    console.warn("k-r.js 将纹理坐标转换为在应用着色器效果后将选择的纹理坐标");
    twgl.v3.copy(vec, dst);

    const effects = drawable.enabledEffects;
    const uniforms = drawable.getUniforms();
    if ((effects & ShaderManager.EFFECT_INFO.mosaic.mask) !== 0) {
      dst[0] = (uniforms.u_mosaic * dst[0]) % 1;
      dst[1] = (uniforms.u_mosaic * dst[1]) % 1;
    }
    if ((effects & ShaderManager.EFFECT_INFO.pixelate.mask) !== 0) {
      const skinUniforms = drawable.skin.getUniforms();
      const texelX = skinUniforms.u_skinSize[0] * uniforms.u_pixelate;
      const texelY = skinUniforms.u_skinSize[1] * uniforms.u_pixelate;
      dst[0] = (Math.floor(dst[0] * texelX) + CENTER_X) / texelX;
      dst[1] = (Math.floor(dst[1] * texelY) + CENTER_Y) / texelY;
    }
    if ((effects & ShaderManager.EFFECT_INFO.whirl.mask) !== 0) {
      const RADIUS = 0.5;
      const offsetX = dst[0] - CENTER_X;
      const offsetY = dst[1] - CENTER_Y;
      const offsetMagnitude = Math.sqrt(
        Math.pow(offsetX, 2) + Math.pow(offsetY, 2)
      );
      const whirlFactor = Math.max(1.0 - offsetMagnitude / RADIUS, 0.0);
      const whirlActual = uniforms.u_whirl * whirlFactor * whirlFactor;
      const sinWhirl = Math.sin(whirlActual);
      const cosWhirl = Math.cos(whirlActual);
      const rot1 = cosWhirl;
      const rot2 = -sinWhirl;
      const rot3 = sinWhirl;
      const rot4 = cosWhirl;

      dst[0] = rot1 * offsetX + rot3 * offsetY + CENTER_X;
      dst[1] = rot2 * offsetX + rot4 * offsetY + CENTER_Y;
    }
    if ((effects & ShaderManager.EFFECT_INFO.fisheye.mask) !== 0) {
      const vX = (dst[0] - CENTER_X) / CENTER_X;
      const vY = (dst[1] - CENTER_Y) / CENTER_Y;
      const vLength = Math.sqrt(vX * vX + vY * vY);
      const r =
        Math.pow(Math.min(vLength, 1), uniforms.u_fisheye) *
        Math.max(1, vLength);
      const unitX = vX / vLength;
      const unitY = vY / vLength;
      dst[0] = CENTER_X + r * unitX * CENTER_X;
      dst[1] = CENTER_Y + r * unitY * CENTER_Y;
    }

    return dst;
  }
}

/**
 * @module 创建皮肤，该皮肤存储和/或生成用于渲染的纹理.
 */
class Skin extends EventEmitter {
  /**
   * @param {int} id - 此皮肤的唯一ID.
   * @constructor
   */
  constructor(id) {
    super();

    /** @type {int} */
    this._id = id;

    /** @type {Vec3} */
    this._rotationCenter = twgl.v3.create(0, 0);

    /** @type {WebGLTexture} */
    this._texture = null;

    /**
     * 顶点和像素着色器要使用的制服.其中一些也被渲染器的其他部分使用.
     * @type {Object.<string,*>}
     * @private
     */
    this._uniforms = {
      /**
       * 当前皮肤的名义（不一定是当前）大小.
       * @type {Array<number>}
       */
      u_skinSize: [0, 0],

      /**
       * 皮肤的实际WebGL纹理对象.
       * @type {WebGLTexture}
       */
      u_skin: null,
    };

    /**
     * 存储触摸数据的轮廓，皮肤负责使数据保持最新.
     * @private
     */
    this._silhouette = new Silhouette();

    this.setMaxListeners(SKIN_SHARE_SOFT_LIMIT);

    console.warn(
      "k-r.js class Skin 创建皮肤，该皮肤存储和/或生成用于渲染的纹理",
      this
    );
  }

  /**
   * 处理该对象。 调用此方法后不要使用它.
   */
  dispose() {
    console.warn("k-r.js 处理该对象。");
    this._id = ID_NONE;
  }

  /**
   * @returns {boolean} 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（如SVGSkin）为false.
   */
  get isRaster() {
    console.warn(
      "k-r.js 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（如SVGSkin）为false"
    );
    return false;
  }

  /**
   * @return {int} 此皮肤的唯一ID.
   */
  get id() {
    console.warn("k-r.js 此皮肤的唯一ID");
    return this._id;
  }

  /**
   * @returns {Vec3} 此皮肤应围绕其旋转的对象空间中的原点.
   */
  get rotationCenter() {
    console.warn("k-r.js 此皮肤应围绕其旋转的对象空间中的原点");
    return this._rotationCenter;
  }

  /**
   * @abstract
   * @return {Array<number>} 该皮肤的“原始”大小（以纹素为单位）.
   */
  get size() {
    console.warn("k-r.js 该皮肤的“原始”大小（以纹素为单位）");
    return [0, 0];
  }

  /**
   * 获取当前边界框的中心
   * @return {Array<number>} 当前边界框的中心
   */
  calculateRotationCenter() {
    console.warn("k-r.js 获取当前边界框的中心");
    return [this.size[0] / 2, this.size[1] / 2];
  }

  /**
   * @abstract
   * @param {Array<number>} scale - 要使用的比例因子.
   * @return {WebGLTexture} 以给定尺寸绘制时此皮肤的GL纹理表示.
   */
  getTexture(scale) {
    console.warn("k-r.js 以给定尺寸绘制时此皮肤的GL纹理表示");
    return this._emptyImageTexture;
  }

  /**
   * 获取可绘制对象的边界以确定其围栏位置.
   * @param {Array<number>} drawable - 皮肤正在使用的Drawable实例.
   * @param {?Rectangle} result - 边界计算的可选目标.
   * @return {!Rectangle} 可绘制对象的边界。 为了与2兼容，我们始终使用getAABB.
   */
  getFenceBounds(drawable, result) {
    console.warn("k-r.js 获取可绘制对象的边界以确定其围栏位置");
    return drawable.getAABB(result);
  }

  /**
   * 更新并返回此皮肤的uniforms.
   * @param {Array<number>} scale - The scaling factors to be used.
   * @returns {object.<string, *>} the shader uniforms to be used when rendering with this Skin.
   */
  getUniforms(scale) {
    console.warn("k-r.js 更新并返回此皮肤的uniforms");
    this._uniforms.u_skin = this.getTexture(scale);
    this._uniforms.u_skinSize = this.size;
    return this._uniforms;
  }

  /**
   * 如果皮肤将轮廓操作延迟到最后一分钟，则将在isTouching使用轮廓之前调用此操作.
   * @abstract
   */
  updateSilhouette() {}

  /**
   * 将此皮肤的纹理设置为给定的图像.
   * @param {ImageData|HTMLCanvasElement} textureData - 用于将纹理设置为的画布或图像数据.
   */
  _setTexture(textureData) {
    console.warn("k-r.js 将此皮肤的纹理设置为给定的图像");
    const gl = this._renderer.gl;

    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    // Premultiplied alpha is necessary for proper blending.
    // See http://www.realtimerendering.com/blog/gpus-prefer-premultiplication/
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureData
    );
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    this._silhouette.update(textureData);
  }

  /**
   * 将此皮肤的内容设置为空皮肤.
   * @fires Skin.event:WasAltered
   */
  setEmptyImageData() {
    console.warn("k-r.js 将此皮肤的内容设置为空皮肤");
    // Free up the current reference to the _texture
    this._texture = null;

    if (!this._emptyImageData) {
      // 创建一个透明像素
      this._emptyImageData = new ImageData(1, 1);

      // 创建一个新的纹理并更新轮廓
      const gl = this._renderer.gl;

      const textureOptions = {
        auto: true,
        wrap: gl.CLAMP_TO_EDGE,
        src: this._emptyImageData,
      };

      // 注意：我们在这里使用_emptyImageTexture而不是_texture，以便我们可以缓存此空纹理以供以后根据需要使用。 this._texture可以被其他皮肤修改（例如BitmapSkin和SVGSkin，因此我们不能使用同一字段进行缓存）
      this._emptyImageTexture = twgl.createTexture(gl, textureOptions);
    }

    this._rotationCenter[0] = 0;
    this._rotationCenter[1] = 0;

    this._silhouette.update(this._emptyImageData);
    this.emit(Skin.Events.WasAltered);
  }

  /**
   * 该点是否触及该皮肤上的不透明或半透明点?最近邻居版本
   * 呼叫者负责确保此皮肤的轮廓是最新的.
   * @see updateSilhouette
   * @see Drawable.updateCPURenderAttributes
   * @param {twgl.v3} vec A texture coordinate.
   * @return {boolean} Did it touch?
   */
  isTouchingNearest(vec) {
    console.warn("k-r.js 该点是否触及该皮肤上的不透明或半透明点?最近邻居版本");
    return this._silhouette.isTouchingNearest(vec);
  }

  /**
   * 该点是否触及该皮肤上的不透明或半透明点?线性插值版本
   * 呼叫者负责确保此皮肤的轮廓是最新的.
   * @see updateSilhouette
   * @see Drawable.updateCPURenderAttributes
   * @param {twgl.v3} vec A texture coordinate.
   * @return {boolean} Did it touch?
   */
  isTouchingLinear(vec) {
    console.warn("k-r.js 该点是否触及该皮肤上的不透明或半透明点?线性插值版本");
    return this._silhouette.isTouchingLinear(vec);
  }
}

/**
 * 这些是此类实例可以发出的事件.
 * @enum {string}
 */
Skin.Events = {
  /**
   * 当有关皮肤的任何内容（例如外观或旋转中心）发生更改时发出.
   * @event Skin.event:WasAltered
   */
  WasAltered: "WasAltered",
};

/**
 * @module SVGSkin
 */
/** @description 最大纹理尺寸 */
const MAX_TEXTURE_DIMENSION = 2048;
/** @description 最小纹理比例 */
const MIN_TEXTURE_SCALE = 1 / 256;
/**
 * SVG的所有缩放渲染都存储在一个数组中. SVG的1.0标度存储在第8个索引处. 最小的1/256比例尺渲染存储在第0个索引处.
 * @const {number}
 */
const INDEX_OFFSET = 8;

class SVGSkin extends Skin {
  /**
   * @param {!int} id - 此皮肤的ID.
   * @param {!RenderWebGL} renderer - 将使用此皮肤的渲染器.
   * @constructor
   * @extends Skin
   */
  constructor(id, renderer) {
    super(id);

    /** @type {RenderWebGL} */
    this._renderer = renderer;

    /** @type {SvgRenderer} */
    this._svgRenderer = KidSvgRenderer.SVGRenderer;

    /** @type {Array<WebGLTexture>} */
    this._scaledMIPs = [];

    /** @type {number} */
    this._largestMIPScale = 0;

    /**
     * SVG大小与WebGL纹理的最大大小之比
     * @type {Number}
     */
    this._maxTextureScale = 1;

    console.warn("k-r.js class SVGSkin extends Skin", this);
  }

  /**
   * 处理该对象。 调用此方法后不要使用它。
   */
  dispose() {
    console.warn("k-r.js SVGSkin 处理该对象。 调用此方法后不要使用它");
    this.resetMIPs();
    super.dispose();
  }

  /**
   * @return {Array<number>} 该皮肤的自然大小（以Kid单位）.
   */
  get size() {
    return this._svgRenderer.size;
  }

  /**
   * 创建给定规模的MIP.
   * @param {number} scale - MIP的相对大小
   * @return {SVGMIP} 处理创建和更新SVG纹理的对象.
   */
  createMIP(scale) {
    console.warn("k-r.js SVGSkin 创建给定规模的MIP");
    this._svgRenderer.draw(scale);

    // 从画布中拉出ImageData. ImageData加快了Silhouette的更新速度，并且在内存方面可以由更多浏览器更好地处理.
    const canvas = this._svgRenderer.canvas;
    // 如果画布尺寸之一为0，则将此MIP设置为空图像纹理.
    // 这样可以避免在维度之一为0时尝试使用IndexSizeError尝试获取ImageImageData。
    if (canvas.width === 0 || canvas.height === 0) return super.getTexture();

    const context = canvas.getContext("2d");
    const textureData = context.getImageData(0, 0, canvas.width, canvas.height);

    const textureOptions = {
      auto: false,
      wrap: this._renderer.gl.CLAMP_TO_EDGE,
      src: textureData,
      premultiplyAlpha: true,
    };

    const mip = twgl.createTexture(this._renderer.gl, textureOptions);

    // 检查这是否是迄今为止创建的最大MIP。 目前，轮廓仅会按比例放大.
    if (this._largestMIPScale < scale) {
      this._silhouette.update(textureData);
      this._largestMIPScale = scale;
    }

    return mip;
  }

  updateSilhouette(scale = [100, 100]) {
    console.warn("k-r.js SVGSkin 确保剪影存在");
    // 确保剪影存在.
    this.getTexture(scale);
  }

  /**
   * @param {Array<number>} scale - 要使用的比例因子，每个在[0,100]范围内.
   * @return {WebGLTexture} 在给定比例下绘制时此皮肤的GL纹理表示.
   */
  getTexture(scale) {
    console.warn("k-r.js SVGSkin 在给定比例下绘制时此皮肤的GL纹理表示");
    // 纹理只能获得均匀的比例。 取两个轴中较大的一个.
    const scaleMax = scale
      ? Math.max(Math.abs(scale[0]), Math.abs(scale[1]))
      : 100;
    const requestedScale = Math.min(scaleMax / 100, this._maxTextureScale);
    let newScale = 1;
    let textureIndex = 0;

    if (requestedScale < 1) {
      while (
        newScale > MIN_TEXTURE_SCALE &&
        requestedScale <= newScale * 0.75
      ) {
        newScale /= 2;
        textureIndex -= 1;
      }
    } else {
      while (
        newScale < this._maxTextureScale &&
        requestedScale >= 1.5 * newScale
      ) {
        newScale *= 2;
        textureIndex += 1;
      }
    }

    if (
      this._svgRenderer.loaded &&
      !this._scaledMIPs[textureIndex + INDEX_OFFSET]
    )
      this._scaledMIPs[textureIndex + INDEX_OFFSET] = this.createMIP(newScale);

    return this._scaledMIPs[textureIndex + INDEX_OFFSET] || super.getTexture();
  }

  /**
   * 通过删除现有的MIP进行硬重置.
   * @param {Array<number>} [rotationCenter] - SVG的可选旋转中心。 如果未提供，将从边界框计算得出
   * @fires Skin.event:WasAltered
   */
  resetMIPs() {
    console.warn("k-r.js SVGSkin 通过删除现有的MIP进行硬重置");
    this._scaledMIPs.forEach((oldMIP) =>
      this._renderer.gl.deleteTexture(oldMIP)
    );
    this._scaledMIPs.length = 0;
    this._largestMIPScale = 0;
  }

  /**
   * 将此皮肤的内容设置为提供的SVG数据的快照.
   * @param {string} svgData - new SVG to use.
   * @param {Array<number>} [rotationCenter] - Optional rotation center for the SVG.
   */
  setSVG(svgData, rotationCenter) {
    console.warn("k-r.js SVGSkin 将此皮肤的内容设置为提供的SVG数据的快照");
    this._svgRenderer.loadSVG(svgData, false, () => {
      const svgSize = this._svgRenderer.size;
      if (svgSize[0] === 0 || svgSize[1] === 0) {
        super.setEmptyImageData();
        return;
      }

      const maxDimension = Math.ceil(Math.max(this.size[0], this.size[1]));
      let testScale = 2;
      for (
        testScale;
        maxDimension * testScale <= MAX_TEXTURE_DIMENSION;
        testScale *= 2
      ) {
        this._maxTextureScale = testScale;
      }

      this.resetMIPs();

      if (typeof rotationCenter === "undefined")
        rotationCenter = this.calculateRotationCenter();
      const viewOffset = this._svgRenderer.viewOffset;
      this._rotationCenter[0] = rotationCenter[0] - viewOffset[0];
      this._rotationCenter[1] = rotationCenter[1] - viewOffset[1];

      this.emit(Skin.Events.WasAltered);
    });
  }
}

/**
 * @module BitmapSkin
 */
class BitmapSkin extends Skin {
  /**
   * @extends Skin
   * @param {!int} id - The ID for this Skin.
   * @param {!RenderWebGL} renderer - The renderer which will use this skin.
   */
  constructor(id, renderer) {
    super(id);

    /** @type {!int} */
    this._costumeResolution = 1;

    /** @type {!RenderWebGL} */
    this._renderer = renderer;

    /** @type {Array<int>} */
    this._textureSize = [0, 0];
    console.warn("k-r.js class BitmapSkin extends Skin", this);
  }

  /**
   * 处理该对象。 调用此方法后不要使用它.
   */
  dispose() {
    console.warn("k-r.js BitmapSkin");
    if (this._texture) {
      this._renderer.gl.deleteTexture(this._texture);
      this._texture = null;
    }
    super.dispose();
  }

  /**
   * @returns {boolean} 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（如SVGSkin）为false.
   */
  get isRaster() {
    console.warn(
      "k-r.js BitmapSkin 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（如SVGSkin）为false"
    );
    return true;
  }

  /**
   * @return {Array<number>} 该皮肤的“原始”大小（以纹素为单位）.
   */
  get size() {
    console.warn("k-r.js BitmapSkin 该皮肤的“原始”大小（以纹素为单位）");
    return [
      this._textureSize[0] / this._costumeResolution,
      this._textureSize[1] / this._costumeResolution,
    ];
  }

  /**
   * @param {Array<number>} scale - The scaling factors to be used.
   * @return {WebGLTexture} 在给定比例下绘制时此皮肤的GL纹理表示.
   */
  getTexture(scale) {
    console.warn("k-r.js BitmapSkin 在给定比例下绘制时此皮肤的GL纹理表示");
    return this._texture || super.getTexture();
  }

  /**
   * 将此皮肤的内容设置为提供的位图数据的快照.
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} bitmapData - 这种皮肤的新内容.
   * @param {int} [costumeResolution=1] - 此位图使用的分辨率.
   * @param {Array<number>} [rotationCenter] - 位图的可选旋转中心。 如果未提供，将从边界框计算得出
   * @fires Skin.event:WasAltered
   */
  setBitmap(bitmapData, costumeResolution, rotationCenter) {
    console.warn("k-r.js BitmapSkin 将此皮肤的内容设置为提供的位图数据的快照");
    if (!bitmapData.width || !bitmapData.height) {
      super.setEmptyImageData();
      return;
    }
    const gl = this._renderer.gl;

    // 优选地，bitmapData是ImageData。 ImageData加快了Silhouette的更新速度，并且在内存方面可以由更多浏览器更好地处理.
    let textureData = bitmapData;
    if (bitmapData instanceof HTMLCanvasElement) {
      // 给定一个HTMLCanvasElement获取图像数据传递给webgl和Silhouette.
      const context = bitmapData.getContext("2d");
      textureData = context.getImageData(
        0,
        0,
        bitmapData.width,
        bitmapData.height
      );
    }

    if (this._texture === null) {
      const textureOptions = {
        auto: false,
        wrap: gl.CLAMP_TO_EDGE,
      };

      this._texture = twgl.createTexture(gl, textureOptions);
    }

    this._setTexture(textureData);

    // 如果以上任何情况引发异常，请最后执行这些操作
    this._costumeResolution = costumeResolution || 2;
    this._textureSize = BitmapSkin._getBitmapSize(bitmapData);

    if (typeof rotationCenter === "undefined")
      rotationCenter = this.calculateRotationCenter();
    this._rotationCenter[0] = rotationCenter[0];
    this._rotationCenter[1] = rotationCenter[1];

    this.emit(Skin.Events.WasAltered);
  }

  /**
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} bitmapData - 要检查的位图数据.
   * @returns {Array<int>} 位图数据的宽度和高度（以像素为单位）.
   * @private
   */
  static _getBitmapSize(bitmapData) {
    console.warn("k-r.js BitmapSkin 位图数据的宽度和高度（以像素为单位）");
    if (bitmapData instanceof HTMLImageElement)
      return [
        bitmapData.naturalWidth || bitmapData.width,
        bitmapData.naturalHeight || bitmapData.height,
      ];

    if (bitmapData instanceof HTMLVideoElement)
      return [
        bitmapData.videoWidth || bitmapData.width,
        bitmapData.videoHeight || bitmapData.height,
      ];

    // ImageData or HTMLCanvasElement
    return [bitmapData.width, bitmapData.height];
  }
}

/**
 * @module PenSkin
 */
/**
 *用笔绘图时要使用的属性
 * @typedef {object} PenSkin#PenAttributes
 * @property {number} [diameter] - The size (diameter) of the pen.
 * @property {Array<number>} [color4f] - 笔颜色为[r，g，b，a]的数组，每个分量在[0,1]范围内.
 */

/**
 * 未指定时要使用的笔属性.
 * @type {PenSkin#PenAttributes}
 * @memberof PenSkin
 * @private
 * @const
 */
const DefaultPenAttributes = {
  color4f: [0, 0, 1, 1],
  diameter: 1,
};

/**
 * 重用的存储位置，用于存储预乘笔颜色.
 * @type {FloatArray}
 */
const __premultipliedColor = [0, 0, 0, 0];

/**
 * 重用的投影矩阵存储位置.
 * @type {FloatArray}
 */
const __projectionMatrix = twgl.m4.identity();

/**
 * 重用的内存位置用于构建模型矩阵的转换矩阵.
 * @type {FloatArray}
 */
const __modelTranslationMatrix = twgl.m4.identity();

/**
 * 重用内存位置以缩放矩阵以构建模型矩阵.
 * @type {FloatArray}
 */
const __modelScalingMatrix = twgl.m4.identity();

/**
 * 重用模型矩阵的存储位置.
 * @type {FloatArray}
 */
const __modelMatrix = twgl.m4.identity();

/**
 * 向量的重复使用存储位置，可从中创建转换矩阵.
 * @type {FloatArray}
 */
const __modelTranslationVector = twgl.v3.create();

/**
 * 向量的重复使用存储位置，可从中创建缩放矩阵.
 * @type {FloatArray}
 */
const __modelScalingVector = twgl.v3.create();

class PenSkin extends Skin {
  /**
   * 创建一个实现便签笔图层的外观.
   * @param {int} id - The unique ID for this Skin.
   * @param {RenderWebGL} renderer - The renderer which will use this Skin.
   * @extends Skin
   * @listens RenderWebGL#event:NativeSizeChanged
   */
  constructor(id, renderer) {
    super(id);

    /**
     * @private
     * @type {RenderWebGL}
     */
    this._renderer = renderer;

    /** @type {HTMLCanvasElement} */
    this._canvas = document.createElement("canvas");

    /** @type {WebGLTexture} */
    this._exportTexture = null;

    /** @type {WebGLFramebuffer} */
    this._framebuffer = null;

    /** @type {WebGLFramebuffer} */
    this._silhouetteBuffer = null;

    /** @type {boolean} */
    this._canvasDirty = false;

    /** @type {boolean} */
    this._silhouetteDirty = false;

    /** @type {Uint8Array} */
    this._silhouettePixels = null;

    /** @type {ImageData} */
    this._silhouetteImageData = null;

    /** @type {object} */
    this._lineOnBufferDrawRegionId = {
      enter: () => this._enterDrawLineOnBuffer(),
      exit: () => this._exitDrawLineOnBuffer(),
    };

    /** @type {object} */
    this._toBufferDrawRegionId = {
      enter: () => this._enterDrawToBuffer(),
      exit: () => this._exitDrawToBuffer(),
    };

    /** @type {twgl.BufferInfo} */
    this._lineBufferInfo = null;

    const NO_EFFECTS = 0;
    /** @type {twgl.ProgramInfo} */
    this._stampShader = this._renderer._shaderManager.getShader(
      ShaderManager.DRAW_MODE.default,
      NO_EFFECTS
    );

    /** @type {twgl.ProgramInfo} */
    this._lineShader = this._renderer._shaderManager.getShader(
      ShaderManager.DRAW_MODE.line,
      NO_EFFECTS
    );

    this._createLineGeometry();

    this.onNativeSizeChanged = this.onNativeSizeChanged.bind(this);
    this._renderer.on(Events.NativeSizeChanged, this.onNativeSizeChanged);

    this._setCanvasSize(renderer.getNativeSize());

    console.warn("k-r.js class PenSkin extends Skin", this);
  }

  /**
   * 处理该对象。 调用此方法后不要使用它.
   */
  dispose() {
    this._renderer.removeListener(
      Events.NativeSizeChanged,
      this.onNativeSizeChanged
    );
    this._renderer.gl.deleteTexture(this._texture);
    this._renderer.gl.deleteTexture(this._exportTexture);
    this._texture = null;
    super.dispose();
  }

  /**
   * @returns {boolean} 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（例如SVGSkin）为false.
   */
  get isRaster() {
    console.warn(
      "k-r.js PenSkin 对于栅格样式的外观（例如，BitmapSkin）为true，对于矢量样式（例如SVGSkin）为false"
    );
    return true;
  }

  /**
   * @return {Array<number>} 皮肤的“原始”大小（以纹素为单位）
   */
  get size() {
    console.warn("k-r.js PenSkin 皮肤的“原始”大小（以纹素为单位）");
    return [this._canvas.width, this._canvas.height];
  }

  /**
   * @return {WebGLTexture} 以给定尺寸绘制时此皮肤的GL纹理表示.
   * @param {int} pixelsWide - 渲染皮肤的宽度，以GPU像素为单位.
   * @param {int} pixelsTall - 渲染皮肤的高度，以GPU像素为单位.
   */
  getTexture(pixelsWide, pixelsTall) {
    console.warn("k-r.js PenSkin 以给定尺寸绘制时此皮肤的GL纹理表示");
    if (this._canvasDirty) {
      this._drawToBuffer();
    }

    return this._exportTexture;
  }

  /**
   * 清除笔层.
   */
  clear() {
    console.warn("k-r.js PenSkin 清除笔层");
    const gl = this._renderer.gl;
    twgl.bindFramebufferInfo(gl, this._framebuffer);

    /* 将帧缓冲区重置为透明黑色 */
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const ctx = this._canvas.getContext("2d");
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._silhouetteDirty = true;
  }

  /**
   * 在笔层上画一个点.
   * @param {PenAttributes} penAttributes - 应该如何画点.
   * @param {number} x - 绘制点的X坐标.
   * @param {number} y - 绘制点的Y坐标.
   */
  drawPoint(penAttributes, x, y) {
    console.warn("k-r.js PenSkin 在笔层上画一个点");
    // Canvas绘制一条零长度的线作为两个背对背的端盖，这就是我们想要的.
    this.drawLine(penAttributes, x, y, x, y);
  }

  /**
   * 在笔层上画一条线.
   * @param {PenAttributes} penAttributes - how the line should be drawn.
   * @param {number} x0 - the X coordinate of the beginning of the line.
   * @param {number} y0 - the Y coordinate of the beginning of the line.
   * @param {number} x1 - the X coordinate of the end of the line.
   * @param {number} y1 - the Y coordinate of the end of the line.
   */
  drawLine(penAttributes, x0, y0, x1, y1) {
    console.warn("k-r.js PenSkin 在笔层上画一条线");
    // For compatibility with Scratch 2.0, offset pen lines of width 1 and 3 so they're pixel-aligned.
    // See https://github.com/LLK/scratch-render/pull/314
    const diameter = penAttributes.diameter || DefaultPenAttributes.diameter;
    const offset = diameter === 1 || diameter === 3 ? 0.5 : 0;

    this._drawLineOnBuffer(
      penAttributes,
      x0 + offset,
      y0 + offset,
      x1 + offset,
      y1 + offset
    );

    this._silhouetteDirty = true;
  }

  /**
   * 创建2D几何图形以将线绘制到帧缓冲区.
   */
  _createLineGeometry() {
    console.warn("k-r.js PenSkin 创建2D几何图形以将线绘制到帧缓冲区");
    const quads = {
      a_position: {
        numComponents: 2,
        data: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
      },
    };

    this._lineBufferInfo = twgl.createBufferInfoFromArrays(
      this._renderer.gl,
      quads
    );
  }

  /**
   * 准备在_lineOnBufferDrawRegionId区域中绘制线条.
   */
  _enterDrawLineOnBuffer() {
    console.warn(
      "k-r.js PenSkin 准备在_lineOnBufferDrawRegionId区域中绘制线条"
    );
    const gl = this._renderer.gl;

    const bounds = this._bounds;
    const currentShader = this._lineShader;
    const projection = twgl.m4.ortho(
      0,
      bounds.width,
      0,
      bounds.height,
      -1,
      1,
      __projectionMatrix
    );

    twgl.bindFramebufferInfo(gl, this._framebuffer);

    gl.viewport(0, 0, bounds.width, bounds.height);

    gl.useProgram(currentShader.program);

    twgl.setBuffersAndAttributes(gl, currentShader, this._lineBufferInfo);

    const uniforms = {
      u_skin: this._texture,
      u_projectionMatrix: projection,
    };

    twgl.setUniforms(currentShader, uniforms);
  }

  /**
   * 从_lineOnBufferDrawRegionId返回基本状态.
   */
  _exitDrawLineOnBuffer() {
    console.warn("k-r.js PenSkin 从_lineOnBufferDrawRegionId返回基本状态");
    const gl = this._renderer.gl;

    twgl.bindFramebufferInfo(gl, null);
  }

  /**
   * 在帧缓冲区上画一条线.
   * 请注意，点坐标位于以下坐标空间中:
   * +y is down, (0, 0) is the center, and the coords range from (-width / 2, -height / 2) to (height / 2, width / 2).
   * @param {PenAttributes} penAttributes - how the line should be drawn.
   * @param {number} x0 - the X coordinate of the beginning of the line.
   * @param {number} y0 - the Y coordinate of the beginning of the line.
   * @param {number} x1 - the X coordinate of the end of the line.
   * @param {number} y1 - the Y coordinate of the end of the line.
   */
  _drawLineOnBuffer(penAttributes, x0, y0, x1, y1) {
    console.warn("k-r.js PenSkin 在帧缓冲区上画一条线");
    const gl = this._renderer.gl;

    const currentShader = this._lineShader;

    this._renderer.enterDrawRegion(this._lineOnBufferDrawRegionId);

    // 通过笔透明度预乘笔颜色
    const penColor = penAttributes.color4f || DefaultPenAttributes.color4f;
    __premultipliedColor[0] = penColor[0] * penColor[3];
    __premultipliedColor[1] = penColor[1] * penColor[3];
    __premultipliedColor[2] = penColor[2] * penColor[3];
    __premultipliedColor[3] = penColor[3];

    // 在着色器中进行此计算可能会使浮点范围溢出.
    // 仅要求'mediump'精度范围最大为2 ^ 14（16384），所以任何长于2 ^ 7（128）的行
    // 可能会溢出，因为您要对操作数求平方，并且它们最终可能会变成“无穷大”。
    // Even GLSL's `length` function won't save us here:
    // https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es
    const lineDiffX = x1 - x0;
    const lineDiffY = y1 - y0;
    const lineLength = Math.sqrt(lineDiffX * lineDiffX + lineDiffY * lineDiffY);

    const uniforms = {
      u_lineColor: __premultipliedColor,
      u_lineThickness: penAttributes.diameter || DefaultPenAttributes.diameter,
      u_lineLength: lineLength,
      u_penPoints: [x0, -y0, x1, -y1],
      u_stageSize: this.size,
    };

    twgl.setUniforms(currentShader, uniforms);

    twgl.drawBufferInfo(gl, this._lineBufferInfo, gl.TRIANGLES);

    this._silhouetteDirty = true;
  }

  /**
   * 将图像标记到笔层上.
   * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} stampElement - 用作图章的元素.
   * @param {number} x - the X coordinate of the stamp to draw.
   * @param {number} y - the Y coordinate of the stamp to draw.
   */
  drawStamp(stampElement, x, y) {
    console.warn("k-r.js PenSkin 将图像标记到笔层上");
    const ctx = this._canvas.getContext("2d");

    ctx.drawImage(
      stampElement,
      this._rotationCenter[0] + x,
      this._rotationCenter[1] - y
    );

    this._canvasDirty = true;
    this._silhouetteDirty = true;
  }

  /**
   * 输入绘制区域以绘制矩形. 具有相同regionId的多个调用会跳过回调，从而减少GL状态更改的次数.
   * @param {twgl.ProgramInfo} currentShader - 程序信息以绘制矩形
   * @param {Rectangle} bounds - 视口范围以绘制区域
   */
  _drawRectangleRegionEnter(currentShader, bounds) {
    console.warn("k-r.js PenSkin 输入绘制区域以绘制矩形");
    const gl = this._renderer.gl;

    gl.viewport(0, 0, bounds.width, bounds.height);

    gl.useProgram(currentShader.program);
    twgl.setBuffersAndAttributes(gl, currentShader, this._renderer._bufferInfo);
  }

  /**
   * 画一个矩形.
   * @param {twgl.ProgramInfo} currentShader - 程序信息以绘制矩形
   * @param {WebGLTexture} texture - texture to draw
   * @param {Rectangle} bounds - bounded area to draw in
   * @param {number} x - centered at x
   * @param {number} y - centered at y
   */
  _drawRectangle(
    currentShader,
    texture,
    bounds,
    x = -this._canvas.width / 2,
    y = this._canvas.height / 2
  ) {
    console.warn("k-r.js PenSkin 画一个矩形");
    const gl = this._renderer.gl;

    const projection = twgl.m4.ortho(
      bounds.left,
      bounds.right,
      bounds.top,
      bounds.bottom,
      -1,
      1,
      __projectionMatrix
    );

    const uniforms = {
      u_skin: texture,
      u_projectionMatrix: projection,
      u_modelMatrix: twgl.m4.multiply(
        twgl.m4.translation(
          twgl.v3.create(-x - bounds.width / 2, -y + bounds.height / 2, 0),
          __modelTranslationMatrix
        ),
        twgl.m4.scaling(
          twgl.v3.create(bounds.width, bounds.height, 0),
          __modelScalingMatrix
        ),
        __modelMatrix
      ),
    };

    twgl.setTextureParameters(gl, texture, { minMag: gl.NEAREST });
    twgl.setUniforms(currentShader, uniforms);

    twgl.drawBufferInfo(gl, this._renderer._bufferInfo, gl.TRIANGLES);
  }

  /**
   * 准备在_toBufferDrawRegionId区域中绘制矩形.
   */
  _enterDrawToBuffer() {
    console.warn("k-r.js PenSkin 准备在_toBufferDrawRegionId区域中绘制矩形");
    const gl = this._renderer.gl;

    twgl.bindFramebufferInfo(gl, this._framebuffer);

    this._drawRectangleRegionEnter(this._stampShader, this._bounds);
  }

  /**
   * 从_toBufferDrawRegionId返回基本状态.
   */
  _exitDrawToBuffer() {
    console.warn("k-r.js PenSkin 从_toBufferDrawRegionId返回基本状态");
    const gl = this._renderer.gl;

    twgl.bindFramebufferInfo(gl, null);
  }

  /**
   * 将输入纹理绘制到帧缓冲区.
   * @param {WebGLTexture} texture - input texture to draw
   * @param {number} x - texture centered at x
   * @param {number} y - texture centered at y
   */
  _drawToBuffer(
    texture = this._texture,
    x = -this._canvas.width / 2,
    y = this._canvas.height / 2
  ) {
    console.warn("k-r.js PenSkin 将输入纹理绘制到帧缓冲区");
    if (texture !== this._texture && this._canvasDirty) {
      this._drawToBuffer();
    }

    const gl = this._renderer.gl;

    // 如果输入的纹理是代表笔的画布层的纹理，请使用画布数据更新纹理.
    if (texture === this._texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this._canvas
      );

      const ctx = this._canvas.getContext("2d");
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      this._canvasDirty = false;
    }

    const currentShader = this._stampShader;
    const bounds = this._bounds;

    this._renderer.enterDrawRegion(this._toBufferDrawRegionId);

    this._drawRectangle(currentShader, texture, bounds, x, y);

    this._silhouetteDirty = true;
  }

  /**
   * 对渲染器本机大小的变化做出反应.
   * @param {object} event - The change event.
   */
  onNativeSizeChanged(event) {
    console.warn("k-r.js PenSkin 对渲染器本机大小的变化做出反应");
    this._setCanvasSize(event.newSize);
  }

  /**
   * 设置笔画布的大小.
   * @param {Array<int>} canvasSize - 画布的新宽度和高度.
   * @private
   */
  _setCanvasSize(canvasSize) {
    console.warn("k-r.js PenSkin 设置笔画布的大小");
    const [width, height] = canvasSize;

    const gl = this._renderer.gl;

    this._bounds = new Rectangle();
    this._bounds.initFromBounds(width / 2, width / -2, height / 2, height / -2);

    this._canvas.width = width;
    this._canvas.height = height;
    this._rotationCenter[0] = width / 2;
    this._rotationCenter[1] = height / 2;

    this._texture = twgl.createTexture(gl, {
      auto: true,
      mag: gl.NEAREST,
      min: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE,
      src: this._canvas,
    });

    this._exportTexture = twgl.createTexture(gl, {
      auto: true,
      mag: gl.NEAREST,
      min: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE,
      width,
      height,
    });

    const attachments = [
      {
        format: gl.RGBA,
        attachment: this._exportTexture,
      },
    ];
    if (this._framebuffer) {
      twgl.resizeFramebufferInfo(
        gl,
        this._framebuffer,
        attachments,
        width,
        height
      );
      twgl.resizeFramebufferInfo(
        gl,
        this._silhouetteBuffer,
        [{ format: gl.RGBA }],
        width,
        height
      );
    } else {
      this._framebuffer = twgl.createFramebufferInfo(
        gl,
        attachments,
        width,
        height
      );
      this._silhouetteBuffer = twgl.createFramebufferInfo(
        gl,
        [{ format: gl.RGBA }],
        width,
        height
      );
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._silhouettePixels = new Uint8Array(Math.floor(width * height * 4));
    this._silhouetteImageData = this._canvas
      .getContext("2d")
      .createImageData(width, height);

    this._silhouetteDirty = true;
  }

  /**
   * 设置上下文状态以匹配提供的笔属性.
   * @param {CanvasRenderingContext2D} context - 要修改的画布渲染上下文.
   * @param {PenAttributes} penAttributes - 要使用的笔属性.
   * @private
   */
  _setAttributes(context, penAttributes) {
    console.warn("k-r.js PenSkin 设置上下文状态以匹配提供的笔属性");
    penAttributes = penAttributes || DefaultPenAttributes;
    const color4f = penAttributes.color4f || DefaultPenAttributes.color4f;
    const diameter = penAttributes.diameter || DefaultPenAttributes.diameter;

    const r = Math.round(color4f[0] * 255);
    const g = Math.round(color4f[1] * 255);
    const b = Math.round(color4f[2] * 255);
    const a = color4f[3]; // Alpha is 0 to 1 (not 0 to 255 like r,g,b)

    context.strokeStyle = `rgba(${r},${g},${b},${a})`;
    context.lineCap = "round";
    context.lineWidth = diameter;
  }

  /**
   * 如果有些笔操作弄脏了画布，请在有人要使用我们的轮廓之前先进行更新.
   */
  updateSilhouette() {
    console.warn("k-r.js PenSkin updateSilhouette");
    if (this._silhouetteDirty) {
      if (this._canvasDirty) {
        this._drawToBuffer();
      }

      // 将导出纹理渲染到另一个帧缓冲区
      const gl = this._renderer.gl;

      this._renderer.enterDrawRegion(this._toBufferDrawRegionId);

      // 将帧缓冲区的像素采样到剪影实例中
      gl.readPixels(
        0,
        0,
        this._canvas.width,
        this._canvas.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this._silhouettePixels
      );

      this._silhouetteImageData.data.set(this._silhouettePixels);
      this._silhouette.update(
        this._silhouetteImageData,
        true /* isPremultiplied */
      );

      this._silhouetteDirty = false;
    }
  }
}

/**
 * @module 提供一个画布渲染上下文，其中"font"设置为要包装的文本的文本样式.
 * @description TextBubbleSkin.js所需
 */
class CanvasMeasurementProvider {
  /**
   * @param {CanvasRenderingContext2D} ctx -
   */
  constructor(ctx) {
    this._ctx = ctx;
    this._cache = {};
  }

  // 我们不需要在这里设置或拆除任何东西。 是否应将其全部删除？

  /**
   * 在零次或多次调用measureText（）之前由TextWrapper调用.
   */
  beginMeasurementSession() {}

  /**
   * 在零次或多次调用measureText（）后，由TextWrapper调用.
   */
  endMeasurementSession() {}

  /**
   * 将整个字符串作为一个单位进行测量.
   * @param {string} text - 要测量的文字.
   * @returns {number} - 字符串的长度.
   */
  measureText(text) {
    if (!this._cache[text]) {
      this._cache[text] = this._ctx.measureText(text).width;
    }
    return this._cache[text];
  }
}

/**
 * @module
 * @description TextBubbleSkin.js所需
 */
// Unicode换行算法的JS实现
// import LineBreaker from "!ify-loader!linebreak";
// import { nextBreak as _nextBreak } from "!ify-loader!grapheme-breaker";

/**
 * Tell this text wrapper to use a specific measurement provider.
 * @typedef {object} MeasurementProvider - the new measurement provider.
 * @property {Function} beginMeasurementSession - this will be called before a batch of measurements are made.
 *      Optionally, this function may return an object to be provided to the endMeasurementSession function.
 * @property {Function} measureText - this will be called each time a piece of text must be measured.
 * @property {Function} endMeasurementSession - this will be called after a batch of measurements is finished.
 *      It will be passed whatever value beginMeasurementSession returned, if any.
 */

/**
 * 该实用程序可以跨多行换行，尊重Unicode字形簇，并在可能的情况下提供Unicode换行的机会.
 * Reference material:
 * - Unicode Standard Annex #14: http://unicode.org/reports/tr14/
 * - Unicode Standard Annex #29: http://unicode.org/reports/tr29/
 * - "JavaScript has a Unicode problem" by Mathias Bynens: https://mathiasbynens.be/notes/javascript-unicode
 */
class TextWrapper {
  /**
   * Construct a text wrapper which will measure text using the specified measurement provider.
   * @param {MeasurementProvider} measurementProvider - a helper object to provide text measurement services.
   */
  constructor(measurementProvider) {
    this._measurementProvider = measurementProvider;
    this._cache = {};
  }

  /**
   * 将提供的文本包装成限制为最大宽度的行.
   * @param {number} maxWidth - the maximum allowed width of a line.
   * @param {string} text - the text to be wrapped. Will be split on whitespace.
   * @returns {Array.<string>} an array containing the wrapped lines of text.
   */
  wrapText(maxWidth, text) {
    // 标准化为规范的组成
    text = text.normalize();

    const cacheKey = `${maxWidth}-${text}`;
    if (this._cache[cacheKey]) {
      return this._cache[cacheKey];
    }

    const measurementSession = this._measurementProvider.beginMeasurementSession();

    const breaker = new LineBreaker(text);
    let lastPosition = 0;
    let nextBreak;
    let currentLine = null;
    const lines = [];

    while ((nextBreak = breaker.nextBreak())) {
      const word = text
        .slice(lastPosition, nextBreak.position)
        .replace(/\n+$/, "");

      let proposedLine = (currentLine || "").concat(word);
      let proposedLineWidth = this._measurementProvider.measureText(
        proposedLine
      );

      if (proposedLineWidth > maxWidth) {
        // 下一个单词不适合此行。 它本身就适合吗？
        const wordWidth = this._measurementProvider.measureText(word);
        if (wordWidth > maxWidth) {
          // 下一个单词本身甚至不能放在一行上。 一次消耗一个字素簇.
          let lastCluster = 0;
          let nextCluster;
          while (
            lastCluster !== (nextCluster = _nextBreak(word, lastCluster))
          ) {
            const cluster = word.substring(lastCluster, nextCluster);
            proposedLine = (currentLine || "").concat(cluster);
            proposedLineWidth = this._measurementProvider.measureText(
              proposedLine
            );
            if (currentLine === null || proposedLineWidth <= maxWidth) {
              // first cluster of a new line or the cluster fits
              currentLine = proposedLine;
            } else {
              // no more can fit
              lines.push(currentLine);
              currentLine = cluster;
            }
            lastCluster = nextCluster;
          }
        } else {
          // The next word can fit on the next line. Finish the current line and move on.
          if (currentLine !== null) lines.push(currentLine);
          currentLine = word;
        }
      } else {
        // The next word fits on this line. Just keep going.
        currentLine = proposedLine;
      }

      // Did we find a \n or similar?
      if (nextBreak.required) {
        if (currentLine !== null) lines.push(currentLine);
        currentLine = null;
      }

      lastPosition = nextBreak.position;
    }

    currentLine = currentLine || "";
    if (currentLine.length > 0 || lines.length === 0) {
      lines.push(currentLine);
    }

    this._cache[cacheKey] = lines;
    this._measurementProvider.endMeasurementSession(measurementSession);
    return lines;
  }
}

/**
 * @module TextBubbleSkin
 */

const BubbleStyle = {
  MAX_LINE_WIDTH: 170, // 单行文字的最大宽度（以 像素为单位）

  MIN_WIDTH: 50, // 文字提示框的最小宽度（以 像素为单位）
  STROKE_WIDTH: 4, // 气泡周围的笔触厚度。 只有一半是可见的，因为它是在填充下绘制的
  PADDING: 10, // 在文字区域周围填充
  CORNER_RADIUS: 16, // 圆角半径
  TAIL_HEIGHT: 12, // 气泡的“尾巴”的高度。 可能应该是一个常数

  FONT: "Helvetica", // 用于呈现文本的字体
  FONT_SIZE: 14, // Font size
  FONT_HEIGHT_RATIO: 0.9, // 文字的高度（以 像素为单位），占字体大小的比例
  LINE_HEIGHT: 16, // 每行文字之间的间距

  COLORS: {
    BUBBLE_FILL: "white",
    BUBBLE_STROKE: "rgba(0, 0, 0, 0.15)",
    TEXT_FILL: "#575E75",
  },
};

/**
 * @module 文本气泡。显示在舞台上的对话消息
 */
class TextBubbleSkin extends Skin {
  /**
   * 创建一个新的文本气泡皮肤.
   * @param {!int} id - 此皮肤的ID.
   * @param {!RenderWebGL} renderer - 将使用此皮肤的渲染器.
   * @constructor
   * @extends Skin
   */
  constructor(id, renderer) {
    super(id);

    /** @type {RenderWebGL} */
    this._renderer = renderer;

    /** @type {HTMLCanvasElement} */
    this._canvas = document.createElement("canvas");

    /** @type {Array<number>} */
    this._size = [0, 0];

    /** @type {number} */
    this._renderedScale = 0;

    /** @type {Array<string>} */
    this._lines = [];

    /** @type {object} */
    this._textAreaSize = { width: 0, height: 0 };

    /** @type {string} */
    this._bubbleType = "";

    /** @type {boolean} */
    this._pointsLeft = false;

    /** @type {boolean} */
    this._textDirty = true;

    /** @type {boolean} */
    this._textureDirty = true;

    this.measurementProvider = new CanvasMeasurementProvider(
      this._canvas.getContext("2d")
    );
    // this.textWrapper = new TextWrapper(this.measurementProvider);

    this._restyleCanvas();
    console.log("是否使用TextBubbleSkin");
  }

  /**
   * Dispose of this object. Do not use it after calling this method.
   */
  dispose() {
    if (this._texture) {
      this._renderer.gl.deleteTexture(this._texture);
      this._texture = null;
    }
    this._canvas = null;
    super.dispose();
  }

  /**
   * @return {Array<number>} 此蒙皮的尺寸（以 单位为单位）.
   */
  get size() {
    if (this._textDirty) {
      this._reflowLines();
    }
    return this._size;
  }

  /**
   * 设置此文本提示框的参数.
   * @param {!string} type - either "say" or "think".
   * @param {!string} text - the text for the bubble.
   * @param {!boolean} pointsLeft - which side the bubble is pointing.
   */
  setTextBubble(type, text, pointsLeft) {
    this._text = text;
    this._bubbleType = type;
    this._pointsLeft = pointsLeft;

    this._textDirty = true;
    this._textureDirty = true;
    this.emit(Skin.Events.WasAltered);
  }

  /**
   * Re-style the canvas after resizing it. This is necessary to ensure proper text measurement.
   */
  _restyleCanvas() {
    this._canvas.getContext(
      "2d"
    ).font = `${BubbleStyle.FONT_SIZE}px ${BubbleStyle.FONT}, sans-serif`;
  }

  /**
   * 更新换行行和文本尺寸的数组.
   */
  _reflowLines() {
    // this._lines = this.textWrapper.wrapText(
    //   BubbleStyle.MAX_LINE_WIDTH,
    //   this._text
    // );

    // 测量最长线的宽度，以避免出现超宽气泡
    let longestLineWidth = 0;
    for (const line of this._lines) {
      longestLineWidth = Math.max(
        longestLineWidth,
        this.measurementProvider.measureText(line)
      );
    }

    // 计算填充文本区域和全文气泡的画布空间大小
    const paddedWidth =
      Math.max(longestLineWidth, BubbleStyle.MIN_WIDTH) +
      BubbleStyle.PADDING * 2;
    const paddedHeight =
      BubbleStyle.LINE_HEIGHT * this._lines.length + BubbleStyle.PADDING * 2;

    this._textAreaSize.width = paddedWidth;
    this._textAreaSize.height = paddedHeight;

    this._size[0] = paddedWidth + BubbleStyle.STROKE_WIDTH;
    this._size[1] =
      paddedHeight + BubbleStyle.STROKE_WIDTH + BubbleStyle.TAIL_HEIGHT;

    this._textDirty = false;
  }

  /**
   * 使用当前参数以一定比例将此文本气泡渲染到画布上.
   * @param {number} scale The scale to render the bubble at
   */
  _renderTextBubble(scale) {
    const ctx = this._canvas.getContext("2d");

    if (this._textDirty) {
      this._reflowLines();
    }

    // Calculate the canvas-space sizes of the padded text area and full text bubble
    const paddedWidth = this._textAreaSize.width;
    const paddedHeight = this._textAreaSize.height;

    // Resize the canvas to the correct screen-space size
    this._canvas.width = Math.ceil(this._size[0] * scale);
    this._canvas.height = Math.ceil(this._size[1] * scale);
    this._restyleCanvas();

    // Reset the transform before clearing to ensure 100% clearage
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    ctx.scale(scale, scale);
    ctx.translate(
      BubbleStyle.STROKE_WIDTH * 0.5,
      BubbleStyle.STROKE_WIDTH * 0.5
    );

    // If the text bubble points leftward, flip the canvas
    ctx.save();
    if (this._pointsLeft) {
      ctx.scale(-1, 1);
      ctx.translate(-paddedWidth, 0);
    }

    // Draw the bubble's rounded borders
    ctx.beginPath();
    ctx.moveTo(BubbleStyle.CORNER_RADIUS, paddedHeight);
    ctx.arcTo(
      0,
      paddedHeight,
      0,
      paddedHeight - BubbleStyle.CORNER_RADIUS,
      BubbleStyle.CORNER_RADIUS
    );
    ctx.arcTo(0, 0, paddedWidth, 0, BubbleStyle.CORNER_RADIUS);
    ctx.arcTo(
      paddedWidth,
      0,
      paddedWidth,
      paddedHeight,
      BubbleStyle.CORNER_RADIUS
    );
    ctx.arcTo(
      paddedWidth,
      paddedHeight,
      paddedWidth - BubbleStyle.CORNER_RADIUS,
      paddedHeight,
      BubbleStyle.CORNER_RADIUS
    );

    // Translate the canvas so we don't have to do a bunch of width/height arithmetic
    ctx.save();
    ctx.translate(paddedWidth - BubbleStyle.CORNER_RADIUS, paddedHeight);

    // Draw the bubble's "tail"
    if (this._bubbleType === "say") {
      // For a speech bubble, draw one swoopy thing
      ctx.bezierCurveTo(0, 4, 4, 8, 4, 10);
      ctx.arcTo(4, 12, 2, 12, 2);
      ctx.bezierCurveTo(-1, 12, -11, 8, -16, 0);

      ctx.closePath();
    } else {
      // For a thinking bubble, draw a partial circle attached to the bubble...
      ctx.arc(-16, 0, 4, 0, Math.PI);

      ctx.closePath();

      // and two circles detached from it
      ctx.moveTo(-7, 7.25);
      ctx.arc(-9.25, 7.25, 2.25, 0, Math.PI * 2);

      ctx.moveTo(0, 9.5);
      ctx.arc(-1.5, 9.5, 1.5, 0, Math.PI * 2);
    }

    // Un-translate the canvas and fill + stroke the text bubble
    ctx.restore();

    ctx.fillStyle = BubbleStyle.COLORS.BUBBLE_FILL;
    ctx.strokeStyle = BubbleStyle.COLORS.BUBBLE_STROKE;
    ctx.lineWidth = BubbleStyle.STROKE_WIDTH;

    ctx.stroke();
    ctx.fill();

    // Un-flip the canvas if it was flipped
    ctx.restore();

    // Draw each line of text
    ctx.fillStyle = BubbleStyle.COLORS.TEXT_FILL;
    ctx.font = `${BubbleStyle.FONT_SIZE}px ${BubbleStyle.FONT}, sans-serif`;
    const lines = this._lines;
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      ctx.fillText(
        line,
        BubbleStyle.PADDING,
        BubbleStyle.PADDING +
          BubbleStyle.LINE_HEIGHT * lineNumber +
          BubbleStyle.FONT_HEIGHT_RATIO * BubbleStyle.FONT_SIZE
      );
    }

    this._renderedScale = scale;
  }

  /**
   * @param {Array<number>} scale - The scaling factors to be used, each in the [0,100] range.
   * @return {WebGLTexture} The GL texture representation of this skin when drawing at the given scale.
   */
  getTexture(scale) {
    // The texture only ever gets uniform scale. Take the larger of the two axes.
    const scaleMax = scale
      ? Math.max(Math.abs(scale[0]), Math.abs(scale[1]))
      : 100;
    const requestedScale = scaleMax / 100;

    // If we already rendered the text bubble at this scale, we can skip re-rendering it.
    if (this._textureDirty || this._renderedScale !== requestedScale) {
      this._renderTextBubble(requestedScale);
      this._textureDirty = false;

      const context = this._canvas.getContext("2d");
      const textureData = context.getImageData(
        0,
        0,
        this._canvas.width,
        this._canvas.height
      );

      const gl = this._renderer.gl;

      if (this._texture === null) {
        const textureOptions = {
          auto: false,
          wrap: gl.CLAMP_TO_EDGE,
        };

        this._texture = twgl.createTexture(gl, textureOptions);
      }

      this._setTexture(textureData);
    }

    return this._texture;
  }
}

/**
 * @module Drawable 可绘制
 */
/**
 * 一个内部工作空间，用于从世界向量计算纹理位置，出于节省内存的原因，此工作空间已重用
 * @type {twgl.v3}
 */
const __isTouchingPosition = twgl.v3.create();

/**
 * 将临时空间位置转换为纹理空间浮动.
 * 内部__isTouchingPosition作为返回值，因此如果您需要获取两个本地位置并存储两个位置，则应复制此值. 要求可绘制的inverseMatrix是最新的.
 *
 * @param {Drawable} drawable 从以下项获取逆矩阵和均匀项的drawable
 * @param {twgl.v3} vec [x，y]暂存空间向量
 * @return {twgl.v3} [x，y]纹理空间浮点向量-由效果和矩阵转换
 */
const getLocalPosition = (drawable, vec) => {
  // 从世界坐标转换为可绘制坐标.
  const localPosition = __isTouchingPosition;
  const v0 = vec[0];
  const v1 = vec[1];
  const m = drawable._inverseMatrix;
  // var v2 = v[2];
  const d = v0 * m[3] + v1 * m[7] + m[15];
  // RenderWebGL Quad翻转纹理的X轴. 所以渲染的左下角是1，0，右上角是0，1. 翻转X轴，以便localPosition匹配该变换.
  localPosition[0] = 0.5 - (v0 * m[0] + v1 * m[4] + m[12]) / d;
  localPosition[1] = (v0 * m[1] + v1 * m[5] + m[13]) / d + 0.5;
  // 如果localPosition在可绘制的空间之内并且任何效果当前处于活动状态，则应用纹理效果变换.
  if (
    drawable.enabledEffects !== 0 &&
    localPosition[0] >= 0 &&
    localPosition[0] < 1 &&
    localPosition[1] >= 0 &&
    localPosition[1] < 1
  ) {
    EffectTransform.transformPoint(drawable, localPosition, localPosition);
  }
  return localPosition;
};

class Drawable {
  /**
   * 渲染器可以绘制的对象.
   * @todo 双缓冲所有渲染状态（位置，外观，效果等）
   * @param {!int} id - 此Drawable的唯一ID.
   * @constructor
   */
  constructor(id) {
    /** @type {!int} */
    this._id = id;

    /**
     * The uniforms to be used by the vertex and pixel shaders.
     * 其中一些也被渲染器的其他部分使用.
     * @type {Object.<string,*>}
     * @private
     * @description 一般用来表示：变换矩阵，材质，光照参数和颜色等信息.由顶点着色器和片段着色器共享
     */
    this._uniforms = {
      /**
       * 模型矩阵，在绘制时与投影相结合.
       * @type {module:twgl/m4.Mat4}
       */
      u_modelMatrix: twgl.m4.identity(),

      /**
       * 轮廓绘制模式中使用的颜色.
       * @type {Array<number>}
       */
      u_silhouetteColor: Drawable.color4fFromID(this._id),
    };

    //  共享特效值
    const numEffects = ShaderManager.EFFECTS.length;
    for (let index = 0; index < numEffects; ++index) {
      const effectName = ShaderManager.EFFECTS[index];
      const effectInfo = ShaderManager.EFFECT_INFO[effectName];
      const converter = effectInfo.converter;
      this._uniforms[effectInfo.uniformName] = converter(0);
    }

    this._position = twgl.v3.create(0, 0);
    this._scale = twgl.v3.create(100, 100);
    this._direction = 90;
    this._transformDirty = true;
    this._rotationMatrix = twgl.m4.identity();
    this._rotationTransformDirty = true;
    this._rotationAdjusted = twgl.v3.create();
    this._rotationCenterDirty = true;
    this._skinScale = twgl.v3.create(0, 0, 0);
    this._skinScaleDirty = true;
    this._inverseMatrix = twgl.m4.identity();
    this._inverseTransformDirty = true;
    this._visible = true;

    /** A bitmask identifying which effects are currently in use.
     * @readonly
     * @type {int} */
    this.enabledEffects = 0;

    /** @todo move convex hull functionality, maybe bounds functionality overall, to Skin classes */
    this._convexHullPoints = null;
    this._convexHullDirty = true;

    this._skinWasAltered = this._skinWasAltered.bind(this);

    console.warn("k-r.js class Drawable 可绘制", this);
  }

  /**
   * 处置此Drawable。 调用此方法后不要使用它.
   */
  dispose() {
    // 使用设置器：断开事件
    this.skin = null;
  }

  /**
   * 将此Drawable的转换标记为脏.下次需要时将重新计算
   */
  setTransformDirty() {
    console.warn(
      "k-r.js Drawable 将此Drawable的转换标记为脏.下次需要时将重新计算"
    );
    this._transformDirty = true;
    this._inverseTransformDirty = true;
  }

  /**
   * @returns {number} 此Drawable的ID.
   */
  get id() {
    console.warn("k-r.js Drawable 此Drawable的ID");
    return this._id;
  }

  /**
   * @returns {Skin} 此Drawable的当前外观(_skin).
   */
  get skin() {
    console.warn("k-r.js Drawable 此Drawable的当前外观(_skin)");
    return this._skin;
  }

  /**
   * @param {Skin} newSkin - 此Drawable的新外观(_skin).
   */
  set skin(newSkin) {
    console.warn("k-r.js Drawable 此Drawable的新外观(_skin)");
    if (this._skin !== newSkin) {
      if (this._skin) {
        this._skin.removeListener(Skin.Events.WasAltered, this._skinWasAltered);
      }
      this._skin = newSkin;
      if (this._skin) {
        this._skin.addListener(Skin.Events.WasAltered, this._skinWasAltered);
      }
      this._skinWasAltered();
    }
  }

  /**
   * @returns {Array<number>} 当前应用于此Drawable的缩放比例。 [100,100]是正常尺寸.
   */
  get scale() {
    console.warn("k-r.js Drawable 当前应用于此Drawable的缩放比例");
    return [this._scale[0], this._scale[1]];
  }

  /**
   * @returns {object.<string, *>} 渲染此Drawable时要使用的着色器_uniforms.
   */
  getUniforms() {
    console.warn("k-r.js Drawable 渲染此Drawable时要使用的着色器_uniforms");
    if (this._transformDirty) {
      this._calculateTransform();
    }
    return this._uniforms;
  }

  /**
   * @returns {boolean} 此Drawable是否可见.
   */
  getVisible() {
    console.warn("k-r.js Drawable 此Drawable是否可见");
    return this._visible;
  }

  /**
   * 如果位置不同，请更新位置。 将转换标记为脏.
   * @param {Array.<number>} position A new position.
   */
  updatePosition(position) {
    console.warn("k-r.js Drawable 如果位置不同，请更新位置");
    if (
      this._position[0] !== position[0] ||
      this._position[1] !== position[1]
    ) {
      this._position[0] = Math.round(position[0]);
      this._position[1] = Math.round(position[1]);
      this.setTransformDirty();
    }
  }

  /**
   * 如果方向不同，请更新方向。 将转换标记为脏.
   * @param {number} direction A new direction.
   */
  updateDirection(direction) {
    console.warn("k-r.js Drawable 如果方向不同，请更新方向");
    if (this._direction !== direction) {
      this._direction = direction;
      this._rotationTransformDirty = true;
      this.setTransformDirty();
    }
  }

  /**
   * 如果比例不同，则更新比例。 将转换标记为脏.
   * @param {Array.<number>} scale A new scale.
   */
  updateScale(scale) {
    console.warn("k-r.js Drawable 如果比例不同，则更新比例");
    if (this._scale[0] !== scale[0] || this._scale[1] !== scale[1]) {
      this._scale[0] = scale[0];
      this._scale[1] = scale[1];
      this._rotationCenterDirty = true;
      this._skinScaleDirty = true;
      this.setTransformDirty();
    }
  }

  /**
   * 如果不同，则更新可见性。 将凸包标记为脏.
   * @param {boolean} visible A new visibility state.
   */
  updateVisible(visible) {
    console.warn("k-r.js Drawable 如果不同，则更新可见性");
    if (this._visible !== visible) {
      this._visible = visible;
      this.setConvexHullDirty();
    }
  }

  /**
   * 更新效果。 如果效果改变形状，则将凸包标记为脏.
   * @param {string} effectName The name of the effect.
   * @param {number} rawValue A new effect value.
   */
  updateEffect(effectName, rawValue) {
    console.warn("k-r.js Drawable 更新效果");
    const effectInfo = ShaderManager.EFFECT_INFO[effectName];
    if (rawValue) {
      this.enabledEffects |= effectInfo.mask;
    } else {
      this.enabledEffects &= ~effectInfo.mask;
    }
    const converter = effectInfo.converter;
    this._uniforms[effectInfo.uniformName] = converter(rawValue);
    if (effectInfo.shapeChanges) {
      this.setConvexHullDirty();
    }
  }

  /**
   * 更新此Drawable的位置，方向，比例或效果属性.
   * @deprecated Use specific update* methods instead.
   * @param {object.<string,*>} properties The new property values to set.
   */
  updateProperties(properties) {
    console.warn("k-r.js Drawable 更新此Drawable的位置，方向，比例或效果属性");
    if ("position" in properties) {
      this.updatePosition(properties.position);
    }
    if ("direction" in properties) {
      this.updateDirection(properties.direction);
    }
    if ("scale" in properties) {
      this.updateScale(properties.scale);
    }
    if ("visible" in properties) {
      this.updateVisible(properties.visible);
    }
    const numEffects = ShaderManager.EFFECTS.length;
    for (let index = 0; index < numEffects; ++index) {
      const effectName = ShaderManager.EFFECTS[index];
      if (effectName in properties) {
        this.updateEffect(effectName, properties[effectName]);
      }
    }
  }

  /**
   * 计算渲染此Drawable时要使用的变换.
   * @private
   */
  _calculateTransform() {
    console.warn("k-r.js Drawable 计算渲染此Drawable时要使用的变换");
    if (this._rotationTransformDirty) {
      const rotation = ((270 - this._direction) * Math.PI) / 180;
      const c = Math.cos(rotation);
      const s = Math.sin(rotation);
      this._rotationMatrix[0] = c;
      this._rotationMatrix[1] = s;
      this._rotationMatrix[4] = -s;
      this._rotationMatrix[5] = c;

      this._rotationTransformDirty = false;
    }

    // 调整相对于皮肤的旋转中心.
    if (this._rotationCenterDirty && this.skin !== null) {
      const rotationCenter = this.skin.rotationCenter;
      const skinSize = this.skin.size;
      const center0 = rotationCenter[0];
      const center1 = rotationCenter[1];
      const skinSize0 = skinSize[0];
      const skinSize1 = skinSize[1];
      const scale0 = this._scale[0];
      const scale1 = this._scale[1];

      const rotationAdjusted = this._rotationAdjusted;
      rotationAdjusted[0] = ((center0 - skinSize0 / 2) * scale0) / 100;
      rotationAdjusted[1] = (((center1 - skinSize1 / 2) * scale1) / 100) * -1;

      this._rotationCenterDirty = false;
    }

    if (this._skinScaleDirty && this.skin !== null) {
      // 本地分配skinSize以防止两次调用Skin getter属性.
      const skinSize = this.skin.size;
      const scaledSize = this._skinScale;
      scaledSize[0] = (skinSize[0] * this._scale[0]) / 100;
      scaledSize[1] = (skinSize[1] * this._scale[1]) / 100;

      this._skinScaleDirty = false;
    }

    const modelMatrix = this._uniforms.u_modelMatrix;
    const scale0 = this._skinScale[0];
    const scale1 = this._skinScale[1];
    const rotation00 = this._rotationMatrix[0];
    const rotation01 = this._rotationMatrix[1];
    const rotation10 = this._rotationMatrix[4];
    const rotation11 = this._rotationMatrix[5];
    const adjusted0 = this._rotationAdjusted[0];
    const adjusted1 = this._rotationAdjusted[1];
    const position0 = this._position[0];
    const position1 = this._position[1];

    modelMatrix[0] = scale0 * rotation00;
    modelMatrix[1] = scale0 * rotation01;
    modelMatrix[4] = scale1 * rotation10;
    modelMatrix[5] = scale1 * rotation11;
    modelMatrix[12] =
      rotation00 * adjusted0 + rotation10 * adjusted1 + position0;
    modelMatrix[13] =
      rotation01 * adjusted0 + rotation11 * adjusted1 + position1;

    this._transformDirty = false;
  }

  /**
   * Drawable是否需要渲染器提供的凸包体点.
   * @return {boolean} 当不知道凸包或脏时为真.
   */
  needsConvexHullPoints() {
    console.warn("k-r.js Drawable Drawable是否需要渲染器提供的凸包体点");
    return (
      !this._convexHullPoints ||
      this._convexHullDirty ||
      this._convexHullPoints.length === 0
    );
  }

  /**
   * 将凸包设置为脏.每当Drawable的形状可能改变时，请执行此操作
   */
  setConvexHullDirty() {
    console.warn("k-r.js Drawable 将凸包设置为脏");
    this._convexHullDirty = true;
  }

  /**
   * 设置Drawable的凸包点.
   * @param {Array<Array<number>>} points Convex hull points, as [[x, y], ...]
   */
  setConvexHullPoints(points) {
    console.warn("k-r.js Drawable 设置Drawable的凸包点");
    this._convexHullPoints = points;
    this._convexHullDirty = false;
  }

  /**
   * 检查世界位置是否触及皮肤.调用方负责确保此可绘制对象的逆矩阵及其皮肤轮廓是最新的.
   * @see updateCPURenderAttributes
   * @param {twgl.v3} vec 世界坐标向量.
   * @return {boolean} True if the world position touches the skin.
   */
  isTouching(vec) {
    console.warn("k-r.js Drawable 检查世界位置是否触及皮肤");
    if (!this.skin) {
      return false;
    }

    const localPosition = getLocalPosition(this, vec);

    //我们并没有传递使用最近的量表，但这没关系，因为“碰触”查询总以“本机”大小发生.
    if (this.useNearest()) {
      return this.skin.isTouchingNearest(localPosition);
    }
    return this.skin.isTouchingLinear(localPosition);
  }

  /**
   * 可绘制对象应使用NEAREST NEIGHBOR还是LINEAR INTERPOLATION模式
   * @param {?Array<Number>} scale 可选）可绘制对象的屏幕空间比例.
   * @return {boolean} True if the drawable should use nearest-neighbor interpolation.
   */
  useNearest(scale = this.scale) {
    console.warn(
      "k-r.js Drawable 可绘制对象应使用NEAREST NEIGHBOR还是LINEAR INTERPOLATION模式"
    );
    // 栅格外观（位图）应始终首选最近的邻居
    if (this.skin.isRaster) return true;

    // 如果设置了马赛克，像素化，旋转或鱼眼效果位，请使用线性
    if (
      (this.enabledEffects &
        (ShaderManager.EFFECT_INFO.fisheye.mask |
          ShaderManager.EFFECT_INFO.whirl.mask |
          ShaderManager.EFFECT_INFO.pixelate.mask |
          ShaderManager.EFFECT_INFO.mosaic.mask)) !==
      0
    ) {
      return false;
    }

    // 除非我们是90旋转的倍数，否则我们不能使用最近的邻居
    if (this._direction % 90 !== 0) return false;

    // 如果皮肤的比例非常接近100（我猜0.99999的差异还可以）
    if (
      Math.abs(scale[0]) > 99 &&
      Math.abs(scale[0]) < 101 &&
      Math.abs(scale[1]) > 99 &&
      Math.abs(scale[1]) < 101
    )
      return true;

    return false;
  }

  /**
   * 获取Drawable的精确范围.
   * 此函数将变换矩阵应用于已知的凸包，然后沿轴查找最小框.
   * 在调用此方法之前，请确保渲染器已更新凸包体点.
   * @param {?Rectangle} result 边界计算的可选目标
   * @return {!Rectangle} Drawable周围的紧密框的边界.
   */
  getBounds(result) {
    console.warn("k-r.js Drawable 获取Drawable的精确范围");
    if (this.needsConvexHullPoints())
      throw new Error("在边界计算之前需要更新的凸包点.");

    if (this._transformDirty) this._calculateTransform();

    const transformedHullPoints = this._getTransformedHullPoints();
    // 搜索变形点以在轴上生成框.
    result = result || new Rectangle();
    result.initFromPointsAABB(transformedHullPoints);
    return result;
  }

  /**
   * 获取Drawable的高8px切片的精确边界.
   * 用于计算气泡位置. 在调用此方法之前，请确保渲染器已更新凸包体点.
   * @param {?Rectangle} result optional destination for bounds calculation
   * @return {!Rectangle} Bounds for a tight box around a slice of the Drawable.
   */
  getBoundsForBubble(result) {
    console.warn("k-r.js Drawable 获取Drawable的高8px切片的精确边界");
    if (this.needsConvexHullPoints())
      throw new Error("在计算气泡边界之前需要更新的凸包点");

    if (this._transformDirty) this._calculateTransform();

    const slice = 8; // px，要测量的顶部切片的高度。
    const transformedHullPoints = this._getTransformedHullPoints();
    const maxY = Math.max.apply(
      null,
      transformedHullPoints.map((p) => p[1])
    );
    const filteredHullPoints = transformedHullPoints.filter(
      (p) => p[1] > maxY - slice
    );
    // 搜索经过过滤的点以在轴上生成框.
    result = result || new Rectangle();
    result.initFromPointsAABB(filteredHullPoints);
    return result;
  }

  /**
   * 获取Drawable的与轴对齐的粗略边界框.通过变换皮肤的边界来计算.
   * Note that this is less precise than the box returned by `getBounds`,
   * which is tightly snapped to account for a Drawable's transparent regions.
   * `getAABB` returns a much less accurate bounding box, but will be much
   * faster to calculate so may be desired for quick checks/optimizations.
   * @param {?Rectangle} result optional destination for bounds calculation
   * @return {!Rectangle} Rough axis-aligned bounding box for Drawable.
   */
  getAABB(result) {
    console.warn("k-r.js Drawable 获取Drawable的与轴对齐的粗略边界框");
    if (this._transformDirty) {
      this._calculateTransform();
    }
    const tm = this._uniforms.u_modelMatrix;
    result = result || new Rectangle();
    result.initFromModelMatrix(tm);
    return result;
  }

  /**
   * 返回可能的最佳Drawable边界，而无需执行图形查询.
   * I.e., returns the tight bounding box when the convex hull points are already
   * known, but otherwise return the rough AABB of the Drawable.
   * @param {?Rectangle} result optional destination for bounds calculation
   * @return {!Rectangle} Bounds for the Drawable.
   */
  getFastBounds(result) {
    console.warn(
      "k-r.js Drawable 返回可能的最佳Drawable边界，而无需执行图形查询"
    );
    if (!this.needsConvexHullPoints()) {
      return this.getBounds(result);
    }
    return this.getAABB(result);
  }

  /**
   * 通过当前Drawable的变换对所有凸包点进行变换. 这使我们可以跳过许多Drawable更新的重新计算凸包的操作，包括平移，旋转，缩放.
   * @return {!Array.<!Array.number>} Array of glPoints which are Array<x, y>
   * @private
   */
  _getTransformedHullPoints() {
    console.warn("k-r.js Drawable 通过当前Drawable的变换对所有凸包点进行变换");
    const projection = twgl.m4.ortho(-1, 1, -1, 1, -1, 1);
    const skinSize = this.skin.size;
    const halfXPixel = 1 / skinSize[0] / 2;
    const halfYPixel = 1 / skinSize[1] / 2;
    const tm = twgl.m4.multiply(this._uniforms.u_modelMatrix, projection);
    const transformedHullPoints = [];
    for (let i = 0; i < this._convexHullPoints.length; i++) {
      const point = this._convexHullPoints[i];
      const glPoint = twgl.v3.create(
        0.5 + -point[0] / skinSize[0] - halfXPixel,
        point[1] / skinSize[1] - 0.5 + halfYPixel,
        0
      );
      twgl.m4.transformPoint(tm, glPoint, glPoint);
      transformedHullPoints.push(glPoint);
    }
    return transformedHullPoints;
  }

  /**
   * 更新变换矩阵并计算其逆值以用于碰撞和局部纹理位置.
   */
  updateMatrix() {
    console.warn(
      "k-r.js Drawable 更新变换矩阵并计算其逆值以用于碰撞和局部纹理位置"
    );
    if (this._transformDirty) {
      this._calculateTransform();
    }
    // 获取模型矩阵的逆矩阵或对其进行更新.
    if (this._inverseTransformDirty) {
      const inverse = this._inverseMatrix;
      twgl.m4.copy(this._uniforms.u_modelMatrix, inverse);
      // 法线矩阵的z缩放比例为0，导致model [10]为0. Getting a 4x4 inverse is impossible without a scaling in x, y,
      // and z.
      inverse[10] = 1;
      twgl.m4.inverse(inverse, inverse);
      this._inverseTransformDirty = false;
    }
  }

  /**
   * 更新将其绘制为可绘制内容所需的所有内容.
   */
  updateCPURenderAttributes() {
    console.warn("k-r.js Drawable 更新将其绘制为可绘制内容所需的所有内容");
    this.updateMatrix();
    // CPU渲染始终以“本机”大小进行，因此无需按比例放大。
    if (this.skin) {
      this.skin.updateSilhouette(this._scale);
    } else {
      console.warn(`找不到ID为可绘制的皮肤: ${this._id}`);
    }
  }

  /**
   * 响应当前外观的内部更改.
   * @private
   */
  _skinWasAltered() {
    console.warn("k-r.js Drawable 响应当前外观的内部更改");
    this._rotationCenterDirty = true;
    this._skinScaleDirty = true;
    this.setConvexHullDirty();
    this.setTransformDirty();
  }

  /**
   * 计算颜色以表示给定的ID号. 如果ID不是RenderConstants.ID_NONE，则结果颜色的至少一个分量将为非零.
   * @param {int} id The ID to convert.
   * @returns {Array<number>} An array of [r,g,b,a], each component in the range [0,1].
   */
  static color4fFromID(id) {
    console.warn("k-r.js Drawable 计算颜色以表示给定的ID号");
    id -= ID_NONE;
    const r = ((id >> 0) & 255) / 255.0;
    const g = ((id >> 8) & 255) / 255.0;
    const b = ((id >> 16) & 255) / 255.0;
    return [r, g, b, 1.0];
  }

  /**
   * 计算给定颜色表示的ID号. 如果颜色的所有分量均为零，则结果将为RenderConstants.ID_NONE;。 否则结果将是有效的ID.
   * @param {int} r The red value of the color, in the range [0,255].
   * @param {int} g The green value of the color, in the range [0,255].
   * @param {int} b The blue value of the color, in the range [0,255].
   * @returns {int} The ID represented by that color.
   */
  static color3bToID(r, g, b) {
    console.warn("k-r.js Drawable 计算给定颜色表示的ID号");
    let id;
    id = (r & 255) << 0;
    id |= (g & 255) << 8;
    id |= (b & 255) << 16;
    return id + ID_NONE;
  }

  /**
   * 从绘图对象的纹理中采样颜色.
   * 调用方负责确保此可绘制对象的逆矩阵及其皮肤轮廓是最新的.
   * @see updateCPURenderAttributes
   * @param {twgl.v3} vec The scratch space [x,y] vector
   * @param {Drawable} drawable The drawable to sample the texture from
   * @param {Uint8ClampedArray} dst The "color4b" representation of the texture at point.
   * @param {number} [effectMask] A bitmask for which effects to use. Optional.
   * @returns {Uint8ClampedArray} The dst object filled with the color4b
   */
  static sampleColor4b(vec, drawable, dst, effectMask) {
    console.warn("k-r.js Drawable 从绘图对象的纹理中采样颜色");
    const localPosition = getLocalPosition(drawable, vec);
    if (
      localPosition[0] < 0 ||
      localPosition[1] < 0 ||
      localPosition[0] > 1 ||
      localPosition[1] > 1
    ) {
      dst[0] = 0;
      dst[1] = 0;
      dst[2] = 0;
      dst[3] = 0;
      return dst;
    }
    const textColor =
      // commenting out to only use nearest for now
      // drawable.useNearest() ?
      drawable.skin._silhouette.colorAtNearest(localPosition, dst);
    // : drawable.skin._silhouette.colorAtLinear(localPosition, dst);

    if (drawable.enabledEffects === 0) return textColor;
    return EffectTransform.transformColor(drawable, textColor, effectMask);
  }
}

/** @description 触摸可绘制点 */
const __isTouchingDrawablesPoint = twgl.v3.create();
/** @description 候选边界 */
const __candidatesBounds = new Rectangle();
/** @description 栅栏边界 */
const __fenceBounds = new Rectangle();
/** @description 触摸颜色 */
const __touchingColor = new Uint8ClampedArray(4);
/** @description 混合颜色 */
const __blendColor = new Uint8ClampedArray(4);

// 像素多于此像素，我们放弃了GPU并承担readPixels的代价宽度*高度*位置可绘制对象的数量
const __cpuTouchingColorPixelCount = 4e4;

/**
 * @callback RenderWebGL#idFilterFunc
 * @param {int} drawableID The ID to filter.
 * @return {bool} True if the ID passes the filter, otherwise false.
 */

/**
 * Maximum touch size for a picking check.
 * @todo Figure out a reasonable max size. Maybe this should be configurable?
 * @type {Array<int>}
 * @memberof RenderWebGL
 */
const MAX_TOUCH_SIZE = [3, 3];

/**
 * 传递给制服的彩色面罩
 */
const MASK_TOUCHING_COLOR_TOLERANCE = 2;

/**
 * 确定遮罩颜色是否“足够接近”（仅测试每种颜色的前6位）.  These bit masks are what scratch 2 used to use, so we do the same.
 * @param {Uint8Array} a A color3b or color4b value.
 * @param {Uint8Array} b A color3b or color4b value.
 * @returns {boolean} If the colors match within the parameters.
 */
const maskMatches = (a, b) =>
  // has some non-alpha component to test against
  a[3] > 0 &&
  (a[0] & 0b11111100) === (b[0] & 0b11111100) &&
  (a[1] & 0b11111100) === (b[1] & 0b11111100) &&
  (a[2] & 0b11111100) === (b[2] & 0b11111100);

/**
 * Determines if the given color is "close enough" (only test the 5 top bits for
 * red and green, 4 bits for blue).  These bit masks are what scratch 2 used to use,
 * so we do the same.
 * @param {Uint8Array} a A color3b or color4b value.
 * @param {Uint8Array} b A color3b or color4b value / or a larger array when used with offsets
 * @param {number} offset An offset into the `b` array, which lets you use a larger array to test
 *                  multiple values at the same time.
 * @returns {boolean} If the colors match within the parameters.
 */
const colorMatches = (a, b, offset) =>
  (a[0] & 0b11111000) === (b[offset + 0] & 0b11111000) &&
  (a[1] & 0b11111000) === (b[offset + 1] & 0b11111000) &&
  (a[2] & 0b11110000) === (b[offset + 2] & 0b11110000);

/**
 * 精灵围栏-精灵要保留在过渡区域边缘周围的屏幕上所需的像素数.
 * @type {number}
 */
const FENCE_WIDTH = 15;

class RenderWebGL extends EventEmitter {
  /**
   * 尝试创建实例之前，请检查该环境是否支持此渲染器.
   * 从构造函数中捕获异常也是测试（缺乏）支持的有效方法.
   * @param {canvas} [optCanvas] - 用于测试的可选画布。 否则将使用临时画布.
   * @returns {boolean} - 如果此环境似乎支持此渲染器，则为true，否则为false.
   */
  static isSupported(optCanvas) {
    try {
      // 以与构造函数相同的方式创建上下文：属性可能会有所作为.
      return !!RenderWebGL._getContext(
        optCanvas || document.createElement("canvas")
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * 要求TWGL使用此渲染器使用的属性创建渲染上下文.
   * @param {canvas} canvas - attach the context to this canvas.
   * @returns {WebGLRenderingContext} - a TWGL rendering context (backed by either WebGL 1.0 or 2.0).
   * @private
   */
  static _getContext(canvas) {
    console.warn(
      "k-r.js class RenderWebGL 要求TWGL使用此渲染器使用的属性创建渲染上下文."
    );
    return twgl.getWebGLContext(canvas, {
      alpha: false,
      stencil: true,
      antialias: false,
    });
  }

  /**
   * 创建一个渲染器，以使用WebGL将精灵绘制到画布上.
   * 如果未指定，则坐标将默认为2.0值.
   * 舞台的“本机”大小将根据这些坐标进行计算.
   * 例如，默认值导致本机尺寸为480x360.
   * 诸如“触色”之类的查询。 将始终以原始大小执行.
   * @see RenderWebGL#setStageSize
   * @see RenderWebGL#resize
   * @param {canvas} canvas The canvas to draw onto.
   * @param {int} [xLeft=-240] The x-coordinate of the left edge.
   * @param {int} [xRight=240] The x-coordinate of the right edge.
   * @param {int} [yBottom=-180] The y-coordinate of the bottom edge.
   * @param {int} [yTop=180] The y-coordinate of the top edge.
   * @constructor
   * @listens RenderWebGL#event:NativeSizeChanged
   */
  constructor(canvas, xLeft, xRight, yBottom, yTop) {
    super();

    /** @type {WebGLRenderingContext} */
    const gl = (this._gl = RenderWebGL._getContext(canvas));
    if (!gl) {
      throw new Error("无法获取WebGL上下文：此浏览器或环境可能不支持WebGL.");
    }

    /** @type {RenderWebGL.UseGpuModes} */
    this._useGpuMode = RenderWebGL.UseGpuModes.Automatic;

    /** @type {Drawable[]} */
    this._allDrawables = [];

    /** @type {Skin[]} */
    this._allSkins = [];

    /** @type {Array<int>} */
    this._drawList = [];

    // A list of layer group names in the order they should appear
    // from furthest back to furthest in front.
    /** @type {Array<String>} */
    this._groupOrdering = [];

    /**
     * @typedef LayerGroup
     * @property {int} groupIndex The relative position of this layer group in the group ordering
     * @property {int} drawListOffset The absolute position of this layer group in the draw list
     * This number gets updated as drawables get added to or deleted from the draw list.
     */

    // Map of group name to layer group
    /** @type {Object.<string, LayerGroup>} */
    this._layerGroups = {};

    /** @type {int} */
    this._nextDrawableId = ID_NONE + 1;

    /** @type {int} */
    this._nextSkinId = ID_NONE + 1;

    /** @type {module:twgl/m4.Mat4} */
    this._projection = twgl.m4.identity();

    /** @type {ShaderManager} */
    this._shaderManager = new ShaderManager(gl);

    /** @type {HTMLCanvasElement} */
    this._tempCanvas = document.createElement("canvas");

    /** @type {any} */
    this._regionId = null;

    /** @type {function} */
    this._exitRegion = null;

    /** @type {Array.<snapshotCallback>} 快照回调 */
    this._snapshotCallbacks = [];

    this._createGeometry();

    this.on(Events.NativeSizeChanged, this.onNativeSizeChanged);

    this.setBackgroundColor(1, 1, 1);
    this.setStageSize(
      xLeft || -240,
      xRight || 240,
      yBottom || -180,
      yTop || 180
    );
    this.resize(this._nativeSize[0], this._nativeSize[1]);

    gl.disable(gl.DEPTH_TEST);
    /** @todo disable when no partial transparency? */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    console.warn("k-r.js class RenderWebGL ", this);
  }

  /**
   * @returns {WebGLRenderingContext} 与此渲染器关联的WebGL渲染上下文.
   */
  get gl() {
    console.warn("k-r.js RenderWebGL 与此渲染器关联的WebGL渲染上下文");
    return this._gl;
  }

  /**
   * @returns {HTMLCanvasElement} 与此渲染器关联的WebGL渲染上下文的画布.
   */
  get canvas() {
    console.warn("k-r.js RenderWebGL 与此渲染器关联的WebGL渲染上下文的画布");
    return this._gl && this._gl.canvas;
  }

  /**
   * 设置平台的物理尺寸（与设备无关的像素）.
   * This will be multiplied by the device's pixel ratio on high-DPI displays.
   * @param {int} pixelsWide The desired width in device-independent pixels.
   * @param {int} pixelsTall The desired height in device-independent pixels.
   */
  resize(pixelsWide, pixelsTall) {
    console.warn("k-r.js RenderWebGL 设置平台的物理尺寸（与设备无关的像素）");
    const { canvas } = this._gl;
    const pixelRatio = window.devicePixelRatio || 1;
    const newWidth = pixelsWide * pixelRatio;
    const newHeight = pixelsTall * pixelRatio;

    // 即使画布大小没有变化，某些操作（例如移动颜色选择器）也会每帧调用一次“调整大小”. To avoid unnecessary canvas updates, check that we *really* need to resize the canvas.
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      // 调整画布大小会使其清除，因此请重新绘制.
      this.draw();
    }
  }

  /**
   * 设置舞台的背景色。 每帧用此颜色清除舞台.
   * @param {number} red The red component for the background.
   * @param {number} green The green component for the background.
   * @param {number} blue The blue component for the background.
   */
  setBackgroundColor(red, green, blue) {
    console.warn("k-r.js RenderWebGL 设置舞台的背景色。 每帧用此颜色清除舞台");
    this._backgroundColor = [red, green, blue, 1];
  }

  /**
   * 告诉渲染器在某些操作期间将各种调试信息绘制到提供的画布上.
   * @param {canvas} canvas The canvas to use for debug output.
   */
  setDebugCanvas(canvas) {
    console.warn(
      "k-r.js RenderWebGL 告诉渲染器在某些操作期间将各种调试信息绘制到提供的画布上"
    );
    this._debugCanvas = canvas;
  }

  /**
   * 控制isTouchingColor中GPU或CPU路径的使用.
   * @param {RenderWebGL.UseGpuModes} useGpuMode - automatically decide, force CPU, or force GPU.
   */
  setUseGpuMode(useGpuMode) {
    console.warn("k-r.js RenderWebGL 控制isTouchingColor中GPU或CPU路径的使用");
    this._useGpuMode = useGpuMode;
  }

  /**
   * 以临时单位设置舞台的逻辑大小.
   * @param {int} xLeft 左边缘的x坐标. Scratch 2 uses -240.
   * @param {int} xRight 右边缘的x坐标. Scratch 2 uses 240.
   * @param {int} yBottom The bottom edge's y-coordinate. Scratch 2 uses -180.
   * @param {int} yTop The top edge's y-coordinate. Scratch 2 uses 180.
   */
  setStageSize(xLeft, xRight, yBottom, yTop) {
    console.warn("k-r.js RenderWebGL 以临时单位设置舞台的逻辑大小");
    this._xLeft = xLeft;
    this._xRight = xRight;
    this._yBottom = yBottom;
    this._yTop = yTop;

    // 交换yBottom和yTop以适应+ y = up的暂存约定
    this._projection = twgl.m4.ortho(xLeft, xRight, yBottom, yTop, -1, 1);

    this._setNativeSize(Math.abs(xRight - xLeft), Math.abs(yBottom - yTop));
  }

  /**
   * @return {Array<int>} 舞台的“本机”大小，用于笔，查询渲染等.
   */
  getNativeSize() {
    console.warn("k-r.js RenderWebGL 舞台的“本机”大小，用于笔，查询渲染等");
    return [this._nativeSize[0], this._nativeSize[1]];
  }

  /**
   * 设置舞台的“本机”大小，用于笔，查询渲染等.
   * @param {int} width - the new width to set.
   * @param {int} height - the new height to set.
   * @private
   * @fires RenderWebGL#event:NativeSizeChanged
   */
  _setNativeSize(width, height) {
    console.warn("k-r.js RenderWebGL 设置舞台的“本机”大小，用于笔，查询渲染等");
    this._nativeSize = [width, height];
    this.emit(Events.NativeSizeChanged, {
      newSize: this._nativeSize,
    });
  }

  /**
   * 从提供的位图数据的快照创建新的位图外观.
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} bitmapData - new contents for this skin.
   * @param {!int} [costumeResolution=1] - The resolution to use for this bitmap.
   * @param {?Array<number>} [rotationCenter] Optional: rotation center of the skin. If not supplied, the center of
   * the skin will be used.
   * @returns {!int} the ID for the new skin.
   */
  createBitmapSkin(bitmapData, costumeResolution, rotationCenter) {
    console.warn("k-r.js RenderWebGL 从提供的位图数据的快照创建新的位图外观");
    const skinId = this._nextSkinId++;
    const newSkin = new BitmapSkin(skinId, this);
    newSkin.setBitmap(bitmapData, costumeResolution, rotationCenter);
    this._allSkins[skinId] = newSkin;
    return skinId;
  }

  /**
   * 创建一个新的SVG外观.
   * @param {!string} svgData - new SVG to use.
   * @param {?Array<number>} rotationCenter Optional: rotation center of the skin. If not supplied, the center of the
   * skin will be used
   * @returns {!int} the ID for the new skin.
   */
  createSVGSkin(svgData, rotationCenter) {
    console.warn("k-r.js RenderWebGL 创建一个新的SVG外观");
    const skinId = this._nextSkinId++;
    const newSkin = new SVGSkin(skinId, this);
    newSkin.setSVG(svgData, rotationCenter);
    this._allSkins[skinId] = newSkin;
    return skinId;
  }

  /**
   * 创建一个新的PenSkin-一种实现便签层的皮肤.
   * @returns {!int} the ID for the new skin.
   */
  createPenSkin() {
    console.warn("k-r.js RenderWebGL 创建一个新的PenSkin-一种实现便签层的皮肤");
    const skinId = this._nextSkinId++;
    const newSkin = new PenSkin(skinId, this);
    this._allSkins[skinId] = newSkin;
    return skinId;
  }

  /**
   * 使用文本泡泡SVG创建者创建新的SVG外观. 旋转中心始终位于左上方.
   * @param {!string} type - either "say" or "think".
   * @param {!string} text - the text for the bubble.
   * @param {!boolean} pointsLeft - which side the bubble is pointing.
   * @returns {!int} the ID for the new skin.
   */
  createTextSkin(type, text, pointsLeft) {
    console.warn("k-r.js RenderWebGL 使用文本泡泡SVG创建者创建新的SVG外观");
    const skinId = this._nextSkinId++;
    const newSkin = new TextBubbleSkin(skinId, this);
    newSkin.setTextBubble(type, text, pointsLeft);
    this._allSkins[skinId] = newSkin;
    return skinId;
  }

  /**
   * 更新现有的SVG外观，或者如果先前的皮肤不是SVG，则创建SVG外观.
   * @param {!int} skinId the ID for the skin to change.
   * @param {!string} svgData - new SVG to use.
   * @param {?Array<number>} rotationCenter Optional: rotation center of the skin. If not supplied, the center of the
   * skin will be used
   */
  updateSVGSkin(skinId, svgData, rotationCenter) {
    console.warn(
      "k-r.js RenderWebGL 更新现有的SVG外观，或者如果先前的皮肤不是SVG，则创建SVG外观"
    );
    if (this._allSkins[skinId] instanceof SVGSkin) {
      this._allSkins[skinId].setSVG(svgData, rotationCenter);
      return;
    }

    const newSkin = new SVGSkin(skinId, this);
    newSkin.setSVG(svgData, rotationCenter);
    this._reskin(skinId, newSkin);
  }

  /**
   * 更新现有的位图外观，如果先前的外观不是位图，则创建一个位图外观.
   * @param {!int} skinId the ID for the skin to change.
   * @param {!ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imgData - new contents for this skin.
   * @param {!number} bitmapResolution - the resolution scale for a bitmap costume.
   * @param {?Array<number>} rotationCenter Optional: rotation center of the skin. If not supplied, the center of the
   * skin will be used
   */
  updateBitmapSkin(skinId, imgData, bitmapResolution, rotationCenter) {
    console.warn(
      "k-r.js RenderWebGL 更新现有的位图外观，如果先前的外观不是位图，则创建一个位图外观"
    );
    if (this._allSkins[skinId] instanceof BitmapSkin) {
      this._allSkins[skinId].setBitmap(
        imgData,
        bitmapResolution,
        rotationCenter
      );
      return;
    }

    const newSkin = new BitmapSkin(skinId, this);
    newSkin.setBitmap(imgData, bitmapResolution, rotationCenter);
    this._reskin(skinId, newSkin);
  }

  _reskin(skinId, newSkin) {
    console.warn("k-r.js RenderWebGL _reskin");
    const oldSkin = this._allSkins[skinId];
    this._allSkins[skinId] = newSkin;

    // Tell drawables to update
    for (const drawable of this._allDrawables) {
      if (drawable && drawable.skin === oldSkin) {
        drawable.skin = newSkin;
      }
    }
    oldSkin.dispose();
  }

  /**
   * 使用文本泡泡SVG创建者更新皮肤.
   * @param {!int} skinId the ID for the skin to change.
   * @param {!string} type - either "say" or "think".
   * @param {!string} text - the text for the bubble.
   * @param {!boolean} pointsLeft - which side the bubble is pointing.
   */
  updateTextSkin(skinId, type, text, pointsLeft) {
    console.warn("k-r.js RenderWebGL 使用文本泡泡SVG创建者更新皮肤");
    if (this._allSkins[skinId] instanceof TextBubbleSkin) {
      this._allSkins[skinId].setTextBubble(type, text, pointsLeft);
      return;
    }

    const newSkin = new TextBubbleSkin(skinId, this);
    newSkin.setTextBubble(type, text, pointsLeft);
    this._reskin(skinId, newSkin);
  }

  /**
   * 销毁现有皮肤。 呼叫此后请勿使用皮肤或其ID.
   * @param {!int} skinId - The ID of the skin to destroy.
   */
  destroySkin(skinId) {
    console.warn("k-r.js RenderWebGL 销毁现有皮肤");
    const oldSkin = this._allSkins[skinId];
    oldSkin.dispose();
    delete this._allSkins[skinId];
  }

  /**
   * 创建一个新的Drawable并将其添加到场景中.
   * @param {string} group Layer group to add the drawable to
   * @returns {int} The ID of the new Drawable.
   */
  createDrawable(group) {
    console.warn("k-r.js RenderWebGL 创建一个新的Drawable并将其添加到场景中");
    if (!group || !this._layerGroups.hasOwnProperty(group)) {
      console.warn("Cannot create a drawable without a known layer group");
      return;
    }
    const drawableID = this._nextDrawableId++;
    const drawable = new Drawable(drawableID);
    this._allDrawables[drawableID] = drawable;
    this._addToDrawList(drawableID, group);

    drawable.skin = null;

    return drawableID;
  }

  /**
   * 设置渲染器的图层组顺序.
   * @param {Array<string>} groupOrdering The ordered array of layer group
   * names
   */
  setLayerGroupOrdering(groupOrdering) {
    console.warn("k-r.js RenderWebGL 设置渲染器的图层组顺序");
    this._groupOrdering = groupOrdering;
    for (let i = 0; i < this._groupOrdering.length; i++) {
      this._layerGroups[this._groupOrdering[i]] = {
        groupIndex: i,
        drawListOffset: 0,
      };
    }
  }

  _addToDrawList(drawableID, group) {
    console.warn("k-r.js RenderWebGL _addToDrawList");
    const currentLayerGroup = this._layerGroups[group];
    const currentGroupOrderingIndex = currentLayerGroup.groupIndex;

    const drawListOffset = this._endIndexForKnownLayerGroup(currentLayerGroup);
    this._drawList.splice(drawListOffset, 0, drawableID);

    this._updateOffsets("add", currentGroupOrderingIndex);
  }

  _updateOffsets(updateType, currentGroupOrderingIndex) {
    console.warn("k-r.js RenderWebGL _updateOffsets");
    for (
      let i = currentGroupOrderingIndex + 1;
      i < this._groupOrdering.length;
      i++
    ) {
      const laterGroupName = this._groupOrdering[i];
      if (updateType === "add") {
        this._layerGroups[laterGroupName].drawListOffset++;
      } else if (updateType === "delete") {
        this._layerGroups[laterGroupName].drawListOffset--;
      }
    }
  }

  get _visibleDrawList() {
    console.warn("k-r.js RenderWebGL _visibleDrawList");
    return this._drawList.filter((id) => this._allDrawables[id]._visible);
  }

  // 给定一个图层组，返回其结束处的索引,
  // e.g. the returned index does not have a drawable from this layer group in it)
  _endIndexForKnownLayerGroup(layerGroup) {
    console.warn("k-r.js RenderWebGL 给定一个图层组，返回其结束处的索引");
    const groupIndex = layerGroup.groupIndex;
    if (groupIndex === this._groupOrdering.length - 1) {
      return this._drawList.length;
    }
    return this._layerGroups[this._groupOrdering[groupIndex + 1]]
      .drawListOffset;
  }

  /**
   * 销毁Drawable，将其从场景中移除.
   * @param {int} drawableID The ID of the Drawable to remove.
   * @param {string} group Group name that the drawable belongs to
   */
  destroyDrawable(drawableID, group) {
    console.warn("k-r.js RenderWebGL 销毁Drawable，将其从场景中移除");
    if (!group || !this._layerGroups.hasOwnProperty(group)) {
      console.warn("没有已知图层组就无法销毁可绘制对象.");
      return;
    }
    const drawable = this._allDrawables[drawableID];
    drawable.dispose();
    delete this._allDrawables[drawableID];

    const currentLayerGroup = this._layerGroups[group];
    const endIndex = this._endIndexForKnownLayerGroup(currentLayerGroup);

    let index = currentLayerGroup.drawListOffset;
    while (index < endIndex) {
      if (this._drawList[index] === drawableID) {
        break;
      }
      index++;
    }
    if (index < endIndex) {
      this._drawList.splice(index, 1);
      this._updateOffsets("delete", currentLayerGroup.groupIndex);
    } else {
      console.warn("无法销毁在图层组中找不到的可绘制对象.");
      return;
    }
  }

  /**
   * 返回给定drawableID在绘制列表中的位置. This is
   * the absolute position irrespective of layer group.
   * @param {number} drawableID The drawable ID to find.
   * @return {number} The postion of the given drawable ID.
   */
  getDrawableOrder(drawableID) {
    console.warn("k-r.js RenderWebGL 返回给定drawableID在绘制列表中的位置");
    return this._drawList.indexOf(drawableID);
  }

  /**
   * 在可绘制列表中设置可绘制的顺序（有效地是z / layer）.
   * Can be used to move drawables to absolute positions in the list,
   * or relative to their current positions.
   * "go back N layers": setDrawableOrder(id, -N, true, 1); (assuming stage at 0).
   * "go to back": setDrawableOrder(id, 1); (assuming stage at 0).
   * "go to front": setDrawableOrder(id, Infinity);
   * @param {int} drawableID ID of Drawable to reorder.
   * @param {number} order New absolute order or relative order adjusment.
   * @param {string=} group Name of layer group drawable belongs to.
   * Reordering will not take place if drawable cannot be found within the bounds
   * of the layer group.
   * @param {boolean=} optIsRelative If set, `order` refers to a relative change.
   * @param {number=} optMin If set, order constrained to be at least `optMin`.
   * @return {?number} New order if changed, or null.
   */
  setDrawableOrder(drawableID, order, group, optIsRelative, optMin) {
    console.warn(
      "k-r.js RenderWebGL 在可绘制列表中设置可绘制的顺序（有效地是z / layer）"
    );
    if (!group || !this._layerGroups.hasOwnProperty(group)) {
      console.warn("没有已知图层组就无法设置可绘制对象的顺序.");
      return;
    }

    const currentLayerGroup = this._layerGroups[group];
    const startIndex = currentLayerGroup.drawListOffset;
    const endIndex = this._endIndexForKnownLayerGroup(currentLayerGroup);

    let oldIndex = startIndex;
    while (oldIndex < endIndex) {
      if (this._drawList[oldIndex] === drawableID) {
        break;
      }
      oldIndex++;
    }

    if (oldIndex < endIndex) {
      // Remove drawable from the list.
      if (order === 0) {
        return oldIndex;
      }

      const _ = this._drawList.splice(oldIndex, 1)[0];
      // Determine new index.
      let newIndex = order;
      if (optIsRelative) {
        newIndex += oldIndex;
      }

      const possibleMin = (optMin || 0) + startIndex;
      const min =
        possibleMin >= startIndex && possibleMin < endIndex
          ? possibleMin
          : startIndex;
      newIndex = Math.max(newIndex, min);

      newIndex = Math.min(newIndex, endIndex);

      // Insert at new index.
      this._drawList.splice(newIndex, 0, drawableID);
      return newIndex;
    }

    return null;
  }

  /**
   * 绘制所有当前的可绘制对象并将框架显示在画布上.
   */
  draw() {
    console.warn(
      "k-r.js RenderWebGL 绘制所有当前的可绘制对象并将框架显示在画布上"
    );
    this._doExitDrawRegion();
    // 获取gl
    const gl = this._gl;

    twgl.bindFramebufferInfo(gl, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor.apply(gl, this._backgroundColor);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 重新绘制
    this._drawThese(
      this._drawList,
      ShaderManager.DRAW_MODE.default,
      this._projection
    );
    // 此处直接走会话缓存的方式，解决预览图黑屏问题
    window.sessionStorage.setItem("imgsrc", gl.canvas.toDataURL());

    if (this._snapshotCallbacks.length > 0) {
      const snapshot = gl.canvas.toDataURL();
      this._snapshotCallbacks.forEach((cb) => cb(snapshot));
      this._snapshotCallbacks = [];
    }
  }

  /**
   * 获取Drawable的精确范围.
   * @param {int} drawableID ID of Drawable to get bounds for.
   * @return {object} Bounds for a tight box around the Drawable.
   */
  getBounds(drawableID) {
    console.warn("k-r.js RenderWebGL 获取Drawable的精确范围");
    const drawable = this._allDrawables[drawableID];
    // 如有必要，将其更新的凸包告知Drawable.
    if (drawable.needsConvexHullPoints()) {
      const points = this._getConvexHullPointsForDrawable(drawableID);
      drawable.setConvexHullPoints(points);
    }
    const bounds = drawable.getFastBounds();
    // In debug mode, draw the bounds.
    if (this._debugCanvas) {
      const gl = this._gl;
      this._debugCanvas.width = gl.canvas.width;
      this._debugCanvas.height = gl.canvas.height;
      const context = this._debugCanvas.getContext("2d");
      context.drawImage(gl.canvas, 0, 0);
      context.strokeStyle = "#FF0000";
      const pr = window.devicePixelRatio;
      context.strokeRect(
        pr * (bounds.left + this._nativeSize[0] / 2),
        pr * (-bounds.top + this._nativeSize[1] / 2),
        pr * (bounds.right - bounds.left),
        pr * (-bounds.bottom + bounds.top)
      );
    }
    return bounds;
  }

  /**
   * 获取顶部切片周围Drawable的精确边界.
   * Used for positioning speech bubbles more closely to the sprite.
   * @param {int} drawableID ID of Drawable to get bubble bounds for.
   * @return {object} Bounds for a tight box around the Drawable top slice.
   */
  getBoundsForBubble(drawableID) {
    console.warn("k-r.js RenderWebGL 获取顶部切片周围Drawable的精确边界");
    const drawable = this._allDrawables[drawableID];
    // 如有必要，将其更新的凸包告知Drawable.
    if (drawable.needsConvexHullPoints()) {
      const points = this._getConvexHullPointsForDrawable(drawableID);
      drawable.setConvexHullPoints(points);
    }
    const bounds = drawable.getBoundsForBubble();
    // In debug mode, draw the bounds.
    if (this._debugCanvas) {
      const gl = this._gl;
      this._debugCanvas.width = gl.canvas.width;
      this._debugCanvas.height = gl.canvas.height;
      const context = this._debugCanvas.getContext("2d");
      context.drawImage(gl.canvas, 0, 0);
      context.strokeStyle = "#FF0000";
      const pr = window.devicePixelRatio;
      context.strokeRect(
        pr * (bounds.left + this._nativeSize[0] / 2),
        pr * (-bounds.top + this._nativeSize[1] / 2),
        pr * (bounds.right - bounds.left),
        pr * (-bounds.bottom + bounds.top)
      );
    }
    return bounds;
  }

  /**
   * 获取Drawable的当前皮肤（服装）大小.
   * @param {int} drawableID The ID of the Drawable to measure.
   * @return {Array<number>} Skin size, width and height.
   */
  getCurrentSkinSize(drawableID) {
    console.warn("k-r.js RenderWebGL 获取Drawable的当前皮肤（服装）大小");
    const drawable = this._allDrawables[drawableID];
    return this.getSkinSize(drawable.skin.id);
  }

  /**
   * 通过ID获取皮肤的大小.
   * @param {int} skinID The ID of the Skin to measure.
   * @return {Array<number>} Skin size, width and height.
   */
  getSkinSize(skinID) {
    console.warn("k-r.js RenderWebGL 通过ID获取皮肤的大小");
    const skin = this._allSkins[skinID];
    return skin.size;
  }

  /**
   * 通过ID获取皮肤的旋转中心.
   * @param {int} skinID The ID of the Skin
   * @return {Array<number>} The rotationCenterX and rotationCenterY
   */
  getSkinRotationCenter(skinID) {
    console.warn("k-r.js RenderWebGL 通过ID获取皮肤的旋转中心");
    const skin = this._allSkins[skinID];
    return skin.calculateRotationCenter();
  }

  /**
   * 检查特定的Drawable是否接触到特定的颜色.
   * Unlike touching drawable, if the "tester" is invisble, we will still test.
   * @param {int} drawableID The ID of the Drawable to check.
   * @param {Array<int>} color3b Test if the Drawable is touching this color.
   * @param {Array<int>} [mask3b] Optionally mask the check to this part of Drawable.
   * @returns {boolean} True iff the Drawable is touching the color.
   */
  isTouchingColor(drawableID, color3b, mask3b) {
    console.warn("k-r.js RenderWebGL 检查特定的Drawable是否接触到特定的颜色");
    const candidates = this._candidatesTouching(
      drawableID,
      this._visibleDrawList
    );
    if (candidates.length === 0) {
      return false;
    }

    const bounds = this._candidatesBounds(candidates);

    const maxPixelsForCPU = this._getMaxPixelsForCPU();

    const debugCanvasContext =
      this._debugCanvas && this._debugCanvas.getContext("2d");
    if (debugCanvasContext) {
      this._debugCanvas.width = bounds.width;
      this._debugCanvas.height = bounds.height;
    }

    // 如果有太多像素无法有效渲染CPU，我们需要让readPixels发生
    if (
      bounds.width * bounds.height * (candidates.length + 1) >=
      maxPixelsForCPU
    ) {
      this._isTouchingColorGpuStart(
        drawableID,
        candidates.map(({ id }) => id).reverse(),
        bounds,
        color3b,
        mask3b
      );
    }

    const drawable = this._allDrawables[drawableID];
    const point = __isTouchingDrawablesPoint;
    const color = __touchingColor;
    const hasMask = Boolean(mask3b);

    // Masked drawable ignores ghost effect
    const effectMask = ~ShaderManager.EFFECT_INFO.ghost.mask;

    // Scratch Space - +y is top
    for (let y = bounds.bottom; y <= bounds.top; y++) {
      if (
        bounds.width * (y - bounds.bottom) * (candidates.length + 1) >=
        maxPixelsForCPU
      ) {
        return this._isTouchingColorGpuFin(bounds, color3b, y - bounds.bottom);
      }
      for (let x = bounds.left; x <= bounds.right; x++) {
        point[1] = y;
        point[0] = x;
        // if we use a mask, check our sample color...
        if (
          hasMask
            ? maskMatches(
                Drawable.sampleColor4b(point, drawable, color, effectMask),
                mask3b
              )
            : drawable.isTouching(point)
        ) {
          RenderWebGL.sampleColor3b(point, candidates, color);
          if (debugCanvasContext) {
            debugCanvasContext.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
            debugCanvasContext.fillRect(
              x - bounds.left,
              bounds.bottom - y,
              1,
              1
            );
          }
          // ...and the target color is drawn at this pixel
          if (colorMatches(color, color3b, 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  _getMaxPixelsForCPU() {
    console.warn("k-r.js RenderWebGL _getMaxPixelsForCPU");
    switch (this._useGpuMode) {
      case RenderWebGL.UseGpuModes.ForceCPU:
        return Infinity;
      case RenderWebGL.UseGpuModes.ForceGPU:
        return 0;
      case RenderWebGL.UseGpuModes.Automatic:
      default:
        return __cpuTouchingColorPixelCount;
    }
  }

  _isTouchingColorGpuStart(drawableID, candidateIDs, bounds, color3b, mask3b) {
    console.warn("k-r.js RenderWebGL _isTouchingColorGpuStart");
    this._doExitDrawRegion();

    const gl = this._gl;
    twgl.bindFramebufferInfo(gl, this._queryBufferInfo);

    // Limit size of viewport to the bounds around the target Drawable,
    // and create the projection matrix for the draw.
    gl.viewport(0, 0, bounds.width, bounds.height);
    const projection = twgl.m4.ortho(
      bounds.left,
      bounds.right,
      bounds.top,
      bounds.bottom,
      -1,
      1
    );

    let fillBackgroundColor = this._backgroundColor;

    // When using masking such that the background fill color will showing through, ensure we don't
    // fill using the same color that we are trying to detect!
    if (color3b[0] > 196 && color3b[1] > 196 && color3b[2] > 196) {
      fillBackgroundColor = [0, 0, 0, 255];
    }

    gl.clearColor.apply(gl, fillBackgroundColor);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    let extraUniforms;
    if (mask3b) {
      extraUniforms = {
        u_colorMask: [mask3b[0] / 255, mask3b[1] / 255, mask3b[2] / 255],
        u_colorMaskTolerance: MASK_TOUCHING_COLOR_TOLERANCE / 255,
      };
    }

    try {
      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.ALWAYS, 1, 1);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
      gl.colorMask(false, false, false, false);
      this._drawThese(
        [drawableID],
        mask3b
          ? ShaderManager.DRAW_MODE.colorMask
          : ShaderManager.DRAW_MODE.silhouette,
        projection,
        {
          extraUniforms,
          ignoreVisibility: true, // Touching color ignores sprite visibility,
          effectMask: ~ShaderManager.EFFECT_INFO.ghost.mask,
        }
      );

      gl.stencilFunc(gl.EQUAL, 1, 1);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      gl.colorMask(true, true, true, true);

      this._drawThese(
        candidateIDs,
        ShaderManager.DRAW_MODE.default,
        projection,
        {
          idFilterFunc: (testID) => testID !== drawableID,
        }
      );
    } finally {
      gl.colorMask(true, true, true, true);
      gl.disable(gl.STENCIL_TEST);
    }
  }

  _isTouchingColorGpuFin(bounds, color3b, stop) {
    console.warn("k-r.js RenderWebGL _isTouchingColorGpuFin");
    const gl = this._gl;
    const pixels = new Uint8Array(
      Math.floor(bounds.width * (bounds.height - stop) * 4)
    );
    gl.readPixels(
      0,
      0,
      bounds.width,
      bounds.height - stop,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );

    if (this._debugCanvas) {
      this._debugCanvas.width = bounds.width;
      this._debugCanvas.height = bounds.height;
      const context = this._debugCanvas.getContext("2d");
      const imageData = context.getImageData(
        0,
        0,
        bounds.width,
        bounds.height - stop
      );
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);
    }

    for (let pixelBase = 0; pixelBase < pixels.length; pixelBase += 4) {
      if (colorMatches(color3b, pixels, pixelBase)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查特定的Drawable是否碰到一组Drawable中的任何一个.
   * @param {int} drawableID The ID of the Drawable to check.
   * @param {?Array<int>} candidateIDs The Drawable IDs to check, otherwise all visible drawables in the renderer
   * @returns {boolean} True if the Drawable is touching one of candidateIDs.
   */
  isTouchingDrawables(drawableID, candidateIDs = this._drawList) {
    console.warn(
      "k-r.js RenderWebGL 检查特定的Drawable是否碰到一组Drawable中的任何一个"
    );
    const candidates = this._candidatesTouching(
      drawableID,
      // even if passed an invisible drawable, we will NEVER touch it!
      candidateIDs.filter((id) => this._allDrawables[id]._visible)
    );
    // if we are invisble we don't touch anything.
    if (candidates.length === 0 || !this._allDrawables[drawableID]._visible) {
      return false;
    }

    // Get the union of all the candidates intersections.
    const bounds = this._candidatesBounds(candidates);

    const drawable = this._allDrawables[drawableID];
    const point = __isTouchingDrawablesPoint;

    // This is an EXTREMELY brute force collision detector, but it is
    // still faster than asking the GPU to give us the pixels.
    for (let x = bounds.left; x <= bounds.right; x++) {
      // Scratch Space - +y is top
      point[0] = x;
      for (let y = bounds.bottom; y <= bounds.top; y++) {
        point[1] = y;
        if (drawable.isTouching(point)) {
          for (let index = 0; index < candidates.length; index++) {
            if (candidates[index].drawable.isTouching(point)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * 将基于客户端的x / y位置在画布上转换为3世界空间矩形.  This creates recangles with a radius to cover selecting multiple
   * scratch pixels with touch / small render areas.
   *
   * @param {int} centerX The client x coordinate of the picking location.
   * @param {int} centerY The client y coordinate of the picking location.
   * @param {int} [width] The client width of the touch event (optional).
   * @param {int} [height] The client width of the touch event (optional).
   * @returns {Rectangle} Scratch world space rectangle, iterate bottom <= top,
   *                      left <= right.
   */
  clientSpaceToScratchBounds(centerX, centerY, width = 1, height = 1) {
    console.warn(
      "k-r.js RenderWebGL 将基于客户端的x / y位置在画布上转换为3世界空间矩形"
    );
    const gl = this._gl;

    const clientToScratchX = this._nativeSize[0] / gl.canvas.clientWidth;
    const clientToScratchY = this._nativeSize[1] / gl.canvas.clientHeight;

    width *= clientToScratchX;
    height *= clientToScratchY;

    width = Math.max(1, Math.min(Math.round(width), MAX_TOUCH_SIZE[0]));
    height = Math.max(1, Math.min(Math.round(height), MAX_TOUCH_SIZE[1]));
    const x = centerX * clientToScratchX - (width - 1) / 2;
    // + because scratch y is inverted
    const y = centerY * clientToScratchY + (height - 1) / 2;

    const xOfs = width % 2 ? 0 : -0.5;
    // y is offset +0.5
    const yOfs = height % 2 ? 0 : -0.5;

    const bounds = new Rectangle();
    bounds.initFromBounds(
      Math.floor(this._xLeft + x + xOfs),
      Math.floor(this._xLeft + x + xOfs + width - 1),
      Math.ceil(this._yTop - y + yOfs),
      Math.ceil(this._yTop - y + yOfs + height - 1)
    );
    return bounds;
  }

  /**
   * 确定可绘制对象是否正在触摸基于客户端的x / y。 用于感测触摸鼠标指针的辅助方法。 忽略可见性.
   *
   * @param {int} drawableID The ID of the drawable to check.
   * @param {int} centerX The client x coordinate of the picking location.
   * @param {int} centerY The client y coordinate of the picking location.
   * @param {int} [touchWidth] The client width of the touch event (optional).
   * @param {int} [touchHeight] The client height of the touch event (optional).
   * @returns {boolean} If the drawable has any pixels that would draw in the touch area
   */
  drawableTouching(drawableID, centerX, centerY, touchWidth, touchHeight) {
    console.warn(
      "k-r.js RenderWebGL 确定可绘制对象是否正在触摸基于客户端的x/y"
    );
    const drawable = this._allDrawables[drawableID];
    if (!drawable) {
      return false;
    }
    const bounds = this.clientSpaceToScratchBounds(
      centerX,
      centerY,
      touchWidth,
      touchHeight
    );
    const worldPos = twgl.v3.create();

    drawable.updateCPURenderAttributes();

    for (
      worldPos[1] = bounds.bottom;
      worldPos[1] <= bounds.top;
      worldPos[1]++
    ) {
      for (
        worldPos[0] = bounds.left;
        worldPos[0] <= bounds.right;
        worldPos[0]++
      ) {
        if (drawable.isTouching(worldPos)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 检测哪个精灵（如果有）在给定位置.
   * This function will pick all drawables that are visible, unless specific
   * candidate drawable IDs are provided.  Used for determining what is clicked
   * or dragged.  Will not select hidden / ghosted sprites.
   *
   * @param {int} centerX The client x coordinate of the picking location.
   * @param {int} centerY The client y coordinate of the picking location.
   * @param {int} [touchWidth] The client width of the touch event (optional).
   * @param {int} [touchHeight] The client height of the touch event (optional).
   * @param {Array<int>} [candidateIDs] The Drawable IDs to pick from, otherwise all visible drawables.
   * @returns {int} The ID of the topmost Drawable under the picking location, or
   * RenderConstants.ID_NONE if there is no Drawable at that location.
   */
  pick(centerX, centerY, touchWidth, touchHeight, candidateIDs) {
    console.warn("k-r.js RenderWebGL 检测哪个精灵（如果有）在给定位置");
    const bounds = this.clientSpaceToScratchBounds(
      centerX,
      centerY,
      touchWidth,
      touchHeight
    );
    if (bounds.left === -Infinity || bounds.bottom === -Infinity) {
      return false;
    }

    candidateIDs = (candidateIDs || this._drawList).filter((id) => {
      const drawable = this._allDrawables[id];
      // default pick list ignores visible and ghosted sprites.
      if (drawable.getVisible() && drawable.getUniforms().u_ghost !== 0) {
        const drawableBounds = drawable.getFastBounds();
        const inRange = bounds.intersects(drawableBounds);
        if (!inRange) return false;

        drawable.updateCPURenderAttributes();
        return true;
      }
      return false;
    });
    if (candidateIDs.length === 0) {
      return false;
    }

    const hits = [];
    const worldPos = twgl.v3.create(0, 0, 0);
    // Iterate over the scratch pixels and check if any candidate can be
    // touched at that point.
    for (
      worldPos[1] = bounds.bottom;
      worldPos[1] <= bounds.top;
      worldPos[1]++
    ) {
      for (
        worldPos[0] = bounds.left;
        worldPos[0] <= bounds.right;
        worldPos[0]++
      ) {
        // Check candidates in the reverse order they would have been
        // drawn. This will determine what candiate's silhouette pixel
        // would have been drawn at the point.
        for (let d = candidateIDs.length - 1; d >= 0; d--) {
          const id = candidateIDs[d];
          const drawable = this._allDrawables[id];
          if (drawable.isTouching(worldPos)) {
            hits[id] = (hits[id] || 0) + 1;
            break;
          }
        }
      }
    }

    // Bias toward selecting anything over nothing
    hits[ID_NONE] = 0;

    let hit = ID_NONE;
    for (const hitID in hits) {
      if (hits.hasOwnProperty(hitID) && hits[hitID] > hits[hit]) {
        hit = hitID;
      }
    }

    return Number(hit);
  }

  /**
   * 返回可绘制像素数据和相对于可绘制边界的拾取坐标
   * @param {int} drawableID 用于获取像素数据的drawable的ID
   * @param {int} x clientX 坐标的选择点
   * @param {int} y clientY 坐标的选择点.
   * @return {?DrawableExtraction} Data about the picked drawable
   */
  extractDrawable(drawableID, x, y) {
    console.warn(
      "k-r.js RenderWebGL 返回可绘制像素数据和相对于可绘制边界的拾取坐标"
    );
    this._doExitDrawRegion();

    const drawable = this._allDrawables[drawableID];
    if (!drawable) return null;

    // 将客户坐标转换为绝对临时单位
    const scratchX =
      this._nativeSize[0] * (x / this._gl.canvas.clientWidth - 0.5);
    const scratchY =
      this._nativeSize[1] * (y / this._gl.canvas.clientHeight - 0.5);

    const gl = this._gl;

    const bounds = drawable.getFastBounds();
    bounds.snapToInt();

    // 为bufferInfo边界设置合理的最大限制宽度和高度
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const clampedWidth = Math.min(2048, bounds.width, maxTextureSize);
    const clampedHeight = Math.min(2048, bounds.height, maxTextureSize);

    // 制作一个新的bufferInfo，因为this._queryBufferInfo限制为480x360
    const attachments = [{ format: gl.RGBA }, { format: gl.DEPTH_STENCIL }];
    const bufferInfo = twgl.createFramebufferInfo(
      gl,
      attachments,
      clampedWidth,
      clampedHeight
    );

    try {
      // If the new bufferInfo is invalid, fall back to using the smaller _queryBufferInfo
      twgl.bindFramebufferInfo(gl, bufferInfo);
      if (
        gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE
      ) {
        twgl.bindFramebufferInfo(gl, this._queryBufferInfo);
      }

      // Translate to scratch units relative to the drawable
      const pickX = scratchX - bounds.left;
      const pickY = scratchY + bounds.top;

      // Limit size of viewport to the bounds around the target Drawable,
      // and create the projection matrix for the draw.
      gl.viewport(0, 0, bounds.width, bounds.height);
      const projection = twgl.m4.ortho(
        bounds.left,
        bounds.right,
        bounds.top,
        bounds.bottom,
        -1,
        1
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      try {
        gl.disable(gl.BLEND);
        // ImageData objects store alpha un-premultiplied, so draw with the `straightAlpha` draw mode.
        this._drawThese(
          [drawableID],
          ShaderManager.DRAW_MODE.straightAlpha,
          projection,
          {
            effectMask: ~ShaderManager.EFFECT_INFO.ghost.mask,
          }
        );
      } finally {
        gl.enable(gl.BLEND);
      }

      const data = new Uint8Array(Math.floor(bounds.width * bounds.height * 4));
      gl.readPixels(
        0,
        0,
        bounds.width,
        bounds.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );

      if (this._debugCanvas) {
        this._debugCanvas.width = bounds.width;
        this._debugCanvas.height = bounds.height;
        const ctx = this._debugCanvas.getContext("2d");
        const imageData = ctx.createImageData(bounds.width, bounds.height);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);
        ctx.beginPath();
        ctx.arc(pickX, pickY, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
      }

      /**
       * @typedef DrawableExtraction
       * @property {Uint8Array} data 可绘制的原始像素数据
       * @property {int} width 可绘制的边框宽度
       * @property {int} height 可绘制的边框高度
       * @property {Array<number>} kidOffset [x，y]临时坐标中的偏移量
       * [x，y]从可绘制位置到客户端x，y坐标的坐标偏移
       * @property {int} x 相对于可绘制边界框的x坐标
       * @property {int} y 相对于可绘制边界框的y坐标
       */
      return {
        data: data,
        width: bounds.width,
        height: bounds.height,
        kidOffset: [
          -scratchX + drawable._position[0],
          -scratchY - drawable._position[1],
        ],
        x: pickX,
        y: pickY,
      };
    } finally {
      gl.deleteFramebuffer(bufferInfo.framebuffer);
    }
  }

  /**
   * 返回给定位置的可绘制像素数据和颜色
   * @param {int} x The client x coordinate of the picking location.
   * @param {int} y The client y coordinate of the picking location.
   * @param {int} radius The client radius to extract pixels with.
   * @return {?ColorExtraction} Data about the picked color
   */
  extractColor(x, y, radius) {
    console.warn("k-r.js RenderWebGL 返回给定位置的可绘制像素数据和颜色");
    this._doExitDrawRegion();

    const scratchX = Math.round(
      this._nativeSize[0] * (x / this._gl.canvas.clientWidth - 0.5)
    );
    const scratchY = Math.round(
      -this._nativeSize[1] * (y / this._gl.canvas.clientHeight - 0.5)
    );

    const gl = this._gl;
    twgl.bindFramebufferInfo(gl, this._queryBufferInfo);

    const bounds = new Rectangle();
    bounds.initFromBounds(
      scratchX - radius,
      scratchX + radius,
      scratchY - radius,
      scratchY + radius
    );

    const pickX = scratchX - bounds.left;
    const pickY = bounds.top - scratchY;

    gl.viewport(0, 0, bounds.width, bounds.height);
    const projection = twgl.m4.ortho(
      bounds.left,
      bounds.right,
      bounds.top,
      bounds.bottom,
      -1,
      1
    );

    gl.clearColor.apply(gl, this._backgroundColor);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this._drawThese(
      this._drawList,
      ShaderManager.DRAW_MODE.default,
      projection
    );

    const data = new Uint8Array(Math.floor(bounds.width * bounds.height * 4));
    gl.readPixels(
      0,
      0,
      bounds.width,
      bounds.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
    );

    const pixelBase = Math.floor(4 * (pickY * bounds.width + pickX));
    const color = {
      r: data[pixelBase],
      g: data[pixelBase + 1],
      b: data[pixelBase + 2],
      a: data[pixelBase + 3],
    };

    if (this._debugCanvas) {
      this._debugCanvas.width = bounds.width;
      this._debugCanvas.height = bounds.height;
      const ctx = this._debugCanvas.getContext("2d");
      const imageData = ctx.createImageData(bounds.width, bounds.height);
      imageData.data.set(data);
      ctx.putImageData(imageData, 0, 0);
      ctx.strokeStyle = "black";
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      ctx.rect(pickX - 4, pickY - 4, 8, 8);
      ctx.fill();
      ctx.stroke();
    }

    /**
     * @typedef ColorExtraction
     * @property {Uint8Array} data Raw pixel data for the drawable
     * @property {int} width Drawable bounding box width
     * @property {int} height Drawable bounding box height
     * @property {object} color Color object with RGBA properties at picked location
     */
    return {
      data: data,
      width: bounds.width,
      height: bounds.height,
      color: color,
    };
  }

  /**
   * 获取触摸查询的候选边界框.
   * @param {int} drawableID ID for drawable of query.
   * @return {?Rectangle} Rectangle bounds for touching query, or null.
   */
  _touchingBounds(drawableID) {
    console.warn("k-r.js RenderWebGL 获取触摸查询的候选边界框");
    const drawable = this._allDrawables[drawableID];

    /** @todo remove this once URL-based skin setting is removed. */
    if (!drawable.skin || !drawable.skin.getTexture([100, 100])) return null;

    drawable.updateCPURenderAttributes();
    const bounds = drawable.getFastBounds();

    // Limit queries to the stage size.
    bounds.clamp(this._xLeft, this._xRight, this._yBottom, this._yTop);

    // Use integer coordinates for queries - weird things happen
    // when you provide float width/heights to gl.viewport and projection.
    bounds.snapToInt();

    if (bounds.width === 0 || bounds.height === 0) {
      // No space to query.
      return null;
    }
    return bounds;
  }

  /**
   * 将接触式查询的候选列表过滤为仅可能与给定范围相交的候选列表.
   * @param {int} drawableID - ID for drawable of query.
   * @param {Array<int>} candidateIDs - Candidates for touching query.
   * @return {?Array< {id, drawable, intersection} >} Filtered candidates with useful data.
   */
  _candidatesTouching(drawableID, candidateIDs) {
    console.warn(
      "k-r.js RenderWebGL 将接触式查询的候选列表过滤为仅可能与给定范围相交的候选列表"
    );
    const bounds = this._touchingBounds(drawableID);
    const result = [];
    if (bounds === null) {
      return result;
    }
    // iterate through the drawables list BACKWARDS - we want the top most item to be the first we check
    for (let index = candidateIDs.length - 1; index >= 0; index--) {
      const id = candidateIDs[index];
      if (id !== drawableID) {
        const drawable = this._allDrawables[id];
        if (drawable.skin && drawable._visible) {
          // Update the CPU position data
          drawable.updateCPURenderAttributes();
          const candidateBounds = drawable.getFastBounds();
          if (bounds.intersects(candidateBounds)) {
            result.push({
              id,
              drawable,
              intersection: Rectangle.intersect(bounds, candidateBounds),
            });
          }
        }
      }
    }
    return result;
  }

  /**
   * 助手从上述方法返回的一组候选中获得联合边界
   * @private
   * @param {Array<object>} candidates info from _candidatesTouching
   * @return {Rectangle} 外边界框联合
   */
  _candidatesBounds(candidates) {
    console.warn(
      "k-r.js RenderWebGL 助手从上述方法返回的一组候选人中获得联合边界"
    );
    return candidates.reduce((memo, { intersection }) => {
      if (!memo) return intersection;

      // 将两个矩形的并集存储在我们的静态矩形实例中
      return Rectangle.union(memo, intersection, __candidatesBounds);
    }, null);
  }

  /**
   * 更新绘图对象的皮肤.
   * @param {number} drawableID The drawable's id.
   * @param {number} skinId The skin to update to.
   */
  updateDrawableSkinId(drawableID, skinId) {
    console.warn("k-r.js RenderWebGL 更新绘图对象的皮肤");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.skin = this._allSkins[skinId];
  }

  /**
   * 更新绘图的位置.
   * @param {number} drawableID The drawable's id.
   * @param {Array.<number>} position The new position.
   */
  updateDrawablePosition(drawableID, position) {
    console.warn("k-r.js RenderWebGL 更新绘图的位置");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.updatePosition(position);
  }

  /**
   * 更新绘图的方向.
   * @param {number} drawableID The drawable's id.
   * @param {number} direction A new direction.
   */
  updateDrawableDirection(drawableID, direction) {
    console.warn("k-r.js RenderWebGL 更新绘图的方向");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.updateDirection(direction);
  }

  /**
   * 更新绘图的比例.
   * @param {number} drawableID The drawable's id.
   * @param {Array.<number>} scale A new scale.
   */
  updateDrawableScale(drawableID, scale) {
    console.warn("k-r.js RenderWebGL 更新绘图的比例");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.updateScale(scale);
  }

  /**
   * 更新绘图的方向并一起缩放.
   * @param {number} drawableID The drawable's id.
   * @param {number} direction A new direction.
   * @param {Array.<number>} scale A new scale.
   */
  updateDrawableDirectionScale(drawableID, direction, scale) {
    console.warn("k-r.js RenderWebGL 更新绘图的方向并一起缩放");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.updateDirection(direction);
    drawable.updateScale(scale);
  }

  /**
   * 更新绘图的可见性.
   * @param {number} drawableID The drawable's id.
   * @param {boolean} visible Will the drawable be visible?
   */
  updateDrawableVisible(drawableID, visible) {
    console.warn("k-r.js RenderWebGL 更新绘图的可见性");
    const drawable = this._allDrawables[drawableID];
    // TODO: https://github.com/LLK/scratch-vm/issues/2288
    if (!drawable) return;
    drawable.updateVisible(visible);
  }

  /**
   * 更新绘图的视觉效果.
   * @param {number} drawableID The drawable's id.
   * @param {string} effectName The effect to change.
   * @param {number} value A new effect value.
   */
  updateDrawableEffect(drawableID, effectName, value) {
    console.warn("k-r.js RenderWebGL 更新绘图的视觉效果");
    const drawable = this._allDrawables[drawableID];
    if (!drawable) return;
    drawable.updateEffect(effectName, value);
  }

  /**
   * 更新此Drawable的位置，方向，比例或效果属性.
   * @deprecated Use specific updateDrawable* methods instead.
   * @param {int} drawableID The ID of the Drawable to update.
   * @param {object.<string,*>} properties The new property values to set.
   */
  updateDrawableProperties(drawableID, properties) {
    console.warn(
      "k-r.js RenderWebGL 更新此Drawable的位置，方向，比例或效果属性"
    );
    const drawable = this._allDrawables[drawableID];
    if (!drawable) return;

    if ("skinId" in properties)
      this.updateDrawableSkinId(drawableID, properties.skinId);

    drawable.updateProperties(properties);
  }

  /**
   * 更新位置对象的x和y成员以使可绘制的栅栏保持可见.
   * @param {int} drawableID - The ID of the Drawable to update.
   * @param {Array.<number, number>} position to be fenced - An array of type [x, y]
   * @return {Array.<number, number>} The fenced position as an array [x, y]
   */
  getFencedPositionOfDrawable(drawableID, position) {
    console.warn(
      "k-r.js RenderWebGL 更新位置对象的x和y成员以使可绘制的栅栏保持可见"
    );
    let x = position[0];
    let y = position[1];

    const drawable = this._allDrawables[drawableID];
    // 现在，在某些项目上经常发生这种情况，因此此处的警告或异常可能会挂起浏览器.
    if (!drawable) return [x, y];

    const dx = x - drawable._position[0];
    const dy = y - drawable._position[1];
    const aabb = drawable._skin.getFenceBounds(drawable, __fenceBounds);
    const inset = Math.floor(Math.min(aabb.width, aabb.height) / 2);

    const sx = this._xRight - Math.min(FENCE_WIDTH, inset);
    if (aabb.right + dx < -sx) {
      x = Math.ceil(drawable._position[0] - (sx + aabb.right));
    } else if (aabb.left + dx > sx) {
      x = Math.floor(drawable._position[0] + (sx - aabb.left));
    }
    const sy = this._yTop - Math.min(FENCE_WIDTH, inset);
    if (aabb.top + dy < -sy) {
      y = Math.ceil(drawable._position[1] - (sy + aabb.top));
    } else if (aabb.bottom + dy > sy) {
      y = Math.floor(drawable._position[1] + (sy - aabb.bottom));
    }
    return [x, y];
  }

  /**
   * Clear a pen layer.
   * @param {int} penSkinID - the unique ID of a Pen Skin.
   */
  penClear(penSkinID) {
    console.warn("k-r.js RenderWebGL 清除笔层");
    const skin = /** @type {PenSkin} */ this._allSkins[penSkinID];
    skin.clear();
  }

  /**
   * 在笔层上绘制一个点.
   * @param {int} penSkinID - the unique ID of a Pen Skin.
   * @param {PenAttributes} penAttributes - how the point should be drawn.
   * @param {number} x - the X coordinate of the point to draw.
   * @param {number} y - the Y coordinate of the point to draw.
   */
  penPoint(penSkinID, penAttributes, x, y) {
    console.warn("k-r.js RenderWebGL 在笔层上绘制一个点");
    const skin = /** @type {PenSkin} */ this._allSkins[penSkinID];
    skin.drawPoint(penAttributes, x, y);
  }

  /**
   * 在笔层上画一条线.
   * @param {int} penSkinID - the unique ID of a Pen Skin.
   * @param {PenAttributes} penAttributes - how the line should be drawn.
   * @param {number} x0 - the X coordinate of the beginning of the line.
   * @param {number} y0 - the Y coordinate of the beginning of the line.
   * @param {number} x1 - the X coordinate of the end of the line.
   * @param {number} y1 - the Y coordinate of the end of the line.
   */
  penLine(penSkinID, penAttributes, x0, y0, x1, y1) {
    console.warn("k-r.js RenderWebGL 在笔层上画一条线");
    const skin = /** @type {PenSkin} */ this._allSkins[penSkinID];
    skin.drawLine(penAttributes, x0, y0, x1, y1);
  }

  /**
   * 将Drawable标记到笔层上.
   * @param {int} penSkinID - the unique ID of a Pen Skin.
   * @param {int} stampID - the unique ID of the Drawable to use as the stamp.
   */
  penStamp(penSkinID, stampID) {
    console.warn("k-r.js RenderWebGL 将Drawable标记到笔层上");
    const stampDrawable = this._allDrawables[stampID];
    if (!stampDrawable) {
      return;
    }

    const bounds = this._touchingBounds(stampID);
    if (!bounds) {
      return;
    }

    this._doExitDrawRegion();

    const skin = /** @type {PenSkin} */ this._allSkins[penSkinID];

    const gl = this._gl;
    twgl.bindFramebufferInfo(gl, skin._framebuffer);

    // Limit size of viewport to the bounds around the stamp Drawable and create the projection matrix for the draw.
    gl.viewport(
      this._nativeSize[0] * 0.5 + bounds.left,
      this._nativeSize[1] * 0.5 - bounds.top,
      bounds.width,
      bounds.height
    );
    const projection = twgl.m4.ortho(
      bounds.left,
      bounds.right,
      bounds.top,
      bounds.bottom,
      -1,
      1
    );

    // Draw the stamped sprite onto the PenSkin's framebuffer.
    this._drawThese([stampID], ShaderManager.DRAW_MODE.default, projection, {
      ignoreVisibility: true,
    });
    skin._silhouetteDirty = true;
  }

  /* ******
   * 真正的内部功能：这些功能支持上述功能.
   ********/

  /**
   * 构建几何体（顶点和索引）缓冲区.
   * @private
   */
  _createGeometry() {
    console.warn("k-r.js RenderWebGL 构建几何体（顶点和索引）缓冲区");
    const quad = {
      a_position: {
        numComponents: 2,
        data: [
          -0.5,
          -0.5,
          0.5,
          -0.5,
          -0.5,
          0.5,
          -0.5,
          0.5,
          0.5,
          -0.5,
          0.5,
          0.5,
        ],
      },
      a_texCoord: {
        numComponents: 2,
        data: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
      },
    };
    this._bufferInfo = twgl.createBufferInfoFromArrays(this._gl, quad);
  }

  /**
   * 响应“原始”渲染尺寸的更改. The native size is used by buffers which are fixed in size
   * regardless of the size of the main render target. This includes the buffers used for queries such as picking and
   * color-touching. The fixed size allows (more) consistent behavior across devices and presentation modes.
   * @param {object} event - The change event.
   * @private
   */
  onNativeSizeChanged(event) {
    console.warn("k-r.js RenderWebGL 响应“原始”渲染尺寸的更改");
    const [width, height] = event.newSize;

    const gl = this._gl;
    const attachments = [{ format: gl.RGBA }, { format: gl.DEPTH_STENCIL }];

    if (!this._pickBufferInfo) {
      this._pickBufferInfo = twgl.createFramebufferInfo(
        gl,
        attachments,
        MAX_TOUCH_SIZE[0],
        MAX_TOUCH_SIZE[1]
      );
    }

    /** @todo should we create this on demand to save memory? */
    // A 480x360 32-bpp buffer is 675 KiB.
    if (this._queryBufferInfo) {
      twgl.resizeFramebufferInfo(
        gl,
        this._queryBufferInfo,
        attachments,
        width,
        height
      );
    } else {
      this._queryBufferInfo = twgl.createFramebufferInfo(
        gl,
        attachments,
        width,
        height
      );
    }
  }

  /**
   * 输入描绘区域.
   *
   * A draw region is where multiple draw operations are performed with the
   * same GL state. WebGL performs poorly when it changes state like blend
   * mode. Marking a collection of state values as a "region" the renderer
   * can skip superfluous extra state calls when it is already in that
   * region. Since one region may be entered from within another a exit
   * handle can also be registered that is called when a new region is about
   * to be entered to restore a common inbetween state.
   *
   * @param {any} regionId - id of the region to enter
   * @param {function} enter - handle to call when first entering a region
   * @param {function} exit - handle to call when leaving a region
   */
  enterDrawRegion(regionId, enter = regionId.enter, exit = regionId.exit) {
    console.warn("k-r.js RenderWebGL 输入描绘区域");
    if (this._regionId !== regionId) {
      this._doExitDrawRegion();
      this._regionId = regionId;
      enter();
      this._exitRegion = exit;
    }
  }

  /**
   * 强制退出当前区域，返回到GL状态之间的公共状态.
   */
  _doExitDrawRegion() {
    console.warn(
      "k-r.js RenderWebGL 强制退出当前区域，返回到GL状态之间的公共状态"
    );
    if (this._exitRegion !== null) {
      this._exitRegion();
    }
    this._exitRegion = null;
    this._regionId = null;
  }

  /**
   * 获取可绘制对象的屏幕空间比例，以可绘制对象“正常”尺寸的百分比表示.
   * @param {Drawable} drawable The drawable whose screen-space scale we're fetching.
   * @returns {Array<number>} The screen-space X and Y dimensions of the drawable's scale, as percentages.
   */
  _getDrawableScreenSpaceScale(drawable) {
    console.warn(
      "k-r.js RenderWebGL 获取可绘制对象的屏幕空间比例，以可绘制对象“正常”尺寸的百分比表示"
    );
    return [
      (drawable.scale[0] * this._gl.canvas.width) / this._nativeSize[0],
      (drawable.scale[1] * this._gl.canvas.height) / this._nativeSize[1],
    ];
  }

  /**
   * 通过可绘制ID绘制一组可绘制对象
   * @param {Array<int>} drawables The Drawable IDs to draw, possibly this._drawList.
   * @param {ShaderManager.DRAW_MODE} drawMode Draw normally, silhouette, etc.
   * @param {module:twgl/m4.Mat4} projection The projection matrix to use.
   * @param {object} [opts] Options for drawing
   * @param {idFilterFunc} opts.filter An optional filter function.
   * @param {object.<string,*>} opts.extraUniforms Extra uniforms for the shaders.
   * @param {int} opts.effectMask Bitmask for effects to allow
   * @param {boolean} opts.ignoreVisibility Draw all, despite visibility (e.g. stamping, touching color)
   * @private
   */
  _drawThese(drawables, drawMode, projection, opts = {}) {
    console.warn("k-r.js RenderWebGL 通过可绘制ID绘制一组可绘制对象");
    const gl = this._gl;
    let currentShader = null;

    const numDrawables = drawables.length;
    for (let drawableIndex = 0; drawableIndex < numDrawables; ++drawableIndex) {
      const drawableID = drawables[drawableIndex];

      // If we have a filter, check whether the ID fails
      if (opts.filter && !opts.filter(drawableID)) continue;

      const drawable = this._allDrawables[drawableID];
      /** @todo check if drawable is inside the viewport before anything else */

      // Hidden drawables (e.g., by a "hide" block) are not drawn unless
      // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
      if (!drawable.getVisible() && !opts.ignoreVisibility) continue;

      // Combine drawable scale with the native vs. backing pixel ratio
      const drawableScale = this._getDrawableScreenSpaceScale(drawable);

      // If the skin or texture isn't ready yet, skip it.
      if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;

      const uniforms = {};

      let effectBits = drawable.enabledEffects;
      effectBits &= opts.hasOwnProperty("effectMask")
        ? opts.effectMask
        : effectBits;
      const newShader = this._shaderManager.getShader(drawMode, effectBits);

      // Manually perform region check. Do not create functions inside a
      // loop.
      if (this._regionId !== newShader) {
        this._doExitDrawRegion();
        this._regionId = newShader;

        currentShader = newShader;
        gl.useProgram(currentShader.program);
        twgl.setBuffersAndAttributes(gl, currentShader, this._bufferInfo);
        Object.assign(uniforms, {
          u_projectionMatrix: projection,
        });
      }

      Object.assign(
        uniforms,
        drawable.skin.getUniforms(drawableScale),
        drawable.getUniforms()
      );

      // Apply extra uniforms after the Drawable's, to allow overwriting.
      if (opts.extraUniforms) {
        Object.assign(uniforms, opts.extraUniforms);
      }

      if (uniforms.u_skin) {
        twgl.setTextureParameters(gl, uniforms.u_skin, {
          minMag: drawable.useNearest(drawableScale) ? gl.NEAREST : gl.LINEAR,
        });
      }

      twgl.setUniforms(currentShader, uniforms);
      twgl.drawBufferInfo(gl, this._bufferInfo, gl.TRIANGLES);
    }

    this._regionId = null;
  }

  /**
   * 获取特定Drawable的凸包点.
   * 为此，请根据可绘制对象的剪影对其进行计算.
   * @param {int} drawableID Drawable ID为以下对象计算凸包.
   * @return {Array<Array<number>>} points Convex hull points, as [[x, y], ...]
   */
  _getConvexHullPointsForDrawable(drawableID) {
    console.warn("k-r.js RenderWebGL 获取特定Drawable的凸包点");
    const drawable = this._allDrawables[drawableID];

    drawable.updateCPURenderAttributes();

    const [width, height] = drawable.skin.size;
    // No points in the hull if invisible or size is 0.
    if (!drawable.getVisible() || width === 0 || height === 0) {
      return [];
    }

    /**
     * Return the determinant of two vectors, the vector from A to B and the vector from A to C.
     *
     * The determinant is useful in this case to know if AC is counter-clockwise from AB.
     * A positive value means that AC is counter-clockwise from AB. A negative value means AC is clockwise from AB.
     *
     * @param {Float32Array} A A 2d vector in space.
     * @param {Float32Array} B A 2d vector in space.
     * @param {Float32Array} C A 2d vector in space.
     * @return {number} Greater than 0 if counter clockwise, less than if clockwise, 0 if all points are on a line.
     */
    const determinant = function (A, B, C) {
      // AB = B - A
      // AC = C - A
      // det (AB BC) = AB0 * AC1 - AB1 * AC0
      return (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    };

    // This algorithm for calculating the convex hull somewhat resembles the monotone chain algorithm.
    // The main difference is that instead of sorting the points by x-coordinate, and y-coordinate in case of ties,
    // it goes through them by y-coordinate in the outer loop and x-coordinate in the inner loop.
    // This gives us "left" and "right" hulls, whereas the monotone chain algorithm gives "top" and "bottom" hulls.
    // Adapted from https://github.com/LLK/scratch-flash/blob/dcbeeb59d44c3be911545dfe54d46a32404f8e69/src/scratch/ScratchCostume.as#L369-L413

    const leftHull = [];
    const rightHull = [];

    // While convex hull algorithms usually push and pop values from the list of hull points,
    // here, we keep indices for the "last" point in each array. Any points past these indices are ignored.
    // This is functionally equivalent to pushing and popping from a "stack" of hull points.
    let leftEndPointIndex = -1;
    let rightEndPointIndex = -1;

    const _pixelPos = twgl.v3.create();
    const _effectPos = twgl.v3.create();

    let currentPoint;

    // *Not* Scratch Space-- +y is bottom
    // Loop over all rows of pixels, starting at the top
    for (let y = 0; y < height; y++) {
      _pixelPos[1] = y / height;

      // We start at the leftmost point, then go rightwards until we hit an opaque pixel
      let x = 0;
      for (; x < width; x++) {
        _pixelPos[0] = x / width;
        EffectTransform.transformPoint(drawable, _pixelPos, _effectPos);
        if (drawable.skin.isTouchingLinear(_effectPos)) {
          currentPoint = [x, y];
          break;
        }
      }

      // If we managed to loop all the way through, there are no opaque pixels on this row. Go to the next one
      if (x >= width) {
        continue;
      }

      // Because leftEndPointIndex is initialized to -1, this is skipped for the first two rows.
      // It runs only when there are enough points in the left hull to make at least one line.
      // If appending the current point to the left hull makes a counter-clockwise turn,
      // we want to append the current point. Otherwise, we decrement the index of the "last" hull point until the
      // current point makes a counter-clockwise turn.
      // This decrementing has the same effect as popping from the point list, but is hopefully faster.
      while (leftEndPointIndex > 0) {
        if (
          determinant(
            leftHull[leftEndPointIndex],
            leftHull[leftEndPointIndex - 1],
            currentPoint
          ) > 0
        ) {
          break;
        } else {
          // leftHull.pop();
          --leftEndPointIndex;
        }
      }

      // This has the same effect as pushing to the point list.
      // This "list head pointer" coding style leaves excess points dangling at the end of the list,
      // but that doesn't matter; we simply won't copy them over to the final hull.

      // leftHull.push(currentPoint);
      leftHull[++leftEndPointIndex] = currentPoint;

      // Now we repeat the process for the right side, looking leftwards for a pixel.
      for (x = width - 1; x >= 0; x--) {
        _pixelPos[0] = x / width;
        EffectTransform.transformPoint(drawable, _pixelPos, _effectPos);
        if (drawable.skin.isTouchingLinear(_effectPos)) {
          currentPoint = [x, y];
          break;
        }
      }

      // Because we're coming at this from the right, it goes clockwise this time.
      while (rightEndPointIndex > 0) {
        if (
          determinant(
            rightHull[rightEndPointIndex],
            rightHull[rightEndPointIndex - 1],
            currentPoint
          ) < 0
        ) {
          break;
        } else {
          --rightEndPointIndex;
        }
      }

      rightHull[++rightEndPointIndex] = currentPoint;
    }

    // Start off "hullPoints" with the left hull points.
    const hullPoints = leftHull;
    // This is where we get rid of those dangling extra points.
    hullPoints.length = leftEndPointIndex + 1;
    // Add points from the right side in reverse order so all points are ordered clockwise.
    for (let j = rightEndPointIndex; j >= 0; --j) {
      hullPoints.push(rightHull[j]);
    }

    // 使用hull.js简化边界点.
    // TODO: Remove this; this algorithm already generates convex hulls.
    return hull(hullPoints, Infinity);
  }

  /**
   * 在给定的暂存空间中从一系列可绘制对象中采样“最终”颜色.
   * Will blend any alpha values with the drawables "below" it.
   * @param {twgl.v3} vec Scratch Vector Space to sample
   * @param {Array<Drawables>} drawables A list of drawables with the "top most"
   *              drawable at index 0
   * @param {Uint8ClampedArray} dst The color3b space to store the answer in.
   * @return {Uint8ClampedArray} The dst vector with everything blended down.
   */
  static sampleColor3b(vec, drawables, dst) {
    console.warn(
      "k-r.js RenderWebGL 在给定的暂存空间中从一系列可绘制对象中采样“最终”颜色"
    );
    dst = dst || new Uint8ClampedArray(3);
    dst.fill(0);
    let blendAlpha = 1;
    for (let index = 0; blendAlpha !== 0 && index < drawables.length; index++) {
      Drawable.sampleColor4b(vec, drawables[index].drawable, __blendColor);
      // Equivalent to gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      dst[0] += __blendColor[0] * blendAlpha;
      dst[1] += __blendColor[1] * blendAlpha;
      dst[2] += __blendColor[2] * blendAlpha;
      blendAlpha *= 1 - __blendColor[3] / 255;
    }
    // Backdrop could be transparent, so we need to go to the "clear color" of the
    // draw scene (white) as a fallback if everything was alpha
    dst[0] += blendAlpha * 255;
    dst[1] += blendAlpha * 255;
    dst[2] += blendAlpha * 255;
    return dst;
  }

  /**
   * @callback RenderWebGL#snapshotCallback
   * @param {string} dataURI Data URI of the snapshot of the renderer
   */

  /**
   * @param {snapshotCallback} callback 在下一帧中使用快照数据调用的函数
   */
  requestSnapshot(callback) {
    console.warn("k-r.js RenderWebGL 在下一帧中使用快照数据调用的函数");
    this._snapshotCallbacks.push(callback);
  }
}

RenderWebGL.prototype.canHazPixels = RenderWebGL.prototype.extractDrawable;

/**
 * Values for setUseGPU()
 * @enum {string}
 */
RenderWebGL.UseGpuModes = {
  /** 试探性地决定使用GPU路径，CPU路径还是两者的动态混合. */
  Automatic: "Automatic",

  /** 始终使用GPU路径. */
  ForceGPU: "ForceGPU",

  /** 始终使用CPU路径. */
  ForceCPU: "ForceCPU",
};
