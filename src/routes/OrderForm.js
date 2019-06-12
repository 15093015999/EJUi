import React from 'react';
import { Form, Modal, Input, Radio } from 'antd'

class OrderForm extends React.Component {

    render() {
        // 父组件传递给子组件值
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="添加订单"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <Form.Item label="订单号">
                        {getFieldDecorator('id', {
                            rules: [{ required: true, message: '请输入订单号' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="下单时间">
                        {getFieldDecorator('orderTime', {
                            rules: [{ required: true, message: '请输入下单时间!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="金额">
                        {getFieldDecorator('total', {
                            rules: [{ required: true, message: '请输入金额!' }],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="下单人">
                        {getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请输入下单人!' }],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="送货号">
                        {getFieldDecorator('waiterId', {
                            rules: [{ required: true, message: '请输入送货号!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="送货地址">
                        {getFieldDecorator('addressId', {
                            rules: [{ required: true, message: '请输入送货地址!' }],
                        })(<Input.Password />)}
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
    {mapPropsToFields}
)(OrderForm);