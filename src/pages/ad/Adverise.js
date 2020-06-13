import React from 'react';
import Icon from '../../img/advertise.svg';
import {
    Link
} from "react-router-dom";

export default class Adverise extends React.Component{
    render() {
        return(
            <Link to={'../login/Login'}>
            <div id={'ad'} style={{
                display:'flex',
                position:'absolute',
                top:'0',
                backgroundColor:'#ff9d8d',
                flexDirection:'column'}}>
                    <div id={'ad_icon'} style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent:'center',/*水平居中*/
                        alignItems:'center'/*内容垂直居中*/}}>
                            <div id={'icon_img'} style={{
                                backgroundImage: 'url('+Icon+')',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%',
                                backgroundColor: 'azure'
                            }}>

                    </div>
                    </div>
                    <div id={'ad_text'} style={{
                        flex: '1',
                        // backgroundColor:'#a2d42f',
                        fontFamily: 'southpawregular',
                        color: 'white',
                        fontSize: '60px',
                        display: 'flex',
                        justifyContent: 'center',//这儿已经水平对其了
                        position:'relative',//ab绝对于起点
                        top:'5px'

                    }}>
                        <span>Let's shareROOM!</span>
                    </div>
            </div>
            </Link>

        )
    }
}
