import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./layout.tsx";
import { App, FormProps } from 'antd';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "pages/client/home.tsx";
import BookPage from "pages/client/book.tsx";
import AboutPage from "pages/client/about.tsx";
import LoginPage from "pages/client/auth/login.tsx";
import RegisterPage from "pages/client/auth/register.tsx";
import "styles/global.scss";
import { AppProvider } from "components/context/app.context.tsx";
import ProtectedRoute from "components/checkauth/auth.tsx";
import DashBoardPage from "pages/admin/dashboard.tsx";
import ManageBookPage from "pages/admin/manage.book.tsx";
import ManageOrderPage from "pages/admin/manage.order.tsx";
import ManageUserPage from "pages/admin/manage.user.tsx";
import LayoutAdmin from "components/layout/layout.admin.tsx"
import enUS from 'antd/locale/en_US';
import { ConfigProvider } from "antd";
import OrderPage from "pages/client/auth/order.tsx";
import HistoryPage from "pages/client/history.tsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "/book/:id",
                element: <BookPage />,
            },
            {
                path: "/order",
                element: (<ProtectedRoute><OrderPage /></ProtectedRoute>),
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/history",
                element: (<ProtectedRoute><HistoryPage /></ProtectedRoute>),
            },
        ],
    },
    {
        path: "admin",
        element: <LayoutAdmin />,
        children: [
            { index: true, element: (<ProtectedRoute><DashBoardPage /></ProtectedRoute>) },
            {
                path: "book",
                element: (<ProtectedRoute><ManageBookPage /></ProtectedRoute>),
            },
            {
                path: "order",
                element: (<ProtectedRoute><ManageOrderPage /></ProtectedRoute>),
            },
            {
                path: "user",
                element: (<ProtectedRoute><ManageUserPage /></ProtectedRoute>),
            },
            {
                path: "/admin",
                element: (<ProtectedRoute><div>Admin page</div></ProtectedRoute>),
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <ConfigProvider locale={enUS}>
                    <RouterProvider router={router} />
                </ConfigProvider>
            </AppProvider>
        </App>
    </StrictMode>
);
