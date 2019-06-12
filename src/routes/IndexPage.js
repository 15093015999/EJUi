//主页面

import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Link } from 'dva/router';
import { Menu, Icon,PageHeader } from 'antd';
const { SubMenu } = Menu;
// 首页
class IndexPage extends React.Component {
  handleClick = e => {
    // console.log('click ', e);
  };
  title="爱管不管管理系统"
  constructor() {
    super();
  }

  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {

    return (
      <div className={styles.home}>
        <div className={styles.nav}>
          <Menu
            onClick={this.handleClick}
            style={{ height: '100%',width:'100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={this.state.collapsed}
          >
            <SubMenu title={<span><Icon type="unordered-list" /><span>导航栏</span></span>}>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="appstore" />
                    <span>管理服务</span>
                  </span>
                }
              >
                <Menu.Item key="1"><Link to="/customer">用户管理</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/category">分类管理</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/order">订单管理</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/product">商品管理</Link></Menu.Item>
              </SubMenu>
            </SubMenu>

          </Menu>
        </div>
        <div className={styles.right}>
          <header className={styles.header}>
            <PageHeader onBack={() => window.history.back(-1)} title={this.title} />
          </header>
          <main className={styles.main}>
            {this.props.children ? this.props.children : <h1 className={styles.title}>Welcome!</h1>}
          </main>
        </div>
      </div>
    );
  }

}

export default connect()(IndexPage);
