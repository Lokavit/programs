const formatMessage = require("format-message");

/**
 * 检查“ maybeMessage”是否看起来像消息对象，如果是，则将其传递给“ formatMessage”.
 * 否则，按原样返回`maybeMessage`.
 * @param {*} maybeMessage - 可能是消息描述符对象的东西.
 * @param {object} [args] - 如果被调用传递给formatMessage的参数.
 * @param {string} [locale] - 如果被调用，传递给formatMessage的语言环境.
 * @return {string|*} - 格式化的消息或原始的“ maybeMessage”输入.
 */
const maybeFormatMessage = function (maybeMessage, args, locale) {
  if (maybeMessage && maybeMessage.id && maybeMessage.default) {
    return formatMessage(maybeMessage, args, locale);
  }
  return maybeMessage;
};

module.exports = maybeFormatMessage;
