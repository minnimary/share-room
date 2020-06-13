import React from 'react';
import PageHeader from "../../components/PageHeader";
import money from '../../img/money1.svg'
import axios from 'axios'
import { Button,Modal,Form, Input,message, InputNumber} from 'antd';
import { DeleteOutlined,SearchOutlined ,EditOutlined,PlusCircleOutlined} from '@ant-design/icons';

import {Link} from "react-router-dom";
import {createHashHistory} from 'history';

let history = createHashHistory()
export  default class admin extends React.Component{
    constructor(props) {
        super(props);
        this.state={

                ModalText: 'Content of the modal',
                visible: false,
                confirmLoading: false,
        }

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

                        }


                    }
                }else {
                    if (res.data.code == 403) {

                        message.warning(res.data.msg);
                        history.push('Login')
                    }
                    else if (res.data.code==500){
                        message.error(res.data.msg)
                    }
                }
            })}



    render() {
        return(
            <div style={{
                width:'100%',//一定要设宽度
                height:'100%',
                position:'relative',
                display:'flex',
                flexDirection:'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中


            }}>
                {/*title导航栏*/}
                <PageHeader title={'管理员功能'}></PageHeader>
                <div style={{
                    backgroundColor:'#ff9459',
                    width:'100%',
                    height:'200px',
                    borderRadius: '0% 0% 30% 30%',
                    position:'relative',//由于title那儿只能显示rela（它里边有自己的父子关系）所以不能设置title的
                                        //但是这儿如果设置为ab就会从父级那儿边框开始，所以就只能把这儿设为相对
                    //除了特殊位置的设为ab其他或父级都为rela
                }}>
                </div>

                {/*底部空白处*/}
                <div style={{

                    // position:'relative',
                    flex:'1',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <div style={{
                        flex:'1',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'84px'
                    }}>
                        <Link to={'/AddRoom'}>
                        <Button type="primary" icon={<PlusCircleOutlined />} size={'large'}
                            style={{
                                margin: '0 30px'

                            }}

                        >
                            添加自习室
                        </Button>
                        </Link>

                        <Link to={'/DeleRoom'}>
                        <Button type="primary" icon={<DeleteOutlined />} size={'large'}
                                style={{
                                    margin: '0 30px'
                                }}
                                danger>
                            删改自习室
                        </Button>
                        </Link>
                    </div>
                    <div style={{
                        flex:'1',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'40px'
                    }}>

                        <Link to={'/Feedback'}>
                        <Button type="primary" icon={<SearchOutlined />} size={'large'}
                                style={{
                                    margin: '0 30px'
                                }}
                        >
                            显示故障列表
                        </Button>
                        </Link>
                    </div>



                </div>

            </div>


        )
    }
}
