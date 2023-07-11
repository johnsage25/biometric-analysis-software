import React, { createRef, useState } from 'react'
import Hoc from '../components/Hoc.js'
import LayoutHOC from '../components/layout/LayoutHOC'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import {
  Layout,
  Tabs,
  Radio,
  Space,
  Avatar,
  AutoComplete,
  Skeleton,
  Switch,
  Calendar,
  Popover,
  PageHeader,
  Table,
  Alert,
  Menu,
  Image,
  Typography,
  Transfer,
  Card,
  Dropdown,
  List,
  Button,
  Pagination,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  Upload,
  message,
  Tag,
  Divider,
  TimePicker,
  Popconfirm,
} from 'antd'
import {
  BrowserView,
  MobileView,
  isBrowser,
  isConsole,
  isMobile,
} from 'react-device-detect'
import AdminAccount from './components/AdminAccount'
import SchedulerTable from './components/SchedulerTable'
import RosterTemplate from './components/RosterTemplate'
import { AuthStaff } from '../node/AuthStaff'

const { Content } = Layout
const { TabPane } = Tabs
const { Dragger } = Upload

const Settings = (props:any) => {
  const [tabPosition, settabPosition] = useState(!isMobile ? 'left' : 'top')
  return (
    <>
      <main className="container mx-auto">
        <Head>
          <title>Settings | Admin Panel</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Content
          className="site-layout-body settings"
          style={{
            minHeight: 280,
          }}
        >
          <PageHeader
            className="site-page-header"
            style={{ paddingLeft: 0, paddingRight: 0 }}
            title="Settings"

            // extra={[
            //     <Button key="1" onClick={this.addstaffmodal} type="primary" icon={<UserAddOutlined />}>Add Staff</Button>,
            //     <Button key="2" icon={<FolderViewOutlined />}>View Archive</Button>,

            // ]}
          />

          <div className="desktop_tabl_setting border-gray-200 border-2 border-solid">
            <Tabs
              tabPosition={'left'}
              defaultActiveKey="1"
              tabBarStyle={{ backgroundColor: '#fff' }}
            >
              <TabPane
                tab={
                  <>
                    <div>Admin Account</div>
                    {/* <RightOutlined /> */}
                  </>
                }
                key="1"
                className={'setting_pane'}
              >
                <AdminAccount {...props}/>
              </TabPane>

              <TabPane
                tab={
                  <>
                    <div>Scheduler</div>
                  </>
                }
                key="3"
                className={'setting_pane'}
              >
                <SchedulerTable/>
              </TabPane>

              <TabPane
                tab={
                  <>
                    <div>Roster Template</div>
                  </>
                }
                key="4"
                className={'setting_pane'}
              >
                <RosterTemplate/>
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </main>
    </>
  )
}

export default LayoutHOC(Settings)

export async function getServerSideProps(ctx:any) {

  var session: any = await getSession(ctx);
  let staff:any = await AuthStaff(session?.token?._doc?._id)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
        pageKey: '1',
      },
    }
  }

  var appname = process.env.APP_NAME


  if(staff?.role != "Administrator"){
    return {
      redirect: {
        destination: '/',
        permanent: false,
        pageKey: '1',
      },
    }
  }


  return {
    props: {
      session: session,
      appname: appname,
      user: staff,
    },
  }
}
