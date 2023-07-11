import { AppProps } from 'next/app'
import React, { Ref, useRef, useState } from 'react'
import LayoutHOC from '../../components/layout/LayoutHOC'
import { getSession } from 'next-auth/react'
import { StaffDetails } from '../../node/StaffDetails'
import Head from 'next/head'
import { Avatar, Badge, Button, Card, Col, DatePicker, Dropdown, Form, Layout, Menu, Modal, Row, Segmented, Select } from 'antd'
import { BsArchive, BsPhoneVibrate } from 'react-icons/bs'
import { AiFillIdcard, AiOutlineCalendar, AiOutlineFilePdf, AiOutlineMail, AiOutlineMenu } from 'react-icons/ai'
const { Content } = Layout;
const { Meta } = Card;
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, LineChart, Line, LabelList } from 'recharts';

import DataTable from 'react-data-table-component'
import { trpc } from '../../utils/trpc'
import { PaginationInterface } from '../../types/PaginationInterface'
import { StaffAttendancePagingInterface } from '../../types/StaffAttendancePagingInterface'
import dateFormat, { masks } from "dateformat";
import { convertMinutesToHoursAndMinutes } from '../api/attendance'
import { convertMinutesToHoursAndMinutesHelper, ucword } from '../../utils/helpers'
import moment from "moment"
import { ReportPdfInterterface } from '../../types/ReportPdfInterterface'
import { FormInstance } from 'antd/es/form/Form'

import dynamic from 'next/dynamic';
import PdfViewerComponent from '../components/PdfViewerComponent'




const { Option } = Select;
const { RangePicker } = DatePicker;
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Entity = (props: any) => {

  const { objectId } = props.query


  const [yearlySignedIn, setyearlySignedIn] = useState("")
  const [yearlySignedOut, setyearlySignedOut] = useState("")
  const [selectYear, setselectYear] = useState("")
  const [activeIndex, setactiveIndex] = useState(0)
  const [activePage, setactivePage] = useState(1)
  const [rangeFormatter, setrangeFormatter] = useState<any>("")
  const [reportDatepickerValue, setreportDatepickerValue] = useState("")
  const [ReportRangeValue, setReportRangeValue] = useState("")
  const [reportTypeChanger, setreportTypeChanger] = useState("")
  const [showPrintPdf, setshowPrintPdf] = useState(false)
  const formRef = useRef<Ref<FormInstance<any>> | any>()
  const viewer = useRef(null);
  const [selectedDate, setselectedDate] = useState<string | undefined>()
  const [pagination, setPagination] = useState<StaffAttendancePagingInterface>({
    _id: objectId,
    selectedDate: selectedDate,
    page: activePage,
    limit: 15,
    populate: ['staff_objectId'],
    sort: {
      createdAt: -1
    }
  })
  const [dataMonthly, setdataMonthly] = useState<{ name: string; timeliness: number; lateness: number; }[]>([])
  const [dataYearlyGraph, setdataYearlyGraph] = useState<{ name: string; completed: number; incomplete: number; }[]>([])
  const AttendanceQuery = trpc.attendance.list.useQuery(pagination, { keepPreviousData: true })
  const staffReportMutation = trpc.attendance.staffReport.useMutation();

  const monthlygraphQuery = trpc.attendance.monthlygraph.useQuery({ _id: objectId }, {
    onSuccess(data: any) {


      let graphItem1 = data?.lateness[0]?.data;
      let graphItem2 = data?.timeliness[0]?.data;


      const dataMonthly_D: { name: string; timeliness: number; lateness: number; }[] = [
        {
          name: 'Jan',
          lateness: graphItem1?.January || 0,
          timeliness: graphItem2?.January || 0,
        },
        {
          name: 'Feb',
          lateness: graphItem1?.February || 0,
          timeliness: graphItem2?.February || 0,
        },
        {
          name: 'Mar',
          lateness: graphItem1?.March || 0,
          timeliness: graphItem2?.March || 0,
        },
        {
          name: 'Apr',
          lateness: graphItem1?.April || 0,
          timeliness: graphItem2?.April || 0,
        },
        {
          name: 'May',
          lateness: graphItem1?.May || 0,
          timeliness: graphItem2?.May || 0,
        },
        {
          name: 'Jun',
          lateness: graphItem1?.June || 0,
          timeliness: graphItem2?.June || 0,
        },
        {
          name: 'Jul',
          lateness: graphItem1?.July || 0,
          timeliness: graphItem2?.July || 0,
        },
        {
          name: 'Aug',
          lateness: graphItem1?.August || 0,
          timeliness: graphItem2?.August || 0,
        },
        {
          name: 'Sep',
          lateness: graphItem1?.September || 0,
          timeliness: graphItem2?.September || 0,
        },
        {
          name: 'Oct',
          lateness: graphItem1?.October || 0,
          timeliness: graphItem2?.October || 0,
        },
        {
          name: 'Nov',
          lateness: graphItem1?.November || 0,
          timeliness: graphItem2?.November || 0,
        },
        {
          name: 'Dec',
          lateness: graphItem1?.December || 0,
          timeliness: graphItem2?.December || 0,
        },
      ];

      setdataMonthly([...dataMonthly_D])
    },
  });

  const yearlyBarGraphQuery = trpc.attendance.yearlyBarGraph.useQuery({ _id: objectId }, {
    onSuccess(data: any) {

      console.log(data);



      let graphItem1 = data?.completed[0]?.data;
      let graphItem2 = data?.incomplete[0]?.data;

      const dataYearly = [
        {
          name: 'Jan',
          completed: graphItem1?.January || 0,
          incomplete: graphItem2?.January || 0,
        },
        {
          name: 'Feb',
          completed: graphItem1?.February || 0,
          incomplete: graphItem2?.February || 0,
        },
        {
          name: 'Mar',
          completed: graphItem1?.March || 0,
          incomplete: graphItem2?.March || 0,
        },
        {
          name: 'Apr',
          completed: graphItem1?.April || 0,
          incomplete: graphItem2?.April || 0,
        },
        {
          name: 'May',
          completed: graphItem1?.May || 0,
          incomplete: graphItem2?.May || 0,
        },
        {
          name: 'Jun',
          completed: graphItem1?.June || 0,
          incomplete: graphItem2?.June || 0,
        },
        {
          name: 'Jul',
          completed: graphItem1?.July || 0,
          incomplete: graphItem2?.July || 0,
        },
        {
          name: 'Aug',
          completed: graphItem1?.August || 0,
          incomplete: graphItem2?.August || 0,
        },
        {
          name: 'Sep',
          completed: graphItem1?.September || 0,
          incomplete: graphItem2?.September || 0,
        },
        {
          name: 'Oct',
          completed: graphItem1?.October || 0,
          incomplete: graphItem2?.October || 0,
        },
        {
          name: 'Nov',
          completed: graphItem1?.November || 0,
          incomplete: graphItem2?.November || 0,
        },
        {
          name: 'Dec',
          completed: graphItem1?.December || 0,
          incomplete: graphItem2?.December || 0,
        },
      ];

      setdataYearlyGraph([...dataYearly])
    },
  })



  const staff = props?.staff
  const [reportvVisible, setreportvVisible] = useState(false)
  const [isModalEmail, setisModalEmail] = useState(false)


  const handleReportOk = () => {

  }

  const columns: any = [
    {
      name: 'Date',
      selector: row => (
        <>{dateFormat(row.timestamp_date, 'mediumDate')}</>
      ),
    },
    {
      name: 'Method',
      selector: row => ucword(row.capture_type),
    },
    {
      width: '100px',
      style: {
        background: "#3b82f6",
        color: "#fff",
        borderLeft: "1px solid #ddd"
      },
      name: 'Signed In',
      selector: row => (
        <span className='font-semibold'>
          {dateFormat(`${(moment(row.timestamp_date)).format('DD-MMM-YYYY')} ${row.time_in}`, "shortTime")}
        </span>
      ),
    },
    {
      name: 'Signed Out',
      width: '100px',
      style: {
        background: "#10b981",
        color: "#fff",
        borderBottom: '1px solid rgb(255 255 255 / 6%)',
        textAlign: "center"
      },
      selector: row => (
        <>
          {dateFormat(`${(moment(row.timestamp_date)).format('DD-MMM-YYYY')} ${row.time_out}`, "shortTime")}
        </>
      ),
    },
    {
      name: 'Timeliness',
      selector: row => {
        if (row.is_early) {
          return <>{convertMinutesToHoursAndMinutesHelper(row?.early_durationMinutes)} Early</>
        }
        else {
          return <>{convertMinutesToHoursAndMinutesHelper(row?.lateness_durationMinutes)} Late</>
        }

      },
    },
    {
      name: 'Left At',
      selector: row => (
        <>{convertMinutesToHoursAndMinutesHelper(row?.leftearly_durationMinutes)}</>
      ),
    },
    {
      name: 'Status',
      selector: row => ucword(row.attns_type !== "signed_in" ? "completed" : "incomplete"),
    },
  ];

  const dataAttendance = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ]

  const onChangeRowsPerPage = (row: any) => {
    setPagination({
      _id: objectId,
      page: activePage,
      selectedDate: selectedDate,
      limit: row,
      populate: ['staff_objectId'],
      sort: {
        createdAt: -1
      }
    })

  }
  const onPieEnter = (_, index) => {
    setactiveIndex(index);
  };

  const onCalendarChangeReport = (val) => {
    setReportRangeValue(val)
  }

  const handlePageChange = page => {

    setPagination({
      _id: objectId,
      page: page,
      selectedDate: selectedDate,
      limit: 15,
      populate: ['staff_objectId'],
      sort: {
        createdAt: -1
      }
    })

    setactivePage(page);
  };


  const setDateRange = (val) => {

    switch (val) {
      case "Monthly":
        setrangeFormatter("month")

        break;
      case "Weekly":
        setrangeFormatter("week")

        break;
      case "Yearly":
        setrangeFormatter("year")

        break;
      default:
        setrangeFormatter("date")

        break;
    }
  }

  const onChangeReportDate = (date, dateString) => {
    setreportDatepickerValue(dateString)

  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {value.split(' ')[1]}
        </text>
      </g>
    );
  };

  const selectReportType = (value) => {
    setreportTypeChanger(value)
  }


  const printPdfReport = async (val) => {

    let report: ReportPdfInterterface = {
      _id: objectId,
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

  let dataTable: any = AttendanceQuery.data || []


  return (
    <div>
      <Head>
        <title>{staff?.fullname} Profile | Admin Panel</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="container mx-auto pb-10 ">

        <Badge.Ribbon text={staff?.status ? "Active" : "Retired"} color={staff?.status ? "blue" : "red"} placement="start">
          <Card className='shadow-sm rounded-lg overflow-hidden' size="small">
            <div className="bg-white dark:bg-gray-800 rounded-md  py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-10 ">
              <div className="flex items-center mb-4 sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
                <div className="h-20 w-20">
                  <Avatar src={`/uploads/${staff?.staff_image}`} size={80} className="border border-solid rounded-full border-slate-200" />
                </div>
                <div className="ml-2 space-y-2">
                  <div className='flex space-x-3 '>
                    <h2 className="text-sky-900 dark:text-gray-100 text-lg font-bold ">{staff?.fullname}</h2>

                  </div>
                  <div className="flex space-x-4 border-b pb-2 w-full">
                    <div className="flex items-center space-x-1"><span><BsPhoneVibrate size={20} /> </span> <span>{staff?.mobile}</span></div>
                    <div className="flex items-center space-x-1"><span><AiOutlineMail size={20} /> </span> <span>{staff?.email}</span></div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-1"><span className=' font-semibold'>StaffID: </span> <span>{staff?.unique_id_no}</span></div>
                    <div className="flex items-center space-x-1"><span className=' font-semibold'>Category: </span> <span>{staff?.staff_category}</span></div>
                    <div className="flex items-center space-x-1"><span className=' font-semibold'>Position: </span> <span>{staff?.work_position}</span></div>
                  </div>

                </div>
              </div>
              <div>
                <Button key="1" type="primary" onClick={() => {
                  setreportvVisible(true)
                }} className="" icon={<AiOutlineCalendar className="anticon" />}>Print PDF</Button>
                <Button key="3" target="_blank" rel="noopener noreferrer" href={`/api/cardgen?staffId=${staff?._id}`} className="ml-2" icon={<BsArchive className="anticon" />}>Print Card</Button>

                {/* <Dropdown overlay={
                  <Menu
                    items={[
                      {
                        key: '1',
                        icon: <AiOutlineMail />,
                        onClick: () => {
                          setisModalEmail(false)
                        },
                        label: (
                          <span>Email staff</span>
                        ),
                      },

                      {
                        key: '3',
                        icon: <AiOutlineFilePdf />,
                        onClick: () => {
                          setreportvVisible(true)
                        },
                        label: (
                          <> Print report</>
                        ),
                      },
                      {
                        key: '2',
                        icon: <AiFillIdcard />,

                        label: (
                          <a target="_blank" rel="noopener noreferrer" href={`/api/cardgen?staffId=${staff?._id}`}>
                            Print Card
                          </a>
                        ),
                      },

                    ]}
                  />
                } placement="bottomRight">
                  <Button key="2" className="ml-2" icon={<AiOutlineMenu className="anticon" />}>Menu</Button>
                </Dropdown> */}

              </div>
            </div>
          </Card>
        </Badge.Ribbon>


      </div>

      <Content className="container staff_acc">

        <div className='grid lg:grid-cols-2 gap-4'>
          <div>
            <Card className=' shadow-sm w-full' title={"Yearly Timeliness"} >
              <ResponsiveContainer width={'100%'} height={300}>
                <LineChart width={500} height={300} data={dataMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lateness" label="Lateness" stroke="#f43f5e" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="timeliness" label="Timeliness" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div >
            <Card title="Yearly" className=' shadow-sm'>

              <ResponsiveContainer width={'100%'} height={300}>
                <BarChart
                  width={500}
                  height={300}
                  className=' w-full h-full'
                  data={dataYearlyGraph}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#3b82f6" minPointSize={5} />
                  <Bar dataKey="incomplete" fill="#f43f5e" minPointSize={10} />
                </BarChart>
              </ResponsiveContainer>

            </Card>
          </div>
        </div>
        <div className='mt-8'>
          <Card className=' shadow-sm' title={"Attendance (Monthly)"}
            extra={<div className=' flex justify-between'><DatePicker onChange={(e) => {
              console.log(e?.format("YYYY-MM"));
              setPagination({
                _id: objectId,
                page: activePage,
                selectedDate: e?.format("YYYY-MM").toString(),
                limit: 15,
                populate: ['staff_objectId'],
                sort: {
                  createdAt: -1
                }
              })

              setselectedDate(e?.format("YYYY-MM").toString())

            }} picker="month" inputReadOnly={true} /></div>} >

            <DataTable
              paginationServer
              paginationPerPage={15}
              columns={columns}
              onChangeRowsPerPage={onChangeRowsPerPage}
              onChangePage={handlePageChange}
              data={dataTable?.docs}
              paginationTotalRows={dataTable?.totalDocs}
              pagination
            />

          </Card>
        </div>
      </Content>


      <Modal
        title="Print Report"
        visible={reportvVisible}
        onOk={handleReportOk}
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


      <Modal
        title="Modal 1000px width"
        visible={showPrintPdf}

        style={{ top: 20 }}
        onOk={() => setshowPrintPdf(false)}
        onCancel={() => setshowPrintPdf(false)}
        width={1000}
      >
        <div className=' min-h-screen'>
          {/* {showPrintPdf == true ?  <PdfViewerComponent src='/report.pdf' /> : <></>} */}
        </div>
      </Modal>

    </div>
  )
}

export default LayoutHOC(Entity)

export async function getServerSideProps(ctx) {
  const { req, res } = ctx

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

    let staff = await StaffDetails(ctx)
    let query = ctx.query

    return {
      props: { session: session, staff, query },
    };

  }

}