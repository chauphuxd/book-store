import { App, Button, Divider, Form, Input, Modal } from "antd";
import { FormProps } from "antd";
import { useState } from "react";
import { createUserAPI } from "services/api";


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    refreshTable: () => void;

}

type FieldType = {
    fullName?: string;
    password?: string;
    remember?: string;
    email?: string;
    phone?: string;
};


const CreateUser = (props: IProps) => {


    const { openModal, setOpenModal, refreshTable } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();


    //gui form
    const [form] = Form.useForm();


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)
        const res = await createUserAPI(values)

        console.log(values)
        // success
        if (res && res.data) {
            message.success("Tạo mới user thành công")
            form.resetFields();
            setOpenModal(false);
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }

        setIsSubmit(false)
    };


    return (
        <>
            <Modal title="Add New User" open={openModal} onCancel={() => { setOpenModal(false); form.resetFields(); }} onOk={() => { form.submit() }} confirmLoading={isSubmit} okText={"Tạo mới"} cancelText={"Hủy"} >

                <Form
                    //them thuoc tinh form moi lay dc gia tri tu nut submit
                    form={form}
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
                </Form>

            </Modal >
        </>
    )

}


export default CreateUser