import React from 'react';
import axios from 'axios'
import PageHeader from "../../components/PageHeader";
// import Btn_value from "../components/Btn_value";
// import RMB from '../img/RMB.svg'
import '../../css/wechatPay.css';
import {message, notification} from 'antd';
import {createHashHistory} from 'history';

let history = createHashHistory()
// 定义两个样式分别为选中 未选中
const btnSelectCss = {//未选中css
    width: '30%',
    height: '60px',
    border: '1px solid #ccc',
    borderRadius: '16px',
    display: 'flex',//不用textAlign原因是 它只水平居中文本
    justifyContent: 'center',//而flex是垂直水平都剧中
    alignItems: 'center',
    marginLeft: '2%',//调整各项距离
    marginTop: '25px',

};
const btnSelectedCss = {//选中css
    width: '30%',
    height: '60px',
    border: '1px solid #ccc',
    borderRadius: '16px',
    display: 'flex',//不用textAlign原因是 它只水平居中文本
    justifyContent: 'center',//而flex是垂直水平都剧中
    alignItems: 'center',
    marginLeft: '2%',//调整各项距离
    marginTop: '25px',
    backgroundColor: '#4c8bda',
    color: '#fff'
}

let dotLoading = null;
let p = "001122";
export default class Recharge extends React.Component {
    constructor(props) {
        super(props);

        this.state = {//设置目的是为了方便辨别选中项  选中与否
            selectIndex: 0,//默认选中项为第0项
            list: [    //直接用list（列表）数组来存选项  不用单独一个一个div出来显示
                {amount: 20},//解决这个样式问题的就是下边renderLIST这个函数 里边
                {amount: 30},//它显示判断是否选中来选用那个样式来显示  而不是我们之前那种先定死在hover
                {amount: 50},
                {amount: 100},
                {amount: 200}
            ],
            inputPwd: [],//初始那六个框的密码输入框数组
            dotIndex: 0,//初始的三个等待点
            showPayLoading: false,
            showPayPanel: false,
            // balance:parseInt(localStorage.getItem('balance') == null?0:localStorage.getItem('balance')),
            balanceL: ''
        }

    }

    /** 渲染选择项 */
    renderList() {//首先就得先将list里的数据依次遍历一遍 这儿得用着state属性指针为当前指针this
        const arr = this.state.list.map((item, index) =>
            <div key={item + index} onClick={() => {//用一个点击事件来定义一个匿名函数进行处理
                if (index === this.state.selectIndex) {//这儿是优化项 先往下看
                    return;
                }
                this.setState({//当选中某一项时，获取到该项index 将其标为选中状态
                    selectIndex: index//由于会涉及到改变状态所以setState 且改变后 会重新渲染这个样式
                });
            }} style={this.state.selectIndex === index ? btnSelectedCss : btnSelectCss}>
                {item.amount}元
            </div>
        );
        return arr;
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

                //更新余额
                let amount = this.state.list[this.state.selectIndex].amount;
                let balanceL = this.state.balanceL;
                balanceL = balanceL + amount;
                this.setState({
                    balanceL: balanceL
                });
                // localStorage.setItem("balance",balanceL);

                axios('http://47.103.27.32:8081/share-room/wallet/updateWallet', {
                    method: 'POST',
                    headers:{
                        'token':window.localStorage['token']
                    },
                    data: {
                        money: amount,      //充值传正数，消费传负数
                        type: 0,     //消费种类 0是充值 1消费 2是提现
                    }
                })
                    .then(res=>{
                        if (res.data.success===true){
                            if (res.data.code==200) {
                                this.setState({
                                    balanceL:res.data.data
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
                        }
                        return Promise.resolve(res)
                    })


                message.success("充值成功！",1.5,history.goBack(-1));
            }
        }, 800);

    }

    componentDidMount() {//将next函数进行挂在使用
        axios('http://47.103.27.32:8081/share-room/wallet/findWallet', {
            method: 'GET',
            withCredentials: true,
            changeOrigin: true,
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res => {
                if (res.data.success === true) {
                    // console.log(res.data.data.money)
                    this.setState({
                        balanceL: res.data.data.money
                    })

                } else {
                    if (res.data.code == 403) {
                        message
                            .then(() => message.warning(res.data.msg, 1))
                            .then(() => history.push('Login'))
                    }
                }

            })
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

    render() {
        return (
            <div id={'recharge'} style={{
                // backgroundColor:'#1ff6c4',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/*页面头部导航栏*/}
                <PageHeader title={'我要充值'}/>

                {/*卡片*/}
                <div style={{
                    width: '94%',
                    height: '200px',
                    //backgroundColor:'#ff9b69',
                    borderRadius: '6px',
                    margin: '0 auto',//实现水平居中 但是又要有top
                    marginTop: '10px',//可以这样在其后单独设置  因为这样可以把它原值覆盖了
                    marginBottom: '20px',
                    display: 'flex',//同理  这儿也会将里边的span变为块级
                    flexDirection: 'column',//就会实现并列 居中显示
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'red',//css进行渐变显示  我就一直考虑是canvas然后不会
                    backgroundImage: 'linear-gradient(to right, red , orange)'
                }}>
                <span style={{
                    fontSize: '25px',
                    color: '#fff'
                }}>余额</span>
                    <span style={{
                        fontSize: '40px',
                        color: '#fff'
                    }}>¥{this.state.balanceL}</span>
                </div>

                {/*充值金额选项块*/}
                <div style={{
                    width: '94%',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    margin: '0 auto',//也是让它先水平居中
                    marginTop: '10px',//再在设置top覆盖原值
                    display: 'flex',//将子内容分成三部分
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    boxShadow: '0px 0px 6px 0px #e3e2e2'//盒子阴影设置
                }}>
                    {/*充值金额title项设置*/}
                    <div style={{//这个框没有设置height因为里边会根据内容动态伸缩
                        height: '50px',
                        width: '100%',
                        display: 'flex',//也是将行转块操作
                        flexDirection: 'row',
                        alignItems: 'center',//让内容垂直居中 不然会贴顶显示

                    }}>
                        {/*一个是左边那个橙色竖条*/}
                        <span style={{
                            height: '26px',
                            width: '4px',//设置一个容器让背景色充满就行
                            borderRadius: '2px',
                            backgroundColor: 'red',
                            marginLeft: '16px',
                            marginRight: '8px'
                        }}>

                    </span>

                        {/*一个是title加粗*/}
                        <span style={{fontWeight: 'bold'}}>充值金额</span>
                    </div>

                    {/*金额范围选项框设置*/}
                    <div style={{
                        minHeight: '20px',//在无内容的时候最小显示大小 有内容按内容大小自动扩大
                        borderTop: '1px solid #eee',//整个充值金额板块的内置分界线
                        borderBottom: '1px solid #eee',//不用设置title底部和最好空白块的顶部
                        width: '100%',//直接设中间块的上下就行
                        // paddingTop:'16px',//然后将其内容距离这个线一定距离显示就行
                        paddingBottom: '25px',
                        display: 'flex',//将子内容flex 不用先均分成两行 然后又列操作
                        flexDirection: 'row',//而是将其直接横向显示，然后不够进行换行
                        flexWrap: 'wrap'//这样就能够让选项栏数量不固定，根据之后后台加减的item量动态排布出来
                        // 这样就不会是定死的选项卡了
                    }}>
                        {this.renderList()}
                    </div>
                    <div style={{
                        height: '40px',
                        width: '100%',
                    }}>

                    </div>
                </div>
                <div id={'recharge_btn'} style={{
                    // backgroundColor:'#1fa4c4',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/*设置 确认支付后的微信等待支付小黑框*/}
                    <span style={{
                        width: '92%',
                        height: '50px',
                        backgroundColor: '#ff7f2c',
                        // backgroundColor:'rgb(250,129,76)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        color: 'white',
                        borderRadius: '25px',
                        boxShadow: '5px 10px 15px 2px rgba(0,0,0,0.1)',


                    }} onClick={() => {
                        let list = this.state.list;

                        //选中项在数组中的下标
                        let arrIndex = this.state.selectIndex;

                        //获取选中项
                        let selectedItem = list[arrIndex];

                        //获取金额
                        let amount = selectedItem.amount;


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
                    确认充值
                </span>
                    <span></span>
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
                                        className={'payAmount'}>{this.state.list[this.state.selectIndex].amount}</span>
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
                                        {/*<span className={'password-input'}>
                                        <span className={'pwd-dot'}></span>
                                    </span>
                                    <span className={'password-input'}></span>
                                    <span className={'password-input'}></span>
                                    <span className={'password-input'}></span>
                                    <span className={'password-input'}></span>
                                    <span className={'password-input'}></span>*/}
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

