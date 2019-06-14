import React from 'react';
import { Modal, Tree } from 'antd'
import { connect } from 'dva';
const { TreeNode } = Tree;

class CategoryTree extends React.Component {

    dispalyTree(tree) {
        let treeTag = []
        tree.forEach((node) => {
            treeTag.push(<TreeNode key={node.id} title={node.name}>{this.backTree(node)}</TreeNode>)
        })
        return treeTag

    }
    backTree(node) {
        let treeTag = []
        node.children.forEach((child) => {
            treeTag.push(<TreeNode key={child.id} title={child.name}>{this.backTree(child)}</TreeNode>)
        })
        return treeTag
    }

    render() {

        const { visible, onCancel, tree } = this.props;

        return (
            <Modal
                visible={visible}
                title="分类树"
                okText="导出"
                cancelText="取消"
                onCancel={onCancel}
            >
                <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
                    {this.dispalyTree(tree)}
                </Tree>
            </Modal>
        );
    }
}
export default connect()(CategoryTree);