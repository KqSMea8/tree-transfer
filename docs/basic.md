# 基本

- order: 0

最简单的用法。

---

````jsx
import LscTreeTransfer from '@alife/lsc-tree-transfer';

const dataSource = [
  {
    disabled: true,
    label: '服装',
    value: 'id0',
    children: [{
      label: '男装',
      value: 'id01',
      disableCheckbox: true
    }, {
        label: '裙子',
        value: 'id02',
        disableCheckbox: true
    }, {
        label: '外套',
        value: 'id03',
        disableCheckbox: true
    }, {
        label: '背心',
        value: 'id04',
        disableCheckbox: true
    }, {
        label: '上衣上衣',
        value: 'id05',
        disableCheckbox: true
    }, {
        label: '短裤短裤',
        value: 'id06',
        disableCheckbox: true
    }, {
        label: '靴子靴子',
        value: 'id07',
        disableCheckbox: false
    }, {
      value: '22889',
      label: 'zzh0555',
    }]
  }
]

class Example extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LscTreeTransfer
        dataSource={dataSource}
      />
    );
  }
}

ReactDOM.render(<Example />, mountNode);
````
