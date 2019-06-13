import React from 'react';
import { Form, Modal, Input, Radio,Select,InputNumber } from 'antd'
import { width } from 'window-size';
const { Option } = Select;

class CategoryForm extends React.Component {
    

    componentDidMount() {
        const {  } = this.props;
        this.children=[];
        
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
        const { visible, onCancel, onCreate, form} = this.props;
        const { getFieldDecorator } = form;

        
        // 将表单中没有出现的值做一个双向数据绑定
        getFieldDecorator("id");
        return (
            <Modal
                visible={visible}
                title="添加分类信息"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical" {...formLayout}>
                    <Form.Item label="名称" >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入名称!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="数量" >
                        {getFieldDecorator('num', {
                            rules: [{ required: true, message: '请输入数量!' }],
                        })(<InputNumber min={0} style={{width:'100%'}}/>)}
                    </Form.Item>
                    <Form.Item label="父分类id">
                        {getFieldDecorator('parentId', {
                            rules: []})(
                        <Select>{children}</Select>
                        )}
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
})(CategoryForm);