import React from 'react'
import {Button,Tabs,Table,Icon,} from 'antd'
import axios from '../utils/axios';


class CustomerDetails extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      customer:{},
      address:[],
      orders:[]
    }
  }

  componentDidMount(){
    let payload = this.props.location.payload;
    if(payload){
      this.setState({customer:payload})
      this.loadAddress();
      this.loadOrders();
    } else {
      this.props.history.push("/customer")
    }
  }
  //加载地址信息
  loadAddress(){
    axios.get("/address/findCustomerAddressById",{
      params:{id:this.props.location.payload.id}
    }
    )
    .then((result)=>{
      this.setState({
        address:result.data
      })
    })
  }
   //加载订单信息
   loadOrders(){
    axios.post("/order/queryBasic",
      {customerId:this.props.location.payload.id}
    )
    .then((result)=>{
      this.setState({
        orders:result.data
      })
    })
  }


  render(){
    const { TabPane } = Tabs;
    
    function callback(key) {
      console.log(key);
    } 
          //顾客的地址信息

          let columnsAdds=[{
            title:'省',
            dataIndex:'province'
          },{
            title:'市',
            dataIndex:'city'
          },{
            title:'区',
            dataIndex:'area'
          },{
            title:'详细地址',
            dataIndex:'address'
          },{
            title:'电话',
            dataIndex:'telephone'
          }]

         // 顾客的订单信息
          let columns=[{
            title:'订单号',
            dataIndex:'orderId'
        },{
            title:'顾客姓名',
            dataIndex:'customerName'
        },{
            title:'服务员姓名',
            dataIndex:'waiterName'
        },{
            title:'地址',
            dataIndex:'address'
        },{
            title:'总价',
            dataIndex:'total'
        },{
            title:'订单时间',
            dataIndex:'orderTime'
        }  ]

    return (
      <div>
        <Button type="link" onClick={()=>{this.props.history.goBack()}}><Icon type="rollback" /></Button>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="基本信息" key="1">
            <p>姓&nbsp;&nbsp;名：&nbsp;{this.state.customer.realname}</p>
            <p>电&nbsp;&nbsp;话：&nbsp;{this.state.customer.telephone}</p>
             <tr>
               <td valign="top">头&nbsp;&nbsp;像：&nbsp;</td>
                <td>
                    <img alt="图片未找到..." width={40} height={40} src={"http://47.100.17.233:5000/avatars/"+this.state.customer.photo}/>
                </td>
            </tr>
          </TabPane>
          <TabPane tab="服务地址" key="2">
              <div >
                  <Table
                  size="small"
                  loading={this.state.loading }
                  columns={columnsAdds}
                  dataSource={this.state.address}/>
              </div>
          </TabPane>
          <TabPane tab="订单" key="3">
              <div>
                  <Table
                  rowKey="orderId"
                  size="small"
                  loading={this.state.loading }
                  columns={columns}
                  dataSource={this.state.orders}/>
              </div>
          </TabPane> 
        </Tabs>
        
      </div>
    )
  }
}

export default CustomerDetails;