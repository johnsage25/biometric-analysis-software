import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Card, Layout, Tooltip } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import Image from 'next/image'
import Head from 'next/head'
import { getCsrfToken, signIn } from "next-auth/react"
import { QuestionCircleOutlined } from '@ant-design/icons';
import redirect from 'nextjs-redirect'
import Router from 'next/router'
import Link from 'next/link'
import { getSession } from "next-auth/react";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showError: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  onFinishFailed = () => {

  }

  onFinish = async (value) => {

    console.log(this.props);
    console.log(value);
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
          <title>Sign In | Admin Panel</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Layout>
          <Layout className='loginContainer'>

            <Card className='loginForm'

              title={"Login"} extra={<Tooltip placement="topLeft" title={"Support Center"}>
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
                  label="Email"
                  name="email"

                  validateStatus={showError ? 'error' : null}
                  help={showError ? "Wrong password or Username. Try again or click ‘Forgot password’ to reset it." : null}

                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input size={'large'} />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"

                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password size={'large'} />



                </Form.Item>


                <Form.Item className="fxo" >
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Link href="/forgot-password" >
                    <a className="login-form-forgot">Forgot password</a>
                  </Link>
                </Form.Item>

                <Form.Item >
                  <Button loading={loading} block size="large" type="primary" htmlType="submit" >
                    Login
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

export default Signin;

export async function getServerSideProps(ctx) {
  var session = await getSession(ctx);
  var url = process.env.SERVER_URL

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session, url:url },
  };
}
