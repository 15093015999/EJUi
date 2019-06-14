// //主页面
import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Link } from 'dva/router';
import { Layout, Menu, Breadcrumb, Icon, PageHeader, Button } from 'antd';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class IndexPage extends React.Component {
  state = {
    collapsed: false,
  };
  
onCollapse = collapsed => {
  this.setState({ collapsed });
};

defaultSelected=(path)=>{
  switch(path){
    case '/customer':return ['1'];
    case '/category':return ['2'];
    case '/order':return ['3'];
    case '/product':return ['4'];
    case '/address':return ['5'];
    case '/comment':return ['6'];
    case '/waiter':return ['7'];
    default: return ['1'];
  }
}

render() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
        <div className={styles.logo} ></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={this.defaultSelected(this.props.location.pathname)}>
          <Menu.Item key="1">
            <Link to="/customer">
              <span>
                <Icon type="smile" />
                <span className={styles.navitem}>用户管理</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="2">
            <Link to="/category">
              <span>
                <Icon type="folder" />
                <span className={styles.navitem}>分类管理</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="3">
            <Link to="/order">
              <span >
                <Icon type="file-text" />
                <span className={styles.navitem}>订单管理</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="4">
            <Link to="/product">
              <span>
                <Icon type="shopping-cart" />
                <span className={styles.navitem}>商品管理</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="5">
            <Link to="/address">
              <span>
                <Icon type="home" />
                <span className={styles.navitem}>地址管理</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="6">
            <Link to="/comment">
              <span>
                <Icon type="like" />
                <span className={styles.navitem}>评论管理</span>
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/waiter">
              <span>
                <Icon type="team" />
                <span className={styles.navitem}>服务员管理</span>
              </span>
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>其他</span>
              </span>
            }
          >
            <Menu.Item key="8">Tom</Menu.Item>
            <Menu.Item key="9">Bill</Menu.Item>
            <Menu.Item key="10">Alex</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <PageHeader
          onBack={() => window.history.back(-1)}
          title="爱管不管"
          extra={[
            // <Button key="3">Operation</Button>,
            // <Button key="2">Operation</Button>,
            <Button key="1" type="primary">
              登录
            </Button>
          ]}
        />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{this.props.children ? this.props.children : <h1 className={styles.title}>Welcome!</h1>}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Kalearn ©2019</Footer>
      </Layout>
    </Layout>
  );
}
}
export default connect()(IndexPage);
