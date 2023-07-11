import React from 'react';
import Hoc from '../../components/Hoc.js';
import Head from 'next/head';
import { Table } from 'antd';
import { PageHeader, Layout } from 'antd';
const { Content } = Layout;
import LayoutHOC from '../../components/layout/LayoutHOC'

class Attendance extends React.Component {
    constructor() {
        super();
        this.state = {
            someKey: 'someValue'
        };
    }

    routes = [
        {
            path: 'index',
            breadcrumbName: 'Home',
        },
        {
            path: 'attendance',
            breadcrumbName: 'Attendance',
        },

    ];

    componentDidMount() {
        this.setState({
            someKey: 'otherValue'
        });
    }

    columns = [
        {
            title: 'Full Name',
            width: 100,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'Age',
            width: 100,
            dataIndex: 'age',
            key: 'age',
            fixed: 'left',
        },
        {
            title: 'Column 1',
            dataIndex: 'address',
            key: '1',
        },
        {
            title: 'Column 2',
            dataIndex: 'address',
            key: '2',
        },
        {
            title: 'Column 3',
            dataIndex: 'address',
            key: '3',
        },
        {
            title: 'Column 4',
            dataIndex: 'address',
            key: '4',
        },
        {
            title: 'Column 5',
            dataIndex: 'address',
            key: '5',
        },
        {
            title: 'Column 6',
            dataIndex: 'address',
            key: '6',
        },
        {
            title: 'Column 7',
            dataIndex: 'address',
            key: '7',
        },
        {
            title: 'Column 8',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: () => <a>action</a>,
        },
    ];

    render() {

        const data = [
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

        return (
            <>

                <Head>
                    <title>Settings | Admin Panel</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                </Head>

                <Content
                    className="site-layout-body profile_settings"
                    style={{
                        minHeight: 280,
                    }}
                >
                    <PageHeader
                        className="site-page-header"
                        style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 20 }}
                        title="Attendance"
                        breadcrumb={this.routes} />


                    <main style={{ flex: 1,}}>
                        <Table
                            columns={this.columns}
                            dataSource={data}
                            scroll={{
                                x: 1300,
                            }}
                        />
                    </main>


                </Content>


            </>
        )
    }


}

export default LayoutHOC(Attendance);

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
}