import { Layout } from 'antd';
import React from 'react';
import Hoc from '../components/Hoc.js'
import {
    Table, Empty, ConfigProvider, Menu, Dropdown, Button, PageHeader, Modal, Input, Select,
    Cascader, Col,
    Form,
    AutoComplete,
    Row,
} from 'antd';
import Head from 'next/head';
import Lottie from 'lottie-react-web'
import animation from '../public/lottie/12-layers-flat-edited.json'
import { DownOutlined, UserOutlined, UserAddOutlined, FolderViewOutlined, EllipsisOutlined } from '@ant-design/icons';
import { AiOutlineSetting, AiOutlineDelete, AiOutlineEdit, AiOutlineUserAdd } from 'react-icons/ai';
import { BiBlock } from 'react-icons/bi';
const { Content } = Layout;
const { Option } = Select;

const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center', paddingTop: 30, paddingBottom: 30, justifyContent: 'center', flexDirection: 'row' }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="107.636"
            data-name="Layer 1"
            viewBox="0 0 647.636 632.174"
        >
            <path
                fill="#f2f2f2"
                d="M411.146 142.174h-174.51a15.018 15.018 0 00-15 15v387.85l-2 .61-42.81 13.11a8.007 8.007 0 01-9.99-5.31l-127.34-415.95a8.003 8.003 0 015.31-9.99l65.97-20.2 191.25-58.54 65.97-20.2a7.99 7.99 0 019.99 5.3l32.55 106.32z"
            ></path>
            <path
                fill="#3f3d56"
                d="M449.226 140.174l-39.23-128.14a16.994 16.994 0 00-21.23-11.28l-92.75 28.39-191.24 58.55-92.75 28.4a17.015 17.015 0 00-11.28 21.23l134.08 437.93a17.027 17.027 0 0016.26 12.03 16.79 16.79 0 004.97-.75l63.58-19.46 2-.62v-2.09l-2 .61-64.17 19.65a15.015 15.015 0 01-18.73-9.95L2.666 136.734a14.98 14.98 0 019.95-18.73l92.75-28.4 191.24-58.54 92.75-28.4a15.156 15.156 0 014.41-.66 15.015 15.015 0 0114.32 10.61l39.05 127.56.62 2h2.08z"
            ></path>
            <path
                fill="#1890ff"
                d="M122.68 127.82a9.016 9.016 0 01-8.61-6.366l-12.88-42.072a8.999 8.999 0 015.97-11.24L283.1 14.278a9.009 9.009 0 0111.24 5.971l12.88 42.072a9.01 9.01 0 01-5.97 11.241l-175.94 53.864a8.976 8.976 0 01-2.63.395z"
            ></path>
            <circle cx="190.154" cy="24.955" r="20" fill="#1890ff"></circle>
            <circle cx="190.154" cy="24.955" r="12.665" fill="#fff"></circle>
            <path
                fill="#e6e6e6"
                d="M602.636 582.174h-338a8.51 8.51 0 01-8.5-8.5v-405a8.51 8.51 0 018.5-8.5h338a8.51 8.51 0 018.5 8.5v405a8.51 8.51 0 01-8.5 8.5z"
            ></path>
            <path
                fill="#3f3d56"
                d="M447.136 140.174h-210.5a17.024 17.024 0 00-17 17v407.8l2-.61v-407.19a15.018 15.018 0 0115-15h211.12zm183.5 0h-394a17.024 17.024 0 00-17 17v458a17.024 17.024 0 0017 17h394a17.024 17.024 0 0017-17v-458a17.024 17.024 0 00-17-17zm15 475a15.018 15.018 0 01-15 15h-394a15.018 15.018 0 01-15-15v-458a15.018 15.018 0 0115-15h394a15.018 15.018 0 0115 15z"
            ></path>
            <path
                fill="#1890ff"
                d="M525.636 184.174h-184a9.01 9.01 0 01-9-9v-44a9.01 9.01 0 019-9h184a9.01 9.01 0 019 9v44a9.01 9.01 0 01-9 9z"
            ></path>
            <circle cx="433.636" cy="105.174" r="20" fill="#1890ff"></circle>
            <circle cx="433.636" cy="105.174" r="12.182" fill="#fff"></circle>
        </svg>

        <p>Data Not Found</p>
    </div>
);


class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            visibleModal: false,
            loading: false
        };
    }

    columns = [
        {
            title: 'Full Name',
            width: 150,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'ObjectID',
            width: 150,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
        },
        {
            title: 'Tel Number',
            dataIndex: 'number',
            key: '1',
            width: 150,
        },

        {
            title: 'Group',
            dataIndex: 'address',
            key: '4',
            width: 150,
        },
        {
            title: 'Channels',
            dataIndex: 'address',
            key: '5',
            width: 150,
        },
        {
            title: 'Vcard',
            dataIndex: 'address',
            key: '6',
            width: 150,
        },
        {
            title: 'Device ID',
            dataIndex: 'address',
            key: '7',
            width: 150,
        },
        { title: 'Status', dataIndex: 'status', key: '8' },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: () => {

                const menu = (
                    <Menu
                        //   onClick={handleMenuClick}
                        items={[
                            {
                                label: 'Edit',
                                key: '1',
                                icon: <AiOutlineEdit />,
                            },
                            {
                                label: 'Block',
                                key: '2',
                                icon: <BiBlock />,
                            },
                            {
                                label: 'Delete',
                                key: '3',
                                icon: <AiOutlineDelete />,
                            },
                        ]}
                    />
                );


                return <Dropdown overlay={menu} placement={'bottomRight'} arrow>
                    <Button size={'small'} block >
                        <EllipsisOutlined size={30} style={{ fontSize: '20px' }} />
                    </Button>
                </Dropdown>
            },
        },
    ];

    addstaffmodal = () => {
        this.setState({ visibleModal: true })
    }

    handleCancel = () => {
        this.setState({ visibleModal: false })
    }

    routes = [
        {
            path: 'index',
            breadcrumbName: 'Home',
        },
        {
            path: 'users',
            breadcrumbName: 'Staff',
        },

    ];


    data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 40,
            address: 'London Park',
        },
    ];

    render() {
        const { visibleModal, loading } = this.state
        return (
            <>
                <Head>
                    <title>Staff | Admin Panel</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1"/>
                </Head>



                <Content
                    className="site-layout-body"
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <PageHeader
                        className="site-page-header"
                        style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 30 }}
                        title="Staff List"
                        breadcrumb={this.routes}

                        extra={[
                            <Button key="1" onClick={this.addstaffmodal} type="primary" icon={<UserAddOutlined />}>Add Staff</Button>,
                            <Button key="2" icon={<FolderViewOutlined />}>View Archive</Button>,

                        ]}
                    />

                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <Table columns={this.columns} dataSource={this.data} scroll={{ x: 1500, y: 300 }} />
                    </ConfigProvider>

                </Content>

                <Modal
                    visible={visibleModal}
                    title="New Staff"
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[

                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Submit
                        </Button>,

                    ]}
                >

                    <Form
                        name={"staff_form"}
                        layout="vertical"
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <Form.Item
                            name="name"
                            label="Staff Name"
                            rules={[{ required: true }, { type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
                        >

                            <Input.Group compact>
                                <Select size={'large'} placeholder="Department" style={{ width: '30%' }}>
                                    <Option value="Sign Up">Sign Up</Option>
                                    <Option value="Sign In">Sign In</Option>
                                </Select>
                                <AutoComplete
                                    size={'large'}
                                    style={{ width: '70%' }}
                                    placeholder="Staff name"
                                    options={[{ value: 'text 1' }, { value: 'text 2' }]}
                                />
                            </Input.Group>

                        </Form.Item>

                    </Form>


                </Modal>
            </>
        );
    }

    componentDidMount() {
        this.setState({
            someKey: 'otherValue'
        });
    }
}

export default Hoc(Users, '2');
