import React from 'react';
import styles from './CustomerPage.css';
import { Button, Table, Icon, Popconfirm, message, } from 'antd';
import axios from '../utils/axios'


class CustomerPage extends React.Component {
  //局部状态state
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      loading: false,
      list: []
    }
  }

  componentDidMount() {
    // 查询数据，进行数据绑定
    this.handlerLoad();
    // this.reloadDate();
  }

  //封装查询用户
  handlerLoad() {
    axios.get("/customer/findAll")
      .then((result) => {
        //console.log('查询到的数据为：',result.data);
        //将查询到的数据设置到state中
        this.setState({
          list: result.data
        })
      })
  }
  //删除用户
  handleDelete(id) {
    let obj = { 'id': id }
    axios.post("/customer/deleteById", obj)
      .then((result) => {
        if (200 === result.status) {
          message.success(result.statusText)
          this.handlerLoad();
        } else {
          message.error('删除失败，请稍后再试')
        }
      })
  }
batchDelete=() => {
    axios.post("/customer/batchDelete", {ids:this.state.selectedRowKeys})
      .then((result) => {
        if (200 === result.status) {
          message.success(result.statusText)
          this.handlerLoad();
        } else {
          message.error('删除失败，请稍后再试')
        }
      })
}
onSelectChange = selectedRowKeys => {
  this.setState({ selectedRowKeys });

};

render() {
  const { selectedRowKeys } = this.state;
  const rowSelection = {
    selectedRowKeys,
    onChange: this.onSelectChange,
  };
  let text = "是否删除"
  let columns = [{
    title: "编号",
    dataIndex: "id"
  }, {
    title: "姓名",
    dataIndex: "realname"
  }, {
    title: "电话",
    dataIndex: "telephone"
  }, {
    title: "密码",
    dataIndex: "password"
  }, {
    title: "状态",
    dataIndex: "status"
  }, {
    title: "操作",
    render: (table, Record) => {
      return (
        <div>
          <Popconfirm placement="top" title={text}
            onConfirm={this.handleDelete.bind(this, Record.id)} okText="是" cancelText="否">
            <Icon type="delete"></Icon>
          </Popconfirm>
          &nbsp;&nbsp;

                    </div>
      )
    }
  }]

  //返回结果
  return (
    <div className="customer">
      <div className={styles.customer}>
        <div className={styles.title}>顾客管理</div>
      </div>

      &nbsp;<Button title="primary">添加</Button>
      &nbsp;
        <Popconfirm
        placement="bottomLeft"
        title={text}
        onConfirm={this.batchDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button>批量删除</Button>
      </Popconfirm>
      &nbsp;<Button title="link" >退出</Button>

      <Table
        // bordered 
        rowKey="id"
        size="small"
        bordered
        // loading={this.state.loading}
        // rowSelection={rowSelection}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.state.list}
      />

    </div>


  )
}
}

export default CustomerPage;
