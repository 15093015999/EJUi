import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

// 首页
function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>易洁家政服务</h1>
      {/* <div className={styles.welcome} /> */}
      <ul className={styles.list}>
        {/* <li> <code></code> </li> */}
        <li><a href="#/customer">顾客管理</a></li>
        <li><a href="#/category">分类管理</a></li>
        <li><a href="#/order">订单管理</a></li>
        <li><a href="#/product">商品管理</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
