//地址管理页面

import React from 'react';
import styles from './AddressPage.css';
import { Button, Table, Icon, Popconfirm, message } from 'antd';
import axios from '../utils/axios';
import AddressForm from './AddressForm';
// import { Link } from 'dva/router';

class AddressPage extends React.Component {
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

    UNSAFE_componentWillMount () {
        // 查询数据，进行数据绑定
        this.handlerLoad();
    }

    //封装查询
    handlerLoad() {
        this.setState({ loading: true });
        axios.get("/address/selectByExample")
            .then((result) => {
                //console.log('查询到的数据为：',result.data);
                //将查询到的数据设置到state中
                this.setState({ list: result.data })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }
    //删除
    handleDelete(id) {
        let obj = { 'id': id }
        axios.post("/address/deleteByPrimaryKey", obj)
            .then((result) => {
                if (200 === result.status) {
                    message.success(result.statusText)
                    this.handlerLoad();
                }
            })
    }
    //批量删除
    batchDelete = () => {
        axios.post("/address/batchDelete", { ids: this.state.selectedRowKeys })
            .then((result) => {
                if (200 === result.status) {
                    message.success(result.statusText)
                    this.handlerLoad();
                }
            })
    }
    //添加
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
            axios.post("/address/saveOrUpdate", values)
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
    //添加
    toAdd() {
        // 将默认值置空,模态框打开
        this.setState({ address: {}, visible: true })
    };
    //更新
    toEdit(record) {
        // 更前先先把要更新的数据设置到state中
        this.setState({ address: record })
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
            title: "省会",
            dataIndex: "province"
        }, {
            title: "市级（县）",
            dataIndex: "city"
        }, {
            title: "区",
            dataIndex: "area"
        }, {
            title: "详细地址",
            dataIndex: "address"
        }, {
            title: "联系方式",
            dataIndex: "telephone"
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

        //返回结果
        return (
            <div className="adress">
                <div className={styles.header}>地址管理</div>

                <div className={styles.buttonsbmit}>
                    &nbsp;<Button type="primary" onClick={this.toAdd.bind(this)}>添加地址</Button>

                    &nbsp;<Popconfirm
                        placement="bottomLeft"
                        title={text}
                        onConfirm={this.batchDelete}
                        okText="是"
                        cancelText="否">
                        <Button type="danger" >批量删除</Button>
                    </Popconfirm>

                    {/* &nbsp;<Button ><Link to="/" ><Icon type='' /></Link ></Button> */}
                </div>

                <Table
                    rowKey="id"
                    size="small"
                    bordered
                    loading={this.state.loading}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.list}
                />

                <AddressForm
                    initData={this.state.address}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>

        )
    }
}

export default AddressPage;
