import { App, Button, Col, Form, Input, Row } from 'antd';
import { FormProps } from 'antd/lib';
import { useCurrentApp } from 'components/context/app.context';
import React, { useEffect, useState } from 'react'
import { updateUserPasswordAPI } from 'services/api';

type FieldType = {
    email: string,
    oldpass: string,
    newpass: string
}


export default function ChangePassword() {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { user } = useCurrentApp();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (user) {
            form.setFieldValue("email", user.email);
        }
    }, [user]);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);

        const res = await updateUserPasswordAPI(email, oldpass, newpass);

        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công");
            form.setFieldValue("oldpass", "");
            form.setFieldValue("newpass", "");
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message,
            });
        }
        setIsSubmit(false)
    };


    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col span={1} ></Col>
                <Col span={12}>
                    <Form
                        name='change-password'
                        onFinish={onFinish}
                        autoComplete='off'
                        form={form}
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật hiện tại"
                            name="oldpass"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Mật khẩu hiện tại không được để trống!",
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Mật khẩu mới không được để trống!",
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Button variant="solid" color='primary' htmlType='submit' loading={isSubmit}>
                            Cập nhật
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
