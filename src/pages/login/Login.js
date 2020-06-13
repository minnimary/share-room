import React from 'react'
import axios from 'axios'
import Study from '../../img/advertise.svg';
import User from '../../img/uid.svg';
import Pwd from '../../img/pwd.svg'
import {Link} from "react-router-dom";
import { message,notification} from 'antd';
import { createHashHistory } from 'history';
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            user:'',
            pwd:'',
            token:''
        }
    }
    handleChange(e){
        this.setState({
            [e.target.id]:e.target.value,
        })
    }
    componentDidMount() {
        localStorage.removeItem('qrScanner')
    }

    login=()=>{
        let history=createHashHistory();
        axios('http://www.crazyrobot.xyz:8081/share-room/user/login',{
            method:'post',
            withCredentials:true,
            changeOrigin:true,
            data:{
                mobile: this.state.user,
                passwd: this.state.pwd
            }
        }).then(res=>{
            if (res.data.success===true) {
                if (res.data.code===200){
                    // console.log(res.data.data);
                    this.setState({
                        token:parseInt(localStorage.setItem('token',res.data.data))
                    });

                        message
                            .loading('正在登录', 1)
                            .then(() => message.success('登录成功', 1))
                            .then(()=> history.push('/App'))


                }
            }
            else {
                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg

                    });
            }
            return Promise.resolve(res)
        })
    }
    render(){
        return (
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
                backgroundColor:'#ff9459',
                backgroundImage:'linear-gradient(to bottom, rgb(255, 148, 89) , white)'
            }}>
                <div style={{
                    width: '100%',
                    height: '40px',}}>
                </div>
                <div id={'photo'} style={{
                    width:'100%',
                    height:'200px',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    <div style={{
                        width:'100px',
                        height:'100px',
                        backgroundColor:'white',
                        borderRadius:'50px',
                        backgroundImage:'url('+Study+')',
                        backgroundSize:'cover',
                    }}>
                    </div>
                </div>

                <form id={'login'} style={{
                    width:'100%',
                    height:'200px',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                }}>
                    <div style={{
                        width: '90%',
                        height: '50px',
                        marginTop:'30px',
                        display: 'flex',
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor:'white',
                            backgroundImage:'url('+User+')',
                            backgroundSize:'auto',
                            backgroundRepeat:'no-repeat',
                            backgroundPosition:'center',

                        }}>
                        </span>
                        <input type="text" style={{
                            width:'60%',
                            height:'40px',
                            border:'none',
                            textIndent:'12px',
                        }}
                               id={'user'}
                            onChange={this.handleChange.bind(this)}
                               name={'mobile'}
                               placeholder={'请输入用户名'}
                        />
                    </div>
                    <div style={{
                        width: '90%',
                        height: '90px',
                        display: 'flex',
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor:'white',
                            backgroundImage:'url('+Pwd+')',
                            backgroundSize:'cover',
                        }}>
                        </span>
                        <input type="password" style={{
                            width:'60%',
                            height:'40px',
                            border:'none',
                            textIndent:'12px',
                        }}
                               id={'pwd'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入密码'}
                               name={'passwd'}
                        />
                    </div>
                    <div style={{
                        width: '62%',
                        height: '24px',
                        display: 'flex',
                        justifyContent:'flex-end',
                        alignItems:'center',

                    }}>
                        <Link to={'/Reset'} style={{
                            textDecoration: 'none',
                            color: 'black',
                        }}>
                        忘记密码
                        </Link>
                    </div>
                </form>
                <div style={{
                    width:'68%',
                    height:'50px',
                    backgroundColor:'rgb(238, 130, 72)',
                    marginTop: '68px',
                    textAlign:'center',
                    lineHeight:'50px',
                    fontSize:'18px',
                    letterSpacing:'8px',
                }}
                     onClick={this.login}
                >
                    登录
                </div>
                <div style={{
                    width:'68%',
                    height:'44px',
                    textAlign:'center',
                    lineHeight:'44px',
                    fontSize:'12px',

                }}>
                    <span>还没有账号？</span>
                    <Link to={'/Input'} style={{
                        color:'orange',
                    }}>
                        立即注册
                    </Link>

                </div>

            </div>


    )}}
