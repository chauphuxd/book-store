import { getDashboardAPI } from "services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0,
    });

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) setDataDashboard(res.data);
        };
        initDashboard();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />;

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Card>
                    <Statistic
                        title="Total Orders"
                        value={dataDashboard.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic
                        title="Total Users"
                        value={dataDashboard.countUser}
                        formatter={formatter}

                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic
                        title="Total Books"
                        value={dataDashboard.countBook}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default AdminDashboard;
