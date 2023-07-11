import { getSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { AuthStaff } from '../node/AuthStaff'
import LayoutHOC from '../components/layout/LayoutHOC'
import Head from 'next/head'
import { Avatar, Button, Card, Col, Divider, Form, Input, Layout, PageHeader, Row, Select } from 'antd'
import { AppProps } from 'next/app'
const { Option } = Select;
const { Meta } = Card;
const { Content } = Layout;
import { ErrorMessage, Field, Formik } from 'formik';
import { trpc } from '../utils/trpc'
import { StaffDataInterface } from '../types/StaffDataInterface'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup';

const ProfileSettings = (props: any) => {
    const [activeTabKey1, setactiveTabKey1] = useState("")
    const [twofaEnabled, settwofaEnabled] = useState("")
    const [qrCodeImage, setqrCodeImage] = useState("")
    const [loadingForm, setloadingForm] = useState(false)
    const updateProfileMutation = trpc.staff.updateProfile.useMutation()
    const accountForm = useRef()

    const onFinishForm = async (form) => {

        // const User = await this.props.parseQuery("query_object", Parse.User)
        // const { user: { ascii, id } } = this.account || {}
        // const { session } = this.props
        // const { token } = this.state

        // const currentUser = await User.equalTo("objectId", session.token.id).first({ useMasterKey: true });

        // this.setState({ loadingForm: true })
        // currentUser.save(form, { useMasterKey: true }).then((response) => {
        //     message.success("Account details updated successfully.")
        //     Router.reload(window.location.pathname)
        //     this.setState({ loadingForm: false })

        // }).catch((error) => {
        //     this.setState({ loadingForm: false })
        //     console.log(error);
        // })

        // console.log(form);
    }

    const contentList = () => {

        return {
            tab1: (
                <>
                    {/* <div style={{ padding: 15 }}>
                        <Form
                            ref={accountForm}
                            labelCol={{ span: 4 }}
                            onFinish={onFinishForm}
                            // wrapperCol={{ span: 14 }}
                            layout="horizontal"

                        >

                            <Form.Item rules={[{ required: true, message: 'Fullname is required' }]} name={'fullname'} label="Fullname">
                                <Input size='large' />
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Username is required' }]} name={"username"} label="Username">
                                <Input size='large' />
                            </Form.Item>
                            <Form.Item name={'email'} rules={[{ required: true, message: 'Email is required', type: 'email' }]} label="Email">
                                <Input size='large' />
                            </Form.Item>
                            <Form.Item
                                name={'phone'}
                                label={"Phone Number"}
                                rules={[{ required: false, message: 'Fullname is phone number' }]}
                            >
                                <PhoneInput
                                    country={'ng'}
                                    inputClass="ant-input-lg"
                                    inputStyle={{ width: '100%', height: 'auto', borderRadius: 2 }}
                                    value={this.state.mobileInput}
                                    containerStyle={{ borderRadius: 2 }}
                                    onChange={mobileInput => this.setState({ mobileInput })}
                                />


                            </Form.Item>

                            <Form.Item name={'dob'} label="Date of birth">
                                <DatePicker size='large' defaultValue={moment('2001/01/01', dateFormat)} />
                            </Form.Item>

                            <Form.Item label="" style={{ textAlign: 'right' }}>
                                <Button loading={loadingForm} onClick={() => {
                                    this.accountForm.current.submit()
                                }} size='large' type='primary'>Submit</Button>
                            </Form.Item>


                        </Form>
                    </div> */}
                </>
            ),
            tab2: (<>
                {/* <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                    <Title level={4} textAlign={'center'}>Set Up Two-factor Authentication app</Title>
                    <ol className='list'>
                        <li>Install an authentication app on your mobile phone.</li>
                        <li>Scan the QR code below with your app. If you can't scan the, <br />
                            QR code, enter this code: <strong>{base32}</strong></li>

                        <div style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>
                            {qrCodeImage ? (<Image
                                src={`${qrCodeImage}`}
                                alt="QrCode"
                                width={150}
                                height={150}
                            />) : null}


                        </div>
                        <li>Enter the 6 digit code from the app once the scan is complete.</li>
                    </ol>


                    <div style={{ paddingTop: 10, paddingDown: 10 }}>
                        <Input type={"number"} value={this.state.token} onChange={this.onChange2fa} addonBefore={<AiOutlineQrcode />} placeholder='2fa code' />
                    </div>

                    <div style={{ paddingTop: 20, paddingDown: 10 }}>
                        {twofaEnabled ? (<Button onClick={() => this.disable2fa()} type='primary' danger>Disable 2fa</Button>) :
                            <Button onClick={() => this.enable2fa()} type='primary' >Enable 2fa</Button>}

                    </div>

                </div> */}
            </>)
        }
    };


    const UpdateSchema = Yup.object().shape({
        fullname: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        phone: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Password is required'),
        repeat_password: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    });



    return (
        <>

            <Head>
                <title>Settings | Admin Panel</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
            </Head>

            <Content>

                {/* <PageHeader
                    className="site-page-header"
                    style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 20 }}
                    title="Settings"


                // extra={[
                //     <Button key="1" onClick={this.addstaffmodal} type="primary" icon={<UserAddOutlined />}>Add Staff</Button>,
                //     <Button key="2" icon={<FolderViewOutlined />}>View Archive</Button>,

                // ]}
                /> */}

                <div className=' max-w-5xl mx-auto'>

                    <h1 className=' mb-4'>Account Settings</h1>


                    <Card>

                        <Formik
                            initialValues={{ ...props?.staff, password: "", repeat_password: "" }}
                            validationSchema={UpdateSchema}

                            onSubmit={(values) => {

                                console.log(values);


                                let data: StaffDataInterface = {
                                    ...values
                                }
                                updateProfileMutation.mutate(data, {
                                    onSuccess(data, variables, context) {
                                        console.log(data);
                                        toast.success("Profile updated successfully.")
                                    },
                                    onError(error, variables, context) {
                                        console.log(error);
                                        toast.error("Unable to update profile")

                                    },
                                })


                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                /* and other goodies */
                            }) => (

                                <form onSubmit={handleSubmit}>

                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <div className="relative z-0 w-full mb-6 group">

                                            <Field name="fullname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
                                            <label
                                                htmlFor="floating_first_name"
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                First name
                                            </label>

                                            <div className=' text-red-500' >
                                                <ErrorMessage name="fullname" />
                                            </div>

                                        </div>


                                        <div className="relative z-0 w-full mb-6 group">
                                            <Field
                                                type="tel"

                                                name="phone"
                                                id="floating_phone"
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "

                                            />
                                            <label
                                                htmlFor="floating_phone"
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                Phone number
                                            </label>
                                            <div className=' text-red-500' >
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <div className="relative z-0 w-full mb-6 group">
                                            <Field
                                                type="text"
                                                disabled={true}
                                                name="username"
                                                id="floating_email"
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=""

                                            />
                                            <label
                                                htmlFor="floating_email"
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                Username
                                            </label>

                                            <div className=' text-red-500' >
                                                <ErrorMessage name="username" />
                                            </div>


                                        </div>

                                        <div className="relative z-0 w-full mb-6 group">
                                            <Field
                                                type="email"
                                                name="email"
                                                id="floating_email"
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=""

                                            />
                                            <label
                                                htmlFor="floating_email"
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                Email address
                                            </label>

                                            <div className=' text-red-500' >
                                                <ErrorMessage name="email" />
                                            </div>


                                        </div>

                                    </div>

                                    <div className="relative z-0 w-full mb-6 group">



                                        <Field
                                            type="password"
                                            name="password"
                                            id="floating_password"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "


                                        />
                                        <label
                                            htmlFor="floating_password"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Password
                                        </label>

                                        <div className=' text-red-500' >
                                            <ErrorMessage name="password" />
                                        </div>
                                    </div>
                                    <div className="relative z-0 w-full mb-6 group">
                                        <Field
                                            type="password"
                                            name="repeat_password"
                                            id="floating_repeat_password"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "


                                        />
                                        <label
                                            htmlFor="floating_repeat_password"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Confirm password
                                        </label>

                                        <div className=' text-red-500' >
                                            <ErrorMessage name="repeat_password" />
                                        </div>
                                    </div>


                                    <div className=' flex justify-end'>
                                        <Button loading={updateProfileMutation.isLoading} size="large" type="primary" htmlType="submit" >
                                            Submit
                                        </Button>
                                    </div>
                                </form>

                            )}
                        </Formik>

                    </Card>
                </div>
            </Content>
        </>
    )
}

export default LayoutHOC(ProfileSettings);

export async function getServerSideProps(ctx: any) {

    var session: any = await getSession(ctx);
    let staff = await AuthStaff(session?.token?._doc?._id)


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
            props: { staff }, // will be passed to the page component as props
        }
    }
}