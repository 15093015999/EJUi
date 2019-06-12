//客户管理页面

import React from 'react';
import styles from './CustomerPage.css';
import { Button, Table, Icon, Popconfirm, message } from 'antd';
import axios from '../utils/axios';
import CustomerForm from './CustomerForm';


class CustomerPage extends React.Component {
  //局部状态state
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      loading: true,
      list: [],
      visible: false
    }
  }

  componentDidMount() {
    // 查询数据，进行数据绑定
    this.handlerLoad();
  }

  //封装查询用户
  handlerLoad() {
    axios.get("/customer/findAll")
      .then((result) => {
        //console.log('查询到的数据为：',result.data);
        //将查询到的数据设置到state中
        this.setState({
          list: result.data,
          loading: false
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
  //批量删除用户
  batchDelete = () => {
    axios.post("/customer/batchDelete", { ids: this.state.selectedRowKeys })
      .then((result) => {
        if (200 === result.status) {
          message.success(result.statusText)
          this.handlerLoad();
        } else {
          message.error('删除失败，请稍后再试')
        }
      })
  }
  //添加用户
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      axios.post("/customer/save")
        .then((result) => {
          message.success(result.statusText)
        })
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = formRef => {
    this.formRef = formRef;
  }
  //
  toAdd() {
    this.setState({ visible: true })
  };
  // toEdit() {

  // }

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
      render: () => {
        return (
          <div>
            <Popconfirm placement="top" title={text}
              onConfirm={this.handleDelete} okText="是" cancelText="否">
              <Icon type="delete"></Icon>
            </Popconfirm>
            &nbsp;&nbsp;
                {/* < */}

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

        &nbsp;<Button title="primary" onClick="">添加</Button>

        &nbsp;<Popconfirm
          placement="bottomLeft"
          title={text}
          onConfirm={this.batchDelete}
          okText="Yes"
          cancelText="No">
          <Button>批量删除</Button>
        </Popconfirm>

        &nbsp;<Button title="link" >退出</Button>

        <Table
          rowKey="id"
          size="small"
          bordered
          loading={this.state.loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.list}
        />

        <CustomerForm
          // in
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

      </div>


    )
  }
}

export default CustomerPage;
