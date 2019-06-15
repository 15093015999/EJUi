import React from 'react';
import Exception from 'ant-design-pro/lib/Exception';
import 'ant-design-pro/dist/ant-design-pro.css';

export default class ErrorPage extends React.Component {
    render() {
        return(<Exception type="404" />);
    }
}