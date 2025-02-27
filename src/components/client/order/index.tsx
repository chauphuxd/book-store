import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, InputNumber, Row, Col, message } from 'antd';
import { useCurrentApp } from 'components/context/app.context';
import React, { useEffect, useState } from 'react';
import 'styles/order.scss';

interface IProps {
    setCurrentStep: (v: number) => void;
}



export default function OrderDetail(props: IProps) {

    const { setCurrentStep } = props

    const { carts, setCarts } = useCurrentApp()
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])


    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) return;
        if (!isNaN(+value)) {
            // Update localStorage
            const cartStorage = localStorage.getItem("carts");
            if (cartStorage && book) {
                // Parse cart items
                const carts = JSON.parse(cartStorage) as ICart[];

                // Check if the item already exists
                let isExistIndex = carts.findIndex((c) => c._id === book?._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }

                // Update localStorage with the new cart data
                localStorage.setItem("carts", JSON.stringify(carts));

                setCarts(carts);
            }
        }
    }


    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            // Parse cart items
            const carts = JSON.parse(cartStorage);

            // Lọc bỏ sản phẩm có _id trùng với sản phẩm muốn xóa
            const newCarts = carts.filter((item: any) => item._id !== _id);

            // Cập nhật localStorage với giỏ hàng mới
            localStorage.setItem("carts", JSON.stringify(newCarts));

            // Đồng bộ với React Context (nếu có sử dụng)
            setCarts(newCarts);
        }
    };

    //handel next step
    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tại sản phẩm trong giỏi hàng")
            return;
        }
        setCurrentStep(1)
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
                                            <InputNumber onChange={(value) => handleOnChangeInput(value as number, item.detail)} value={item.quantity} />
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


                </Col>
                <Col span={6}>
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

                        <Button variant="solid" color="danger" block onClick={() => handleNextStep()} >
                            Mua Hàng ({carts.length ?? 0})
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};