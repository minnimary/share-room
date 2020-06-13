import React, {Component} from 'react';
import UsingHeader from "../../components/UsingHeader";
import '../../css/UsingRoom.css'

import axios from "axios";
import {message, Descriptions, notification, Form, Input, Button} from "antd";
import {Link} from "react-router-dom";
import { createHashHistory } from 'history';

let history=createHashHistory();

let dotLoading = null;
let p = "001122";
class UsingRoom extends Component {
    constructor(props) {
        super(props);
        this.state={
            roomName:'',
            id:'',
            price:'',
            createDate:'',
            createTime:'',
            inputPwd: [],//初始那六个框的密码输入框数组
            dotIndex: 0,//初始的三个等待点
            showPayLoading: false,
            showPayPanel: false,
            cost:''
        }

    }


        componentDidMount() {

        localStorage.removeItem('qrScanner')

        this.setState({
            id:parseInt(localStorage.getItem('usingId')),
            roomName:localStorage.getItem('usingName'),
            price:parseInt(localStorage.getItem('usingPrice')),
            createDate:localStorage.getItem('usingTime').split('T').shift(),
            createTime:localStorage.getItem('usingTime').split('T').pop(),

                   })

    }

    //验证密码
    checkPwd() {
        //输入面板消失，支付动画面板显示
        this.setState({
            showPayLoading: true,
            showPayPanel: false
        });
        this.nextDot();
        setTimeout(() => {//过了两秒后这个等待小黑框消失 然后将支付密码框显示出来
            this.setState({
                showPayLoading: false
            });
            clearTimeout(dotLoading);//虽然上边设置为false 但是为了避免占用内存 消耗资源

            //将密码数组拼接成6位字符串
            let inputPwdStr = this.state.inputPwd.join("");

            this.setState({
                inputPwd: []
            });

            //和正确密码字符串进行比较
            if (p !== inputPwdStr) {
                message.warning("密码错误，请重新输入！");
            } else {
                //进行正确操作
                // localStorage.setItem("balance",balanceL);2
                axios('http://47.103.27.32:8081/share-room/room/finishedRoom',{
                    method:'GET',
                    withCredentials:true,
                    params:{
                        id:this.state.id
                    },
                    headers:{
                        'token':window.localStorage['token']
                    }
                }).then(res=>{
                    if (res.data.success===true){
                        if (res.data.code==200) {
                            localStorage.removeItem('usingId')
                            localStorage.removeItem('usingName')
                            localStorage.removeItem('usingPrice')
                            localStorage.removeItem('usingTime')
                            message.success("订单支付成功！欢迎再次使用",1.5,history.push('App'));
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
                                    description:res.data.msg
                                });
                            }
                        }
                    }
                    return Promise.resolve(res)
                })

            }
        }, 800);

    }

    nextDot() { //先设置如何实现三个点循环跳转显示 自定义函数进行处理
        if (this.state.dotIndex === 2) {//如果为2则跳转到0那儿重新循环
            this.setState({//重新渲染新的样式
                dotIndex: 0
            });
        } else {//其余为非2的  不是0就是1  所以一并处理  都加一进行样式新渲染
            this.setState({
                dotIndex: this.state.dotIndex + 1
            });
        }
        dotLoading = setTimeout(() => {//设置定时器进行下一个点的样式切换
            this.nextDot();
        }, 300);//0.3秒

    }

    //微信支付输入框的密码输入六个空
    //依次将输入的这个密码推入这个队列中  将这个新的队列赋给初始的那个空数组
    pushPwd(pwd) {

        this.state.inputPwd.push(pwd);
        this.setState({
            inputPwd: this.state.inputPwd
        });

        if (this.state.inputPwd.length === 6) {
            this.checkPwd();
        }

    }

    //进行对pushPwd赋给初始数组的值进行map遍历


    renderPwd() {
        let arr = this.state.inputPwd.map((item, index) =>
            //这个只是为了使里边那个密码点能够flex所以多加了个框 底层
            <span className={'password-input'}>
                 <span className={'pwd-dot'}> </span>
            </span>/*这儿才是小黑点的样式*/
        );
        //应该在这儿设置一个length判断是否输满了  没满就继续循环将小黑点放入
        if (this.state.inputPwd.length < 6) {
            let len = 6 - this.state.inputPwd.length;
            for (let i = 0; i < len; i++) {
                arr.push(<span className={'password-input'}> </span>);
            }

        }
        return arr;//如果不return得话输入完毕后这个input大框会整个刷新为空  因为没有将整个arr返回回来给页面
    }
    panelClose=()=>{
        this.setState({
            showPayPanel: false
        })
    }


    endTime=()=>{
        //获取金额
        axios('http://47.103.27.32:8081/share-room/room/selectOrderMoney',{
            method:'GET',
            withCredentials:true,
            params:{
                id:this.state.id
            },
            headers:{
                'token':window.localStorage['token']
            }
        }).then(res=>{
            console.log(res.data)
            if (res.data.success===true){
                if (res.data.code==200) {
                    this.setState({
                       cost:res.data.data
                    })
                    //显示微信支付框
                    this.setState({//在上边全局声明中默认false 当点击确认后才显示这个
                        showPayLoading: true
                    });
                    this.nextDot();
                    setTimeout(() => {//过了两秒后这个等待小黑框消失 然后将支付密码框显示出来
                        this.setState({
                            showPayLoading: false,
                            //再点击 等待支付时间到后 set 消失  同时set panel显示出来
                            showPayPanel: true//试着将支付的金额跟select的一致  动态同步
                        });
                        clearTimeout(dotLoading);//虽然上边设置为false 但是为了避免占用内存 消耗资源
                    }, 1000);//需要将那个定时器移除
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
                            message: res.data.code+'Warning',
                            description:res.data.msg
                        });
                    }
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
                <UsingHeader title={'房间使用中'}></UsingHeader>
                <div style={{
                    width: '100%',
                    height:'690px',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                }}
                >
                    <div style={{
                        width: '100%',
                        height:'10%',
                    }}
                    >


                    </div>
                    <div style={{
                        width: '100%',
                        height:'36%',
                        // backgroundColor:'#7ae96a'
                        color:'#999999'
                    }}
                    >
                        <div style={{
                            width: '80%',
                            height:'22%',
                            margin:'0 auto'
                        }}

                        >
                            正在使用的房间号为：<span className={'dataTag'}>{localStorage.getItem('usingId')}</span>
                        </div>
                        <div style={{
                            width: '80%',
                            height:'22%',
                            margin:'0 auto'
                        }}
                             className={'dataTag'}
                        >
                            正在使用的房间名为：<span className={'dataTag'}>{localStorage.getItem('usingName')}</span>
                        </div>
                        <div style={{
                            width: '80%',
                            height:'22%',
                            margin:'0 auto',
                            borderBottom:'0.4px #cdcdcd solid'
                        }}
                             className={'dataTag'}>
                            房间每小时收费标准为：<span className={'dataTag'}>{localStorage.getItem('usingPrice')}元/小时</span>
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        height:'48%',
                        // backgroundColor:'#4fc8ff'
                        textAlign:'center'
                    }}
                    >

                            <div style={{
                                    fontFamily:'cursive',
                                    fontSize:'24px',
                                    color:'#c3c3c3'
                                }}>开始使用时间</div>

                            <div style={{
                                fontWeight: '600',
                                fontSize: '22px',
                                margin: '18px',
                            }}>{localStorage.getItem('usingTime').split('T').shift()}</div>
                            <div style={{
                                    fontWeight: '800',
                                    fontSize: '40px',
                                    margin: '18px',
                                }}>{localStorage.getItem('usingTime').split('T').pop()}</div>
                    </div>
                    <div style={{
                        width: '100%',
                        height:'30%',
                        textAlign:'center'
                    }}
                    >
                        <Button type="primary" danger block style={{
                            width:'70%',
                            height:'40px'
                        }}
                            onClick={this.endTime}

                        >
                            结束使用
                        </Button>
                    </div>
                    {
                        localStorage.getItem('usingRoomData')
                    }
                </div>


                {/*这儿相当于是js操作显示样式  jsx语言  不是单纯html样式设置  而是一个三目运算符进行判断*/}
                {//默认为false  但是当上边确认支付的点击事件被激活时  就会执行函数里改为true
                    //为true时就将这个页面显示出来 全局背景进行黑色透明
                    this.state.showPayLoading ? <div className="pay-mask">
                        <div className="pay-panel">
                            <span className="pay-img"> </span>
                            <span className="pay-text">微信支付</span>
                            <span className="pay-loading">
                        <span className={this.state.dotIndex === 0 ? "pay-dot pay-dot-current" : "pay-dot"}> </span>
                        <span className={this.state.dotIndex === 1 ? "pay-dot pay-dot-current" : "pay-dot"}> </span>
                        <span className={this.state.dotIndex === 2 ? "pay-dot pay-dot-current" : "pay-dot"}> </span>
                    </span>
                        </div>
                    </div> : null//false是啥都不显示
                }

                {
                    this.state.showPayPanel ?
                        <div className="pay-panel-mask">
                            <div className={'Payment'}>
                                <div className={'pay-box'}>
                                    <div className={'box-title'}>
                                    <span className={'box-icon'}>
                                        <span className={'close'} onClick={this.panelClose}> </span>
                                    </span>
                                        <span className={'title-text'}>请输入支付密码</span>
                                    </div>
                                    <div className={'box-price'}>
                                        {/*¥30 这儿不应该写死 而是应该是与select那个金额动态一致 之前点击确认时 可以alert那个选项金额  引用到这儿*/}
                                        ¥ <span
                                        className={'payAmount'}>{this.state.cost}</span>
                                    </div>
                                    <div className={'box-method'}>
                                        <div className={'methodPay'}>支付方式</div>
                                        <div className={'methodCharge'}>
                                            <div className={'totem'}>
                                                <span className={'totemImg'}> </span>
                                            </div>
                                            零钱
                                        </div>
                                    </div>
                                    <div className={'box-password'}>
                                        {this.renderPwd()}

                                    </div>
                                </div>
                            </div>
                            <div className={'keyboard'}>
                                <div className={'keyboard-row'}>
                                <span className={'keyboard-btn'} onClick={() => {
                                    this.pushPwd(1);
                                }}>    1
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(2);
                                    }}>    2
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(3);
                                    }}>    3
                                </span>

                                </div>
                                <div className={'keyboard-row'}>
                                <span className={'keyboard-btn'} onClick={() => {
                                    this.pushPwd(4);
                                }}>    4
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(5);
                                    }}>    5
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(6);
                                    }}>    6
                                </span>

                                </div>
                                <div className={'keyboard-row'}>
                                <span className={'keyboard-btn'} onClick={() => {
                                    this.pushPwd(7);
                                }}>    7
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(8);
                                    }}>    8
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(9);
                                    }}>    9
                                </span>

                                </div>
                                <div className={'keyboard-row'}>
                                <span className={'keyboard-btn'} onClick={() => {
                                    this.pushPwd();
                                }}>
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd(0);
                                    }}>    0
                                </span>
                                    <span className={'keyboard-btn'} onClick={() => {
                                        this.pushPwd();
                                    }}>
                                </span>

                                </div>
                            </div>
                        </div> : null
                }
            </div>
        );
    }
}



export default UsingRoom;
