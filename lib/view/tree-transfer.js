'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;
// import { isEqual, cloneDeep } from 'lodash';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hippo = require('@alife/hippo');

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _styled = require('./styled');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeNode = _hippo.Tree.Node;
var obj = _hippo.util.obj;

/**
 * TreeTransfer
 */

var TreeTransfer = (_temp = _class = function (_Component) {
	(0, _inherits3.default)(TreeTransfer, _Component);

	function TreeTransfer(props) {
		(0, _classCallCheck3.default)(this, TreeTransfer);

		var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

		_this.componentWillReceiveProps = function (nextProps) {
			var dataSource = nextProps.dataSource,
			    value = nextProps.value;

			if (!(0, _isEqual2.default)(dataSource, _this.props.dataSource) || !(0, _isEqual2.default)(value, _this.props.value)) {
				_this.setState({
					value: value,
					rightData: _this.getRightData(value, dataSource)
				});
			}
		};

		_this.handleCheck = function (checkedKeys, extra) {
			_this.setState({
				value: checkedKeys,
				rightData: _this.getRightData(checkedKeys)
			});

			_this.props.onChange(checkedKeys, extra);
		};

		_this.getRightData = function (checkedKeys, dataSource) {
			var data = dataSource || _this.props.dataSource;
			var rightData = [];

			if (checkedKeys && checkedKeys.length) {
				data.forEach(function (item) {
					var isCheck = item.children.some(function (child) {
						return checkedKeys.includes(child.value);
					});
					if (isCheck) {
						var checkedData = (0, _cloneDeep2.default)(item);
						checkedData.allCount = item.children.length;
						checkedData.children = item.children.filter(function (child) {
							return checkedKeys.includes(child.value);
						});
						rightData.push(checkedData);
					}
				});
			}

			return rightData;
		};

		_this.handleSearch = function (obj) {
			var dataSource = _this.props.dataSource;

			var searchKey = obj.key;

			if (!searchKey) {
				_this.setState({
					hideKeys: []
				});
				return;
			}

			var hideKeys = [];
			(dataSource || []).forEach(function (item) {
				if (!(0, _stringify2.default)(item.label).includes(searchKey)) {
					var isContains = item.children.some(function (child) {
						return (0, _stringify2.default)(child.label).includes(searchKey);
					});
					if (!isContains) {
						hideKeys.push(item.value);
					}
					var childKeys = item.children.filter(function (child) {
						return !(0, _stringify2.default)(child.label).includes(searchKey);
					}).map(function (item) {
						return item.value;
					});

					hideKeys = hideKeys.concat(childKeys);
				}
			});

			_this.setState({
				hideKeys: hideKeys
			});
		};

		_this.state = {
			value: props.value || [],
			rightData: _this.getRightData(props.value, props.dataSource),
			hideKeys: [],

			dataList: props.dataSource
		};
		return _this;
	}

	TreeTransfer.prototype.handleDeleItem = function handleDeleItem(deleValue) {
		var value = this.state.value;


		var newValue = value.filter(function (item) {
			return item !== deleValue;
		});

		this.setState({
			value: newValue,
			rightData: this.getRightData(newValue)
		});
		this.props.onChange(newValue);
	};

	TreeTransfer.prototype.renderTree = function renderTree() {
		var _state = this.state,
		    hideKeys = _state.hideKeys,
		    value = _state.value;
		var _props = this.props,
		    notFoundContent = _props.notFoundContent,
		    dataSource = _props.dataSource;

		var data = dataSource.filter(function (item) {
			return !hideKeys.includes(item.value);
		});

		if (!(data && data.length)) {
			return _react2.default.createElement(
				'div',
				{ className: 'no-empty-right' },
				notFoundContent
			);
		}

		return _react2.default.createElement(
			_hippo.Tree,
			{
				checkedKeys: value,
				defaultExpandAll: true,
				className: 'transfer-panel-list tree-panel-list',
				checkable: true,
				editable: true,
				autoExpandParent: true,
				onCheck: this.handleCheck,
				enableCheckedCache: false
			},
			this.loopTree(dataSource)
		);
	};

	TreeTransfer.prototype.loopTree = function loopTree(data) {
		var _this2 = this;

		var hideKeys = this.state.hideKeys;

		var tmp = [];
		data.forEach(function (item) {
			var value = item.value,
			    label = item.label,
			    children = item.children,
			    others = (0, _objectWithoutProperties3.default)(item, ['value', 'label', 'children']);

			if (item.children) {
				tmp.push(_react2.default.createElement(
					TreeNode,
					(0, _extends3.default)({
						style: { display: hideKeys.includes(item.value) ? 'none' : '' },
						key: value,
						label: label
					}, others, {
						disabled: item.disabled
					}),
					_this2.loopTree(item.children)
				));
			} else {
				tmp.push(_react2.default.createElement(TreeNode, (0, _extends3.default)({
					style: { display: hideKeys.includes(item.value) ? 'none' : '' },
					key: value,
					label: label
				}, others, {
					disableCheckbox: item.disableCheckbox
				})));
			}
		});
		return tmp;
	};

	TreeTransfer.prototype.renderTreeLeftPanel = function renderTreeLeftPanel() {
		return _react2.default.createElement(
			_styled.LeftPanelWarp,
			null,
			this.renderTree()
		);
	};

	TreeTransfer.prototype.renderTreeRightPanel = function renderTreeRightPanel() {
		var _this3 = this;

		var rightData = this.state.rightData;


		return _react2.default.createElement(
			_styled.RightPanelWarp,
			null,
			_react2.default.createElement(
				_styled.RightPanelUl,
				null,
				rightData.length ? rightData.map(function (item) {
					return _react2.default.createElement(
						_styled.CheckRightList,
						{ className: 'check-right-list-warp', key: item.value },
						_react2.default.createElement(
							'div',
							{ className: 'item-title' },
							item.label,
							_react2.default.createElement(
								'span',
								{ className: 'uncheck' },
								'(\u5DF2\u9009',
								item.children.length,
								'\u6761\uFF0C\u603B\u5171',
								item.allCount,
								'\u6761)'
							)
						),
						item.children.map(function (child) {
							return _react2.default.createElement(
								_styled.ItemCheckRigh,
								{ className: 'item-check-right-li', key: child.value },
								child.label,
								_react2.default.createElement(_hippo.Icon, { type: 'close', className: 'item-close', onClick: _this3.handleDeleItem.bind(_this3, child.value) })
							);
						})
					);
				}) : _react2.default.createElement(
					'div',
					{ className: 'no-empty-right' },
					'\u6682\u65E0\u5339\u914D\u6570\u636E'
				)
			)
		);
	};

	TreeTransfer.prototype.render = function render() {
		var _props2 = this.props,
		    listStyle = _props2.listStyle,
		    extra = _props2.extra,
		    searchPlaceholder = _props2.searchPlaceholder,
		    others = (0, _objectWithoutProperties3.default)(_props2, ['listStyle', 'extra', 'searchPlaceholder']);


		return _react2.default.createElement(
			_styled.TreeTransfergWarp,
			obj.pickOthers(TreeTransfer.propTypes, others),
			_react2.default.createElement(
				_styled.SearchWarp,
				{ style: listStyle, className: 'staffing-search-warp' },
				_react2.default.createElement(_hippo.Search, { className: 'treeTransfer-search', placeholder: searchPlaceholder, onSearch: this.handleSearch }),
				_react2.default.createElement(
					'div',
					{ className: 'treeTransfer-progress' },
					extra
				)
			),
			_react2.default.createElement(
				_styled.TreeWarp,
				null,
				this.renderTreeLeftPanel(),
				this.renderTreeRightPanel()
			)
		);
	};

	return TreeTransfer;
}(_react.Component), _class.propTypes = {
	/**
  * 数据源
  */
	dataSource: _propTypes2.default.array,
	/**
  * （用于非受控）初始值
  * @param {Array} checkedKeys 勾选复选框节点key的数组
  * @param {Object} extra 额外参数
  */
	onChange: _propTypes2.default.func,
	/**
  * 是否禁用
  */
	disabled: _propTypes2.default.bool,
	/**
  * 是否禁止勾选节点复选框
  */
	disableCheckbox: _propTypes2.default.bool,
	/**
  * 是否展开父节点
  */
	autoExpandParent: _propTypes2.default.bool,
	/**
  * （用于受控）当前值
  */
	value: _propTypes2.default.array,
	/**
  * 搜索框占位符
  */
	searchPlaceholder: _propTypes2.default.string,
	/**
  * 自定义样式对象
  */
	listStyle: _propTypes2.default.object,
	/**
  * 额外需要展示的内容
  */
	extra: _propTypes2.default.node
}, _class.defaultProps = {
	dataSource: [],
	extra: null,
	disabled: false,
	autoExpandParent: true,
	onChange: function onChange() {}
}, _temp);
exports.default = TreeTransfer;
module.exports = exports['default'];