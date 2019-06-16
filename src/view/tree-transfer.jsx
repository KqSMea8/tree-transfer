
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Icon, Tree, util, Search } from '@alife/hippo';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { TreeWarp, RightPanelWarp, RightPanelUl, CheckRightList,
	ItemCheckRigh, LeftPanelWarp, SearchWarp, TreeTransfergWarp } from './styled';

const TreeNode = Tree.Node;
const { obj } = util;

/**
 * TreeTransfer
 */

class TreeTransfer extends Component {
	static propTypes = {
		/**
		 * 数据源
		 */
		dataSource: propTypes.array,
		/**
		 * （用于非受控）初始值
		 * @param {Array} checkedKeys 勾选复选框节点key的数组
		 * @param {Object} extra 额外参数
		 */
		onChange: propTypes.func,
		/**
		 * 是否禁用
		 */
		disabled: propTypes.bool,
		/**
		 * 是否禁止勾选节点复选框
		 */
		disableCheckbox: propTypes.bool,
		/**
		 * 是否展开父节点
		 */
		autoExpandParent: propTypes.bool,
		/**
		 * （用于受控）当前值
		 */
		value: propTypes.array,
		/**
		 * 搜索框占位符
		 */
		searchPlaceholder: propTypes.string,
		/**
		 * 自定义样式对象
		 */
		listStyle: propTypes.object,
		/**
		 * 额外需要展示的内容
		 */
		extra: propTypes.node,
	};

  static defaultProps = {
		dataSource: [],
		extra: null,
		disabled: false,
		autoExpandParent: true,
		value: [],
		onChange: () => { }
	};

	constructor(props) {
		super(props);
		this.state = {
      value: props.value,
			rightData: this.getRightData(props.value, props.dataSource),
			hideKeys: [],

			dataSource: props.dataSource,
		};
	}

	componentWillReceiveProps = (nextProps) => {
		const { dataSource, value } = nextProps;
		if (
			!isEqual(dataSource, this.props.dataSource)
			|| !isEqual(value, this.props.value)
		) {
			this.setState({
				value,
				rightData: this.getRightData(value, dataSource)
			});
		}
	}

	handleCheck = (checkedKeys, extra) => {
    this.setState({
			value: checkedKeys,
			rightData: this.getRightData(checkedKeys)
    });

    this.props.onChange(checkedKeys, extra);
  }

  getRightData = (checkedKeys, dataSource) => {
		const data = dataSource || this.props.dataSource;
    const rightData = [];

    if (checkedKeys && checkedKeys.length) {
			data.forEach((item) => {
        const isCheck = item.children.some(child => checkedKeys.includes(child.value));
        if (isCheck) {
          const checkedData = cloneDeep(item);
          checkedData.allCount = item.children.length;
          checkedData.children = item.children.filter(child => checkedKeys.includes(child.value));
          rightData.push(checkedData);
        }
			});
    }

		return rightData;
  }

	handleDeleItem (deleValue) {
    const { value } = this.state;

    const newValue = value.filter(item => item !== deleValue);

    this.setState({
			value: newValue,
			rightData: this.getRightData(newValue)
		});
		this.props.onChange(newValue);
	}

	renderTree () {
		const { hideKeys, value } = this.state;
		const { notFoundContent, dataSource } = this.props;
		const data = dataSource.filter(item => !hideKeys.includes(item.value));

    if (!(data && data.length)) {
      return (
        <div className="no-empty-right">
          {notFoundContent}
        </div>
      );
    }

		return (
			<Tree
        checkedKeys={value}
				defaultExpandAll
				className="transfer-panel-list tree-panel-list"
				checkable
				editable
				autoExpandParent
				onCheck={this.handleCheck}
				enableCheckedCache={false}
      >
				{this.loopTree(dataSource)}
			</Tree>
		);
	}

	loopTree (data) {
		const { hideKeys } = this.state;
		const tmp = [];
		data.forEach((item) => {
			const { value, label, children, ...others } = item;
			if (item.children) {
        tmp.push(
					<TreeNode
						style={{ display: hideKeys.includes(item.value) ? 'none' : '' }}
						key={value}
						label={label}
						{...others}
						disabled={item.disabled}
					>
						{this.loopTree(item.children)}
					</TreeNode>
				);
      } else {
        tmp.push(
					<TreeNode
						style={{ display: hideKeys.includes(item.value) ? 'none' : '' }}
						key={value}
						label={label}
						{...others}
						disableCheckbox={item.disableCheckbox}
					/>
				);
      }
		});
		return tmp;
	}

	renderTreeLeftPanel () {
		return (
			<LeftPanelWarp>
				{ this.renderTree() }
			</LeftPanelWarp>
		);
	}

	handleSearch = (obj) => {
    const { dataSource } = this.props;
    const searchKey = obj.key;

    if (!searchKey) {
      this.setState({
        hideKeys: []
      });
      return;
    }

		let hideKeys = [];
    (dataSource || []).forEach(item => {
      if (!JSON.stringify(item.label).includes(searchKey)) {
				const isContains = item.children.some(child => JSON.stringify(child.label).includes(searchKey));
				if (!isContains) {
					hideKeys.push(item.value);
				}
				const childKeys = item.children
						.filter(child => !JSON.stringify(child.label).includes(searchKey))
						.map(item => item.value);

				hideKeys = hideKeys.concat(childKeys);
      }
    });

    this.setState({
      hideKeys
    });
	}

	loopRight = (dataSource, checkedKeys, rightData) => {
    dataSource.forEach(item => {
      if (item.children && item.children.length) {
        this.loopRight(item.children, checkedKeys, rightData);
      } else if (checkedKeys.includes(item.value)) {
        const checkedData = cloneDeep(item);
        checkedData.allCount = item.children && item.children.length;
        checkedData.children = item.children && item.children.length > 0 ? item.children.filter(child => checkedKeys.includes(child.value)) : [];
        rightData.push(checkedData);
      }
    });
  }

	renderTreeRightPanel () {
    const { rightData } = this.state;

		return (
			<RightPanelWarp>
				<RightPanelUl>
				{
					rightData.length ? rightData.map((item) => (
            <CheckRightList className="check-right-list-warp" key={item.value}>
              <div className="item-title">{item.label}
                <span className="uncheck">
                  (已选{item.children.length}条，总共{item.allCount}条)
                </span>
              </div>
                {
                  item.children.map(child => (
                    <ItemCheckRigh className="item-check-right-li" key={child.value}>{child.label}
                      <Icon type="close" className="item-close" onClick={this.handleDeleItem.bind(this, child.value)} />
                    </ItemCheckRigh>
                  ))
              }
            </CheckRightList>
          )) : <div className="no-empty-right">暂无匹配数据</div>
				}
				</RightPanelUl>
			</RightPanelWarp>
		);
	}

	render() {
		const { listStyle, extra, searchPlaceholder, ...others } = this.props;

		return (
			<TreeTransfergWarp {...obj.pickOthers(TreeTransfer.propTypes, others)}>
				<SearchWarp style={listStyle} className="staffing-search-warp">
					<Search className="treeTransfer-search" placeholder={searchPlaceholder} onSearch={this.handleSearch} />
					<div className="treeTransfer-progress">{ extra }</div>
				</SearchWarp>
					<TreeWarp>
						{this.renderTreeLeftPanel()}
						{this.renderTreeRightPanel()}
				</TreeWarp>
			</TreeTransfergWarp>
		);
	}
}

export default TreeTransfer;
