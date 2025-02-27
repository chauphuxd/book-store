import React, { useState } from 'react';
import { App, FormProps } from 'antd';
import { Button, Divider, Form, Input } from 'antd';
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from 'services/api';


type FieldType = {
    fullName?: string;
    password?: string;
    remember?: string;
    email?: string;
    phone?: string;
};



// const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//     console.log('Failed:', errorInfo);
// };

const Register = () => {
    const navigate = useNavigate();

    const { message } = App.useApp();

    const [isSubmit, setIsSubmit] = useState(false);
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)
        const res = await registerAPI(values)

        //success
        if (res.data) {
            localStorage.setItem("successMessage", "Đăng kí tài khoản thành công");
            navigate('/login')
        } else {
            message.error('Email đã tồn tại trong hệ thống')
        }

        setIsSubmit(false)
    };

    return (
        <>
            <div className="register-page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <div className="heading">
                                <h2 className="text text-large">
                                    Đăng Ký Tài Khoản
                                </h2>
                                <Divider />
                            </div>
                            <Form
                                name="form-register"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }} //whole column
                                    label="Họ tên"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Họ tên không được để trống!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }} //whole column
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Email không được để trống!",
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "Email không đúng định dạng!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }} //whole column
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Mật khẩu không được để trống!",
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }} //whole column
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Số điện thoại không được để trống!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isSubmit}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                                <Divider>Or</Divider>
                                <p
                                    className="text text-normal"
                                    style={{ textAlign: "center" }}
                                >
                                    Đã có tài khoản ?
                                    <span>
                                        <Link to="/login"> Đăng Nhập </Link>
                                    </span>
                                </p>
                            </Form>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
};
export default Register