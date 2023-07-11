import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
var ReactDOM = require('react-dom');






export default class Pdf extends React.Component {
    render() {
        return (
            <></>
        )
    }
}



export async function getServerSideProps(context) {
    const { req, res } = context


    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });


    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );



    ReactPDF.render(<MyDocument />, `./example.pdf`);


    // res.setHeader('Content-Type', 'application/pdf')

    return {
        props: {}, // will be passed to the page component as props
    }
}
