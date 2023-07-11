import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Spin,
  Table,
  Tag,
  TimePicker,
} from 'antd'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import moment from 'moment'
import axios from 'axios';
import { trpc } from '../../utils/trpc';
import { SchedulerInterface } from '../../types/SchedulerInterface';
import { toast } from 'react-hot-toast';


const SchedulerTable = (props: any) => {
  const [schedulerData, setschedulerData] = useState([])
  const [visibleAddScheduler, setvisibleAddScheduler] = useState(false)
  const [editform, seteditform] = useState(false)
  const [objectId, setobjectId] = useState('')
  const [loadingAccount, setloadingAccount] = useState(false)
  const accountFormDepartment: any = useRef()

  const schedulerDataQuery = trpc.scheduler.list.useQuery()
  const addNewMutation = trpc.scheduler.addNew.useMutation()
  const updateMutation = trpc.scheduler.update.useMutation()
  const deleteMutation = trpc.scheduler.delete.useMutation()

  const utils = trpc.useContext()

  const onFinishSchedule = (form: any) => {
    const { title, sign_in, sign_out } = form

    if (!editform) {

      let _d: SchedulerInterface = {
        title,
        sign_in: [sign_in[0].format('HH:mm'), sign_in[1].format('HH:mm')],
        sign_out: [sign_out[0].format('HH:mm'), sign_out[1].format('HH:mm')],
      }

      addNewMutation.mutate(_d, {
        onSuccess(data, variables, context) {
          accountFormDepartment.current?.resetFields()
          setvisibleAddScheduler(false)
          toast.success('Schedule added successfully')
          utils.scheduler.list.invalidate()
        },
        onError(error, variables, context) {
          toast.error('Input error, please try again')
        },
      })


    } else {


      let _d: SchedulerInterface = {
        title,
        sign_in: [sign_in[0].format('HH:mm'), sign_in[1].format('HH:mm')],
        sign_out: [sign_out[0].format('HH:mm'), sign_out[1].format('HH:mm')],
        _id: objectId
      }

      updateMutation.mutate(_d, {
        onSuccess(data, variables, context) {
          accountFormDepartment.current?.resetFields()
          toast.success('Schedule updated successfully')
          setvisibleAddScheduler(false)
          utils.scheduler.list.invalidate()
        },
        onError(error, variables, context) {
          toast.error('Input error, please try again')
        },
      })



    }
  }

  const editScheduler = (record: any) => {
    seteditform(true)
    setvisibleAddScheduler(true)
    setobjectId(record._id)

    setTimeout(() => {
      accountFormDepartment.current?.setFieldsValue({
        title: record?.title,
        sign_in: [
          moment(record?.sign_in[0], 'HH:mm:ss'),
          moment(record?.sign_in[1], 'HH:mm:ss'),
        ],
        sign_out: [
          moment(record?.sign_out[0], 'HH:mm:ss'),
          moment(record?.sign_out[1], 'HH:mm:ss'),
        ],
        late_time: [],
      })
    }, 100)
  }

  const deleteScheduler = (record: any) => {


    deleteMutation.mutate({id:record._id}, {
      onSuccess(data, variables, context) {
        toast.success('Deleted successfully.')
        utils.scheduler.list.invalidate()
      },
      onError(error, variables, context) {
        toast.success('Failed to deleted this item, try again.')
      },
    })

  }

  const columnsScheduler = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: 300,
      key: 'title',
    },
    {
      title: 'Sign In',
      dataIndex: 'sign_in',
      width: 100,
      key: 'sign_in',
      render: (_: any, record: any) => {
        return (<><Tag>{moment(record?.sign_in[0], 'HH:mm').format('LT')}</Tag></>)
      },
    },
    {
      title: 'Late Time',
      dataIndex: 'late_time',
      width: 100,
      key: 'late_time',
      render: (_: any, record: any) => {
        return <Tag>{moment(record?.sign_in[1], 'HH:mm').format('LT')}</Tag>
      },
    },
    {
      title: 'Sign Out',
      dataIndex: 'sign_out',
      width: 100,
      key: 'sign_out',
      render: (_: any, record: any) => {
        return (
          <>
            <Tag>{moment(record?.sign_out[0], 'HH:mm').format('LT')}</Tag>
          </>
        )
      },
    },

    {
      title: 'Action',
      dataIndex: '',
      width: 80,
      key: 'action',
      render: (_: any, record: any) => (
        <div className=" flex space-x-2">
          <Button
            onClick={() => editScheduler(record)}
            size="middle"
            shape="circle"
            key={2}
          >
            <AiOutlineEdit className="anticon" size={14} />
          </Button>
          <Popconfirm
            key={1}
            title="Are you sure to delete this task?"
            onConfirm={() => deleteScheduler(record)}
            onCancel={() => {
              message.warning('Deletion stopped by user.')
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button size="middle" shape="circle">
              <AiOutlineDelete className="anticon" size={14} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="px-4">
      <PageHeader
        ghost={false}
        style={{ marginBottom: 20 }}
        title="Scheduler"
        subTitle="Time manager"
        extra={[
          <Button
            icon={<AiOutlinePlus className="anticon" />}
            onClick={() => {
              setvisibleAddScheduler(true)
              seteditform(false)

              setTimeout(() => {
                accountFormDepartment?.current?.resetFields()
              }, 100)
            }}
            key="1"
          >
            Add new
          </Button>,
        ]}
      />

      <main style={{ flex: 1, paddingLeft: 10, paddingRight: 20 }}>
        <Spin tip="Loading..." spinning={schedulerDataQuery.isLoading}>
          <Table columns={columnsScheduler} dataSource={schedulerDataQuery?.data} />
        </Spin>
      </main>

      <Modal
        maskClosable={false}
        title={editform ? 'Edit Schedule' : 'New Schedule'}
        visible={visibleAddScheduler}
        onCancel={() => {
          setvisibleAddScheduler(false)
        }}
        footer={[
          <Button
            key="submit"
            loading={updateMutation.isLoading || addNewMutation.isLoading}
            htmlType="submit"
            type="primary"
            onClick={() => {
              accountFormDepartment.current?.submit()
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          preserve={false}
          ref={accountFormDepartment}
          layout="vertical"
          name="complex-form"
          onFinish={(form) => onFinishSchedule(form)}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please input title!' }]}
            label="Name"
            name={'title'}
          >
            <Input size="large" placeholder="Input department" />
          </Form.Item>

          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please input time!' }]}
                className="w-full"
                label={'Sign In'}
                name={'sign_in'}
              >
                <TimePicker.RangePicker
                  format={'HH:mm'}
                  className="w-full"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please input time!' }]}
                className="w-full"
                label={'Sign Out'}
                name={'sign_out'}
              >
                <TimePicker.RangePicker
                  format={'HH:mm'}
                  className="w-full"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default SchedulerTable
