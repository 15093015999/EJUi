import React from 'react';
import { Form, Modal, Input, InputNumber} from 'antd'

class ProductForm extends React.Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('id')
    return (
      <Modal
        visible={visible}
        title="商品管理"
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
            })(<InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              style={{ width: '100%' }}
          />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请输入商品状态!' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="头像">
            {getFieldDecorator('photo', {
              rules: [{ required: true, message: '请输入商品图片!' }],
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
  return obj;
}

export default Form.create({
  mapPropsToFields
})(ProductForm);