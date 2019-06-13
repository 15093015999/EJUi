
import React from 'react';
import styles from './WaiterPage.css';
import { Button, Table, Icon, Popconfirm, message, } from 'antd';
import axios from '../utils/axios'
import WaiterForm from './WaiterForm'


class WaiterPage extends React.Component {  
  //局部状态state
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      loading: true,
      list: [],
      visible:false,
      product:{}
    }
  }
  UNSAFE_componentWillMount(){
    this.handlerLoad();
  }
//   componentDidMount() {
//     // 查询数据，进行数据绑定
    
//     // this.reloadDate();
//   }

  //封装查询用户
  handlerLoad() {
    axios.get("/waiter/findAll")
      .then((result) => {
        //console.log('查询到的数据为：',result.data);
        //将查询到的数据设置到state中
        this.setState({
          list: result.data,
          loading:false
        })
      })
  }
  //删除用户
  handleDelete(id) {
    let obj = { 'id': id }
    axios.post("/waiter/deleteById", obj)
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
    axios.post("/waiter/batchDelete", {ids:this.state.selectedRowKeys})
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

  handleCancel = () =>{
    this.setState({visible:false});
  };
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 表单校验完成后与后台通信进行保存
      axios.post("/waiter/saveOrUpdate",values)
      .then((result)=>{
        message.success(result.statusText)
        // 重置表单
        form.resetFields();
        // 关闭模态框
        this.setState({ visible: false });
        this.handlerLoad();
      })
      
    });
  };
  // 将子组件的引用在父组件中进行保存，方便后期调用
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  //添加
  toAdd(){
    this.setState({waiter:{},visible:true})
  }
  //更新
  toEdit(record){
    //alert(JSON.stringify(record));
    this.setState({waiter:record})
    this.setState({visible:true})

  }

render() {
  const { selectedRowKeys } = this.state;
  const rowSelection = {
    selectedRowKeys,
    onChange: this.onSelectChange,
  };
  let text = "是否删除"
  let columns = [{
    title: "工号",
    dataIndex: "id"
  },{
    title:"电话",
    dataIndex:"telephone"
  },{
    title:"密码",
    dataIndex:"password"
  },{
    title: "姓名",
    dataIndex: "realname"
  },{
      title:"卡号",
      dataIndex:"idcard"
  },{
    title: "状态",
    dataIndex: "status"
  },{
    title: "头像",
    dataIndex: "photo"
  },{
    title: "操作",
    render: (table, Record) => {
      return (
        <div>
          <Popconfirm placement="top" title={text}
            onConfirm={this.handleDelete.bind(this, Record.id)} okText="是" cancelText="否">
            <Icon type="delete"></Icon>
          </Popconfirm>
          &nbsp;&nbsp;
          <Icon type="edit" onClick={this.toEdit.bind(this, Record)}></Icon>
        </div>
      )
    }
  }]

  //返回结果
  return (
    <div className="waiter">
      <div className={styles.waiter}>
        <div className={styles.title}>服务员管理</div>
      </div>

      &nbsp;<Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>
      &nbsp;
        <Popconfirm
        placement="bottomLeft"
        title={text}
        onConfirm={this.batchDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button type="danger">批量删除</Button>
      </Popconfirm>
      &nbsp;<Button type="link" onClick={() => { window.location.href = "/" }}>返回首页</Button>

      <Table
        // bordered 
        rowKey="id"
        size="small"
        bordered
        loading={this.state.loading}
        // rowSelection={rowSelection}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.state.list}
      />

      <WaiterForm
        initData={this.state.waiter}
        wrappedComponentRef={this.saveFormRef}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}/>

    </div>


  )
}
}

export default WaiterPage;