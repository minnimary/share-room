import React from 'react';

export default class BgIcon extends React.Component{
    constructor(props){
        super(props);

    }
    render() {
        return(
            <div id={'bgicon'} style={{
                flex:'1',
                backgroundImage:this.props.bgIcon,
                backgroundSize:'contain',
                backgroundRepeat: 'no-repeat',
                width:this.props.width,
                height:this.props.height,

            }}>

            </div>
        )
    }
}