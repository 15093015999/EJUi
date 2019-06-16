//分类管理页面

import React from 'react';
import styles from './CategoryPage.css';
import { Input, Button, Table, Icon, Popconfirm, message, Select } from 'antd';
import axios from '../utils/axios'
import CategoryForm from './CategoryForm'
import CategoryTree from './CategoryTree';

const { Option } = Select;
const Search = Input.Search;
const ButtonGroup = Button.Group;

class CategoryPage extends React.Component {
    children = [];
    //局部状态state
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            loading: true,
            list: [],
            visible: false,
            category: {},
            tree: [],
            visibleTree: false
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


    //封装查询
    handlerLoad() {
        axios.get("/category/selectByExample")
            .then((result) => {
                // console.log('查询到的数据为：', result.data);
                this.children = []
                this.children.push(<Option key={0} value={null}>无</Option>)
                result.data.forEach((item) => {
                    this.children.push(<Option key={item.id} value={item.id}>{item.name}</Option>);
                })
                //将查询到的数据设置到state中
                this.setState({
                    list: result.data,
                })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }
    //删除
    handleDelete(id) {
        let obj = { 'id': id }
        axios.post("/category/deleteByPrimaryKey", obj)
            .then((result) => {
                if (200 === result.status) {
                    message.success(result.statusText)
                    this.handlerLoad();
                }
            })
    }

    //
    batchDelete = () => {
        axios.post("/category/batchDelete", { ids: this.state.selectedRowKeys })
            .then((result) => {
                if (200 === result.status) {
                    message.success(result.statusText)
                    this.handlerLoad();
                }
            })
        this.setState({ selectedRowKeys: [] })
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
    toAdd = () => {
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




    toTree() {
        // this.setState({ visibleTree: true })
        let nodes = [];
        let tree = [];
        this.state.list.forEach((item) => {
            nodes.push({ id: item.id, parentId: item.parentId, name: item.name, children: [] })
        })
        //找根节点
        nodes.forEach((node) => {
            if (node.parentId === null) {
                tree.push(node);
                // nodes.splice(index, 1);
                this.backTree(node, nodes)
            }
        })
        this.setState({ tree, visibleTree: true })
    }

    //深度优先遍历生成树
    backTree(tree, nodes) {
        nodes.forEach((node) => {
            if (node.parentId === tree.id) {
                tree.children.push(node);
                // nodes.splice(index,1);
                this.backTree(node, nodes)
            }
        })
    }



    onCancelTree = () => {
        this.setState({ visibleTree: false })
    }


    handleSearch = (value) => {
        axios.get('category/query', { params: { queryString: value } })
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
            title: "分类名称",
            dataIndex: "name"
        }, {
            title: "数量",
            dataIndex: "num"
        }, {
            title: "父分类编号",
            dataIndex: "parentId"
        }, {
            title: "操作",
            align: "center",
            render: ( Record) => {
                return (
                    <div>
                        <Popconfirm placement="top" title={text}
                            onConfirm={this.handleDelete.bind(this, Record.id)} okText="是" cancelText="否">
                            <Button size="small" ><Icon type="delete"></Icon></Button>
                        </Popconfirm>
                        &nbsp;&nbsp;
                        <Button size="small" onClick={this.toEdit.bind(this, Record)}><Icon type='edit'></Icon></Button>

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
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加分类</Button>
                    <Button onClick={this.toTree.bind(this)}>分类树</Button>
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
            <div>
                <div className={styles.header}>分类管理页面</div>
                <Table
                    rowKey="id"
                    size="small"
                    bordered
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.list}
                    title={() => titleHeader}
                    loading={this.state.loading}
                />

                <CategoryForm
                    initData={this.state.category}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    children={this.children} />


                <CategoryTree
                    visible={this.state.visibleTree}
                    onCancel={this.onCancelTree}
                    tree={this.state.tree} />
            </div>


        )
    }
}

export default CategoryPage;
