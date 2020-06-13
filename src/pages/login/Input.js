import React from 'react'
import axios from 'axios'
import PageHeader from '../../components/PageHeader';
import Headphoto from "../../img/headphoto.svg";
import { message,notification,Button} from 'antd';
import { createHashHistory } from 'history';


export default class Input extends React.Component {
    constructor(props){
        super(props);
        this.state={//这里的属性名要与各自取得名或者id一直
            username:'',
            password:'',
            password2:'',
            email:'',
            phoneNum:'',
            checkCode:'',

            btnSendCheckCode:'获取验证码',
            btnSendCodeStatus:false
        }



    }
    handleChange=(e)=>{
        // 2更新对应状态  1处理输入数据的改变
        this.setState({  //不加括号就为一个单纯的属性 得变为动态得变量
            [e.target.name]:e.target.value //name不是属性名 而是name变量的值
        })
    }
    register=()=>{
        let history=createHashHistory()

        axios('http://www.crazyrobot.xyz:8081/share-room/user/register',{
            method: 'post',
            withCredentials:true,
            changeOrigin:true,
            headers: {
                        "Content-type": " application/json"
                    },
            data: {
                name: this.state.username,
                passwd: this.state.password,
                mobile:this.state.phoneNum,
                code:this.state.checkCode,
            }
        }).then(res => {
                if (res.data.success===true) {
                    if (res.data.code==200){
                        message
                            .loading('正在注册', 2)
                            .then(() => message.success('注册成功', 1))
                            .then(()=> history.goBack(-1))

                    }
                }
                else {

                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg

                    });

                        // message.error(res.data.msg);


                }
                return Promise.resolve(res)
            })


    }
    sendMsgCode=()=>{


        axios('http://www.crazyrobot.xyz:8081/share-room/user/sendMsgCode',{
            method: 'POST',
            data: {
                mobile:this.state.phoneNum,
            }
        })
            .then(res=>{
                if (res.data.success===true) {
                    if (res.data.code===200){
                        message.success(res.data.msg);
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

                        }, 1000)
                    }
                }
                else{
                    message.error(res.data.msg);



                }
            })
    }
    render() {
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
                <PageHeader title={'我要注册'} ></PageHeader>
                <div id={'photo'} style={{
                    width:'100%',
                    height:'160px',
                    // backgroundColor:'#eaa',
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
                        backgroundImage:'url('+Headphoto+')',
                        backgroundSize:'cover',
                    }}>
                    </div>
                </div>
                <form id={'register-message'} style={{
                    width:'78%',
                    height:'300px',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',

                }}>
                    <div id={'name'} style={{
                        flex:'1',
                        width:'100%',//不叫这个flex不显示出来
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',

                    }}>
                        <span style={{
                            width:'80px',
                            // backgroundColor:'#fef'
                            lineHeight:'50px',

                        }}>
                            账号：
                        </span>
                        <input style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: 'none',
                            margin: '5px 0',
                            textIndent:'10px',

                        }}
                               name={'username'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入用户名'}
                        />

                    </div>
                    <div id={'pwd'} style={{
                        flex:'1',
                        width:'100%',//不叫这个flex不显示出来
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',

                    }}>
                        <span style={{
                            width:'80px',
                            // backgroundColor:'#fef'
                            lineHeight:'50px',

                        }}>
                            密码：
                        </span>
                        <input type="password"
                               style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: 'none',
                            margin: '5px 0',
                            textIndent:'10px',

                        }}
                               name={'password'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入密码'}
                        />
                    </div>
                    <div id={'repwd'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <span style={{
                            width:'80px',
                            lineHeight:'50px',
                        }}>
                            确认密码：
                        </span>
                        <input type="password"
                               style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: 'none',
                            margin: '5px 0',
                            textIndent:'10px',

                        }}
                               name={'password2'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请重新输入密码'}
                        />
                    </div>
                    <div id={'email'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <span style={{
                            width:'80px',
                            // backgroundColor:'#fef'
                            lineHeight:'50px',

                        }}>
                            邮箱：
                        </span>
                        <input style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: 'none',
                            margin: '5px 0',
                            textIndent:'10px',
                        }}
                               name={'email'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入邮箱地址（选填）'}
                        />
                    </div>
                    <div id={'phoneNum'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <span style={{
                            width:'80px',
                            // backgroundColor:'#fef'
                            lineHeight:'50px',

                        }}>
                            手机号：
                        </span>
                        <span style={{
                            flex:'1',
                            border: 'none',
                            margin: '5px 0',
                            borderRadius: '10px 0 0 10px',
                            backgroundColor: 'aliceblue',
                            display:'flex',
                            flexDirection:'row',
                            height:'40px',//这儿必须加个高度不然水平flex会撑大


                        }}>
                            <input style={{
                                border: 'none',
                                textIndent: '10px',
                                flex:'1',
                                width:'100px',//这儿必须设置好不然超长
                                borderRadius: '10px 0 0 10px',
                            }}
                                   name={'phoneNum'}
                                   onChange={this.handleChange.bind(this)}
                                   placeholder={'请输入手机号'}
                            />
                            {/*<span style={{*/}
                            {/*    width:'80px',*/}
                            {/*    paddingTop:'8px',*/}
                            {/*    backgroundColor:'#ff9459',*/}
                            {/*    fontSize: '14px',*/}
                            {/*    textAlign: 'center',*/}
                            {/*}}*/}

                            {/*>*/}
                                <Button type='primary'
                                        style={{
                                            height: '40px',
                                            backgroundColor: '#ff9459',
                                        }}
                                        onClick={this.sendMsgCode}
                                        disabled={this.state.btnSendCodeStatus}
                                >
                                {this.state.btnSendCheckCode}
                                </Button>
                            {/*</span>*/}
                        </span>

                    </div>
                    <div id={'checkNum'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <span style={{
                            width:'80px',
                            // backgroundColor:'#fef'
                            lineHeight:'50px',

                        }}>
                            验证码：
                        </span>
                        <input style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: 'none',
                            margin: '5px 0',
                            textIndent:'10px',
                        }}
                               name={'checkCode'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'六位验证码'}
                        />
                    </div>

                </form>

                <div style={{
                    width: '100%',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div
                        style={{
                        backgroundColor:'#ff9459',
                        width:'50%',
                        height:'50px',
                        borderRadius:'10px',
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                    }}
                        onClick={this.register}
                    >
                        提交申请
                    </div>
                </div>

            </div>
        )
    }
}
