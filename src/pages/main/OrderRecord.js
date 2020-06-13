import React, {Component} from 'react';
import PageHeader from "../../components/PageHeader";
import Study from '../../img/advertise.svg';
import Right from '../../img/right.svg'
import axios from "axios";
import '../../css/OrderRe.css'
import {message, Modal, notification, List, Avatar, Spin, Form, Input, Button, Descriptions} from "antd";
import {Link} from "react-router-dom";
import OrderDetail from './OrderDetail'

import { createHashHistory } from 'history';


let history=createHashHistory();

class OrderRecord extends Component {
    constructor(props) {
        super(props);
        this.state={
            titleProp:'',
            list:[],
            costList:[],
            messageVisible:false,
            orderId:'',
            roomName:'',
            startTime:'',
            endTime:'',
            orderType:'',
            fee:'',

        }
    }
    componentDidMount() {
        axios('http://www.crazyrobot.xyz:8081/share-room/order/selectList',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200) {
                            this.setState({
                                list:res.data.data
                            })
                        this.state.list.map(item=>{
                            if (parseInt(item.type)===1){
                                let costListX=this.state.costList
                                this.setState({
                                    costList:[...costListX,item]
                                })

                            }

                        })
                        console.log(this.state.costList)
                     }
                }
                else{
                    if (res.data.code==403) {
                        notification['warning']({
                            message: 'Warning',
                            description:res.data.msg
                        });

                        history.push('Login')

                    }
                    else {
                        notification['warning']({
                            message: 'Warning'+res.data.code,
                            description:res.data.msg
                        });
                    }
                }
                return Promise.resolve(res)
            })
    }




    getDetail=(item)=>{

        axios('http://www.crazyrobot.xyz:8081/share-room/order/selectOne',{
            method:'GET',
            withCredentials:true,
            params:{
                id:item.id
            },
            headers:{
                'token':window.localStorage['token']
            }
        }).then(res=>{

            if (res.data.success===true){
                if (res.data.code==200) {
                    // console.log(item.serialNumber)
                    message.loading('查看订单详情',1,this.setState({
                        messageVisible:true,
                        orderId:res.data.data.serialNumber,
                        roomName:res.data.data.roomName,
                        startTime:res.data.data.gmtCreate,
                        endTime:res.data.data.gmtModified,
                        orderType:res.data.data.type,
                        fee:res.data.data.spend


                }))
            }}
            else{
                if (res.data.code==403) {
                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg
                    });

                    history.push('Login')
                }
                else {
                    notification['warning']({
                        message: 'Warning'+res.data.code,
                        description:res.data.msg
                    });
                }

            }
            return Promise.resolve(res)
        })

    }

    handleOk = e => {

        this.setState({
            messageVisible: false,
        });
    };

    handleCancel = e => {

        this.setState({
            messageVisible: false,
        });
    };



    render() {

        return (
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
            }} >
                <PageHeader title={'我的订单'}></PageHeader>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.costList}
                    renderItem={(item) => (
                        <List.Item onClick={this.getDetail.bind(this,item)} >
                        <List.Item.Meta
                               id={'first'}
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<span>共计：{item.userTime}</span>}
                                description={<span>{item.gmtModified}</span>}
                            />
                            <List.Item.Meta
                                id={'last'}
                                title={<span>{item.spend}</span>}

                            />

                        </List.Item>


                    )}
                />
                <Modal
                    title="订单详情"
                    visible={this.state.messageVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                >
                    <Descriptions >

                        <Descriptions.Item label="订单号：">
                            {this.state.orderId}

                        </Descriptions.Item>
                        <Descriptions.Item label="房间名：">
                            {this.state.roomName}

                        </Descriptions.Item>
                        <Descriptions.Item label="开始使用时间">
                            {this.state.startTime}

                        </Descriptions.Item>
                        <Descriptions.Item label="结束使用时间">
                            {this.state.endTime}

                        </Descriptions.Item>
                        <Descriptions.Item label="支付价格">{this.state.fee}</Descriptions.Item>
                        <Descriptions.Item label="订单类型">{this.state.orderType}

                        </Descriptions.Item>
                    </Descriptions>
                </Modal>


            </div>
        )
    }
}



export default OrderRecord;
