import Btn_back from "../img/back.svg";
import React from 'react'

import { createHashHistory } from 'history';

export default class  OrderHeader extends React.Component{
    constructor(props){
        super(props);
        this.backPre=this.backPre.bind(this)
    }

    backPre=()=>{
        let history=createHashHistory();
        history.goBack();
        localStorage.removeItem('qrScanner')
    }


    render() {
        return(
            <div id={'recharge_tab'} style={{
                position:'relative',//父级一定要定为相对  方便子操作
                width:'100%',
                backgroundColor:'#ff9459',
                // flex:'1'
                height:'45px',
                lineHeight:'45px',
                display:'flex',
                flexDirection:'row',
                justifyContent:'center',//这样就会使title直接就居中了
                alignItems:'center' }}>
                <span id={'tab_content'}style={{
                    height:'45px',
                    position: 'relative',//最好设为直接就与父级rela相同 不设也不影响页面
                    fontWeight:'bold',//这样就时刻在父级div里居中 字数无线
                    fontSize:'18px',
                    color:'#fff',
                    letterSpacing:'4px',
                }}>
                    {this.props.title}
                </span>

                <div id={'tab_back'} style={{
                    position:'absolute',//第二个才考虑东西应该这么放上去
                    height:'100%',//一定要绝对定位，才能使title跟它不冲突  相当于不在同一层
                    width:'30px',//父相子绝对 然后设一个宽高
                    left:0,//一定要设好跟父级贴边显示
                    top:0,
                    display:'flex',//即使下边为行级 但是父级设了flex
                    justifyContent:'center',//就会把所有子集都变为块级  就可以以块级标准操作了
                    alignItems:'center',
                    padding:'0px 10px'

                }}>

                        <span style={{
                            backgroundImage:'url('+Btn_back+')',
                            width:'30px',
                            height:'30px',
                            backgroundSize:'100% 100%'
                        }}
                              onClick={this.backPre}
                        >

                        </span>

                </div>



            </div>

        )
    }
}
