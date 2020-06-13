import React from 'react';
import axios from 'axios'
import PageHeader from "../../components/PageHeader";
import logo from "../../img/Equity.svg";
import quote from '../../img/coster.svg'
import cut from '../../img/cut.svg';
import plus from '../../img/plus.svg';
import photo from '../../img/photo.svg'
import '../../css/Restore.css'

import {
    Form,
    Select,
    InputNumber,
    Switch,
    message,
    Modal,
    Button,
    Upload,
    Input
} from 'antd';
import { UploadOutlined, InboxOutlined,PlusOutlined, } from '@ant-design/icons';
import {createHashHistory} from 'history';

let history = createHashHistory()
const { Option } = Select;


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export  default class Repair extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: '',
            select:'',
            content:'',
            title:'',
            item:[]

        }
    }




    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    holdChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })

    }

    onFinish = (values) => {
        this.state.fileList.map(item=>{
          let itemL=item.response.data
            // console.log("测试"+itemL)
            this.setState({
                item:[...this.state.item,itemL]
            })
        })


        this.setState({
            title:values.select,

        })
        axios('http://www.crazyrobot.xyz:8081/share-room/fault/submitFault',{
                method:'POST',
                withCredentials: true,
                changeOrigin: true,
                headers:{
                    'token':window.localStorage['token'],
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                data: {
                    roomId: this.state.roomId,      //充值传正数，消费传负数
                    img:this.state.item,
                    content:this.state.content,//故障内容
                    title:this.state.title//故障原因
                }
            }

            ).then(res => {
            if (res.data.success === true) {
                message.success("提交成功",history.push('App'))

            } else {
                if (res.data.code == 403) {
                    message.warning(res.data.msg, 1)
                        .then(() => history.push('Login'))
                }
                else if (res.data.code==500) {
                    message.warning(res.data.msg, 1)

                }
            }

        })




    };


    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return(
            <div style={{
                width: '100%',//一定要设宽度
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',//这样可以使中间那个直接水平居中
            }}>

                <PageHeader title={'故障维护'}></PageHeader>

                {/*放心购栏*/}
                <div style={{
                    height:'80px',
                    width: '100%',//一定要设宽度
                    // backgroundColor:'#efdf76',
                    display:'flex',
                    flexDirection: 'row',
                    alignItems:'center',
                }}>
                    <div style={{
                        backgroundImage:'url('+logo+')',
                        backgroundSize:'contain',
                        width: '32px',
                        height: '32px',
                        marginLeft:'20px'
                    }}>

                    </div>
                    <div style={{
                        backgroundImage:'url('+quote+')',
                        backgroundSize:'contain',
                        width: '100px',
                        height: '13px',
                        marginLeft:'8px',
                        backgroundRepeat: 'no-repeat',
                        marginTop: '12px',

                    }}>

                    </div>
                </div>

                <Form name="validate_other"  onFinish={this.onFinish} >
                            <Form.Item className={'orderId'}>
                                <Form.Item name="input-number"  >
                                    <span id={'applyNum'}>房间号<span><Input onChange={this.holdChange} name={'roomId'}/></span></span>
                                </Form.Item>

                            </Form.Item>

                            <Form.Item name="select" label="请选择故障原因" hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择一项原因!',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择一项原因">
                                    <Option value="使用过程中故障">使用过程中故障</Option>
                                    <Option value="未使用故障">未使用故障</Option>
                                    <Option value="支付故障">支付故障</Option>
                                    <Option value="订单存疑">订单存疑</Option>
                                    <Option value="其它">其它</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item  valuePropName="checked" >
                                <Input.TextArea placeholder="请描述申请的具体情况，字数不超过200字" onChange={this.holdChange } name={'content'}/>
                            </Form.Item>

                            <Form.Item name="upload"  valuePropName="fileList" className={'Ava'}>
                                    <Upload
                                        action="/upload/uploadAva"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 9 ? null : uploadButton}
                                    </Upload>
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                        onCancel={this.handleCancel}
                                    >
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>


                            </Form.Item>

                            <Form.Item className={'orderName'}>
                                <Form.Item name="input-number"  >
                                    <span id={'applyNum'}>用户姓名<Input /></span>
                                </Form.Item>
                                <Form.Item name="input-number"  >
                                    <span id={'applyNum'}>联系方式<Input /></span>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item className={'btn-submit'}>
                                <Button type="primary" htmlType="submit" >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>

            </div>

        )
    }
}
