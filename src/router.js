import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import IndexPage from './routes/IndexPage';
import CustomerPage from "./routes/CustomerPage";
import CategoryPage from './routes/CategoryPage';
import OrderPage from './routes/OrderPage'
import ProductPage from './routes/ProductPage'
import AddressPage from './routes/AddressPage'
import CommentPage from './routes/CommentPage'
import WaiterPage from './routes/WaiterPage'
import CustomerDetails from './routes/CustomerDetails'
import ErrorPage from './routes/ErrorPage'


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {/* <Route path="/index" exact component={IndexPage} /> */}
        <IndexPage>
          <Switch>
            <Redirect path='/' exact to="/customer" />
            <Route path="/customer" exact component={CustomerPage} />
            <Route path="/category" component={CategoryPage} />
            <Route path="/order" component={OrderPage} />
            <Route path="/product" component={ProductPage} />
            <Route path="/address" component={AddressPage} />
            <Route path="/comment" component={CommentPage} />
            <Route path="/waiter" component={WaiterPage} />
            <Route path="/customerDetails" component={CustomerDetails}/>
            <Route path="*" component={ErrorPage} />
          </Switch>
        </IndexPage>
        <Route path="*" component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;