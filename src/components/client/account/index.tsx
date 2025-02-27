

import { Modal, Tabs } from 'antd'
import React, { Children } from 'react'
import UserInfo from './user.info'
import ChangePassword from './change.password'




interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
}
export default function ManageAccount(props: IProps) {

    const { isModalOpen, setIsModalOpen } = props

    const items = [
        {
            key: 'info',
            label: 'cập nhật thông tin',
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />
        }
    ]

    return (
        <Modal
            title="Quản lý tài khoản"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            width={"60vw"}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
            />
        </Modal>

    )
}
