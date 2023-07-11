import React, { useState, useRef, useLayoutEffect } from 'react'
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
  Spin,
  Tooltip,
  Popover,
} from 'antd'
import Router from 'next/router'
import Head from 'next/head'
import { Scheduler } from '@aldabil/react-scheduler'
import { Typography } from '@mui/material'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import {
  AiFillCalendar,
  AiFillDelete,
  AiOutlineDelete,
  AiOutlineInfo,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineUserAdd,
} from 'react-icons/ai'
import VirtualList from 'rc-virtual-list'
import { getSession } from 'next-auth/react'
import Collect from 'collect.js'
import CalenderIcon from '../../components/icons/CalendarIcon'
import moment from 'moment'
import truncate from 'truncate'
import dateFormat from 'dateformat'
import { DialogActions } from '@mui/material'
const { RangePicker } = DatePicker
const { Option } = Select
import ucwords from 'ucwords'
const { Search, TextArea } = Input
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
} from '@silevis/reactgrid'
import { RosterTypes } from '../../types/RosterTypes'
import { useRouter } from 'next/router'
import { getCellsDynamically } from '../../data/monthsArray'
import { AuthStaff } from '../../node/AuthStaff'
import { trpc } from '../../utils/trpc'
import { GetRosterSheet } from '../../node/GetRosterSheet'
import ReactDataSheet from 'react-datasheet';
import collect from 'collect.js';
import DataGrid, { textEditor } from 'react-data-grid';
import { StaffRosterUpdateInterface } from '../../types/StaffDataInterface'
import { toast } from 'react-hot-toast'

const Index = (props: any) => {
  const [loading, setloading] = useState(true)
  const [rosterCellData, setrosterCellData] = useState([])
  const [rosterData, setrosterData] = useState([])
  const [daysExpected, setdaysExpected] = useState(31)
  const [spreadColumns, setspreadColumns] = useState()
  const router = useRouter()
  const { RosterSheet } = props

  const rosterSheetQuery = trpc.staffRoster.rosterSheet.useQuery({ rosterId: RosterSheet?._id }, {
    onSuccess(data: any) {

      setrosterCellData(data[0]?.cells)
    },
  })

  const updateRosterMutation = trpc.staffRoster.updateRoster.useMutation()
  const utils = trpc.useContext()



  const loafRoster = () => {

  }

  const searchInput = (event: any) => {
    // loadEvent(event.target.value)
  }

  useLayoutEffect(() => {
    loafRoster()
  }, [])

  const doPostChanges = (sta: RosterTypes) => {
    let updated: RosterTypes = {
      ...sta,
    }

    fetch('/api/rosterupdate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updated }),
    })
      .then(async (res) => {
        let response = await res.json()
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  let daysArray = Array.from({ length: daysExpected }, (v, k) => k + 1)

  let year = moment(RosterSheet?.rosterDate, 'YYYY-MM-DD').format('Y')
  let month = moment(RosterSheet?.rosterDate, 'YYYY-MM-DD').format('M')

  const startMoment = moment(RosterSheet?.rosterDate, 'YYYY-MM-DD');

  const dates = Array.from({ length: startMoment.daysInMonth() }, (_, i) => startMoment.clone().add(i, 'day'));



  let datesD = dates.map((item) => {

    let dayInW = item.format('dd')
    let dayInt = item.format('DD')
    return { key: `D${parseInt(dayInt)}`, int: parseInt(dayInt), name: `${dayInW} (${parseInt(dayInt)})`, width: 60, editable: true, editor: textEditor };
  })


  const getColumns = (hide: boolean) => {
    let extra: { name: string, key: string, width: number, editable: boolean, editor: any, frozen:boolean  }[] = []

    if (hide) {
      extra = [{ name: 'D31', key: "D31", width: 60, editable: true, editor: textEditor, frozen:false }]
    }


    let column: { name: string, key: string, width: number, editable: boolean, editor: any , frozen:boolean }[] = [
      { name: 'Staff Names', key: "staffName", width: 250, editable: false, editor: null, frozen: true, },

      ...datesD.sort(function (a: any, b: any) {
        return a.int - b.int;
      })

    ]

    return column
  }

  const columns = getColumns(daysArray.length > 30)


  const getRows = (rosters: RosterTypes[]): Row[] => [
    // headerRow,
    ...rosters.map<Row>((roster, idx) => ({
      rowId: idx,
      height: 40,
      cells: [
        ...getCellsDynamically(roster),
      ],
    })),
  ]

  const applyChangesToPeople = (
    changes: CellChange<TextCell>[],
    prevPeople: RosterTypes[],
  ): RosterTypes[] => {

    changes.forEach((change) => {



      const personIndex = change.rowId
      const fieldName = change.columnId
      if (
        change.newCell.text.match('[a-zA-Z]') &&
        change.newCell.text.length == 1
      ) {
        prevPeople[personIndex][fieldName] = change.newCell.text.toUpperCase()

        doPostChanges(prevPeople[personIndex])
      } else {
        message.warning('Wrong value')
      }
    })
    return [...prevPeople]
  }



  const onRowsChange = (row, data) => {

    const valueCollection = collect(['M', "O", "E", "N", "L"]);


    const collection = collect(row[data.indexes[0]]);
    let value = collection.get(`D${data.column.int}`)
    let _id = collection.get('id');

    if(!valueCollection.contains(`${value}`.toUpperCase())){
      toast.error(`You have entered an invalid value, please check the tutorial for detail`, {
        id:`${_id}`,
      })
      return
    }


    let _d: StaffRosterUpdateInterface = {
      value:value,
      row:data.column.int,
      _id
    }
    updateRosterMutation.mutate(_d, {
      onSuccess(data, variables, context) {
        utils.staffRoster.rosterSheet.invalidate()
        console.log(data);
      },
      onError(error, variables, context) {
        toast.error(`Unabled to update row value`);
      }
    })

  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>Shift Roster | Admin Panel</title>
      </Head>
      <div>
        <PageHeader
          ghost={true}
          title={`${RosterSheet?.department ? ucwords(RosterSheet?.department) : ''
            } Shift Roster`}
          subTitle={dateFormat(RosterSheet?.rosterDate, "mmmm, yyyy")}
          extra={[
            <Popover
              key={'tu'}
              placement="bottomLeft"
              title={"Roster Tutorial"}
              content={() => (
                <>
                  <div>
                    <ul className="list-none px-1 m-0">
                      <li>M = Morning</li>
                      <li>O = Off or Empty</li>
                      <li>E = Evening</li>
                      <li>N = Night</li>
                      <li>L = Leave</li>
                    </ul>
                  </div>
                </>)}
              trigger="click"
            >
              <Button className=" items-center" icon={<AiOutlineInfoCircle />}>
                {' '}
                Tutorial
              </Button>
            </Popover>,

            // <Search key={2} placeholder="search event" onSearch={this.onSearch} style={{ width: 300 }} />
          ]}
        ></PageHeader>
      </div>

      <div className="container mx-auto">
        {rosterSheetQuery.isLoading ? (
          <div className=" h-96 flex justify-center items-center">
            <Spin spinning={rosterSheetQuery.isLoading} tip="Loading..." />
          </div>
        ) : (
          <div className=" overflow-x-auto  bg-white border border-solid border-zinc-200">

            <DataGrid columns={columns}
              rows={rosterCellData}
              className=' h-screen'

              onRowsChange={onRowsChange}

            />


          </div>
        )}
      </div>
    </div>
  )
}

export default LayoutHOC(Index, null, null, true)

export async function getServerSideProps(ctx) {
  let session: any = await getSession(ctx)
  let staff: any = await AuthStaff(session?.token?._doc?._id)

  let RosterSheet = await GetRosterSheet(ctx.query.rosterId)

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
      RosterSheet,
      user: staff,
      query: ctx.query,
    },
  }
}
