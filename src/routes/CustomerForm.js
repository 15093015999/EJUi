import React from 'react';
import { Form, Modal, Input, } from 'antd'

class CustomerForm extends React.Component {

    render() {
        const formLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        }
        // 父组件传递给子组件值
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        // 将表单中没有出现的值做一个双向数据绑定
        getFieldDecorator("id");
        getFieldDecorator("status");
        getFieldDecorator("phtot");
        return (
            <Modal
                visible={visible}
                title="添加顾客信息"
                okText="提交"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical" {...formLayout}>
                    <Form.Item label="姓名" >
                        {getFieldDecorator('realname', {
                            rules: [{ required: true, message: '请输入姓名!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="电话" >
                        {getFieldDecorator('telephone', {
                            rules: [{ required: true, message: '请输入电话号码!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="状态">
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: '请输入状态!' }],
                        })(<Input />)}
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}
// 将通过props从父组件中获取的值拿出来设置到表单元素上
const mapPropsToFields = (props) => {
    let obj = {};
    for (let key in props.initData) {
        let val = props.initData[key];
        obj[key] = Form.createFormField({ value: val })
    }
    return obj;
}

export default Form.create({
    mapPropsToFields
})(CustomerForm);