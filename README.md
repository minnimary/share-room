This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).<br />
本项目采用软件工程的思想，有步骤分阶段地完成系统设计，主要内容包括如下几方面：<br />
(1).共享自习室的主界面设计：地图显示、定位按钮、充值按钮、扫码使用按钮、报修按钮。<br />
(2).定位按钮：点击定位按钮，自动定位到用户所在地址并显示其周围自习<br />
(3).扫码按钮：点击扫码，未注册登录的用户会跳转到注册登录页面进行登录，已登录的用户跳转到扫码使用页面选择扫码还是手动输入进行使用。<br />
(4).结束使用按钮：点击结束，有订单的用户跳转到所在订单页面，点击结束使用按钮，跳转到支付界面，显示有订单号、开始和结束的时间、支付金额和支付按钮。<br />
(5).充值按钮：点击充值图标按钮，按照用户类型不同进行相应跳转：已交押金的用户，直接显示钱包内押金和可用余额的数字，点击充值，在跳转到充值支付页面，按所选金额进行支付，未交押金的用户，则会先跳转到押金支付界面进行支付，再进行已交押金的后续操作。<br />
(6)后台管理系统设计：包括用户信息、自习室使用信息和订单信息，<br />

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

使用该命令进行打包，将build文件进行云端部署，即可在移动端使用部署后的新的app

整个项目移动端开发基于reactNative，具体内容不介绍，暂只支持手机端扫描，pc端识别未开发


