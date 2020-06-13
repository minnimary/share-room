import React, {Component } from 'react';
import axios from 'axios'
import {message, Select, Input, Form, Button, Space, notification} from 'antd';
import '../../css/Reset.css'
import PageHeader from "../../components/PageHeader";
import { createHashHistory } from 'history';
let history=createHashHistory();
const { Option } = Select;


const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select
            defaultValue="86"
            style={{
                width: 70,
            }}
        >
            <Option value="86" key={'1'}>86+</Option>
            <Option value="87" key={'2'}>87+</Option>
        </Select>
    </Form.Item>
);

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state={
            btnSendCheckCode:'获取验证码',
            btnSendCodeStatus:false,
            phoneNum:'',
            checkCode:'',
            pwd:''

        }


    }
    formRef = React.createRef();


    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value,
        })

    }

    sendMsgCode=(e)=>{

        axios('http://www.crazyrobot.xyz:8081/share-room/user/sendMsgCode',{
            method: 'POST',
            data: {
                mobile:this.state.phoneNum,
            }
        })
            .then(res=>{
                if (res.data.success===true) {
                    if (res.data.code===200){
                        message.success('验证码已发送，请注意查收',2);
                        let maxTime=60;
                        this.timer = setInterval(() => {
                            if (maxTime > 0) {
                                --maxTime;
                                this.setState({
                                    btnSendCheckCode: '重新获取' + maxTime,
                                    btnSendCodeStatus: true
                                },()=>{
                                    if (maxTime<=0) {
                                        clearInterval(this.timer);
                                        this.setState({
                                            btnSendCheckCode: '获取验证码',
                                            btnSendCodeStatus: false
                                        })
                                    }
                                })
                            }

                        }, 6000)
                    }
                }
                else{
                    message.error(res.data.msg);
                    clearInterval(this.timer);
                    this.setState({
                        btnSendCheckCode: '获取验证码',
                        btnSendCodeStatus: false
                    })

                }
            })

    }


        onFinish = values => {
            axios('/share-room/user/updatePwd',{
                method: 'POST',
                withCredentials:true,
                changeOrigin:true,
                headers:{
                    'Content-Type':'application/json'
                },
                data: {
                    mobile: this.state.phoneNum,
                    passwd:this.state.pwd,
                    code:this.state.checkCode
                }
            }).then(res => {
                if (res.data.success===true) {
                    if (res.data.code==200){

                          message.success('修改成功', 1,history.goBack(-1))


                    }
                }
                else {

                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg

                    });
                    clearInterval(this.timer);
                    this.setState({
                        btnSendCheckCode: '获取验证码',
                        btnSendCodeStatus: false
                    })




                }
                return Promise.resolve(res)
            })

        };

        onReset = () => {
            this.formRef.current.resetFields();
            clearInterval(this.timer);
            this.setState({
                btnSendCheckCode: '获取验证码',
                btnSendCodeStatus: false
            })
        };




    render() {

        return (
            <div>
                <PageHeader title={'找回用户'} ></PageHeader>

                <Form  ref={this.formRef} name="control-ref" onFinish={this.onFinish}>

                        <Form.Item
                            // hasFeedback
                            name="phone"
                            label="手机号"
                            rules={[
                                {
                                    required: true,
                                    message: '手机号不能为空!',

                                },
                            ]}

                        >
                            <Input
                                name={'phoneNum'}
                                addonBefore={prefixSelector}
                                style={{
                                    width: '100%',
                                }}
                                onChange={this.handleChange}
                                maxLength={11}

                                placeholder="请输入正确的手机号"
                            >
                            </Input>
                        </Form.Item>
                        <Form.Item
                            name="手机验证码"
                            label="验证码"
                            rules={[
                                {
                                    required: true,
                                    message: '验证码不能为空!',
                                },
                            ]}
                        >
                            <Input addonAfter={
                                <Button onClick={this.sendMsgCode}
                                        disabled={this.state.btnSendCodeStatus}
                                        style={
                                            {
                                            width:'70px',
                                            height:'30px',
                                            border:0,
                                            padding:'0',
                                            backgroundColor:'transparent'
                                        }
                                        }
                                >
                                    {this.state.btnSendCheckCode}
                                </Button>
                             }
                                   name={'checkCode'}
                                   onChange={this.handleChange}
                                   maxLength={6}
                                   placeholder="请输入六位验证码"
                            >
                            </Input>

                        </Form.Item>
                        <Form.Item
                            name="repwd"
                            label="重置密码"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空!',
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="重新设置登录密码"
                                allowClear
                                onChange={this.handleChange}
                                name={'pwd'}

                            >

                            </Input.Password>
                        </Form.Item>
                        <Form.Item >
                            <Space>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                            <Button htmlType="button" onClick={this.onReset}>
                               清空
                            </Button>
                            </Space>
                        </Form.Item>
                    </Form>


            </div>
        );
    }
};



export default Reset
