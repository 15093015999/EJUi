import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import CustomerPage from "./routes/CustomerPage";
import CategoryPage from './routes/CategoryPage';
import OrderPage from './routes/OrderPage'
import ProductPage from './routes/ProductPage'
<<<<<<< HEAD
import AddressPage from './routes/AddressPage'
import CommentPage from './routes/CommentPage'
=======
import WaiterPage from './routes/WaiterPage'
>>>>>>> fa00e500d6cde98d6a64e0a23bb2c8bae9ea4129

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <IndexPage>
          <Route path="/customer" exact component={CustomerPage} />
          <Route path="/category" exact component={CategoryPage} />
          <Route path="/order" exact component={OrderPage} />
          <Route path="/product" exact component={ProductPage} />
<<<<<<< HEAD
          <Route path="/address" exact component={AddressPage} />
          <Route path="/comment" exact component={CommentPage} />
=======
          <Route path="/waiter" exact component={WaiterPage}/>
>>>>>>> fa00e500d6cde98d6a64e0a23bb2c8bae9ea4129
        </IndexPage>
      </Switch>
    </Router>
  );
}

export default RouterConfig;