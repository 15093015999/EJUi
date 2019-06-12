import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Link} from 'dva/router';
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;
// 首页
class IndexPage extends React.Component {
  handleClick = e => {
    // console.log('click ', e);
  };

  constructor() {
    super();
  }


  render() {

    return (
      <div className={styles.home}>
        <div className={styles.nav}>
        <Menu
          onClick={this.handleClick}
          style={{ height:'100%'}}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
         <SubMenu title={<Icon  type="unordered-list" />}>
         <SubMenu
          key="sub1"
          title={
            <span>
              <Icon  type="appstore" />
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
        <main className={styles.main}>
        {this.props.children}
        </main>
        </div>
    );
  }

}

export default connect()(IndexPage);
