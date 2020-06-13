import React, {Component} from 'react';
import User from "../../img/uid.svg";
import Pwd from "../../img/pwd.svg";
import {Link} from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Headphoto from "../../img/king.svg";
import {Button, message, notification} from "antd";
import axios from "axios";
import { createHashHistory } from 'history';
let history = createHashHistory()
class AddRoom extends Component {
    constructor(props) {
        super(props);
        this.state={
            roomName:'',
            lng:'',
            lat:'',
            price:''
        }


    }
    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value,
        })

    }

    addRoomItem=()=>{
        // console.log(this.state.roomName);


        axios('http://www.crazyrobot.xyz:8081/share-room/room/insertRoom',{
            method: 'post',
            withCredentials:true,
            changeOrigin:true,
            headers:{
                'token':window.localStorage['token'],
                'Content-Type' :'application/json'
            },
            data: {
                roomName: this.state.roomName,
                address:{
                    lng:this.state.lng,
                    lat:this.state.lat
                },
                price: this.state.price

            }

        }).then(res => {
            if (res.data.success===true) {
                if (res.data.code==200){
                    message
                        .loading('正在添加', 1)
                        .then(() => message.success('添加成功', 1,history.goBack(-1)))

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

    render() {
        return (
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
                backgroundColor:'#fff',
                // backgroundImage:'linear-gradient(to bottom, rgb(255, 148, 89) , white)'
            }}>
                <PageHeader title={'添加房间'} ></PageHeader>
                <div style={{marginTop:'50px'}}></div>
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
                    // backgroundColor:'#ff9459',

                }}>
                    <div id={'name'} style={{
                        flex:'1',
                        width:'100%',//不叫这个flex不显示出来
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',


                    }}>
                        <span style={{
                            width:'60px',
                            padding:'24px 0'

                        }}>
                            房间名：
                        </span>
                        <input style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: '#ccc solid 0.6px',
                            margin: '14px 2px',
                            textIndent:'10px',

                        }}
                               name={'roomName'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入房间名'}
                               required={true}
                        />

                    </div>
                    <div id={'lng'} style={{
                        flex:'1',
                        width:'100%',//不叫这个flex不显示出来
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',

                    }}>
                        <span style={{
                            width:'60px',
                            padding:'24px 0'

                        }}>
                            Lng：
                        </span>
                        <input
                               style={{
                                   flex:'1',
                                   borderRadius: '10px',
                                   border: '#ccc solid 0.6px',
                                   margin: '14px 2px',
                                   textIndent:'10px',

                               }}
                               required={true}
                               name={'lng'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请添加lng'}
                        />
                    </div>
                    <div id={'lat'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <span style={{
                            width:'60px',
                            padding:'24px 0'
                        }}>
                            Lat：
                        </span>
                        <input
                               style={{
                                   flex:'1',
                                   borderRadius: '10px',
                                   border: '#ccc solid 0.6px',
                                   margin: '14px 2px',
                                   textIndent:'10px',

                               }}
                               required={true}
                               name={'lat'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请添加lat'}
                        />
                    </div>
                    <div id={'price'}
                         style={{
                             flex:'1',
                             width:'100%',//不叫这个flex不显示出来
                             display:'flex',
                             flexDirection:'row',
                             justifyContent:'center',

                         }}>
                        <label style={{
                            width:'60px',
                            padding:'24px 0'

                        }}>
                            单价：
                        </label>
                        <input type="number"
                               // max={'999'}
                               // min={'1'}
                               // value={'1'}
                               required={true}
                            style={{
                            flex:'1',
                            borderRadius: '10px',
                            border: '#ccc solid 0.6px',
                            margin: '14px 2px',
                            textIndent:'10px',
                        }}
                               name={'price'}
                               onChange={this.handleChange.bind(this)}
                               placeholder={'请输入1-999的数字'}

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
                        onClick={this.addRoomItem}
                    >
                        添加
                    </div>
                </div>

            </div>
        );
    }
}



export default AddRoom;
