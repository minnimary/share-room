import React from 'react'
import OrderHeader from '../../components/OrderHeader';
import learn from '../../img/white.jpg'
import {createHashHistory} from 'history';
import axios from 'axios'
import {notification} from "antd";
let history = createHashHistory()
/*onMessage:在webview内部的网页中调用window.postMessage方法时可以触发此属性对应的函数，
从而实现网页和RN之间的数据交换。 设置此属性的同时会在webview中注入一个postMessage的全局函数并覆盖可能已经存在的同名实现。

网页端的window.postMessage只发送一个参数data，此参数封装在RN端的Event对象中，即event.nativeEvent.data。data 只能是一个字符串。
* */
//2.子级接收数据：首先想到监听方法与h5的生命周期
window.addEventListener('message', function(msg) {

    var acceptData = JSON.parse(msg.data);
    localStorage.setItem("qrScanner",acceptData.code);
    if (localStorage.getItem('qrScanner')){
        history.push('OrderDetail')
    }
    else {
        history.goBack(-1)
    }


});
window.document.addEventListener('message', function(msg) {
    var acceptData = JSON.parse(msg.data);
    localStorage.setItem("qrScanner",acceptData.code);
    if (localStorage.getItem('qrScanner')){
        history.push('OrderDetail')
    }
    else {
        history.goBack(-1)
    }
});
//1.父级向子级发布数据

//3.子级向父级发布数据：
// b.react-native webView从react-native中独立追加了ReactNativeWebView方法
//     c.向父级发布消息为：window.ReactNativeWebView.postMessage('向rn发布信息');
function sendMessage(msg){
    if( typeof window.ReactNativeWebView == "undefined"){
        window.postMessage(JSON.stringify(msg));//html向RN发送信息：只能传递一个字符串类型的参数
    } else{
        setTimeout(function() { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); }, 0);//直接向rn发消息
    }
}


export default class Scan extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }

    }

    componentDidMount() {
        localStorage.removeItem('qrScanner')
        axios('http://47.103.27.32:8081/share-room/room/getUserOrderInfo',{
            method:'GET',
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            }
        }).then(res=>{
            if (res.data.success===true){
             if (res.data.data.flag) {
                    localStorage.setItem('usingId',res.data.data.id)
                    localStorage.setItem('usingName',res.data.data.roomName)
                    localStorage.setItem('usingPrice',res.data.data.price)
                    localStorage.setItem('usingTime',res.data.data.gmtCreate)
                    history.push('UsingRoom')
                }

            }
            else {
                if (res.data.code==403) {
                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg
                    });
                    history.push('Login')

                }
                else if (res.data.code==500) {
                    notification['warning']({
                        message: 'Warning',
                        description:res.data.msg
                    });
                    history.goBack(-1)
                }

            }
            return Promise.resolve(res)
        })
    }

    scan=()=>{

                    var param = {
                        type:'qrScan'
                    };
                    sendMessage(param);


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
            }}>
                <OrderHeader title={'欢迎使用'}></OrderHeader>
                <div style={{
                    backgroundImage:'url('+learn+')',
                    width: '100%',//一定要设宽度
                    height: '210px',
                    backgroundSize:'100% 100%',
                    backgroundRepeat:'no-repeat'
                }}>

                </div>

                <div style={{
                    width:'100%',
                    height: '150px',
                    // backgroundColor:'orange',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    fontSize:'30px',
                    fontFamily: 'Pacifico',
                    // color:'white',

                }}>
                    {/*Welcome to use shareROOM!!*/}
                    <div style={{fontSize:'25px',}}>欢迎使用</div>
                    <div>shareROOM!</div>
                    {/*欢迎使用 shareROOM!*/}
                </div>
                <div style={{
                    width:'100%',
                    height: '100px',
                    // backgroundColor:'black',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',

                }}>
                    <div style={{
                        width:'100%',
                        flex:'1',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',

                    }}>

                        <div style={{
                            width:'80%',
                            flex:'1',
                            display:'flex',
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center',
                            backgroundColor:'rgb(224, 223, 223)',
                            borderRadius:'10px',
                            margin: '24px',
                            height: '50px',

                        }}
                        >
                            <span style={{
                                display:'flex',
                                flexDirection:'row',
                                justifyContent:'center',
                                alignItems:'center',
                                fontSize:'20px',
                                flex:'1',


                            }}
                                  onClick={this.scan}

                            >扫码使用</span>
                        </div>
                    </div>

                </div>




            </div>
        )
    }
}
