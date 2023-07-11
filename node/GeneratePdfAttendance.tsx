/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import dateFormat, { masks } from "dateformat";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  renderToFile,
  renderToStream,
} from "@react-pdf/renderer";
import { encode, decode } from "js-base64";
import ReactPDF from "@react-pdf/renderer";
var QRCode = require("qrcode");
import _ from "lodash";
import { ReportPdfInterterface } from "../types/ReportPdfInterterface";
import collect from "collect.js";
const ucwords = require("ucwords");


let convertMinsToHrsMins = (minutes: any) => {
  let h: any = Math.floor(minutes / 60);
  let m: any = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + 'h :' + m + 'm';
}

const styles = StyleSheet.create({
  page: {
    // flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  section: {
    marginTop: 30,
    flexDirection: 'row',
  },
  logo: {
    height: 60,
    width: 60,
    marginRight: 20,
  },
  header: {
    // padding:10,
    paddingHorizontal: 60,
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#0071bf',
    width: '100%',
  },
  staffimage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  }
})




const GeneratePdfAttendance = async (attendance: any, staff: any, input: ReportPdfInterterface) => {


  let countEarliness = attendance?.filter((item) => item.is_early == true);
  let latenessCount = attendance?.filter((item) => item.is_late == true);
  let leftEarlyCount = attendance?.filter((item) => item.left_early == true);


  let doc = await new Promise(async (resolve, reject) => {

    const TemplateDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>

          <View style={styles.section}>
            <View style={styles.logo}>

              <Image
                style={{ height: 70, width: 70 }}
                src={'./public/facility_logo/madonna-university-logo.jpeg'}
                source={'../../../public/leochat.png'}
              />
            </View>
            <View style={styles.header}>
              <Text>Biometric Analysis System Report</Text>
            </View>
          </View>

          <View
            style={{
              borderBottom: 2,
              borderBottomColor: '#0071bf',
              marginTop: 30,
              height: 30,
              borderBottomStyle: 'solid',
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 15 }}> Staff Details</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottom: 2,
              borderBottomColor: '#0071bf',
              marginTop: 30,
              paddingBottom: 10,
              borderBottomStyle: 'solid',
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Staff ID:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    fontFamily: 'Times-Bold',
                    color: '#000',
                  }}
                >
                  {staff.unique_id_no.toUpperCase()}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Staff Name:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {staff.fullname}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Department or Faculty:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {staff.fac_a_department}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Staff Category:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {staff.staff_category}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Enrolled Date:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {dateFormat(
                    staff.enrolled_date,
                    'ddd, mmm dS, yyyy, h:MM TT',
                  )}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Timeliness:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {countEarliness.length}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Lateness:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {latenessCount.length}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 12, marginRight: 6, fontWeight: 700 }}
                >
                  Left Early:
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
                  {leftEarlyCount.length}
                </Text>
              </View>
            </View>
            <View
              style={styles.staffimage}
            >
              <Image
                style={{ height: 120, width: 120 }}
                src={`./public/uploads/${staff.staff_image}`}
              />
            </View>
          </View>

          {/* Section 2 */}

          <View style={{ width: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  borderBottom: 2,
                  borderBottomColor: '#0071bf',
                  marginTop: 20,
                  paddingBottom: 10,
                  borderBottomStyle: 'solid',
                  flexBasis: 130,
                  width: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  cache={false}
                  style={{ height: 90, width: 90 }}
                  src={'./qrl.png'}
                />
                <Text style={{ fontSize: 8 }}>
                  You may need to get a QR Code® reader from your SmartPhone
                  App Store
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  borderBottom: 2,
                  borderBottomColor: '#0071bf',
                  marginTop: 20,
                  paddingBottom: 10,
                  borderBottomStyle: 'solid',
                  flexDirection: 'column',
                  marginHorizontal: 20,
                  width: 200,
                }}
              >
                {input?.reportType == 'normal' ? (
                  <>
                    <View style={{ marginBottom: 8 }}>
                      <Text
                        style={{ fontFamily: 'Helvetica-Bold', fontSize: 15 }}
                      >
                        For the Month of {dateFormat(input.date, 'mmmm, yyyy')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'Helvetica-Bold',
                          marginRight: 6,
                        }}
                      >
                        Department Position:
                      </Text>
                      <Text style={{ fontSize: 11 }}>
                        {staff.work_position}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ marginBottom: 8 }}>
                      <Text
                        style={{ fontFamily: 'Helvetica-Bold', fontSize: 15 }}
                      >
                        From {dateFormat(input?.from, 'dddd, mmmm dS, yyyy,')} to{' '}
                        {dateFormat(input?.to, 'dddd, mmmm dS, yyyy,')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'Helvetica-Bold',
                          marginRight: 6,
                        }}
                      >
                        Department Position:
                      </Text>
                      <Text style={{ fontSize: 11 }}>
                        {staff.work_position}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              borderBottom: 2,
              borderBottomColor: '#0071bf',
              paddingBottom: 10,
              marginTop: 30,
              alignContent: 'flex-start',
              borderBottomStyle: 'solid',
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 15 }}> Attendance Details</Text>
          </View>
          {/* Table Header */}

          <View
            style={{
              borderBottom: 1,
              borderBottomColor: '#0071bf',
              paddingVertical: 6,
              borderBottomStyle: 'solid',
            }}
          >
            <View
              style={{
                fontFamily: 'Times-Bold',
                alignItems: 'center',
                fontSize: 10,
                textAlign: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Date</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Work Hour</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Signed In</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Signed Out</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Timeliness</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text>Excuse</Text>
              </View>
            </View>
          </View>


          {/* Table Content */}


          {attendance?.map((attns: any, key: number) => {
            console.log(attns.timestamp_date);

            return (
              <View key={key}>
                <View
                  style={{
                    fontFamily: 'Times-Roman',
                    alignItems: 'center',
                    marginTop: 5,
                    borderBottom: 1,
                    paddingBottom: 5,
                    borderBottomColor: '#eee',
                    borderBottomStyle: 'solid',
                    fontSize: 10,
                    textAlign: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ alignItems: 'center', flex: 1, width: 100 }}>
                    <Text>
                      {dateFormat(
                        attns?.timestamp_date,
                        'ddd, mmm dS, yyyy',
                      )}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', flex: 1, width: 200 }}>
                    <Text>{attns.is_shift ? "Shift" : "Full"}</Text>
                  </View>




                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text>
                      {!_.isEmpty(attns?.time_in)
                        ? moment(attns?.time_in, 'hh:mm').format(
                          'hh:mm a',
                        )
                        : '...'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text>
                      {!_.isEmpty(attns?.time_out)
                        ? moment(attns?.time_out, 'hh:mm').format(
                          'hh:mm a',
                        )
                        : '...'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text>
                      {attns?.is_late ? `${convertMinsToHrsMins(attns?.lateness_durationMinutes)} Late` : null}
                      {attns?.is_early ? `${convertMinsToHrsMins(attns?.early_durationMinutes)} Early` : null}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text>...</Text>
                  </View>
                </View>
              </View>
            )
          })}

        </Page>
      </Document>
    )

    renderToFile(<TemplateDocument />, `./public/report.pdf`, (params) => {
      resolve({ done: true })
    })

  });

  return doc;
};

export default GeneratePdfAttendance;
