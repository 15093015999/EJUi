import React from 'react';
import { Form, Modal, Input,InputNumber } from 'antd'

class OrderLineForm extends React.Component {

    render() {
        // 父组件传递给子组件值
        const { visible, onCancel, onCreate, form,orderId } = this.props;
        const { getFieldDecorator } = form;
        getFieldDecorator('orderId',orderId);
        getFieldDecorator('id');
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
                    <Form.Item label="订单号">
                        {getFieldDecorator('orderId',{
                            rules: [{ required: true, message: '请输入订单号!' }],
                        })(<Input disabled/>)}
                    </Form.Item>
                    <Form.Item label="数量">
                        {getFieldDecorator('number',{
                            rules: [{ required: true, message: '请输入数量!' }],
                        })(<InputNumber min={0} style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label="商品编号">
                        {getFieldDecorator('productId',{
                            rules: [{ required: true, message: '请输入商品编号!' }],
                        })(<Input />)}
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
    if(obj['id']==null&&props.orderId!==undefined){
        obj['orderId']=Form.createFormField({ value: props.orderId.value })
    }
    return obj;
}

export default Form.create(
    { mapPropsToFields }
)(OrderLineForm);