const JSZip = require("jszip");

/** 该函数尚未重写 2020.12.20 */
const unzip = function (input, isSprite) {
  console.warn("尚未重写的unzip:", input, isSprite);
  return JSZip.loadAsync(input)
    .then(function (zip) {
      // 在文件列表或子目录中查找json，假定zipfile中只有一个sprite或project json
      const file = isSprite
        ? zip.file(/^([^/]*\/)?sprite\.json$/)[0]
        : zip.file(/^([^/]*\/)?project\.json$/)[0];
      if (file) {
        return file.async("string").then(function (project) {
          return callback(null, [project, zip]);
        });
      }
      return callback(
        "无法解压缩和提取project.json，出现错误: 缺少项目或精灵json"
      );
    })
    .catch(function (err) {
      return callback(
        `无法解压缩和提取project.json，出现错误: ${JSON.stringify(err)}`
      );
    });
};

/**
 * @function 对传入的数据进行解包
 * @param {*} data 传入的数据(项目JSON或元素数据)
 * @param {*} isMaterial 传入当前是否为元素
 */
const unpack = function (data, isMaterial) {
  //   console.warn("重写unpack", data, isMaterial);
  return new Promise((resolve, reject) => {
    // 如果data是字符串类型，将字符串传递到回调函数中
    if (typeof data === "string") return resolve([data, null]);
    // 如果非字符串，再验证是否为buffer类型，不是就将其转为buffer
    if (!Buffer.isBuffer(data)) data = new Buffer(data);
    // 由buffer的某些字节(签名)确定格式
    let signature = data.slice(0, 3).join(" ");
    let isLegacy = false;
    let isZip = false;
    if (signature.indexOf("83 99 114") === 0) isLegacy = true;
    if (signature.indexOf("80 75") === 0) isZip = true;
    if (isLegacy) return reject([null, "解析器只支持2.x及更高版本"]);
    if (!isZip && !isLegacy) return resolve([data.toString("utf-8"), null]);
    if (isZip) {
      console.warn("需要处理压缩包类型,以下是解包函数");
      // 如果是zip，调用解压缩
      unzip(data, isMaterial);
    }
  });
};

/**
 * @function 解析传入的数据
 * @param data 值为项目的JSON对象
 */
const parse = function (data) {
  //   console.warn("重写parse", data);
  return new Promise((resolve, reject) => {
    // 输入是JSON字符串，其中可能包含应删除的控制字符
    try {
      resolve(JSON.parse(data.replace(/\\b|\\u0008/g, "")));
    } catch (e) {
      reject(e.toString());
    }
  });
};

/**
 * @function 校验
 * @param {*} data 传入待校验数据
 */
const validate = function (data) {
  //   console.warn("重写validate", data, isMaterial);
  return new Promise((resolve, reject) => {
    // 此处暂时使用data.meta.semver判断，遇到2代项目，再看具体使用哪个值
    if (data.meta.semver && data.meta.semver.indexOf("2") > -1) {
      data.projectVersion = 2;
      return resolve(data, null);
    }
    if (data.meta.semver && data.meta.semver.indexOf("3") > -1) {
      data.projectVersion = 3;
      return resolve(data, null);
    }
    reject({
      validationError: "无法解析为有效的SB2或SB3项目.",
    });
  });
};

/**
 * 解压，解析，验证和分析Scratch项目。 如果成功，将返回带有附加元数据的有效Scratch项目对象.
 * @param {Buffer | string} data 代表项目的缓冲区或字符串
 * @param {boolean} isMaterial false表示项目数据;true表示单个元素数据
 */
module.exports = function (data, isMaterial) {
  //   console.warn("index.js", data, isMaterial);
  return unpack(data, isMaterial).then((unpackedProject) => {
    console.warn("解包:", unpackedProject);
    return parse(unpackedProject[0]).then((res) =>
      validate(res).then((ress) => ress)
    );
  });
};
