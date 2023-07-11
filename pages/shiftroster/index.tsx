import React, { useState, useRef, useEffect } from 'react'
import LayoutHOC from '../../components/layout/LayoutHOC'
import {
  Table,
  Empty,
  ConfigProvider,
  Menu,
  Dropdown,
  PageHeader,
  Modal,
  Input,
  Select,
  Cascader,
  Col,
  Form,
  Avatar,
  List,
  Button,
  Popconfirm,
  AutoComplete,
  DatePicker,
  TimePicker,
  message,
  Transfer,
  FormInstance,
  Spin,
} from 'antd'
import Router from 'next/router'
import {
  Category,
  FacultiesOrDepartment,
  Position,
} from '../../components/SettingsArray.js'
import Head from 'next/head'
import { Scheduler } from '@aldabil/react-scheduler'
import { Typography } from '@mui/material'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import {
  AiFillCalendar,
  AiFillDelete,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineUserAdd,
} from 'react-icons/ai'
import VirtualList from 'rc-virtual-list'
import { getSession } from 'next-auth/react'
import dateFormat from 'dateformat'
import { DialogActions } from '@mui/material'
const { RangePicker } = DatePicker
const { Option } = Select
const { Search, TextArea } = Input
import ucwords from 'ucwords'
import { AuthStaff } from '../../node/AuthStaff'

import DataTable from 'react-data-table-component';
import { trpc } from '../../utils/trpc'
import { RosterDocumentInterface } from '../../types/RosterDocumentInterface'
import { toast } from 'react-hot-toast'

interface RecordType {
  label: string
  department: string
  roster_date: string
}

const Index = (props: any) => {
  const [loading, setloading] = useState(false)
  const [loadingTable, setloadingTable] = useState(true)
  const [modalVisible, setmodalVisible] = useState(false)
  const [rosterData, setrosterData] = useState([])
  const rosterFormRef: any = useRef<FormInstance<any>>()

  const staffRosterQuery: any = trpc.staffRoster.list.useQuery()
  const addRosterMutation = trpc.staffRoster.addRoster.useMutation()
  const deleteMutation = trpc.staffRoster.delete.useMutation()
  const utils = trpc.useContext()


  const onFinishRoster = (form: any) => {
    const { roster_date } = form

    let _d: RosterDocumentInterface = {
      ...form,
      rosterDate: roster_date.format('YYYY-MM-DD'),
    }

    addRosterMutation.mutate(_d, {
      onSuccess(data, variables, context) {
        toast.success('Roster created successfully.')
        rosterFormRef.current?.resetFields()
        utils.staffRoster.list.invalidate()
      },
      onError(error, variables, context) {
        toast.error('Roster creation failed.')
      },
    })
  }



  const columns: any = [
    {
      name: 'Label',
      selector: row => row.label,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => ucwords(row.department),
      sortable: true,
    },
    {
      width: "230px",
      name: 'Roster Date',
      selector: row => dateFormat(row.rosterDate, "mmm, yyyy"),
      sortable: true,
    },
    {
      name: "",
      width: "130px",
      selector: (row: any) => (
        <>
          <div className="flex space-x-2 items-center py-1">
            <Button
              shape="circle"
              icon={<AiOutlineEye />}
              onClick={() => {
                Router.push(`shiftroster/${row._id}`)
              }}
            />
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => {

                deleteMutation.mutate({
                  id: row._id
                }, {
                  onSuccess(data, variables, context) {
                    toast.success("Roster deleted successfully")
                    utils.staffRoster.list.invalidate()
                  },
                  onError(error, variables, context) {
                    toast.error("Unable to delete roster")
                  },
                })


              }}
              onCancel={() => { }}
              okText="Yes"
              placement="right"
              cancelText="No"
            >
              <Button shape="circle"  icon={<AiOutlineDelete />} />
            </Popconfirm>
          </div>
        </>
      )
    }
  ];


  return (
    <div className="container mx-auto">
      <Head>
        <title>Shift Roster | Admin Panel</title>
      </Head>
      <div>
        <PageHeader
          ghost={true}
          title="Shift Roster"
          extra={[
            <Input
              prefix={<AiOutlineSearch />}
              key={'search'}
              style={{ width: 300 }}
              placeholder="Search"
            />,
            <Button
              onClick={() => {
                setmodalVisible(true)
              }}
              key="3"
              type="primary"
              icon={<AiOutlinePlus className="anticon" />}
            >
              New Roster
            </Button>,
          ]}
        ></PageHeader>
      </div>

      <div className="container mx-auto my-4">
        <Spin spinning={staffRosterQuery.isLoading} tip="Loading...">
          <DataTable
            columns={columns}
            data={staffRosterQuery.data}
          />

        </Spin>
      </div>

      <Modal
        title="New Roster"
        visible={modalVisible}
        maskClosable={false}
        onCancel={() => {
          setmodalVisible(false)
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={addRosterMutation.isLoading}
            onClick={() => {
              rosterFormRef.current?.submit()
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          name="basic"
          layout="vertical"
          ref={rosterFormRef}
          onFinish={onFinishRoster}
          autoComplete="off"
        >
          <Form.Item name={'label'} label={'Label'}>
            <Input placeholder="Enter label for reminder" size="large" />
          </Form.Item>

          <Form.Item
            label="Roster Date"
            name="roster_date"
            rules={[{ required: true, message: 'Please input roster date!' }]}
          >
            <DatePicker picker="month" className="w-full" size="large" />
          </Form.Item>

          <Form.Item
            label="Department"
            name={'department'}
            rules={[{ required: true, message: 'Department is required' }]}
          >
            <Select showSearch size="large" placeholder="Select department">
              {FacultiesOrDepartment.map((item) => (
                <>
                  <Option value={item.toLowerCase()}>{item}</Option>
                </>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LayoutHOC(Index, 0, "", false)

export async function getServerSideProps(ctx) {
  let session: any = await getSession(ctx)
  let staff: any = await AuthStaff(session?.token?._doc?._id)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
        pageKey: '1',
      },
    }
  }

  let appname = process.env.APP_NAME


  return {
    props: {
      session: session,
      appname: appname,
      user: staff,
      query: ctx.query,
    },
  }
}
