import React, {Component} from 'react';
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import '../../css/DelRoom.css'
import {message, Modal, notification, List, Avatar, Form, Input, Button, Descriptions} from "antd";
import {Link} from "react-router-dom";

import { createHashHistory } from 'history';
let history=createHashHistory();

class DeleRoom extends Component {
    constructor(props) {
        super(props);
        this.state={
            list:[],
            messageVisible:false,
            roomId:'',
            roomName:'',
            price:'',
            status:'',
            room:'',
            roomNum:'',
            prices:''
        }
    }


    componentDidMount() {
        axios('http://www.crazyrobot.xyz:8081/share-room/room/selectRoom',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200) {
                        // console.log(res.data.data)
                        this.setState({
                            list:res.data.data
                        })

                    }
                }
                else{
                    if (res.data.code==403) {
                        notification['warning']({
                            message: 'Warning',
                            description:res.data.msg

                        }).then(() => history.push('Login'))

                    }
                    else if (res.data.code==500){
                        message.error(res.data.msg)
                    }
                }
                return Promise.resolve(res)
            })
    }

    check=(item)=>{
        axios('http://www.crazyrobot.xyz:8081/share-room/room/getRoom',{
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

                    message.loading('查看房间',1,this.setState({
                        messageVisible:true,
                        roomName:res.data.data.roomName,
                        price:res.data.data.price,
                        address:res.data.data.address.lng+res.data.data.address.lat,
                        status:res.data.data.status,
                        roomId:res.data.data.id
                    }))
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
                    message.error(res.data.msg)
                }
            }
            return Promise.resolve(res)
        })

    }

    dele=()=>{
        axios('http://www.crazyrobot.xyz:8081/share-room/room/deleteRoom',{
            method:'POST',
            withCredentials: true,
            changeOrigin: true,
            headers:{
                'token':window.localStorage['token'],
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: {

                id:this.state.roomId
            }
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200) {
                        message.success('删除成功！！',1,history.goBack(-2))

                    }
                }
                else{
                    if (res.data.code==403) {
                        notification['warning']({
                            message: 'Warning',
                            description:res.data.msg

                        }).then(() => history.push('Login'))


                    }
                    else if (res.data.code==500){
                        message.error(res.data.msg)
                    }
                }
                return Promise.resolve(res)
            })
    }

    OnCloseModal=()=>{
        this.setState({
            messageVisible:false
        })
    }

    onFinish=(values)=>{

        axios('http://www.crazyrobot.xyz:8081/share-room/room/updateRoom',{
                method:'POST',
                withCredentials: true,
                changeOrigin: true,
                headers:{
                    'token':window.localStorage['token'],
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                data: {
                    roomName:values.room,
                    price:values.prices,
                    id:this.state.roomId
                }
            }

        ).then(res => {
            if (res.data.success === true) {
                message.success("修改成功",history.push('Client/Admin'))

            } else {
                if (res.data.code == 403) {
                    message.warning(res.data.msg, 1)
                     history.push('Login')
                }
                else if (res.data.code==500) {
                    message.warning(res.data.msg, 1)

                }
            }

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
                <PageHeader title={'查找自习室'}></PageHeader>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item) => (
                        <List.Item onClick={this.check.bind(this,item)}>
                            <List.Item.Meta
                                id={'first'}
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<span>{item.roomName}</span>}
                                description={<span>{item.gmtModified}</span>}
                            />
                            <List.Item.Meta
                                id={'last'}
                                title={<span>{item.price}</span>}

                            />

                        </List.Item>


                    )}
                />
                <Modal
                    title="房间设置"
                    visible={this.state.messageVisible}
                    footer={null}
                    onCancel={this.OnCloseModal}

                >
                    <Form  name="basic" onFinish={this.onFinish}>
                        <Form.Item
                            name={'roomNum'}
                            label="房号"

                        >
                            <Input defaultValue={this.state.roomId} disabled={true}/>
                        </Form.Item>
                        <Form.Item
                            name={'room'}
                            label="房价名"

                        >
                            <Input placeholder={this.state.roomName} />
                        </Form.Item>
                        <Form.Item
                            name={'phoneNum'}
                            label="经纬度坐标"

                        >
                            <Input placeholder={this.state.address} disabled={true}/>
                        </Form.Item>
                        <Form.Item name={'prices'} label="单价"

                        >
                            <Input placeholder={this.state.price} />
                        </Form.Item>
                        <Form.Item name={'status'} label="房间状态：0为空闲 1为使用中"

                        >
                            <Input placeholder={this.state.status} disabled={true}/>
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit" style={{margin:'0 5px'}}>
                                确认修改
                            </Button>
                            <Button type="danger" htmlType="button" style={{margin:'0 5px'}} onClick={this.dele}>
                                确认删除
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>


            </div>
        )
    }
}



export default DeleRoom;
