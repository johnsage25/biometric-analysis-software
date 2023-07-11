import React, { useState } from 'react'
import LayoutHoc from '../components/layout/LayoutHOC'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Badge, Card, Layout, PageHeader } from 'antd';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { Chart } from "react-google-charts";
import { BarChart, Bar, LabelList } from 'recharts';

import { trpc } from '../utils/trpc';
import { getSession } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

const Index = (props: AppProps) => {

  const [monthlyGrapy, setmonthlyGrapy] = useState([])
  const [totalAttendance, settotalAttendance] = useState(0)
  const [totalCategory, settotalCategory] = useState<any[]>([])
  const [dataYearlyGraph, setdataYearlyGraph] = useState<{ name: string; completed: any; incomplete: any; }[]>([])
  const [total, settotal] = useState(0)

  let monthlyAttnQuery = trpc.home.monthlyAttn.useQuery({}, {
    onSuccess(data: any) {

      settotalAttendance(data.countAttendance)
      let dataGraph: any = [
        {
          name: 'Mon',
          completed: data.completed[0]?.data?.monday,
          incomplete: data.incomplete[0]?.data?.monday,
        },
        {
          name: 'Tue',
          completed: data.completed[0]?.data?.tuesday,
          incomplete: data.incomplete[0]?.data?.tuesday,
        },
        {
          name: 'Wed',
          completed: data.completed[0]?.data?.wednesday,
          incomplete: data.incomplete[0]?.data?.wednesday,
        },
        {
          name: 'Thu',
          completed: data.completed[0]?.data?.thursday,
          incomplete: data.incomplete[0]?.data?.thursday,
        },
        {
          name: 'Fri',
          completed: data.completed[0]?.data?.friday,
          incomplete: data.incomplete[0]?.data?.friday,
        },
        {
          name: 'Sat',
          completed: data.completed[0]?.data?.saturday,
          incomplete: data.incomplete[0]?.data?.saturday,
        },
        {
          name: 'Sun',
          completed: data.completed[0]?.data?.sunday,
          incomplete: data.incomplete[0]?.data?.sunday,
        }
      ];
      setmonthlyGrapy(dataGraph)

    },
    onError(err) {

    },
  })

  let totalStaffQuery = trpc.home.totalStaff.useQuery({}, {
    onSuccess(data: any) {
      console.log(data);
      settotalCategory([["Task", "Hours per Day"], ...data.dataGraph])
      settotal(data.total)
    },
    onError(err) {

    },
  })

  let yearlyBarGraphQuery = trpc.home.yearlyBarGraph.useQuery({}, {
    onSuccess(data:any) {


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
          name: 'Nov',
          completed: graphItem1?.December || 0,
          incomplete: graphItem2?.December || 0,
        },
      ];

      setdataYearlyGraph([...dataYearly])
    },
    onError(err) {

    },
  })

  const options = {
    title: "My Daily Activities",
    pieHole: 0.4,
    is3D: false,
  };
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    x, y, name
  }) => {
    return (
      <text x={x} y={y} fill="black" textAnchor="end" dominantBaseline="central">
        {name}
      </text>
    );
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const currentMonth = months[today.getMonth()];

  console.log(yearlyBarGraphQuery.data);



  return (
    <div>
      <Head>
        <title>Dashboard | BAS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Content
        className="site-layout-body dashboard"
        style={{

          minHeight: 280,
        }}
      >
        <PageHeader
          className="site-page-header"
          style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 20 }}
          title="My Dashboard"
        />


        <div className="grid  lg:grid-cols-2 gap-4">
          <div>
            <Card title={`Monthly (${currentMonth})`} actions={
              [
                <div key={0} className='px-6 flex justify-start'>
                  <span className=' text-gray-800'>Total Attendance: <Badge showZero={true} style={{ backgroundColor: '#3b82f6' }} count={totalAttendance} /></span>
                </div>
              ]
            }>
              <ResponsiveContainer width="100%" height={300}>


                <LineChart
                  width={500}
                  height={300}
                  data={monthlyGrapy}
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
                  <Line type="monotone" dataKey="completed" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="incomplete" stroke="#f43f5e" />
                </LineChart>

              </ResponsiveContainer>

            </Card>
          </div>
          <div>
            <Card title={"Staff Chart"} actions={
              [
                <div key={0} className='px-4 flex justify-start'>
                  <span className=' text-gray-800'>Total Staff: {total}</span>
                </div>
              ]
            }>

              <Chart
                chartType="PieChart"
                width="100%"
                height="300px"
                data={totalCategory}
                options={options}
              />

            </Card>
          </div>
        </div>
        <div className='mt-10'>
          <Card title={"Yearly Attendance"}>
            <ResponsiveContainer width={'100%'} height={400}>
              <BarChart
                width={500}
                height={400}
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

      </Content>
    </div>
  )
}

export default LayoutHoc(Index)


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