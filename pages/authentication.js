import { Button, Card, Layout, Typography, Checkbox, message } from 'antd';
import React, { createRef } from 'react';
// import ReactCodeInput from 'react-code-input';
import dynamic from 'next/dynamic';
import Head from "next/head";
import { signOut } from "next-auth/react"
const ReactCodeInput = dynamic(import('react-code-input'));
import Router from 'next/router'
import { FcLock } from 'react-icons/fc';
const { Title } = Typography;
class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.AuthInputRef = createRef
        this.state = {
            passCode: '',
            checked: false,
            loadingButton: false,
            borderColor: '#ddd',
        };
    }

    componentDidMount() {

    }

    handleOnChange = (va) => {
        this.setState({ passCode: va })
    }

    onChangeCheckbox = (checked) => {

        this.setState({ checked: !this.state.checked ? true : false })
    }

    onSignout = async () => {

        console.log('====================================');
        console.log();
        console.log('====================================');
        // const user = await this.props.parseQuery("logout", Parse.User).then( () => {

        //     signOut({ redirect: true, callbackUrl: '/' })

        // }).catch( (error) => {

        //     console.log(error);

        // })

    }

    verifyCode = () => {
        const { passCode, checked } = this.state

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "remember": checked,
            "passCode": passCode,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        this.setState({ loadingButton: true })

        fetch("/api/authentication", requestOptions)
            .then(async result => {
                let data = await result.json()
                console.log(data)
                if (data?.message) {
                    Router.reload(window.location.pathname)
                }
                else {
                    this.setState({ borderColor: 'red' })
                    message.error('Invalid passcode, please try again.')
                }

                this.setState({ loadingButton: false })
            })
            .catch(error => {
                console.log('error', error)
                this.setState({ loadingButton: false })
            });

    }

    render() {

        const { checked, loadingButton, borderColor } = this.state

        return (
            <>
                <Head>
                    <title>Two-step verification | BAS</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1"/>
                </Head>
                <Layout style={{ paddingTop: 100 }} className={"twofa"}>
                    <div  >
                        <Card
                            className='auth_input_l' title={
                                <div className='icon_top'>
                                    <svg width={80} height={80} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                        <symbol viewBox="-6.5 -6.5 13 13">
                                            <path
                                                fill="#ffd4c3"
                                                stroke="#504b46"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit="10"
                                                d="M0-6c2.2 0 4.1 1.5 4.7 3.5C6.3-2.5 6.4 0 5 0v1c0 2.8-2.2 5-5 5s-5-2.2-5-5V0c-1.4 0-1.3-2.5.2-2.5C-4.1-4.5-2.2-6 0-6z"
                                            ></path>
                                            <circle cx="-1.6" cy="-0.1" r="0.1" fill="#ffc258"></circle>
                                            <path
                                                fill="#4f4b45"
                                                d="M-1.6.5c-.3 0-.6-.3-.6-.6s.2-.7.6-.7c.3 0 .6.3.6.7s-.3.6-.6.6z"
                                            ></path>
                                            <circle cx="1.6" cy="-0.1" r="0.1" fill="#ffc258"></circle>
                                            <path
                                                fill="#4f4b45"
                                                d="M1.6.5C1.3.5 1 .2 1-.1s.3-.6.6-.6.6.3.6.6-.2.6-.6.6z"
                                            ></path>
                                            <circle cx="-3" cy="-1.5" r="0.5" fill="#fabfa5"></circle>
                                            <circle cx="3" cy="-1.5" r="0.5" fill="#fabfa5"></circle>
                                            <path
                                                fill="none"
                                                stroke="#504b46"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit="10"
                                                d="M-1.2-3c.8-.5 1.7-.5 2.5 0"
                                            ></path>
                                        </symbol>
                                        <g>
                                            <g>
                                                <ellipse
                                                    cx="21.4"
                                                    cy="45.1"
                                                    fill="#45413c"
                                                    opacity="0.15"
                                                    rx="13"
                                                    ry="1.5"
                                                ></ellipse>
                                                <path
                                                    fill="#ffe500"
                                                    d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"
                                                ></path>
                                                <path
                                                    fill="#fff48c"
                                                    d="M28.5 16.3H7c-1.7 0-3 1.3-3 3v4c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v-4c0-1.7-1.4-3-3-3z"
                                                ></path>
                                                <path
                                                    fill="none"
                                                    stroke="#45413c"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit="10"
                                                    d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"
                                                ></path>
                                                <path
                                                    fill="#daedf7"
                                                    d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                ></path>
                                                <path
                                                    fill="#fff"
                                                    d="M17.7 1.3C11.8 1.3 7 6.1 7 12v2.5C7 8.6 11.8 3.8 17.7 3.8s10.8 4.8 10.8 10.8V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                ></path>
                                                <path
                                                    fill="none"
                                                    stroke="#45413c"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit="10"
                                                    d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                ></path>
                                                <path
                                                    fill="#ffaa54"
                                                    d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0z"
                                                ></path>
                                                <g fill="#fc9">
                                                    <path d="M31.2 27.1c2-2 4.8-2.6 7.3-1.9.6-.4 1.4-.4 1.9.2.3.3.4.6.4.9.4.2.7.5 1 .8 1.1 1.1 1.7 2.4 2 3.7.5-2.4-.2-5-2-6.9-2.9-2.9-7.7-2.9-10.6 0-1.9 1.9-2.5 4.5-2 6.9.3-1.4 1-2.7 2-3.7z"></path>
                                                    <path d="M20.3 45.1l9.5-9.5c-.4-.8-.6-1.6-.7-2.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.1.1.2.2.4z"></path>
                                                </g>
                                                <path
                                                    fill="none"
                                                    stroke="#45413c"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit="10"
                                                    d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0z"
                                                ></path>
                                                <path
                                                    fill="none"
                                                    stroke="#45413c"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit="10"
                                                    d="M20.3 44.8l9.1-9.2"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            } bordered={false} style={{ margin: 'auto' }}>
                            <Title level={4} style={{ textAlign: 'center' }}>Two-step verification</Title>
                            <p>Check your preferred one-time password
                                application (ex. Google Authenticator, DUO
                                etc.) for a code and enter it below.</p>
                            <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>

                                <ReactCodeInput onChange={this.handleOnChange} placeholder={'000000'} type="number" inputStyle={{
                                    padding: 10, border: `1px solid ${borderColor}`, margin: 0, borderRadius: 5, width: 45, width: 45, textAlign: 'center', fontSize: 17, margin: 5
                                }} fields={6} {...this.props} />

                            </div>
                            <Checkbox
                                checked={checked}
                                // disabled={this.state.disabled}
                                onChange={this.onChangeCheckbox}
                            >
                                Remember this device for 30 days
                            </Checkbox>
                            <div style={{ paddingTop: 30 }}><Button loading={loadingButton} onClick={this.verifyCode} type='primary' size='large' block>Verify code</Button></div>
                        </Card>


                    </div>
                </Layout>
            </>
        );
    }


}


export default Authentication;
