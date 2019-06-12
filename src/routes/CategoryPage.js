import React from 'react';
import styles from './CategoryPage.css';
import { Button, Table, Icon, Popconfirm, message, Select } from 'antd';
import axios from '../utils/axios'
import CategoryForm from './CategoryForm'
const { Option } = Select;

class CategoryPage extends React.Component {
    children=[];
    //局部状态state
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            loading: false,
            list: [],
            visible: false,
            category:{},
            
        }
    }

    componentDidMount() {
        // 查询数据，进行数据绑定
        this.handlerLoad();
        // this.reloadDate();
    }

    //封装查询用户
    handlerLoad() {
        axios.get("/category/selectByExample")
            .then((result) => {
                // console.log('查询到的数据为：', result.data);
                this.children=[]
                result.data.forEach((item)=>{
                    this.children.push(<Option key={item.id} value={item.id}>{item.name}</Option>);
                })
                //将查询到的数据设置到state中
                this.setState({
                    list: result.data,
                })
            })
    }
    //删除用户
    handleDelete(id) {
        let obj = { 'id': id }
        axios.post("/category/deleteByPrimaryKey", obj)
            .then((result) => {
                if (200 === result.status) {
                    message.success(result.statusText)
                    this.handlerLoad();
                } else {
                    message.error('删除失败，请稍后再试')
                }
            })
    }
    batchDelete = () => {
        axios.post("/category/batchDelete", { ids: this.state.selectedRowKeys })
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

    // 取消按钮的事件处理函数
    handleCancel = () => {
        this.setState({ visible: false });
    };
    // 确认按钮的事件处理函数
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // 表单校验完成后与后台通信进行保存
            axios.post("/category/saveOrUpdate", values)
                .then((result) => {
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
    // 去添加
    toAdd=()=>{
        // 将默认值置空,模态框打开
        this.setState({ category: {}, visible: true })
    }
    // 去更新
    toEdit(record) {
        // 更前先先把要更新的数据设置到state中
        this.setState({ category: record })
        // 将record值绑定表单中
        this.setState({ visible: true })
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
            title: "分类名称",
            dataIndex: "name"
        }, {
            title: "数量",
            dataIndex: "num"
        },{
            title: "父分类Id",
            dataIndex: "parentId"
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
                        <Icon type="edit" onClick={this.toEdit.bind(this,Record)}></Icon>
                        
                    </div>
                )
            }
        }]




        //返回结果
        return (
            <div className="category">
                <div className={styles.category}>
                    <div className={styles.title}>分类管理</div>
                </div>
                &nbsp;
                <Button title="primary" onClick={this.toAdd.bind(this)}>添加</Button>
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
                    bordered 
                    rowKey="id"
                    size="small"
                    bordered
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.list}
                />

                <CategoryForm
                    initData={this.state.category}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    children={this.children} />
            </div>


        )
    }
}

export default CategoryPage;
