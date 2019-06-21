import React from 'react';
import { Form, Modal, Input,Select,message,Button,Icon,Upload } from 'antd'
const { Option } = Select;
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

        // 将表单中没有出现的值做一个双向数据绑定
        getFieldDecorator("id");
        getFieldDecorator("status");
        getFieldDecorator("photo");
        return (
            <Modal
                visible={visible}
                title="用户管理"
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
                            rules: [
                                {pattern: new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/),message: '请输入正确的手机号'},
                                { required: true, message: '请输入电话号码!' }
                            ],
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
                        })(
                            <Select>
                                <Option key="在线" value="在线">{"在线"}</Option>
                                <Option key="离线" value="离线">{"离线"}</Option>
                            </Select>
                        )}
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