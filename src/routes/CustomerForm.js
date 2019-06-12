import React from 'react';
import { Form, Modal, Radio, Input, } from 'antd';


class CustomerForm extends React.Component {
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
        };
    }

    render() {
        const { formLayout } = this.state;
        const formItemLayout =
            formLayout === 'horizontal'
                ? {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                }
                : null;
        //父传子
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="添加"
                okText="提交"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <Form.Item label="用户名">
                        {getFieldDecorator('realname', {
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="手机号">
                        {getFieldDecorator('telephne', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(<Input.telephone />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(<Input.Password />)}
                    </Form.Item>

                    <Form.Item className="collection-create-form_last-form-item">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <Radio.Group>
                                <Radio value="public">Public</Radio>
                                <Radio value="private">Private</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
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

export default Form.create({ mapPropsToFields })(CustomerForm);