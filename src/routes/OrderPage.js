//订单管理页面

import React from 'react';
import styles from './OrderPage.css';
import { Button, Table, Icon, Modal, message, Popconfirm } from 'antd'
import axios from '../utils/axios'
import OrderForm from './OrderForm';
import OrderLineForm from './OrderLineForm'
// import moment from 'moment';

// const { MonthPicker, RangePicker } = DatePicker;
// const dateFormat = 'YYYY/MM/DD';
class OrderPage extends React.Component {
    selectedOrderId
    constructor() {
        super();
        this.state = {
            order: {},
            orderLine: {},
            list: [],
            listPlus: [],
            loading: true,
            selectedRowKeys: [],
            visible: false,
            visibleOrderLine: false,

        }
    }


    //节点将要挂载钩子
    UNSAFE_componentWillMount() {
        this.reloadData();
    }


    //刷新数据
    reloadData = () => {
        let templist = [];
        axios.get("/order/findAll")
            .then((result) => {
                this.setState({ list: result.data })
                result.data.forEach((order) => {
                    axios.get(`/order/findOrderAndOrderLineByOrderId?id=${order.id}`)
                        .then((res) => { templist.push(res.data) })
                })
                this.setState({ listPlus: templist })
            })
            .finally(() => { this.setState({ loading: false }); })
    }

    //批量删除处理
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
                        })
                }
            }
        )
    }

    //删除处理
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

    //查询改变事件处理
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    //订单模态框取消处理
    handleCancel = () => {
        this.setState({ visible: false });
    }

    //订单模态框确定处理
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

    //去添加
    toAdd() {
        this.setState({ order: {}, visible: true })
    }

    //去编辑
    toEdit(record) {

        this.setState({ order: record })
        this.setState({ visible: true });
    }

    //订单项删除处理
    handleLineDelete(id) {
        let obj = { 'id': id }
        axios.post("/orderLine/deleteById", obj)
            .then(
                (result) => {
                    if (200 === result.status) {
                        message.success(result.statusText)
                        this.reloadData();
                    }
                }
            )
    }

    //订单项编辑处理
    toOrderLineEdit(record) {
        this.setState({ orderLine: record })
        this.setState({ visibleOrderLine: true });
    }

    //订单项去添加
    toAddOrderLine(record) {
        this.selectedOrderId = { value: record };
        this.setState({ selectedOrderId: { value: record }, visibleOrderLine: true })
    }

    //订单项模态取消
    handleOrderLineCancel = () => {
        this.setState({ visibleOrderLine: false })
    }

    handleOrderLineCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields(
            (err, values) => {
                if (err) {
                    return;
                }
                axios.post("orderLine/saveOrUpdate", values)
                    .then(
                        (result) => {
                            message.success(result.statusText)
                            form.resetFields();
                        }
                    )
                    .finally(() => { 
                        this.setState({ visibleOrderLine: false });
                        this.reloadData(); 
                    })
                
            }
        )
    }




    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        let text = "是否删除"



        const expandedRowRender = (ecord) => {
            const columns = [
                { title: '编号', dataIndex: 'id', key: 'id' },
                { title: '数量', dataIndex: 'number', key: 'number' },
                { title: '商品编号', dataIndex: 'productId', key: 'productId' },
                { title: '订单编号', dataIndex: 'orderId', key: 'orderId' },
                {
                    title: '操作', align: "center", render: (table, Record) => {
                        return (
                            <div>
                                <Popconfirm placement="top" title={text}
                                    onConfirm={this.handleLineDelete.bind(this, Record.id)}
                                    okText='是' cancelText='否'>
                                    <Button size="small" ><Icon type="delete"></Icon></Button>
                                </Popconfirm>
                                &nbsp;&nbsp;
                                <Button
                                    size="small"
                                    onClick={this.toOrderLineEdit.bind(this, Record)} >
                                    <Icon type='edit'></Icon>
                                </Button>
                                &nbsp;&nbsp;

                        </div>
                        )
                    }
                }
            ];
            for (let i = 0; i < this.state.listPlus.length; i++) {
                if (ecord.id === this.state.listPlus[i].order.id) {
                    return <Table rowKey='id' columns={columns} dataSource={this.state.listPlus[i].orderLines} pagination={false} rowSelection={rowSelection} />
                }
            }
        };






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
                align: "center",
                render: (Record) => {
                    return (
                        <div>
                            <div>
                                <Popconfirm placement="top" title={text}
                                    onConfirm={this.handleDelete.bind(this, Record.id)} okText="是" cancelText="否">
                                    <Button size="small" ><Icon type="delete"></Icon></Button>
                                </Popconfirm>
                                &nbsp;&nbsp;
                                <Button size="small" onClick={this.toEdit.bind(this, Record)}><Icon type='edit'></Icon></Button>
                                &nbsp;&nbsp;
                                <Button size="small" onClick={this.toAddOrderLine.bind(this, Record.id)}><Icon type='plus-circle'></Icon></Button>
                            </div>

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
                        expandedRowRender={expandedRowRender}
                        bordered
                        loading={this.state.loading}
                    >
                    </Table>

                    <OrderForm
                        initData={this.state.order}
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />

                    <OrderLineForm
                        initData={this.state.orderLine}
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visibleOrderLine}
                        onCancel={this.handleOrderLineCancel}
                        onCreate={this.handleOrderLineCreate}
                        orderId={this.selectedOrderId}
                    />


                </div>
            </div>
        )
    }

}


export default OrderPage;