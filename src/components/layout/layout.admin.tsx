import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    BookOutlined,
    AppstoreOutlined,
    DollarOutlined,

} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, MenuProps, Result, Space, theme } from 'antd';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from 'services/api';


const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];



// function getItem(
//     label: React.ReactNode,
//     key: React.Key,
//     icon?: React.ReactNode,
//     children?: MenuItem[],
// ): MenuItem {
//     return {
//         key,
//         icon,
//         children,
//         label,
//     } as MenuItem;
// }
//[getItem('Team 1', '6'), getItem('Team 2', '8')] them menu con
const items: MenuItem[] = [
    {
        key: '/admin',
        icon: <AppstoreOutlined />,
        label: <Link to="/admin">Dashboard</Link>,
    },
    {
        key: '/admin/user',
        icon: <UserOutlined />,
        label: 'Users',
        children: [
            {
                key: '2',
                label: <Link to="/admin/user">User List</Link>,
            }
        ]
    },
    {
        key: '/admin/book',
        icon: <BookOutlined />,
        label: <Link to="/admin/book">Books</Link>,
    },
    {
        key: '/admin/order',
        icon: <DollarOutlined />,
        label: <Link to="/admin/order">Orders</Link>,
    }
];


const SideBarAdmin = () => {
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useCurrentApp();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    const location = useLocation();

    const [activeMenu, setActiveMenu] = useState('');

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false)
            localStorage.removeItem("access_token")
        }
    }
    const dropdownItems: MenuProps['items'] = [
        {
            label: 'Quản lý tài khoản ',
            key: 'account',
        },
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'homepage',
        }, {
            label: <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
                Đăng xuất
            </label>,
            key: 'logout',
        },
    ];


    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();



    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }

    const isAdminRoute = location.pathname.includes("admin")

    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role
        console.log(role)
        if (role === "USER") {
            return (
                <Outlet />
            )

        }
    }


    useEffect(() => {
        const active: any = items.find(
            (item) => location.pathname === (item!.key as any)) ?? "/admin";
        setActiveMenu(active?.key);
    }, [location]);



    return (<>

        <Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <div style={{
                    color: '#ccc',
                    textAlign: 'center',
                    padding: '16px',
                    fontSize: '18px',
                }}>
                    Admin
                </div>
                <Menu theme="dark" selectedKeys={[activeMenu]} mode="inline" items={items} onClick={(e) => setActiveMenu(e.key)} />
            </Sider>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        {isAuthenticated ? <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space style={{ color: "rgb(151 151 151)" }}>
                                    <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}><img src={urlAvatar} style={{ marginRight: '10px', fontSize: "20px", color: "#001632", width: "40px", height: "40px" }} />
                                        {user?.role}
                                    </div>
                                </Space>
                            </a>
                        </Dropdown> : " "}


                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Phu Design ©{new Date().getFullYear()} Created by PHUDEV
                </Footer>
            </Layout>
        </Layout>
    </>
    );
}
export default SideBarAdmin;