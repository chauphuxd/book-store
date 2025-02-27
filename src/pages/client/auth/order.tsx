import { Row, Steps } from 'antd';
import OrderDetail from 'components/client/order'
import Complete from 'components/client/order/completePayment';
import Payment from 'components/client/order/payment';
import { useCurrentApp } from 'components/context/app.context';
import React, { useState } from 'react'

export default function OrderPage() {

    const [currentStep, setCurrentStep] = useState<number>(0);

    const { carts } = useCurrentApp()

    const steps = [
        {
            title: 'Giỏ hàng',
        },
        {
            title: 'Thanh toán',
        },
        {
            title: 'Hoàn tất',
        },
    ];
    return (

        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto', backgroundColor: "white" }}>
                <div className="order-steps" style={{ padding: "10px" }}>
                    <Steps
                        size="small"
                        current={currentStep}
                        onChange={(step) => setCurrentStep(step)}
                        items={steps.map((step, index) => ({
                            ...step,
                            disabled: index > 1 && carts.length > 0, // Chỉ cho phép nhấn nếu đã hoàn tất đặt hàng
                        }))}
                    />
                </div>

                {currentStep === 0 &&
                    <OrderDetail setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />}
                {currentStep === 2 &&
                    <Complete setCurrentStep={setCurrentStep} />}
            </div>
        </div>

    )
}
