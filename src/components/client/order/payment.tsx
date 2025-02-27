import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormProps, Input, InputNumber, message, notification, Radio, Row, Space } from 'antd';
import { useCurrentApp } from 'components/context/app.context';
import React, { useEffect, useState } from 'react'
import { createOrderAPI } from 'services/api';


const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};


interface IProps {
    setCurrentStep: (v: number) => void;
}

export default function Payment(props: IProps) {
    const { carts, setCarts, user } = useCurrentApp()
    const [totalPrice, setTotalPrice] = useState(0)
    const { setCurrentStep } = props

    const [form] = Form.useForm()

    const [isSubmit, setIsSubmit] = useState(false);


    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            });
        }
    }, [user]);


    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);


    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            // Update
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));

            // Sync React Context
            setCarts(newCarts);
        }
    }


    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values
        const detail = carts.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText
        }))
        setIsSubmit(true);
        const res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail)

        if (res && res.data) {
            localStorage.removeItem("carts")
            setCarts([])
            message.success("Mua hàng thành công")
            setCurrentStep(2)
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 5
            });
        }
        setIsSubmit(false)

    }


    return (
        <div className="cart-container">
            <Row gutter={[16, 16]}>
                <Col span={18}>
                    {carts.map((item, index) => {
                        const currentBookPrice = item.detail.price ?? 0;
                        return (
                            <div className="cart-item" key={`index-${index}`}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                                    alt={item.detail.mainText}
                                />
                                <div className="item-details">
                                    <Row align="middle">
                                        <Col span={8}>
                                            <h3>{item.detail.mainText}</h3>
                                        </Col>
                                        <Col span={4}>
                                            <p>{
                                                new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item?.detail?.price)
                                            }</p>
                                        </Col>
                                        <Col span={4}>
                                            <div>Số lượng : {item.quantity}</div>
                                        </Col>
                                        <Col span={4}>
                                            Tổng : <span className="item-total">{new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(currentBookPrice * item.quantity)}</span>
                                        </Col>
                                        <Col span={4} style={{ textAlign: 'center' }}>
                                            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} onClick={() => handleRemoveBook(item._id)} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )
                    })}
                    <div className="" style={{ cursor: "pointer" }} onClick={() => props.setCurrentStep(0)}>
                        <span>Quay trở lại</span>
                    </div>


                </Col>
                <Col span={6}>
                    <div className="cart-summary">
                        <Form
                            form={form}
                            name='payment-form'
                            onFinish={handlePlaceOrder}
                            autoComplete='off'
                            layout='vertical'

                        >
                            <div className="order-sum" >
                                <Form.Item<FieldType>
                                    label="Hình thức thanh toán"
                                    name="method"
                                >
                                    <Radio.Group style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} >
                                        <Space direction="vertical" align='start' >
                                            <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                            <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Họ tên"
                                    name="fullName"
                                    rules={[
                                        { required: true, message: 'Họ tên không được để trống' }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        { required: true, message: 'Số điện thoại không được để trống' }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Địa chỉ nhận hàng"
                                    name="address"
                                    rules={[
                                        { required: true, message: 'Địa chỉ không được để trống' }
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                                <div className="cart-summary">
                                    <p>
                                        Tạm tính <span>{new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(totalPrice || 0)}</span>
                                    </p>
                                    <h3>
                                        Tổng tiền <span className="total">{new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(totalPrice || 0)}</span>
                                    </h3>

                                    <Button htmlType='submit' variant="solid" color="danger" block >
                                        Đặt Hàng ({carts.length ?? 0})
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
