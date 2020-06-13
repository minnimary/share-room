import React, {Component} from 'react';
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import '../../css/Feedback.css'
import {message, Modal, notification, List, Avatar, Form, Input, Button, Descriptions} from "antd";
import {Link} from "react-router-dom";

import { createHashHistory } from 'history';
import parseJson from "parse-json";
let history=createHashHistory();

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state={
            list:[],
            messageVisible:false,
            roomId:'',
            id:'',
            msg:'',
            content:'',
            title:''
        }
    }


    componentDidMount() {
        axios('http://www.crazyrobot.xyz:8081/share-room/fault/faultList',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200) {
                        console.log(res.data.data)
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
        axios('http://www.crazyrobot.xyz:8081/share-room/fault/selectFault',{
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

                    message.loading('查看反馈列表',1,this.setState({
                        messageVisible:true,
                        id:res.data.data.id,
                        roomId:res.data.data.roomId,
                        title:res.data.data.title,
                        content:res.data.data.content,
                        msg:res.data.data.img

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
                else if (res.data.code==500) {
                    message.error(res.data.msg)
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
                <PageHeader title={'查找自习室'}></PageHeader>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item) => (
                        <List.Item onClick={this.check.bind(this,item)}>
                            <List.Item.Meta
                                id={'first'}
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<span>{item.title}</span>}

                            />
                            <List.Item.Meta
                                id={'last'}
                                title={<span>{item.id}</span>}

                            />

                        </List.Item>


                    )}
                />
                <Modal
                    title="房间设置"
                    visible={this.state.messageVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                >
                    <Descriptions >

                        <Descriptions.Item label="反馈号：">
                            {this.state.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="房间号：">
                            {this.state.roomId}
                        </Descriptions.Item>
                        <Descriptions.Item label="故障原因">
                            {this.state.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="上传图片">
                            {this.state.msg}
                        </Descriptions.Item>
                        <Descriptions.Item label="反馈内容">{this.state.content}</Descriptions.Item>

                    </Descriptions>
                </Modal>


            </div>
        )
    }
}



export default Feedback;
