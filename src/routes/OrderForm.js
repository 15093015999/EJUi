import React from 'react';
import { Form, Modal, InputNumber, Select } from 'antd'

class OrderForm extends React.Component {

    render() {
        // 父组件传递给子组件值
        const { visible, onCancel, onCreate, form, customerList, waiterList, addressList } = this.props;
        const { getFieldDecorator } = form;
        getFieldDecorator('id')
        getFieldDecorator('orderTime')
        return (
            <Modal
                visible={visible}
                title="订单管理"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">

                    <Form.Item label="金额">
                        {getFieldDecorator('total', {
                            rules: [{ required: true, message: '请输入金额!' }],
                        })(
                            <InputNumber
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="下单人">
                        {getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请输入下单人!' }],
                        })(<Select>{customerList}</Select>)}
                    </Form.Item>

                    <Form.Item label="送货人">
                        {getFieldDecorator('waiterId', {
                            rules: [{ required: true, message: '请输入送货人!' }],
                        })(<Select>{waiterList}</Select>)}
                    </Form.Item>

                    <Form.Item label="送货地址">
                        {getFieldDecorator('addressId', {
                            rules: [{ required: true, message: '请输入送货地址!' }],
                        })(<Select>{addressList}</Select>)}
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}

const mapPropsToFields = (props) => {
    let obj = {};
    for (let key in props.initData) {
        let val = props.initData[key];
        obj[key] = Form.createFormField({ value: val })
    }
    return obj;
}

export default Form.create(
    { mapPropsToFields }
)(OrderForm);