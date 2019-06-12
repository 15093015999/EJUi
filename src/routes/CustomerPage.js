//客户管理页面

import React from 'react';
import styles from './CustomerPage.css';
import { Button, Table, Icon, Popconfirm, message, Modal } from 'antd';
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
    this.setState({ loading: true });
    axios.get("/customer/findAll")
      .then((result) => {
        //console.log('查询到的数据为：',result.data);
        //将查询到的数据设置到state中
        this.setState({ list: result.data, })
      })
      .finally(() => {
        this.setState({ loading: false })
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
  //取消添加
  handleCancel = () => {
    this.setState({ visible: false });
  }
  //确认添加
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 表单校验完成后与后台通信进行保存
      axios.post("/customer/saveOrUpdate", values)
        .then((result) => {
          message.success(result.statusText)
          this.handlerLoad();
        })
      // 重置表单
      form.resetFields();
      // 关闭模态框
      this.setState({ visible: false });
      this.handlerLoad();
    });
  }
  // 将子组件的引用在父组件中进行保存，方便后期调用
  saveFormRef = formRef => {
    this.formRef = formRef;
  }
  //添加用户
  toAdd() {
    // 将默认值置空,模态框打开
    this.setState({ customer: {}, visible: true })
  };
  //更新用户
  toEdit(record) {
    // 更前先先把要更新的数据设置到state中
    this.setState({ customer: record })
    // 将record值绑定表单中
    this.setState({ visible: true })
  }

  render() {
    //tuichu
    const confirm = Modal.confirm;
    function showConfirm() {
      confirm({
        title: '确认退出吗？',
        // content: 'Some descriptions',
        onOk() { console.log('是'); },
        onCancel() { console.log('否'); },
      });
    }
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
      width: 150,
      align: "center",
      render: (record) => {
        return (
          <div>
            <Popconfirm placement="top" title={text}
              onConfirm={this.handleDelete.bind(this, record.id)} okText="是" cancelText="否">
              <Button size="small" ><Icon type="delete"></Icon></Button>
            </Popconfirm>
            &nbsp;&nbsp;
            <Button size="small" onClick={this.toEdit.bind(this, record)}><Icon type='edit'></Icon></Button>

          </div>
        )
      }
    }]

    //返回结果
    return (
      <div className="customer">
        {/* <div className={styles.customer}> */}
        <div className={styles.customer}>顾客管理</div>
        <div className={styles.buttonsbmit}>
          &nbsp;<Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>

          &nbsp;<Popconfirm
            placement="bottomLeft"
            title={text}
            onConfirm={this.batchDelete}
            okText="是"
            cancelText="否">
            <Button type="danger" >批量删除</Button>
          </Popconfirm>

          &nbsp;<Button type="link" onClick={showConfirm}>退出</Button>
        </div>
        {/* </div> */}
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
          initData={this.state.customer}
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
