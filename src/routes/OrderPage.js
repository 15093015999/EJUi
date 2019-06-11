import React from 'react';
import styles from './OrderPage.css';
import { Button, Table, Icon, Modal, message, Popconfirm } from 'antd'
import axios from '../utils/axios'
class OrderPage extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,
            selectedRowKeys: []
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

    handleBatchDelete=()=> {
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
                            } else {
                                message.error('删除失败/(ㄒoㄒ)/~~')
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
                    } else {
                        message.error('对不起（＞人＜；），失败啦')
                    }
                }
            )
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
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
                dataIndex: "order_time"
            },
            {
                title: "总花费",
                dataIndex: "total"
            },
            {
                title: "下单用户",
                dataIndex: "customer_id"
            },
            {
                title: "送货号",
                dataIndex: "waiter_id"
            },
            {
                title: "地址",
                dataIndex: "address_id"
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
                                <Icon type="delete"></Icon>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]

        return (
            <div>
                <div className={styles.handle}>
                    订单管理页面
                </div>
                <div className={styles.buttonsbmit}>
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handleBatchDelete}
                        title={text}
                        okText='Yes'
                        cancelText='No'
                    >
                    <Button >
                        删除订单
                    </Button>
                    </Popconfirm>
                    &nbsp;&nbsp;
                    <Button>
                        下订单
                    </Button>
                    &nbsp;&nbsp;
                </div>

                <div>
                    <Table
                        rowKey='id'
                        rowSelection={rowSelection}
                        dataSource={this.state.list}
                        columns={columns}
                    >
                    </Table>
                </div>
            </div>
        )
    }

}


export default OrderPage;