import React from 'react';
import PageHeader from "../../components/PageHeader";
import study from '../../img/study.jpg'
import axios from 'axios'
import { createHashHistory } from 'history';
import { message,notification,Modal, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

let history=createHashHistory();
const { confirm } = Modal;

export  default class Wallet extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            balanceW:'',
            visible:false

        }
        this.RechargeW=this.RechargeW.bind(this);

    }


    componentDidMount() {

        axios('http://www.crazyrobot.xyz:8081/share-room/wallet/findWallet',{
            headers:{
                'token':window.localStorage['token']
            },
        })
            .then(res=>{
                if (res.data.success===true){
                    if (res.data.code==200) {
                        this.setState({
                            balanceW:res.data.data.money
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

    }
    RechargeW=()=>{

        history.push('Recharge');

    }

    showModal = () => {
        this.setState({
            visible: true,
        });

    };

    handleOk = e => {

        this.setState({
            visible: false,
        });
        axios('http://www.crazyrobot.xyz:8081/share-room/wallet/updateWallet',{
            method:'POST',
            headers:{
                'token':window.localStorage['token']
            },
            data:{
                money: -this.state.balanceW,
                type: 2,
            }

        }).then(res=>{
            if (res.data.success===true){
                if (res.data.code==200){
                    this.setState(
                       {balanceW:res.data.data}
                    )
                    message.success('提现成功',1.5)
                }
            }
            else {
                if (res.data.code == 403) {
                    message.warning(res.data.msg);
                    history.push('Login')
                }
            }

        })
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        return(
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
            }} >
                <PageHeader title={'我的钱包'}></PageHeader>
                 <div style={{
                    width: '100%',//一定要设宽度
                    height: '220px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',//这样可以使中间那个直接水平居中
                    // backgroundColor:'#aaeeff',
                    backgroundImage:'url('+study+')',
                     backgroundSize:'100% 100%',
                     backgroundRepeat:'no-repeat'

                }}>

                </div>
                <div style={{
                    width: '100%',//一定要设宽度
                    height: '180px',
                    position: 'relative',
                    backgroundColor:'#aaeeff',
                    borderRadius: '0 100% 100% 0px',
                    margin:'10px 10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems:'center',

                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent:'center',
                        alignItems:'center',
                        width: '50%',
                        height: '80%',
                        // background: 'aliceblue',

                    }}>
                        <span style={{
                            // marginTop: '24px',
                            fontSize: '30px',
                            fontWeight:'bolder'
                        }}>
                            余额
                        </span>
                        <span style={{
                            marginTop: '24px',
                            fontSize: '20px',
                        }}>
                            {this.state.balanceW}元
                        </span>
                    </div>
                    <div style={{
                        width:'100px',
                        height:'50px',
                        backgroundColor:'#ffa960',
                        margin:'0px 13%',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        fontSize: '20px',
                        boxShadow: '5px 10px 15px 2px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                    }}
                         onClick={this.showModal}
                    >
                        提现
                    </div>
                    <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        取出押金将无法使用，是否将押金取出?
                    </Modal>

                </div>

                <div style={{
                    width: '100%',//一定要设宽度
                    height: '180px',
                    position: 'relative',
                    backgroundColor:'#ff8957',
                    borderRadius: '0 100% 100% 0px',
                    margin:'10px 10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems:'center',



                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent:'center',
                        alignItems:'center',
                        width: '50%',
                        height: '80%',
                        // background: 'aliceblue',

                    }}>
                        <span style={{
                            // marginTop: '24px',
                            fontSize: '30px',
                            fontWeight:'bolder'
                        }}>
                            余额
                        </span>
                        <span style={{
                            marginTop: '24px',
                            fontSize: '20px',
                        }}>
                            {this.state.balanceW}元
                        </span>
                    </div>
                    <div style={{
                        width:'100px',
                        height:'50px',
                        backgroundColor:'#feffcf',
                        margin:'0px 13%',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        fontSize: '20px',
                        boxShadow: '5px 10px 15px 2px rgba(0,0,0,0.1)',
                        borderRadius: '10px',

                    }}
                        onClick={this.RechargeW}
                    >
                        充值
                    </div>
                </div>

            </div>


        )
    }
}
