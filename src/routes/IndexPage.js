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
        <li><a href="http://localhost:8000/#/customer">顾客管理</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
