class UserData {
  constructor() {
    this._username = "";
  }

  /**
   * 用于更新用户名的处理程序
   * @param {object} data 数据发布到此ioDevice.
   * @property {!string} username 新的用户名.
   */
  postData(data) {
    this._username = data.username;
  }

  /**
   * 用户名的获取器。 最初为空字符串，直到通过postData设置.
   * @returns {!string} 当前的用户名
   */
  getUsername() {
    return this._username;
  }
}

module.exports = UserData;
