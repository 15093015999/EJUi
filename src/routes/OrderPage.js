//订单管理页面

import React from 'react';
import styles from './OrderPage.css';
import { Input, Button, Table, Icon, Modal, message, Popconfirm, Select } from 'antd'
import axios from '../utils/axios'
import OrderForm from './OrderForm';
import OrderLineForm from './OrderLineForm'
import moment from 'moment'
const { Option } = Select;
const Search = Input.Search;
const ButtonGroup = Button.Group;
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
            productList: [],
            customerList: [],
            waiterList: [],
            addressList: [],
        }
    }


    //节点将要挂载钩子
    UNSAFE_componentWillMount() {
        this.reloadData();
    }

    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }


    //刷新数据
    reloadData = () => {
        let templist = [];
        // axios.get("/order/findAll")
        //     .then((result) => {
        //         result.data.forEach((order) => {
        //             axios.get(`/order/findOrderAndOrderLineByOrderId?id=${order.id}`)
        //                 .then((res) => { templist.push(res.data) })
        //         })
        //         this.setState({ listPlus: templist,list: result.data })
        //     })
        //     .finally(() => { this.setState({ loading: false }); })
        axios.get('/order/findAllOrderWithOrderLines').then((result)=>{
            result.data.forEach((item)=>{
                templist.push(item.order)
            })
            this.setState({ listPlus: result.data,list: templist })
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
                    this.setState({ selectedRowKeys: [] })
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
                console.log(values)
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

    saveOrderLineFormRef = formRef => {
        this.orderLineFormRef = formRef;
    }

    //*核心函数*//回调封装
    gainList = (addr, callBack) => {
        return axios.get(addr).then((result) => {
            if (200 === result.status) {
                callBack(result.data);
            }
        })
    }

    //打开订单模态框
    toOrderModal(order) {
        let requsetCustomer = this.gainList('/customer/findAll',
            (data) => {
                let templist = []
                data.forEach((item) => {
                    templist.push(<Option key={item.id} value={item.id}>{item.realname}</Option>);
                })
                this.setState({ customerList: templist });
            });
        let requsetWaiter = this.gainList('/waiter/findAll',
            (data) => {
                let templist = []
                data.forEach((item) => {
                    templist.push(<Option key={item.id} value={item.id}>{item.realname}</Option>);
                })
                this.setState({ waiterList: templist });
            });
        let requsetAddress = this.gainList('/address/selectByExample',
            (data) => {
                let templist = []
                data.forEach((item) => {
                    templist.push(<Option key={item.id} value={item.id}>{`${item.province}/${item.city}/${item.area}/${item.address}`}</Option>);
                })
                this.setState({ addressList: templist });
            })

        //三个请求同时成功打开模态窗
        Promise.all([requsetCustomer, requsetWaiter, requsetAddress]).then(() => {
            this.setState({ order: order, visible: true });
        })
    }

    //去添加
    toAdd() {
        this.toOrderModal({})
    }

    //去编辑
    toEdit(record) {
        this.toOrderModal(record)
    }



    //打开订单项模态框
    toOrderLineModal(callBack) {
        this.gainList('/product/findAll',
            (data) => {
                let templist = []
                data.forEach((item) => {
                    templist.push(<Option key={item.id} value={item.id}>{item.name}</Option>);
                })
                callBack();
                this.setState({ visibleOrderLine: true, productList: templist });
            });
    }

    //订单项编辑处理
    toOrderLineEdit(record) {
        this.toOrderLineModal(() => { this.setState({ orderLine: record }) })
    }

    //订单项去添加
    toAddOrderLine = (record) => {
        this.setState({ orderLine: {} })
        this.toOrderLineModal(() => { this.selectedOrderId = { value: record } })
    }

    //订单项模态取消
    handleOrderLineCancel = () => {
        this.setState({ visibleOrderLine: false })
    }

    handleOrderLineCreate = () => {
        const form = this.orderLineFormRef.props.form;
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
    handleSearch(value) {
        if (value) {
            axios.get(`/order/findOrderAndOrderLineByOrderId?id=${value}`)
                .then((res) => { this.setState({ list: [res.data.order], templist: res.data.orderLine }) })
        } else {
            this.reloadData();
        }
    }




    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        let text = "是否删除"



        let expandedRowRender = (ecord) => {
            const columns = [
                { title: '编号', dataIndex: 'id', key: 'id' },
                { title: '数量', dataIndex: 'number', key: 'number' },
                { title: '商品编号', dataIndex: 'productId', key: 'productId' },
                { title: '订单编号', dataIndex: 'orderId', key: 'orderId' },
                {
                    title: '操作', align: "center", render: (Record) => {
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
                dataIndex: "id",
                // sorter: true
            },
            {
                title: "下单时间",
                dataIndex: "orderTime",
                // sorter: true,
                render: val => <span>{moment(val).utc().format('YYYY-MM-DD HH:mm:ss')}</span>
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


        let titleHeader = (
            <div className={styles.titleheader}>
                <Search
                    placeholder="输入查询内容"
                    onSearch={value => this.handleSearch(value)}
                    style={{ width: 200 }}
                />
                <div className={styles.fill} />
                <ButtonGroup>
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加订单</Button>
                    <Popconfirm
                        placement="bottomLeft"
                        title={text}
                        onConfirm={this.handleBatchDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" >批量删除</Button>
                    </Popconfirm>
                </ButtonGroup>
            </div>
        );



        return (
            <div>
                <div className={styles.header}>
                    订单管理页面
                </div>

                <div>
                    <Table
                        rowKey='id'
                        size="small"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.list}
                        expandedRowRender={expandedRowRender}
                        bordered
                        title={() => titleHeader}
                        loading={this.state.loading}
                    />


                    <OrderForm
                        initData={this.state.order}
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        customerList={this.state.customerList}
                        waiterList={this.state.waiterList}
                        addressList={this.state.addressList}

                    />

                    <OrderLineForm
                        initData={this.state.orderLine}
                        wrappedComponentRef={this.saveOrderLineFormRef}
                        visible={this.state.visibleOrderLine}
                        onCancel={this.handleOrderLineCancel}
                        onCreate={this.handleOrderLineCreate}
                        orderId={this.selectedOrderId}
                        productList={this.state.productList}
                    />


                </div>
            </div>
        )
    }

}


export default OrderPage;