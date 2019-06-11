import React from 'react';
// import { connect } from 'dva';
import styles from './IndexPage.css';
import { Menu } from 'antd';

class IndexPage extends React.Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render(){
    return(
      <div className={styles.normal}>
        <div className={styles.normal}>
          <h1 className={styles.title}>易洁家政服务</h1>
        </div>
        {/* <div className={styles.welcome} />
          <ul className={styles.list}></ul>
        </div> */}
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="alipay">
            <a href="http://localhost:8000/#/customer" target="_blank" rel="noopener noreferrer">
              <h1 className={styles.title}>顾客管理</h1>
            </a>
          </Menu.Item>

          {/* <Menu.Item key="alipay">
            <a href="http://localhost:8000/#/course" target="_blank" rel="noopener noreferrer">
              课程管理
            </a>
          </Menu.Item> */}

          </Menu>
      </div>
    )
  }
}

// function IndexPage() {
//   return (
//     <div className={styles.normal}>
//       <h1 className={styles.title}>Yay! Welcome to dva!</h1>
//       <div className={styles.welcome} />
//       <ul className={styles.list}>
//         <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
//         <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
//       </ul>
//     </div>
//   );
// }

// IndexPage.propTypes = {
// };

export default (IndexPage);
