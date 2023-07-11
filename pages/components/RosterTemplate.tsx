import {
  Button,
  Col,
  Form,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
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
import { rosterInterface } from '../../types/rosterInterface';
import { toast } from 'react-hot-toast';

const { Option } = Select

const RosterTemplate = () => {
  const [rosterEventData, setrosterEventData] = useState([])
  const [loadingPage, setloadingPage] = useState(false)
  const [isEdit, setisEdit] = useState(false)
  const [visibleRosterTemplateModal, setvisibleRosterTemplateModal] = useState(
    false,
  )
  const rosterTemplateFormRef = useRef<any>()
  const [modalTitle, setmodalTitle] = useState('')
  const [scheduleId, setscheduleId] = useState('')

  const rosterListQuery = trpc.roster.list.useQuery()
  const utils = trpc.useContext()

  const addnewMutation = trpc.roster.addnew.useMutation()
  const updateMutation = trpc.roster.update.useMutation()
  const deleteMutation = trpc.roster.delete.useMutation()

  const deleteEvent = (record: any) => {

    deleteMutation.mutate({ id: record._id }, {
      onSuccess(data) {
        toast.success("Deleted successfully.")
        utils.roster.list.invalidate()
      },
      onError(error, variables, context) {
        toast.error('Failed to deleted this item, try again.')
      },
    })


  }

  const columnsRosterEvent = [
    {
      title: 'Event',
      dataIndex: 'roster_event',
      width: 200,
      key: 'roster_event',
      render: (_: any, record: any) => {
        switch (record.roster_event) {
          case 'M':
            return <span>Morning</span>
          case 'A':
            return <span>Afternoon</span>
          case 'E':
            return <span>Evening</span>
          default:
            return <span>Off</span>
        }
      },
    },
    {
      title: 'Sign In',
      dataIndex: 'sign_in',
      width: 100,
      key: 'sign_in',
      render: (_: any, record: any) => {
        return <Tag>{moment(record?.sign_in[0], 'HH:mm').format('LT')}</Tag>
      },
    },
    {
      title: 'Sign Out',
      dataIndex: 'sign_out',
      width: 100,
      key: 'sign_out',
      render: (_: any, record: any) => {
        return <Tag>{moment(record?.sign_out[0], 'HH:mm').format('LT')}</Tag>
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
      title: 'Action',
      dataIndex: '',
      width: 80,
      key: 'action',
      render: (_: any, record: any) => (
        <div className=" flex space-x-2">
          <Button
            onClick={() => {
              setscheduleId(record._id)

              setvisibleRosterTemplateModal(true)
              rosterTemplateFormRef.current?.resetFields()

              setmodalTitle('Edit Template')
              setisEdit(true)
              setTimeout(() => {
                rosterTemplateFormRef.current?.setFieldsValue({
                  roster_event: record?.roster_event,
                  sign_in: [
                    moment(record?.sign_in[0], 'HH:mm'),
                    moment(record?.sign_in[1], 'HH:mm'),
                  ],
                  sign_out: [
                    moment(record?.sign_out[0], 'HH:mm'),
                    moment(record?.sign_out[1], 'HH:mm'),
                  ],
                })
              }, 100)
            }}
            shape="circle"
            size="middle"
            key={2}
          >
            <AiOutlineEdit className="anticon" size={14} />
          </Button>
          <Popconfirm
            key={1}
            title="Are you sure to delete this task?"
            onConfirm={() => {
              deleteEvent(record)
            }}
            onCancel={() => {
              message.warning('Deletion stopped by user.')
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button shape="circle" size="middle">
              <AiOutlineDelete className="anticon" size={14} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const onFinishRosterEvent = (form: any) => {
    const { roster_event, sign_out, sign_in } = form

    if (!isEdit) {

      let _d: rosterInterface = {
        roster_event,
        sign_in: [sign_in[0].format('HH:mm'), sign_in[1].format('HH:mm')],
        sign_out: [sign_out[0].format('HH:mm'), sign_out[1].format('HH:mm')],
      }

      addnewMutation.mutate(_d, {
        onSuccess(data, variables, context) {
          toast.success('Event added successfully.')
          setvisibleRosterTemplateModal(false)
          utils.roster.list.invalidate()
        },
        onError(error, variables, context) {
          toast.error('Event already added, please edit to make changes.')
        },
      })



    } else {

      let _d: rosterInterface = {
        roster_event,
        sign_in: [sign_in[0].format('HH:mm'), sign_in[1].format('HH:mm')],
        sign_out: [sign_out[0].format('HH:mm'), sign_out[1].format('HH:mm')],
        _id: scheduleId
      }

      updateMutation.mutate(_d, {
        onSuccess(data, variables, context) {
          toast.success('Event updated successfully.')
          setvisibleRosterTemplateModal(false)
          utils.roster.list.invalidate()
        },
        onError(error, variables, context) {
          toast.error('Unknown error occured.')
        },
      })
    }
  }

  return (
    <div className="px-4">
      <PageHeader
        ghost={false}
        title="Roster"
        subTitle="Template"
        extra={[
          <Button
            key="3"
            icon={<AiOutlinePlus className="anticon" />}
            onClick={() => {
              setvisibleRosterTemplateModal(true)
              setmodalTitle('New Template')
              setisEdit(false)
              rosterTemplateFormRef.current?.resetFields()
            }}
          >
            Add new
          </Button>,
        ]}
      />
      <Spin tip="Loading..." spinning={rosterListQuery.isLoading}>
        <Table columns={columnsRosterEvent} dataSource={rosterListQuery?.data} />
      </Spin>

      <Modal
        visible={visibleRosterTemplateModal}
        title={modalTitle}
        maskClosable={false}
        confirmLoading={addnewMutation.isLoading || addnewMutation.isLoading}
        onOk={() => {
          rosterTemplateFormRef.current?.submit()
        }}
        onCancel={() => {
          setvisibleRosterTemplateModal(false)
        }}
      >
        <Form
          preserve={false}
          ref={rosterTemplateFormRef}
          layout="vertical"
          name="complex-form"
          onFinish={(form) => onFinishRosterEvent(form)}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please input Event!' }]}
            label="Event"
            name={'roster_event'}
          >
            <Select size="large" placeholder="Please select an event">
              <Option value="M">Morning</Option>
              <Option value="E">Evening</Option>
              <Option value="A">Afternoon</Option>
            </Select>
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

export default RosterTemplate
