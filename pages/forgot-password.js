import React, { createRef } from 'react';
const { Header, Footer, Sider, Content } = Layout;
import { Form, Input, Button, Checkbox, Row, Col, Card, Layout, Tooltip, PageHeader, Affix } from 'antd';
import Image from 'next/image'
import Head from 'next/head'
import { getCsrfToken, signIn } from "next-auth/react"
import { QuestionCircleOutlined } from '@ant-design/icons';
import redirect from 'nextjs-redirect'
import Router from 'next/router'
import Link from 'next/link'
import { getSession } from "next-auth/react";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.container = createRef()
    this.state = {
      loading: false,
      showError: false,
    };
  }

  componentDidMount() {

  }

  onFinishFailed = () => {

  }

  onFinish = async (value) => {

    this.setState({ loading: true })



    try {

      signIn('credentials', {
        redirect: false,
        ...value
      }).then(async (res) => {

        const { error, ok } = res;

        setTimeout(async () => {

          if (ok) {
            this.setState({ loading: false })
            Router.push('/')
          }
          else {
            this.setState({ loading: false, showError: true })
          }

        }, 100)

        console.log(res);
      }).catch((error) => console.log(error));

    } catch (error) {
      console.log(error);
      this.setState({ loading: false })
    }


  }

  render() {

    const { loading, showError } = this.state

    return (
      <>
        <Head>
          <title>Forgot Password | Admin Panel</title>
          {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
        </Head>
        <Layout >




          <Layout className='loginContainer' ref={this.container}>

          <Affix target={() => this.container.current} >
            <PageHeader
              className="site-page-header"
              onBack={() => {
                Router.push('/')
              }}
              ghost={false}
              title="Forgot password"

            />
          </Affix>


            <Card className='loginForm'

              title={(<img
                src="/leochat.png"
                alt="Picture of the author"
                width={150}
              />)} extra={<Tooltip placement="topLeft" title={"Support Center"}>
                <a href="#"><QuestionCircleOutlined /></a>
              </Tooltip>} >

              <Form
                name="basic"
                layout="vertical"

                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username or Email"
                  name="Username"

                  validateStatus={showError ? 'error' : null}
                  help={showError ? "Wrong password or Username. Try again or click ‘Forgot password’ to reset it." : null}

                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input size={'large'} />
                </Form.Item>


                <Form.Item >
                  <Button loading={loading} block size="large" type="primary" htmlType="submit" >
                    Reset password
                  </Button>
                </Form.Item>


              </Form>
            </Card>

          </Layout>
        </Layout>
      </>
    );
  }


}

export default ForgotPassword;


export async function getServerSideProps(ctx) {
  var session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
