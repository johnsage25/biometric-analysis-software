import PropTypes from 'prop-types'
import React, { Component } from 'react'
import LayoutHOC from '../../components/layout/LayoutHOC'
import Head from 'next/head'
import Truncate from 'react-truncate';
import { Button, Descriptions, PageHeader, Table, Modal, Badge, Form, Input, Popover, Tag, Dropdown, Menu, DatePicker, Avatar, notification, List, Segmented, message, Space } from 'antd';
import { AiOutlineSchedule, AiOutlineStop, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineMenu, AiOutlineBackward, AiOutlineArrowLeft } from 'react-icons/ai';
import { GoTasklist } from 'react-icons/go';
import { Content } from 'antd/lib/layout/layout';
import { getSession } from "next-auth/react";
import VirtualList from 'rc-virtual-list';
import dateFormat, { masks } from "dateformat";
import Router from 'next/router';

class ExpiredTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            staffList: [],
            loadStaffTable:false,
        }
    }

    componentDidMount() {
        console.log(this.props);
        this.prepareStafflist()
    }

    prepareStafflist = async () => {

        this.setState({loadStaffTable: true})

        const Query = await this.props.parseQuery("query_object", "ExcuseScheduler")
        var staffList = await Query.equalTo('expired', true).notEqualTo("task_note", null).include("staff_object").find().finally( () => {

            this.setState({loadStaffTable: false})
        }).catch( () => {
            this.setState({loadStaffTable: false})
        })
        var ndata = staffList.map((item) => {
            item.key = Math.floor((Math.random() * 100) + 1)
            return item;
        })
        this.setState({ staffList: staffList })

    }


    columns = [
        {
            title: 'Task Name',
            width: 150,
            dataIndex: 'task_name',
            key: 'task_name',

            fixed: 'left',
            render: (text, record, index) => {
                return <span>{record.get("task_name")}</span>
            }
        },

        {
            title: 'Staff List',
            dataIndex: 'staff_list',

            key: '1',
            render: (text, record, index) => {
                console.log(record.get("staff_list"));
                return (
                    <Avatar.Group maxCount={4} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {record.get('staff_list').map((item, key) => {
                            return (
                                <Avatar className=' border border-sky-400 border-1 border-solid' size={40} src={item.get("staff_image").url()}>{item.get("fullname")}</Avatar>
                            )
                        })}
                    </Avatar.Group>
                )
            }
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: '2',
            width: 200,

            render: (text, record, index) => {
                return <span className=' text-sm'>{dateFormat(record.get("date_from"), "ddd, mmmm dS, yyyy")}</span>
            }
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: '3',
            width: 200,

            render: (text, record, index) => {
                return <span className=' text-sm'>{dateFormat(record.get("date_to"), "ddd, mmmm dS, yyyy")}</span>
            }
        },

        {
            title: 'Note',
            dataIndex: 'remain_task',
            className: 'table-02',
            key: '5',
            render: (text, record, index) => {
                return <Truncate lines={1} ellipsis={
                    <Popover content={<div className=' w-56'>
                        {record.get("task_note")}
                    </div>} className=" w-44" title="Note" trigger="click">
                        <span>... <a href=''>View more</a></span>
                    </Popover>
                } >{record.get("task_note")}</Truncate>
            }
        },

        {
            title: 'Status',
            key: 'operation',
            fixed: 'right',
            className: 'text-center',
            width: 100,
            render: (text, record, index) => {
                return <Tag color="#f43f5e">Expired</Tag>
            },
        },
    ];


    render() {

        const { staffList, loadStaffTable } = this.state

        return (
            <>
                <Head>
                    <title>Expired Excuse | Staff Portal</title>
                </Head>

                <PageHeader
                    ghost={true}
                    title="Expired Excuse"
                    // subTitle="List of staff in scheduler robot"
                    extra={[
                        <Button key="2" onClick={() => {
                            Router.push('/scheduler')
                        }} icon={<AiOutlineArrowLeft className='anticon' />}>Back to Scheduler</Button>,
                    ]}
                />

                <Content
                    className="site-layout-body"
                    style={{

                        minHeight: 280,
                    }}
                >

                    <Table
                        columns={this.columns}
                        dataSource={staffList}
                        loading={loadStaffTable}
                        className="table_scheduler"
                        scroll={{
                            x: 1300,
                        }}
                    />

                </Content>
            </>
        )
    }
}


export default LayoutHOC(ExpiredTask)


export async function getServerSideProps(ctx) {
    var session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
                pageKey: "1",
            },
        };
    }

    return {
        props: { session },
    };
}
