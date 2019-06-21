import React from 'react';
import { Form, Modal, Input, InputNumber, Select, Upload, Button, Icon, message } from 'antd'

class ProductForm extends React.Component {
  render() {
    const { visible, onCancel, onCreate, form, categoryList } = this.props;
    const { getFieldDecorator } = form;


    const upload_props = {
      name: 'formCollection',
      action: 'http://47.100.17.233:5000/api/File/upload',
      onChange: (info) => {
        console.log(info)
        if (info.file.status === 'done') {
          //后端的回应信息
          // 将上传成功后的图片id保存到表单中，点击提交的时候再随着表单提交提交到后台

          let photo = info.file.response;
          // 自行将photo设置到表单中
          this.props.form.setFieldsValue({
            photo
          });

        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };


    getFieldDecorator('id')
    getFieldDecorator("photo");
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
          <Form.Item label="分类">
            {getFieldDecorator('categoryId', {
              rules: [{ required: true, message: '请输入分类!' }],
            })(<Select>{categoryList}</Select>)}
          </Form.Item>
          <Form.Item label="图片">
            <Upload {...upload_props}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
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