/* eslint-disable react/display-name */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon, Dropdown, Button, Space } from 'antd';
import { useSession } from "next-auth/react"
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,

    DashboardOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { signOut } from "next-auth/react"
import { RiGroupLine } from "react-icons/ri";
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineSetting } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { BsCalendarCheck } from 'react-icons/bs'
import { MdOutlineAccountCircle } from "react-icons/md";
import Image from 'next/image'
import Router from 'next/router'
import { BrowserView, MobileView, isBrowser, isConsole, isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';


const Hoc = (WrappedComponent, pagekey = 1, query = "_User") => {


    const { Header, Sider, Content, Footer } = Layout;

    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentMenu: "2",
                marginLeft: 240,
                collapsedWidth: 80,
                collapsed: false,
            }
        }



        componentDidMount() {
            if (typeof window !== 'undefined') {

                window.addEventListener('resize', (e) => {
                    console.log('====================================');
                    if (window.innerWidth < 1122) {
                        this.setState({ collapsedWidth: 0 })
                    }
                    else {
                        this.setState({ collapsedWidth: 80 })
                    }
                    console.log(window.innerWidth);
                    console.log('====================================');
                });
            }
            if(isMobile){
                this.setState({ collapsedWidth: 0 , collapsed:true,  marginLeft: 0})
            }
        }
        toggle = () => {
            const { marginLeft, collapsedWidth } = this.state
            this.setState({
                collapsed: !this.state.collapsed,
                marginLeft: marginLeft == collapsedWidth ? 240 : collapsedWidth,
            });
        };

        onClick = (e) => {
            console.log('click ', e);
            setCurrent(e.key);
        };

        onCollapse = (e) => {

            const { marginLeft } = this.state

            // this.setState({
            //     marginLeft: marginLeft == 50 ? 240 : 50
            // })
        }

        menu = (
            <Menu


                // defaultActiveFirst={false}

                items={[
                    {
                        onClick: () => {

                        },
                        label: 'Help',
                        key: '1',
                        icon: <BiHelpCircle />,
                    },
                    {
                        onClick: async () => {

                            // signOut({redirect: false})

                        },
                        label: 'Profile Settings',
                        key: '2',
                        icon: <UserOutlined />,
                        onClick: () => {
                            Router.push('/profile_settings')
                        }
                    },
                    {
                        onClick: async () => {

                            // signOut({redirect: false})

                            signOut({ redirect: true, callbackUrl: '/' })



                        },
                        label: 'Log out',
                        key: '3',
                        icon: <AiOutlineLogout />,
                    },
                ]}
            />
        );


        render() {

            console.log(isMobile);
            const { marginLeft, collapsedWidth, collapsed } = this.state

            return (
                <>
                    <Layout id="main-container" hasSider>
                        <Sider width={250}
                            breakpoint={{
                                xs: '480px',
                                sm: '576px',
                                md: '768px',
                                lg: '992px',
                                xl: '1200px',
                                xxl: '1600px',
                            }}
                            collapsedWidth={collapsedWidth}
                            defaultCollapsed={collapsed}

                            onCollapse={this.onCollapse()} trigger={null}
                            style={{
                                zIndex: 1000,
                                height: '100vh',
                                position: 'fixed',

                            }}
                            collapsible collapsed={collapsed}>
                            <div className="logo" />
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={[pagekey]}

                                onSelect={(e) => {
                                    this.setState({ currentMenu: e.key })
                                }}


                                items={[
                                    {
                                        onClick: () => {
                                            Router.push('/')
                                        },
                                        key: '1',
                                        icon: <AiOutlineDashboard size={20} />,
                                        label: 'Dashboard',
                                    },
                                    {
                                        onClick: () => {
                                            Router.push('/attendance')
                                        },
                                        key: '5',
                                        icon: <BsCalendarCheck size={20} />,
                                        label: 'Attendance',
                                    },
                                    {
                                        onClick: () => {
                                            Router.push('/staffs')
                                        },
                                        key: '2',
                                        icon: <HiUserGroup size={20} />,
                                        label: 'Staff list',
                                    },

                                    {
                                        onClick: () => {
                                            Router.push('/profile_settings')
                                        },

                                        key: '3',
                                        icon: <MdOutlineAccountCircle size={20} />,
                                        label: 'My Profile',
                                    },
                                    {
                                        type: 'group', // Must have
                                        label: 'Account',
                                        chidlren: [

                                        ],
                                    },
                                    {
                                        onClick: () => {
                                            Router.push('/settings')
                                        },

                                        key: '4',
                                        icon: <AiOutlineSetting size={20} />,
                                        label: 'Settings',
                                    },

                                ]}
                            />
                        </Sider>
                        <Layout className="site-layout" style={{ marginLeft: marginLeft }}>
                            <Header className="ant-layout-header site-layout-background header_container" style={{ padding: 0 }}>
                                <div>
                                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.toggle,
                                    })}
                                </div>
                                <div className='avatar_drop'>
                                    <Dropdown className='avatar_image' overlay={this.menu} placement="bottomRight" arrow>

                                        <Image
                                            src='/avatar/avatar.svg'
                                            alt="Picture of the author"
                                            width={50}
                                            height={50}
                                        />

                                    </Dropdown>

                                </div>
                            </Header>

                            <Layout>
                                <WrappedComponent {...this.props} />
                            </Layout>
                            <Footer>
                                <div className={'footer-content'}>
                                    <div>
                                        BAS by PearlDrift Technologies LTD
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </Footer>

                        </Layout>


                    </Layout>

                </>
            )
        }
    }
}


export default Hoc
