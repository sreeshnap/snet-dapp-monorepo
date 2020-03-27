"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/styles");

var _styles2 = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FunctionText = function FunctionText(_ref) {
  var classes = _ref.classes,
      text = _ref.text;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.functionTextContainer
  }, text);
};

var _default = (0, _styles.withStyles)(_styles2.useStyles)(FunctionText);

exports.default = _default;