import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import CustomerPage from "./routes/CustomerPage";
import CategoryPage from './routes/CategoryPage';
import OrderPage from './routes/OrderPage'
import ProductPage from './routes/ProductPage'
import AddressPage from './routes/AddressPage'
import CommentPage from './routes/CommentPage'

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
          <Route path="/address" exact component={AddressPage} />
          <Route path="/comment" exact component={CommentPage} />
        </IndexPage>
      </Switch>
    </Router>
  );
}

export default RouterConfig;