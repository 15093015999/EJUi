import React from 'react';
import { Form, Modal, Input, Select, InputNumber, Tree, Icon, } from 'antd'
const { TreeNode } = Tree;
class CategoryTree extends React.Component {

    displayTree(tree){
        let treeNode = []
        tree.forEach((node)=>{
            treeNode.push(<TreeNode key={node.id} title={node.name}>{this.backTree(node)}</TreeNode>)
        })
        return treeNode
    }

    backTree(node){
        let Children=[]
        node.children.forEach((child)=>{
            Children.push(<TreeNode key={child.id} title={child.name}>{this.backTree(child)}</TreeNode>)
        })
        return Children;
    }


    render() {
        // 父组件传递给子组件值
        const { visible, onCancel, onCreate, form, tree } = this.props;
        const { getFieldDecorator } = form;
        // 将表单中没有出现的值做一个双向数据绑定
        getFieldDecorator("id");
        return (
            <Modal
                visible={visible}
                title="分类生成树"
                okText="导出"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
                    {this.displayTree(tree)}
                </Tree>
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
})(CategoryTree);