import React from 'react';
import PageHeader from "../../components/PageHeader";
import money from '../../img/money1.svg'
import axios from "axios";
import '../../css/wechatPay.css';

import {message, notification} from 'antd';
import {createHashHistory} from 'history';

let history = createHashHistory()

let dotLoading = null;
let p = "001122";

export  default class deposit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            inputPwd: [],//初始那六个框的密码输入框数组
            dotIndex: 0,//初始的三个等待点
            showPayLoading: false,
            showPayPanel: false,
        }

        }


    nextDot=()=>{//先设置如何实现三个点循环跳转显示 自定义函数进行处理
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
    pushPwd=(pwd)=> {

        this.state.inputPwd.push(pwd);
        this.setState({
            inputPwd: this.state.inputPwd
        });

        if (this.state.inputPwd.length === 6) {
            this.checkPwd();
        }

    }

    //进行对pushPwd赋给初始数组的值进行map遍历


    renderPwd=()=>{
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

    checkPwd=()=>{
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
                message.error("密码错误，请重新输入！");
            } else {


                axios('/wallet/updateWallet', {
                    method: 'POST',
                    headers: {
                        'token': window.localStorage['token']
                    },
                    data: {
                        money: 100,      //充值传正数，消费传负数
                        type: 3,     //消费种类 0是充值 1消费 2是提现 3是押金
                    }
                })
                    .then(res => {
                        if (res.data.success === true) {
                            if (res.data.code == 200) {
                                this.setState({
                                    balanceL: res.data.data
                                },history.push('Wallet'))
                            }
                        } else {
                            if (res.data.code == 403) {
                                notification['warning']({
                                    message: 'Warning',
                                    description: res.data.msg

                                });

                                history.push('Login')

                            }
                        }
                        return Promise.resolve(res)
                    })


                message.success("充值成功！");
            }
        }, 800);
    }

    panelClose=()=>{
        this.setState({
            showPayPanel: false
        })
    }

    render()
{
    return (
        <div style={{
            width: '100%',//一定要设宽度
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',//这样可以使中间那个直接水平居中


        }}>

            <PageHeader title={'押金支付'}></PageHeader>
            <div style={{
                backgroundColor: '#ff9459',
                width: '100%',
                height: '200px',
                borderRadius: '0% 0% 30% 30%',
                position: 'relative',//由于title那儿只能显示rela（它里边有自己的父子关系）所以不能设置title的
                                     //但是这儿如果设置为ab就会从父级那儿边框开始，所以就只能把这儿设为相对
                //除了特殊位置的设为ab其他或父级都为rela
            }}>
            </div>

            {/*底部空白处*/}
            <div style={{

                // position:'relative',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '500px',
                    backgroundColor: 'rgb(250,129,76)',
                    width: '80%',
                    height: '60px',
                    borderRadius: '30px',
                    boxShadow: '5px 10px 15px 2px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '25px',
                    color: 'white'

                }}
                     onClick={()=>{


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
                         //alert(this.state.list[this.state.selectIndex].amount);
                     }}>

                    确认支付
                </div>
            </div>

            {/*中间叠层*/}
            <div style={{
                backgroundColor: 'white',
                width: '90%',
                height: '250px',
                position: 'absolute',
                top: '160px',
                borderRadius: '5px',
                boxShadow: '5px 10px 15px 2px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',


            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(' + money + ')',
                    marginBottom: '40px',
                    backgroundSize: 'cover',

                }}>

                </div>
                <div>尚未支付押金，如需使用请先支付押金</div>
            </div>

            {/*这儿相当于是js操作显示样式  jsx语言  不是单纯html样式设置  而是一个三目运算符进行判断*/}
            {//默认为false  但是当上边确认支付的点击事件被激活时  就会执行函数里改为true
                //为true时就将这个页面显示出来 全局背景进行黑色透明
                this.state.showPayLoading ?
                    <div className="pay-mask">
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

                                    <span className={'title-text'}>请输入支付密码</span>
                                    <span className={'box-icon'}>
                                        <span className={'close'} onClick={this.panelClose}> </span>
                                    </span>
                                </div>
                                <div className={'box-price'}>
                                    {/*¥30 这儿不应该写死 而是应该是与select那个金额动态一致 之前点击确认时 可以alert那个选项金额  引用到这儿*/}
                                    ¥ <span className={'payAmount'}>100</span>
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


    )
}}

