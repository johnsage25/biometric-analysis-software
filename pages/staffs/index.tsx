import { getSession } from 'next-auth/react'
import { AppProps } from 'next/app'
import React, { Ref, useRef, useState } from 'react'
import { ServerSideProps } from '../../interface/ServerSideProps'
import LayoutHOC from '../../components/layout/LayoutHOC'
import Head from 'next/head'
import { Avatar, Button, Col, DatePicker, Dropdown, Form, FormInstance, Input, Layout, Menu, MenuProps, Modal, PageHeader, Row, Select } from 'antd'
const { Content } = Layout;
const { Option } = Select;
import GridTable from '@nadavshaar/react-grid-table'
import { AiOutlineEdit, AiOutlineEye, AiOutlineDelete, AiOutlineFilePdf, AiOutlineIdcard, AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai'
import DataTable from 'react-data-table-component';
import { trpc } from '../../utils/trpc'
import { PaginationInterface } from '../../types/PaginationInterface'
import { UserOutlined } from '@ant-design/icons';
import { BiEdit, BiFolder, BiTrash } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'
import { FacultiesOrDepartment, Position } from '../../components/SettingsArray'
import PhoneInput from 'react-phone-input-2'
import moment from 'moment';
import { StaffDataInterface } from '../../types/StaffDataInterface'
import { useRouter } from 'next/router'
import { ReportPdfInterterface } from '../../types/ReportPdfInterterface'
import { truncate } from 'lodash'
import toast from 'react-hot-toast';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

const Index = (props: AppProps) => {
  const router = useRouter()
  const [activePage, setactivePage] = useState(1)
  const [searchText, setsearchText] = useState({})
  const StaffFormRef = useRef<Ref<FormInstance<any>> | any>()
  const [visibleModal, setvisibleModal] = useState(false)
  const [mobileInput, setmobileInput] = useState("")
  const saveStaffMutation = trpc.staff.update.useMutation();
  const schedulerListQuery = trpc.staff.schedulerList.useQuery()
  const staffReportMutation = trpc.attendance.staffReport.useMutation();
  const deleteStaffMutation = trpc.staff.deleteStaff.useMutation()
  const [selectedRow, setselectedRow] = useState('')
  const formRef = useRef<Ref<FormInstance<any>> | any>()
  const [reportDatepickerValue, setreportDatepickerValue] = useState("")
  const [reportTypeChanger, setreportTypeChanger] = useState("")
  const [setStaff, setsetStaff] = useState<any>({})
  let utils = trpc.useContext()
  const [reportvVisible, setreportvVisible] = useState(false)
  const [pagination, setPagination] = useState<PaginationInterface>({
    page: 1,
    limit: 20,
    searchString: searchText,
    populate: 'scheduler',
    sort: {
      createdAt: -1
    }
  })

  let queryStaffList: any = trpc.staff.list.useQuery(pagination, { keepPreviousData: true })

  const [searchValue, setsearchValue] = useState('')


  const printPdfReport = async (val) => {


    let report: ReportPdfInterterface = {
      _id: setStaff._id,
      date: val.date.format("YYYY-MM"),
      reportType: val.report_type
    }

    staffReportMutation.mutate(report, {
      onSuccess(data: any, variables, context) {
        console.log(data);
        if (data?.done) {
          window.open(`${window.location.origin}/report.pdf`, '_blank', 'noreferrer');
        }
      },
    })
    // const { ReportRangeValue, reportTypeChanger, reportDatepickerValue } = this.state

    /// fix weekend here

    // if (reportTypeChanger == "normal") {

    //   this.setState({ confirmLoadingModalReport: true })
    //   var workingDaysWeek = momentWorkingDays(new Date(reportDatepickerValue), 'YYYY-MM-DD').monthBusinessDays()

    //   /// -----

    //   var collect = Collect(workingDaysWeek)
    //   var from = collect.first()
    //   var to = collect.last()

    //   this.postReportDownload(from, to)


    // }
    // else {
    //   var collect = Collect(ReportRangeValue)
    //   var from = collect.first()
    //   var to = collect.last()
    //   this.postReportDownload(from, to)

    // }

  }



  const columns: any = [

    {
      name: '',
      width: '80px',
      selector: row => (<Avatar size={40} src={`/uploads/${row.staff_image}`} />),
    },

    {
      name: 'Fullname',

      selector: row => row.fullname,
    },
    {
      name: "Staff ID", width: '150px', style: {
        backgroundColor: '#f1f5f9',
        color: '#000',
        width: '80px',
        '&:hover': {
          cursor: 'pointer',
        },
      }, selector: row => row.unique_id_no
    },
    {
      name: 'Department',
      selector: row => row.fac_a_department,
    },

    {
      name: 'Position',
      selector: row => row.work_position,
    },
    {
      name: 'Scheduler',
      width: "140px",
      selector: row => {
        return (
          <>
            <span>{row?.scheduler[0]?.title || ""}</span>
          </>
        )
      },
    },
    {
      name: '',
      width: '100px',
      selector: row => {

        const menu = (
          <Menu

            items={[
              {
                label: 'View',
                key: '1',
                onClick: (e) => {

                  router.push(`/staffs/${row._id}`)
                },
                icon: <AiOutlineEye />,
              },
              {
                label: 'Print Card',
                onClick: () => {
                  window.open(`/api/cardgen?staffId=${row._id}`, '_blank', 'noreferrer');
                },
                key: '4',
                icon: <BiFolder />,
              },
              {

                onClick: () => {
                  setvisibleModal(true)

                  setselectedRow(row._id)

                  StaffFormRef.current.setFieldsValue({
                    ...row,
                    phone: row.mobile,
                    scheduler: row?.scheduler[0]?._id,
                    birthdate: moment(row.birthdate, "YYYY-MM-DD"),
                    _id: row._id,
                  });

                },

                label: 'Edit',
                key: '3',
                icon: <AiOutlineEdit />,
              },
              {
                label: 'Delete',
                onClick: () => {
                  confirm({
                    title: 'Do you Want to delete these staff data?',
                    icon: <ExclamationCircleFilled />,
                    content: 'Please note that this action can\'t be undone.',
                    onOk() {
                      deleteStaffMutation.mutate({ staffId: row?._id }, {
                        onSuccess(data, variables, context) {
                          toast.success("Staff deleted successfully.")
                          utils.staff.list.invalidate()
                        },
                        onError(error, variables, context) {
                          toast.error("Unable to delete staff data.")
                        },
                      })
                      console.log('OK');
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                  });
                },
                key: '2',
                icon: <AiOutlineDelete />,
              },

            ]}
          />
        );
        return (
          <div className=' space-x-5 items-center flex'>
            <Button type="text" onClick={() => {
              setreportvVisible(true)
              setsetStaff(row)
              formRef.current?.resetFields()
            }} icon={<AiOutlineFilePdf />} />
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button type="text" icon={<AiOutlineMenu />} />
            </Dropdown>

          </div>
        )
      },
    },
  ];


  const onChangeRowsPerPage = (row: any) => {
    setPagination({
      page: activePage,
      limit: row,
      populate: 'scheduler',
      sort: {
        createdAt: -1
      }
    })

  }

  const handlePageChange = page => {

    setPagination({
      page: page,
      limit: 20,
      populate: 'scheduler',
      sort: {
        createdAt: -1
      }
    })

    setactivePage(page);
  };

  const onFinishStaff = (value: any) => {
    let data: StaffDataInterface = {
      ...value,
      _id: selectedRow
    }

    saveStaffMutation.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data);
        utils.staff.list.invalidate()
        StaffFormRef.current?.resetFields();
        setvisibleModal(false)
        toast.success("Updated successfully.")

      },
      onError(error, variables, context) {

        toast.error("Unable to update staff data.")
      },
    })

  }

  const onFinishFailed = () => { }

  const onGenderChange = () => { }

  const setscheduleData = () => { }

  const onChangeReportDate = (date, dateString) => {
    setreportDatepickerValue(dateString)

  }

  let dataList = queryStaffList?.data || []
  let scheduleData: { value: "", label: "" }[] = schedulerListQuery?.data || []

  const selectReportType = (value) => {
    setreportTypeChanger(value)
  }



  return (
    <div>
      <Head>
        <title>Staff | Admin Panel</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <Content
        className="site-layout-body"
        style={{

          minHeight: 280,
        }}
      >

        <PageHeader
          className="site-page-header"
          style={{ paddingLeft: 4, paddingRight: 4, marginBottom: 20 }}
          title="Staff List"
          // breadcrumb={this.routes}

          extra={[

            <div key={2} className=' w-72'>
              <Input
                // showSearch={true}
                value={searchValue}
                placeholder="Search filter"


                className="w-full"
                prefix={<AiOutlineSearch />}


                onChange={(e) => {
                  setsearchValue(e.target.value)
                  setPagination({
                    limit: 20,
                    populate: 'scheduler',
                    searchString: e.target.value.length > 0 ? { fullname: { $regex: `${e.target.value}`, $options: 'i' } } : {},
                    sort: {
                      createdAt: -1
                    }
                  })


                }}

              />

            </div>,

            // <Button key={1} onClick={() => {
            //     Router.push("/staffs/general_attendance");
            // }} type="primary" icon={<AiOutlineCalendar className='anticon' />}>General Attendance</Button>,


          ]}
        />

        <DataTable columns={columns} paginationServer
          paginationPerPage={20} onChangeRowsPerPage={onChangeRowsPerPage} onChangePage={handlePageChange}
          paginationTotalRows={dataList?.totalDocs} data={dataList?.docs} pagination />


        <Modal
          visible={visibleModal}
          title="Edit Staff"
          maskClosable={false}

          forceRender={true}
          onCancel={() => {
            setvisibleModal(false)
          }}
          footer={[

            <Button key="submit" type="primary" loading={saveStaffMutation.isLoading} onClick={() => {

              StaffFormRef.current.submit()

            }}>
              Submit
            </Button>,

          ]}
        >

          <Form
            name={"staff_form"}
            layout="vertical"
            onFinish={onFinishStaff}
            ref={StaffFormRef}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <input type='hidden' name='_id' />
            <Form.Item
              label="Full Name"
              name="fullname"
              rules={[{ required: true, message: 'Please input your fullname!' }]}
            >
              <Input size="large" placeholder="Staff fullname.. e.g John Sage" />
            </Form.Item>

            <Form.Item name="fac_a_department" label="Department" rules={[{ required: true }]}>
              <Select
                size="large"
                placeholder="Select staff department"
                onChange={onGenderChange}
                allowClear
              >
                {FacultiesOrDepartment.map((item, i) =>
                  <Option value={item.toLowerCase()} key={i}>{item}</Option>
                )}

              </Select>
            </Form.Item>

            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                  <PhoneInput
                    country={'ng'}
                    inputClass="ant-input-lg"
                    inputStyle={{ width: '100%', height: 'auto', borderRadius: 2 }}
                    value={mobileInput}
                    containerStyle={{ borderRadius: 2 }}
                    onChange={mobileInput => setmobileInput(mobileInput)}
                  />

                </Form.Item>

              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input size="large" placeholder="info@pearldrift.com" />
                </Form.Item>

              </Col>
            </Row>
            <Form.Item name="work_position" label="Work Position" rules={[{ required: true }]}>
              <Select
                size="large"
                placeholder="Select staff position"
                // onChange={this.onGenderChange}
                allowClear
              >
                {Position.map((item, i) =>
                  <Option value={item.toLowerCase()} key={i}>{item}</Option>
                )}

              </Select>
            </Form.Item>

            <Row gutter={6}>
              <Col span={12}>
                <Form.Item name="scheduler" rules={[{ required: true }]} label="Scheduler">
                  <Select
                    size="large"
                    placeholder="Select an option"

                    onChange={setscheduleData}
                    allowClear
                  >
                    {scheduleData?.map((item, i) => <Option value={item.value} key={i}>{item.label}</Option>)}
                  </Select>
                </Form.Item>

              </Col>

              <Col span={12}>
                <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    placeholder="Select a option"
                    onChange={onGenderChange}
                    allowClear
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            {/*
                        <Row gutter={6}>


                            <Col span={12}>

                                <Form.Item name="staff_category" label="Category" rules={[{ required: true }]}>
                                    <Select
                                        size="large"
                                        placeholder="Select staff category"
                                        onChange={this.onGenderChange}
                                        allowClear
                                    >
                                        {Category.map((item, i) =>
                                            <Option value={item.toLowerCase()} key={i}>{item}</Option>
                                        )}

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row> */}


            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="Staff unique no"
                  name="unique_id_no"
                  rules={[{ required: false, message: 'Please input your unique!' }]}
                >
                  <Input size="large" placeholder="BAS-38948302" />
                </Form.Item>

              </Col>
              <Col span={12}>
                <Form.Item
                  label="Birthdate"
                  name="birthdate"
                  rules={[{ required: true, message: 'Please staff birthdate!' }]}
                >
                  <DatePicker size="large" className="w-full h-full" defaultValue={moment('1999/01/01', "YYYY-MM-DD")} format={"YYYY-MM-DD"} />
                </Form.Item>

              </Col>


            </Row>

          </Form>


        </Modal>

        <Modal
          title={`Print Report for ${truncate(setStaff.fullname, {
            length: 25,
            omission: "..."
          })}`}
          visible={reportvVisible}
          // onOk={handleReportOk}
          closable={true}
          okText="Print"
          maskClosable={false}
          footer={[
            <Button type='primary' loading={staffReportMutation.isLoading} onClick={() => {
              formRef.current?.submit();

            }} icon={<AiOutlineFilePdf size={17} className="anticon" />} key={1}>PDF File</Button>
          ]}
          confirmLoading={staffReportMutation.isLoading}
          onCancel={() => setreportvVisible(false)}
        >
          <Form
            name="basic"
            layout="vertical"
            ref={formRef}
            onFinish={printPdfReport}
            autoComplete="off"
          >
            <Form.Item
              label="Report Type:"
              name="report_type"
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={selectReportType}
                size="large"
                defaultValue={""}
                allowClear
              >
                <Option value="normal">Normal</Option>
                {/* <Option value="range">Range</Option> */}
              </Select>
            </Form.Item>

            <Form.Item
              label="Date:"
              name="date"
            // extra={reportTypeChanger != "normal" ? [
            //   <div className='pt-2' key={2}> <Segmented onChange={setDateRange} options={['Default', 'Weekly', 'Monthly', 'Yearly']} /> </div>
            // ] : []}
            ><DatePicker inputReadOnly={true} className='w-full' picker='month'
              onChange={onChangeReportDate} size="large" />
            </Form.Item>

          </Form>

        </Modal>


      </Content>
    </div>
  )
}

export default LayoutHOC(Index);

export async function getServerSideProps(ctx: any) {

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
  else {
    return {
      props: {}, // will be passed to the page component as props
    }
  }
}