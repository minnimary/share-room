import React, {Component} from 'react';
import OrderHeader from "../../components/OrderHeader";
import '../../css/OrderDe.css'

import axios from "axios";
import {message, Descriptions, notification, Form, Input, Button} from "antd";
import {Link} from "react-router-dom";
import { createHashHistory } from 'history';
import learn from "../../img/white.jpg";

let history=createHashHistory();

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            roomName:'',
            id:'',
            price:'',
            qr:''
        }
    }
    componentDidMount() {
        if (localStorage.getItem('qrScanner')){
            axios('http://47.103.27.32:8081/share-room/room/getRoom',{
                            method:'GET',
                            withCredentials:true,
                            params:{
                                id:localStorage.getItem('qrScanner')
                                    //
                            },
                            headers:{
                                'token':window.localStorage['token']
                            }
                        }).then(res=>{
                            if (res.data.success===true){
                                if (res.data.code==200) {
                                    this.setState({
                                        roomName:res.data.data.roomName,
                                        id:res.data.data.id,
                                        price:res.data.data.price,
                                        qr:localStorage.getItem('qrScanner')
                                    })
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
                                else if (res.data.code!==403) {
                                    if (res.data.code==500){
                                        notification['warning']({
                                            message: 'Warning',
                                            description:res.data.msg
                                        });
                                    }
                                    else {
                                        notification['warning']({
                                            message: 'Warning',
                                            description:'请求参数有误,请重新扫码使用！'+res.data.msg
                                        });
                                    }
                                    history.goBack(-1)
                                }

                            }
                            return Promise.resolve(res)
                        })
        }
        // else {
        //     message.error('无法获取到扫码信息，请重新扫码使用',1.5,history.goBack(-1))
        //
        // }
   }
    onFinish=()=>{
        axios('http://47.103.27.32:8081/share-room/room/userRoom',
            {
                method:'GET',
                withCredentials:true,
                params:{
                    id:this.state.qr
                    //
                },
                headers:{
                    'token':window.localStorage['token']
                }
            }).then(res=>{
            if (res.data.success===true){
                if (res.data.code==200) {
                    axios('http://47.103.27.32:8081/share-room/room/getUserOrderInfo',{
                        method:'GET',
                        withCredentials:true,
                        headers:{
                            'token':window.localStorage['token']
                        }
                    }).then(res=>{
                        if (res.data.success===true){
                            // if (res.data.data.flag) {
                            // console.log(res.data)
                                localStorage.setItem('usingId',res.data.data.id)
                                localStorage.setItem('usingName',res.data.data.roomName)
                                localStorage.setItem('usingPrice',res.data.data.price)
                                localStorage.setItem('usingTime',res.data.data.gmtCreate)
                                history.push('UsingRoom')
                            // }

                        }
                        else {
                            if (res.data.code==403) {
                                notification['warning']({
                                    message: 'Warning',
                                    description:res.data.msg
                                });
                                history.push('Login')

                            }
                            else if (res.data.code==500) {
                                notification['warning']({
                                    message: 'Warning',
                                    description:res.data.msg
                                });
                                history.goBack(-1)
                            }

                        }
                        return Promise.resolve(res)
                    })


                    // localStorage.setItem('usingRoomData',this.state.qr)
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
                else if (res.data.code==500) {
                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg
                    });

                    history.goBack(-1)
                }
            }
                return Promise.resolve(res)
            })

    }

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
                <OrderHeader title={'使用信息'}></OrderHeader>
                <div style={{
                    width: '100%',
                    height:'690px',
                }}
                >
                    <div style={{
                        backgroundImage:'url('+learn+')',
                        width: '100%',//一定要设宽度
                        height: '210px',
                        backgroundSize:'contain',
                    }}>

                    </div>

                 <Form  name="basic" onFinish={this.onFinish} style={{
                        margin:'40px 40px'
                        }}

                 >
                            <Form.Item
                                name={'username'}
                                label="自习室名字："
                                className={'special-Tag'}
                            >
                                <Input defaultValue={this.state.roomName} key={this.state.roomName}
                                       style={{
                                    border:'none',
                                    fontSize:'large',
                                    textAlign:'center',
                                           borderBottom:' black 0.4px dotted'
                                }} />
                            </Form.Item>
                            <Form.Item
                                name={'phoneNum'}
                                label="自习室编号："
                                className={'special-Tag'}
                            >
                                <Input defaultValue={this.state.id} key={this.state.id}
                                       style={{
                                    border:'none',
                                    fontSize:'large',
                                    textAlign:'center',
                                           borderBottom:' black 0.4px dotted'
                                }} />
                            </Form.Item>
                            <Form.Item name={'password'} label="单价：" style={{color:'red'}}
                                       className={'special-Tag'}
                            >
                                <Input defaultValue={this.state.price+'元/小时'} style={{
                                    border:'none',
                                    fontSize:'large',
                                    color:'red',
                                    textAlign:'center'
                                }}
                                       key={this.state.price}
                                />
                            </Form.Item>

                            <Form.Item className={'btnV'}>
                                <Button type="primary" htmlType="submit">
                                    确认使用
                                </Button>
                            </Form.Item>
                        </Form>

                </div>
           </div>
        );
    }
}



export default OrderDetail;
