import {
  Avatar,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Upload,
} from 'antd'
import React, { useLayoutEffect, useRef, useState } from 'react'
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUserAdd,
} from 'react-icons/ai'
import {
  RightOutlined,
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InboxOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import { FacultiesOrDepartment, Position } from '../../components/SettingsArray'
import ImgCrop from 'antd-img-crop'
const { Dragger } = Upload
import moment from 'moment'
const { Option } = Select
import axios from 'axios';
import { trpc } from '../../utils/trpc'
import { AddNewStaffInterface } from '../../types/AddNewStaffInterface'
import { toast } from 'react-hot-toast'

const AdminAccount = (props: any) => {
  const [tableContent, settableContent] = useState([])
  const [loadingPage, setloadingPage] = useState(true)
  const [visibleAddAccount, setvisibleAddAccount] = useState(false)
  const [titleModalAccount, settitleModalAccount] = useState('')
  const [helpUsername, sethelpUsername] = useState('')
  const [editAccount, seteditAccount] = useState(false)
  const [helpEmail, sethelpEmail] = useState('')
  const [mobileInput, setmobileInput] = useState('')
  const [loadingAccount, setloadingAccount] = useState(false)
  const [userId, setuserId] = useState('')
  const [fileList, setfileList] = useState<any[]>([])

  const addAdminUserMutation = trpc.admin.addAdminUser.useMutation()
  const adminUserlistQuery = trpc.admin.adminUserlist.useQuery()
  const updateAdminUpdation = trpc.admin.updateAdmin.useMutation()
  const deleteAdminMutation = trpc.admin.deleteAdmin.useMutation()

  const utils = trpc.useContext()

  console.log(props?.user);


  const accountForm: any = useRef<FormInstance<any>>()


  const editAdmin = (record: any) => {
    accountForm.current?.resetFields()
    seteditAccount(true)
    setuserId(record._id)
    settitleModalAccount('Edit Account')
    setvisibleAddAccount(true)

    setTimeout(() => {
      accountForm.current?.setFieldsValue({
        ...record,
        password: ""
      })
    }, 100)
  }

  const uploadprops = {
    name: 'avatar',
    multiple: false,
    listType: 'picture',
    maxCount: 1,
    beforeUpload: (file) => {
      setfileList((state) => [...fileList, file])
      return false
    },

    onChange: ({ file: file, fileList: newFileList }) => {
      if (file) {
        setfileList(newFileList)
      }
    },
    onPreview: async (file) => {
      let src = file.url

      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file.originFileObj)

          reader.onload = () => resolve(reader.result)
        })
      }

      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const getSrcFromFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file.originFileObj)
      reader.onload = () => resolve(reader.result)
    })
  }

  const onFinishAccount = (form: any) => {
    setloadingAccount(true)


    if (!editAccount) {

      let _d: AddNewStaffInterface = {
        ...form
      }

      addAdminUserMutation.mutate(_d, {
        onSuccess(data, variables, context) {
          accountForm.current?.resetFields()
          utils.admin.adminUserlist.invalidate()
          setvisibleAddAccount(false)
          toast.success('Account created successfully.')
        },
        onError(error, variables, context) {
          console.log(error.data);

          toast.error(`Unable add new staff \n reason: ${error.message}`)
        },
      })



    } else {

      console.log(userId);

      let _d: AddNewStaffInterface = {
        ...form,
        _id: userId
      }
      updateAdminUpdation.mutate(_d, {
        onSuccess(data, variables, context) {
          utils.admin.adminUserlist.invalidate()
          accountForm.current?.resetFields()
          setvisibleAddAccount(false)
          toast.success('Account update successfully.')
        },
        onError(error, variables, context) {
          toast.error("Unable update new staff")
        },
      })


    }
  }

  const deleteAdminAccoint = (admin: any) => {

    deleteAdminMutation.mutate({ id: admin._id }, {
      onSuccess(data, variables, context) {
        toast.success('Account deleted successfully')
        utils.admin.adminUserlist.invalidate()
      },
      onError(error, variables, context) {
        toast.error(error.message)
      },
    })



  }

  const columns = [
    {
      title: '',
      dataIndex: 'image',
      width: 80,
      key: 'image',
      render: (text: any, record: any) => (
        <Avatar size={50} src={'/svg/avatar-profile.svg'} />
      ),
    },
    {
      title: 'Fullname',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <div className=" flex space-x-2">
          <Button
            onClick={() => editAdmin(record)}
            size="middle"
            disabled={props?.user._id == record._id}
            shape="circle"
            key={2}
          >
            <AiOutlineEdit className="anticon" size={14} />
          </Button>
          <Popconfirm
            key={1}
            title="Are you sure to delete this task?"
            onConfirm={() => deleteAdminAccoint(record)}
            onCancel={() => {
              message.warning('Deletion stopped by user.')
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={props?.user._id == record._id} size="middle" shape="circle">
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
        title="Admin"
        subTitle="Accounts"
        extra={[
          <Button
            icon={<AiOutlineUserAdd className="anticon" size={16} />}
            onClick={() => {
              accountForm.current?.resetFields()
              setvisibleAddAccount(true)
              seteditAccount(false)
              settitleModalAccount('New Account')
            }}
            key="1"
          >
            New account
          </Button>,
        ]}
      />

      {!adminUserlistQuery.isLoading ? (
        <Table dataSource={adminUserlistQuery.data} columns={columns} />
      ) : (
        <div className=' flex justify-center'>
          <Spin tip="Loading..." spinning={adminUserlistQuery.isLoading} />
        </div>
      )}

      <Modal
        visible={visibleAddAccount}
        title={`${titleModalAccount}`}
        maskClosable={false}
        onCancel={() => setvisibleAddAccount(false)}
        footer={[
          <Button
            key="submit"
            loading={addAdminUserMutation.isLoading || updateAdminUpdation.isLoading}
            type="primary"
            onClick={() => {
              accountForm.current?.submit()
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          ref={accountForm}
          layout="vertical"
          name="complex-form"
          onFinish={(form) => onFinishAccount(form)}
        >
          <Form.Item
            name={'fullname'}
            label={'Fullname'}
            rules={[{ required: true, message: 'Fullname is required' }]}
          >
            <Input placeholder="Staff name" size="large" />
          </Form.Item>

          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                name={'username'}
                label={'Username'}
                help={helpUsername}
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Input placeholder="Input username" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'password'}
                label={'Password'}
                rules={[
                  { required: !editAccount, message: 'Password is required' },
                ]}
              >
                <Input.Password
                  placeholder="input password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                name={'email'}
                label={'Email'}
                help={helpEmail}
                rules={[{ type: 'email', required: !editAccount }]}
              >
                <Input placeholder="Staff email" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'phone'}
                label={'Phone Number'}
                rules={[
                  { required: false, message: 'Fullname is phone number' },
                ]}
              >
                <PhoneInput
                  country={'ng'}
                  inputClass="ant-input-lg"
                  inputStyle={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                  }}
                  value={mobileInput}
                  containerStyle={{ borderRadius: 2 }}
                  onChange={(mobileInput) => setmobileInput(mobileInput)}
                />
                {/* <ConfigProvider locale={en}>
                                            <CountryPhoneInput />
                                        </ConfigProvider> */}
                {/* <Input

                                            placeholder="1555 5555"
                                            size='large'

                                        /> */}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                label="Role"
                name={'role'}
                rules={[{ required: true, message: 'Province is required' }]}
              >
                <Select size="large" placeholder="Select role">
                  <Option value="Administrator">Administrator</Option>
                  <Option value="Moderator">Moderator</Option>
                  <Option value="Subadmin">Subadmin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Assigned Position"
                name={'position'}
                rules={[{ required: true, message: 'Department is required' }]}
              >
                <Select size="large" placeholder="Select department">
                  {FacultiesOrDepartment.map((item) => (
                    <>
                      <Option value={item.toLowerCase()}>{item}</Option>
                    </>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status" name={'status'} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminAccount
