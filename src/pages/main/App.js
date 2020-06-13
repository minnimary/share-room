import React from 'react';

import '../../App.css';
import {Map, Marker, NavigationControl,DrivingRoute,MapTypeControl,ScaleControl,OverviewMapControl} from 'react-bmap';
import find from '../../img/find.svg';
import pay from '../../img/recharge.svg'
import repair from '../../img/repair.svg'
import scan from '../../img/scan.svg'
import user from '../../img/user.svg'
import BgIcon from '../../components/bgIcon'
import axios from 'axios'
import {
    Link
}
from'react-router-dom'
import { createHashHistory } from 'history';
import {message} from "antd";
import Infowindow from "react-bmap/src/components/infowindow";


let history=createHashHistory();


class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
        bgIconShow:true,
      list:[],
      title:'首页',
      a:0
    }
    this.markerList=this.markerList.bind(this);


  }

  componentDidMount() {
      localStorage.removeItem('qrScanner')
    axios('http://www.crazyrobot.xyz:8081/share-room/room/selectRoom',
        {
            withCredentials:true,
            headers:{
                'token':window.localStorage['token']
            },
        })
        .then(res=>{

            if (res.data.success===true){
                if (res.data.code==200){

                    this.setState({
                        list:res.data.data
                    })
                }

            }
            else {
                if (res.data.code == 403) {

                    message.warning(res.data.msg);
                    history.push('Login')
                }
            }
            return Promise.resolve(res)
        })
  }




    useRoom=(e)=>{
        history.push('Scan')
    }
    disuse=(e)=>{
        message.error('房间已被使用，请重选')
    }


    markerList(){


    let markerArr = [];

    this.state.list.map((item,index) => {
        if (item.status===0){
            markerArr.push(
                <Marker position={ item.address} key={index}
                        icon="loc_blue" title="房间可用" label={'空闲'}
                        size={'50px'}
                        events={{click: this.useRoom}}
                >
                </Marker>
                );
        }
        else if (item.status===1) {
            markerArr.push(
                <Marker position={item.address} key={index} icon="loc_red" size={'30px'}
                        events={{click: this.disuse}} title="房间禁用" label={'忙碌'}
                />);
        }


    });
    return markerArr;

    }
  render() {

    return (
        <div id={'content'}>
          <Map center={{lng: 120.085444,lat: 30.337677,}} zoom="18" style={{flex:1}}
          >
              <Marker position={{lng: 120.085444,lat: 30.337677}} icon="red"  size={'80px'}/>
            {this.markerList()}
              {/*<DrivingRoute start='三墩新天地商业中心' end='金家渡' autoViewport={true} />*/}
            <NavigationControl />
              <MapTypeControl />
              <ScaleControl />
                {/*<Infowindow position={{lng: 120.085444,lat: 30.337677}} text="" title="我的位置"/>*/}
                <OverviewMapControl />

          </Map>
          <div id={'nav_tab'} style={{
                    // backgroundColor:'#f0ff0f',
                    height:'60px',
                    width:'100%',
                    display:'flex',
                    flexDirection:'row',
                    position:'absolute',
                    bottom:'10%',
                    justifyContent:'space-evenly',
                    alignItems:'center'

                }}>

                    <Link to={'/Wallet'}>
                        <BgIcon bgIcon={'url('+find+')'} width={'40px'} height={'40px'}></BgIcon>
                    </Link>
                    <Link to={'/Recharge'}>
                        <BgIcon bgIcon={'url('+pay+')'} width={'40px'} height={'40px'}></BgIcon>
                    </Link>
                    <Link to={'/Scan'}>
                        <BgIcon bgIcon={'url('+scan+')'} width={'60px'} height={'60px'}></BgIcon>
                    </Link>
                    <Link to={'/Repair'}>
                        <BgIcon bgIcon={'url('+repair+')'} width={'40px'} height={'40px'}></BgIcon>
                    </Link>
                    <Link to={'/Client'}>
                        <BgIcon bgIcon={'url('+user+')'} width={'40px'} height={'40px'}></BgIcon>
                    </Link>
           </div>
            {/*<Link to={'/Deposit'}>*/}
            {/*   <div style={{*/}
            {/*       width:'30px',*/}
            {/*       height:'30px',*/}
            {/*       position:'absolute',*/}
            {/*       top:'100px',*/}
            {/*       left:'15px',*/}
            {/*       backgroundImage:'url('+local+')',*/}
            {/*       backgroundSize:'contain'*/}
            {/*   }}>*/}

            {/*   </div>*/}
            {/*</Link>*/}

        </div>


    )
  }
}
export default App;
