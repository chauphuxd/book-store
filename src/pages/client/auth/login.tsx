import { Divider, Input, message, Form, Button, FormProps, App } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './register.scss'
import { loginAPI } from 'services/api';
import { useCurrentApp } from "components/context/app.context";


type FieldType = {
    username?: string;
    password?: string;
};

const LoginPage = () => {

    useEffect(() => {
        const successMessage = localStorage.getItem("successMessage");
        if (successMessage) {
            message.success(successMessage);
            localStorage.removeItem("successMessage");
        }
    }, []);

    const navigate = useNavigate();
    const { notification } = App.useApp();


    const [isSubmit, setIsSubmit] = useState(false);
    const { setIsAuthenticated, setUser } = useCurrentApp()


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)
        console.log(values)
        const res = await loginAPI(values)
        //success
        if (res.data) {
            setIsAuthenticated(true)
            setUser(res.data.user)
            const token = res.data.access_token;
            localStorage.setItem('access_token', token);
            localStorage.setItem("successMessage", "Đăng nhập thành công");
            localStorage.setItem("isLoggedIn", "true");
            navigate('/')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 2

            })
        }

        setIsSubmit(false)
    };

    return (
        <div>
            <div className="login-page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <div className="heading">
                                <h2 className="text text-large">
                                    Đăng nhập
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
                                    label="Email"
                                    name="username"
                                    rules={[

                                        {
                                            required: true,
                                            message:
                                                "Tài khoản không được để trống!"
                                        },
                                        { type: "email", message: "Email không đúng định dạng" }

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

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isSubmit}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <p
                                    className="text text-normal"
                                    style={{ textAlign: "center" }}
                                >
                                    Đã có tài khoản ?
                                    <span>
                                        <Link to="/register"> Đăng Ký</Link>
                                    </span>
                                </p>
                            </Form>
                        </section>
                    </div>
                </main>
            </div >
        </div >
    );
};
export default LoginPage;
