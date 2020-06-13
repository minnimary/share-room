import React from 'react'
import PageHeader from "../../components/PageHeader";
import Study from '../../img/advertise.svg';
import Right from '../../img/right.svg'
import '../../css/Client.css'

import axios from "axios";
import {message,Modal,Form,Input,Button} from "antd";
import {Link} from "react-router-dom";
import { createHashHistory } from 'history';


let history=createHashHistory();
export default class Client extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            listItem:[],
            onshow:'hidden',
            visible: false,
            messageVisible:false,
            UserPhonenum:'',
            reName:'',
            rePhone:'',
            rePwd:''
        };
        this.exitLogin=this.exitLogin.bind(this);
        this.contect=this.contect.bind(this);

    }


    componentDidMount() {
        axios('http://www.crazyrobot.xyz:8081/share-room/user/selectRole',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200){
                        if (res.data.data==1) {
                            this.setState({
                                onshow:'',

                            })
                        }


                    }
                }else {
                    if (res.data.code == 403) {

                        message.warning(res.data.msg);
                        history.push('Login')
                    }
                }
            })
        axios('http://www.crazyrobot.xyz:8081/share-room/user/select',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
            method:'GET',

        }).then(res=>{
            if (res.data.success===true){
                if (res.data.code==200){

                        this.setState({
                            UserPhonenum:res.data.data.mobile,

                        })



                }
            }else {
                if (res.data.code == 403) {

                    message.warning(res.data.msg);
                    history.push('Login')
                }
            }
        })

    }


    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    contect=()=>{
        this.setState({
            visible: true,
        });
    }
    // enterOrderRecord=()=>{
    //
    //
    //     history.push('OrderRecord')
    // }

    enterSetting=()=>{


        this.setState({
            messageVisible: true,
        });
    }

    exitLogin=()=>{
        axios('http://www.crazyrobot.xyz:8081/share-room/user/logout',{
            method:'GET',
            headers:{
                'token':window.localStorage['token']
            },
        })
        localStorage.removeItem('token');
    }

    onFinish = values => {
        console.log(values)
        axios('http://www.crazyrobot.xyz:8081/share-room/user/update',{
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
            method: 'POST',
            data:{
                name: values.username,
                mobile: values.phoneNum,     //传入小于等于这五个
                passwd: values.password

            }
        }).then(res => {
            if (res.data.success===true) {
                if (res.data.code==200){
                    message.success('修改成功', 1,this.OnCloseModal)


                }
            }
    })
    }

    OnCloseModal=()=>{
        this.setState({
            messageVisible:false
        })
    }

    render() {
        return(
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
            }}>
                <PageHeader></PageHeader>
                <div style={{
                    height:'220px',
                    width:'100%',
                    backgroundColor:'#ff9459',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',//这样可以使中间那个直接水平居中
                    justifyContent:'flex-start',
                }}>
                    <div style={{
                        backgroundColor:'#fff',
                        width:'100px',
                        height:'100px',
                        borderRadius:'50px',
                        backgroundImage:'url('+Study+')',
                        backgroundSize:'cover',

                    }}>
                    </div>
                    <span style={{
                        marginTop:'48px',
                        fontSize:'24px',
                        color:'white'
                    }}>
                        {this.state.UserPhonenum}
                    </span>
                </div>
                <div style={{
                    // width:'100%',
                     flex:1,
                    // position:'absolute',
                    //top:'200px',
                    backgroundColor:'white',
                    borderRadius:'25px 25px 0 0',
                    //height: '500px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',//这样可以使中间那个直接水平居中
                    // justifyContent:'space-between',

                }}>

                    <Link style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',//这样可以使中间那个直接水平居中
                        justifyContent:'space-between',
                        width:'100%',
                        borderBottom:'2px solid #ccc',
                        height:'56px',
                        // paddingTop:'30px',

                    }}
                         // onClick={this.enterOrderRecord}
                        to={'/OrderRecord'}
                   >
                        <span style={{ margin: '0 20px',color:'rgba(0, 0, 0, 0.65)' }}  >使用记录</span>
                        <span style={{
                            width:'25px',
                            height:'25px',
                            backgroundImage:'url('+Right+')',
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            margin: '0 20px',
                        }}></span>
                    </Link>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',//这样可以使中间那个直接水平居中
                        justifyContent:'space-between',
                        width:'100%',
                        borderBottom:'2px solid #ccc',
                        height:'56px',


                    }}
                         onClick={this.contect}>

                        <span style={{margin: '0 20px',}} >
                            客服中心
                        </span>
                        <span style={{
                            width:'25px',
                            height:'25px',
                            backgroundImage:'url('+Right+')',
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            margin: '0 20px',
                        }}></span>
                    </div>
                    <Modal
                        title="联系信息"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p>联系电话：13166991301</p>

                        <p>Q               Q：867756573</p>
                    </Modal>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',//这样可以使中间那个直接水平居中
                        justifyContent:'space-between',
                        width:'100%',
                        borderBottom:'2px solid #ccc',
                        height:'56px',
                        // paddingTop:'30px',

                    }}
                         onClick={this.enterSetting}
                    >
                        <span style={{ margin: '0 20px', }}  >修改信息</span>
                        <span style={{
                            width:'25px',
                            height:'25px',
                            backgroundImage:'url('+Right+')',
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            margin: '0 20px',
                        }}></span>
                    </div>
                    <Modal
                        title="修改信息"
                        visible={this.state.messageVisible}
                        footer={null}
                        onCancel={this.OnCloseModal}

                    >
                        <Form  name="basic" onFinish={this.onFinish} >
                            <Form.Item
                                name={'username'}
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                className={'itemLabel'}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'phoneNum'}
                                label="手机号"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                                className={'itemLabel'}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name={'password'} label="登录密码"
                                rules={[
                                    {
                                        required: true,
                                    }

                                ]}
                                       className={'itemLabel'}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                    确认修改
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',//这样可以使中间那个直接水平居中
                        justifyContent:'space-between',
                        width:'100%',
                        borderBottom:'2px solid #ccc',
                        height:'56px',

                    }}>
                        {/*<Link to={'Login'} style={{color:'#717171'}} onClick={this.exitLogin}>*/}
                        <span style={{margin: '0 20px',}}>退出登录</span>
                        <Link to={'Login'}  onClick={this.exitLogin}
                            style={{
                            width:'25px',
                            height:'25px',
                            backgroundImage:'url('+Right+')',
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            margin: '0 20px',
                        }}>

                        </Link>
                        {/*</Link>*/}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',//这样可以使中间那个直接水平居中
                        justifyContent:'space-between',
                        width:'100%',
                        borderBottom:'2px solid #ccc',
                        height:'60px',

                    }} hidden={this.state.onshow}

                    >
                        <span style={{margin: '0 20px',}}>管理员设置</span>
                        <Link to={'Admin'} style={{
                            width:'25px',
                            height:'25px',
                            backgroundImage:'url('+Right+')',
                            backgroundSize:'contain',
                            backgroundRepeat:'no-repeat',
                            margin: '0 20px',
                        }}>

                        </Link>
                    </div>




                </div>
            </div>
        )
    }


}
