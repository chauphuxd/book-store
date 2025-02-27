import { App, Form, Input, Modal } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { updateUserAPI } from "services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;

}

type FieldType = {
    _id: string,
    email: string;
    fullName?: string;
    phone?: string;
};




const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();


    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            })
        }
    }, [dataUpdate])

    //gui form
    const [form] = Form.useForm();



    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { _id, fullName, phone } = values;
        setIsSubmit(true)
        const res = await updateUserAPI(_id, fullName!, phone!)

        // success
        if (res && res.data) {
            message.success("Cập nhật user thành công")
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }

        setIsSubmit(false)
    };

    return (
        <>
            <Modal title="Update User" open={openModalUpdate} onCancel={() => { setOpenModalUpdate(false); form.resetFields(); setDataUpdate(null) }} onOk={() => { form.submit() }} confirmLoading={isSubmit} okText={"Cập nhật"} cancelText={"Hủy"} >

                <Form
                    //them thuoc tinh form moi lay dc gia tri tu nut submit
                    form={form}
                    name="form-register"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }} //whole column
                        label="_id"
                        name="_id"
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
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }} //whole column
                        label="Tên hiển thị"
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


export default UpdateUser