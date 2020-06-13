import React from 'react';
import Home from './pages/main/App';
import Advertise from './pages/ad/Adverise';
import Recharge from './pages/main/Recharge';
import Wallet from './pages/main/Wallet';
import Repair from './pages/main/Repair';
import Client from './pages/main/Client';
import Admin from './pages/admin/Admin';
import Deposit from './pages/main/Deposit';
import Scan from './pages/main/Scan';
import Input from './pages/login/Input';
import Login from './pages/login/Login';
import Addroom from './pages/admin/AddRoom';
import Reset from './pages/login/Reset';
import OrderRecord from './pages/main/OrderRecord'
import Deleroom from './pages/admin/DeleRoom'
import FeedBack from './pages/admin/Feedback'
import OrderDetail from './pages/main/OrderDetail'
import UsingRoom from './pages/main/UsingRoom'



import 'antd/dist/antd.css';

import {

    HashRouter,
    Switch,
    Route,

} from "react-router-dom";


export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/Login">
                        <Login/>
                    </Route>
                    <Route path="/Input">
                        <Input />
                    </Route>
                    <Route path="/Reset">
                        <Reset />
                    </Route>

                    <Route path="/Scan">
                        <Scan />
                    </Route>
                    <Route path="/Repair">
                        <Repair />
                    </Route>
                    <Route path="/AddRoom">
                        <Addroom />
                    </Route>
                    <Route path="/DeleRoom">
                        <Deleroom />
                    </Route>
                    <Route path="/Feedback">
                        <FeedBack />
                    </Route>
                    <Route path="/Admin">
                        <Admin />
                    </Route>
                    <Route path="/OrderRecord">
                        <OrderRecord />
                    </Route>
                    <Route path="/OrderDetail">
                        <OrderDetail />
                    </Route>
                    <Route path="/UsingRoom">
                        <UsingRoom />
                    </Route>




                    <Route path="/Client">
                        <Client />
                    </Route>
                    <Route path="/Wallet">
                        <Wallet />
                    </Route>
                    <Route path="/App">
                        <Home />
                    </Route>
                    <Route path="/Deposit">
                        <Deposit />
                    </Route>
                    <Route path="/Recharge">
                        <Recharge />
                    </Route>
                    <Route path="/">
                        <Advertise/>
                    </Route>
                </Switch>
            </HashRouter>
        )
    }
}
