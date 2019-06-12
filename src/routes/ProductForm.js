import React from 'react';
import {Form,Modal,Input} from 'antd'

class ProductForm extends React.Component{
    render(){
        const{visible,onCancel,onCreate,form} = this.props;
        const{getFieldDecorator} = form;
        return (
            <Modal
                visible={visible}
                title="添加产品信息"
                okText="提交"
                onCancel={onCancel}
                onOk={onCreate}
            >   
          <Form layout="vertical">
            <Form.Item label="商品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入商品名称!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入商品描述!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="价格">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入商品价格!' }],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请输入商品状态!' }],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="头像">
              {getFieldDecorator('photo', {
                rules: [{ required: true, message: '请输入商品图片!' }],
              })(<Input/>)}
            </Form.Item>
           
          </Form>
        </Modal>
        );
    }
}
const mapPropsToFields = (props)=>{
    let obj = {};
    for(let key in props.initData){
        let val = props.initData[key];
        obj[key] = Form.createFormField({value:val})
    }
    return obj;
}

export default Form.create({
    mapPropsToFields
})(ProductForm);