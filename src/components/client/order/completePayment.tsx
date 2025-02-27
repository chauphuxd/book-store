import React from 'react'
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';




interface IProps {
    setCurrentStep: (v: number) => void;
}
export default function Complete(props: IProps) {
    return (
        <div> <Result
            status="success"
            title="Đặt hàng thành công!"
            subTitle="Hệ thống đã tiếp nhận yêu cầu đặt hàng của bạn"
            extra={[
                <Button type="primary" key="console">
                    <Link to="/">Trang chủ</Link>
                </Button>,
                <Button key="buy">
                    <Link to="/history">Lịch sử mua hàng</Link>
                </Button>,
            ]}
        /></div>
    )
}
