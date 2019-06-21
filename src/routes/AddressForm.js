import React from 'react';
import { Form, Modal, Input, Cascader, Select } from 'antd'
class AddressForm extends React.Component {
    constructor() {
        super();
        this.options = [
            {
                value: '河南',
                label: '河南',
                children: [
                    {
                        value: '郑州',
                        label: '郑州',
                        children: [
                            {
                                value: '中原区',
                                label: '中原区',
                            },
                        ],
                    },
                ],
            },
            {
                value: '广东',
                label: '广东',
                children: [
                    {
                        value: '珠海',
                        label: '珠海',
                        children: [
                            {
                                value: '拱北',
                                label: '拱北',
                            },
                        ],
                    },
                ],
            },
        ];
    }

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
        const { visible, onCancel, onCreate, form ,customerList } = this.props;
        const { getFieldDecorator } = form;
        // 将表单中没有出现的值做一个双向数据绑定
        getFieldDecorator("id");
        getFieldDecorator("status");
        getFieldDecorator("phtot");


        return (
            <Modal
                visible={visible}
                title="地址管理"
                okText="提交"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical" {...formLayout}>
                    <Form.Item label="省/市/区" >
                        {getFieldDecorator('addr', {
                            rules: [{ required: true, message: '请输入!' }],
                        })(<Cascader options={this.options} />)}

                    </Form.Item>
                    <Form.Item label="详细地址">
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="联系方式">
                        {getFieldDecorator('telephone', {
                            rules: [{ required: true, message: '请输入!' }],
                        })(<Input />)}
                    </Form.Item>

                    <Form.Item label="用户">
                        {getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请输入!' }],
                        })(<Select>{customerList}</Select>)}
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
})(AddressForm);