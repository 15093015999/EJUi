//订单管理页面

import React from 'react';
import styles from './OrderPage.css';
import { Button, Table, Icon, Modal, message, Popconfirm } from 'antd'
import axios from '../utils/axios'
import OrderForm from './OrderForm';
// import moment from 'moment';

// const { MonthPicker, RangePicker } = DatePicker;
// const dateFormat = 'YYYY/MM/DD';
class OrderPage extends React.Component {
    constructor() {
        super();
        this.state = {
            order: {},
            list: [
                // {
                //     id: 1,
                //     orderTime: 1,
                //     total: 1,
                //     customerId: 1,
                //     waiterId: 1,
                //     addressId: 1
                // }
            ],
            loading: false,
            selectedRowKeys: [],
            visible: false
        }
    }

    componentDidMount() {
        this.reloadData();
    }

    reloadData() {
        this.setState({ loading: true });
        axios.get("/order/findAll")
            .then(
                (result) => {
                    this.setState({ list: result.data })
                }
            )
            .finally(
                () => { this.setState({ loading: false }); }
            )
    }

    handleBatchDelete = () => {
        Modal.confirm(
            {
                title: '确认是否删除这些订单',
                content: '删除后无法恢复偶',
                onOk: () => {
                    console.log(this.state.selectedRowKeys);
                    axios.post("/order/batchDelete", { ids: this.state.selectedRowKeys })
                        .then((result) => {
                            if (200 === result.status) {
                                message.success(result.statusText)
                                this.reloadData();
                            }
                        }
                        )
                }
            }
        )
    }

    handleDelete(id) {
        let obj = { 'id': id }
        axios.post("/order/deleteById", obj)
            .then(
                (result) => {
                    if (200 === result.status) {
                        message.success(result.statusText)
                        this.reloadData();
                    }
                }
            )
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields(
            (err, values) => {
                if (err) {
                    return;
                }
                axios.post("order/saveOrUpdate", values)
                    .then(
                        (result) => {
                            message.success(result.statusText)
                            form.resetFields();
                        }
                    )
                this.setState({ visible: false });
                this.reloadData();
            }
        )
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    toAdd() {
        this.setState({ order: {}, visible: true })
    }

    toEdit(record) {
        this.setState({ order: record })
        this.setState({ visible: true })
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        let text = "是否删除"
        let columns = [
            {
                title: "订单号",
                dataIndex: "id"
            },
            {
                title: "下单时间",
                dataIndex: "orderTime"
            },
            {
                title: "金额",
                dataIndex: "total"
            },
            {
                title: "下单用户",
                dataIndex: "customerId"
            },
            {
                title: "送货号",
                dataIndex: "waiterId"
            },
            {
                title: "地址",
                dataIndex: "addressId"
            },
            {
                title: "操作",
                render: (table, Record) => {
                    return (
                        <div>
                            <Popconfirm placement="top" title={text}
                                onConfirm={this.handleDelete.bind(this, Record.id)}
                                okText='是' cancelText='否'
                            >
                                <Button>
                                    <Icon type="delete"></Icon>
                                </Button>
                            </Popconfirm>
                            &nbsp;&nbsp;
                            <Button
                                type='linlk'
                                onClick={this.toEdit.bind(this, Record)}
                            >
                                <Icon type='edit'>

                                </Icon>
                            </Button>
                            &nbsp;&nbsp;

                        </div>
                    )
                }
            }
        ]

        return (
            <div>
                <div className={styles.header}>
                    订单管理页面
                </div>
                <div className={styles.buttonsbmit}>
                    &nbsp;
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加订单</Button>
                    &nbsp;
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handleBatchDelete}
                        title={text}
                        okText='Yes'
                        cancelText='No'>
                        <Button type="danger">批量删除</Button>
                    </Popconfirm>
                </div>

                <div>
                    <Table
                        rowKey='id'
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.list}
                    >
                    </Table>

                    <OrderForm
                        initData={this.state.order}
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    >

                    </OrderForm>
                </div>
            </div>
        )
    }

}


export default OrderPage;