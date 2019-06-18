//客户管理页面

import React from 'react';
import styles from './CustomerPage.css';
import { Button, Table, Icon, Popconfirm, message, Input, } from 'antd';
import axios from '../utils/axios';
import CustomerForm from './CustomerForm';
// import { Link } from 'dva/router';

const Search = Input.Search
const ButtonGroup = Button.Group;

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

  UNSAFE_componentWillMount() {
    // 查询数据，进行数据绑定
    this.handlerLoad();
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
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
        }
      })
  }
  //批量删除用户
  batchDelete = () => {
    console.log(this.state.selectedRowKeys)
    axios.post("/customer/batchDelete", { ids: this.state.selectedRowKeys })
      .then((result) => {
        if (200 === result.status) {
          message.success(result.statusText)
          this.handlerLoad();
        }
      })
    this.setState({ selectedRowKeys: [] })
  }
  //添加用户
  onSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys);
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

  handleSearch = (value) => {
    axios.get('customer/findByLikeRealname', { params: { realname: value } })
      .then((result) => {
        if (200 === result.status) {
          this.setState({
            list: result.data
          })
        }
      })
  }

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
      title: "状态",
      dataIndex: "status"
    },{
      title: "头像",
      dataIndex: "photo",
      render(text){
        return (
          <img width={40} height={40} src={"http://10.84.130.41:5000/avatars/"+text}/>
        )
      }
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
            <Button size="small" onClick={this.toEdit.bind(this, record)}><Icon type='edit' /></Button>
          </div>
        )
      }
    }]

    let titleHeader = (
      <div className={styles.titleheader}>
        <Search
          placeholder="输入查询内容"
          onSearch={value => this.handleSearch(value)}
          style={{ width: 200 }}
        />
        <div className={styles.fill} />
        <ButtonGroup>
          <Button type="primary" onClick={this.toAdd.bind(this)}>添加客户</Button>
          <Popconfirm
            placement="bottomLeft"
            title={text}
            onConfirm={this.batchDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" >批量删除</Button>
          </Popconfirm>
        </ButtonGroup>
      </div>
    );

    //返回结果
    return (
      <div >
        <div className={styles.header}>用户管理</div>

        <Table
          rowKey="id"
          size="small"
          bordered
          loading={this.state.loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.list}
          title={() => titleHeader}
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
