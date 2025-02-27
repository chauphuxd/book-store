import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Modal, Checkbox, Col, Divider, Form, InputNumber, message, Pagination, Rate, Row, Spin, Tabs } from "antd";
import { FormProps } from "antd/lib";
import { Children, useEffect, useState } from "react";
import { getBookAPI, getCategoryAPI } from "services/api";
import { useNavigate, useOutletContext } from "react-router";
import "styles/home.scss"
import AppFooter from "components/layout/app.footer";




type FieldType = {
    range: {
        from: number,
        to: number
    }
    category: string[]
};

const HomePage = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);




    const [searchTerm] = useOutletContext() as any
    const navigate = useNavigate();
    useEffect(() => {
        const successMessage = localStorage.getItem("successMessage");
        if (successMessage) {
            message.success(successMessage);
            localStorage.removeItem("successMessage");
        }

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            setIsModalVisible(true);
            localStorage.setItem("isLoggedIn", "false");
        }
    }, []);

    const items = [
        {
            key: 'sort=-sold',
            label: "Phổ biến",
            Children: <></>
        },
        {
            key: 'sort=-updateAt',
            label: "Hàng mới",
            Children: <></>
        },
        {
            key: 'sort=price',
            label: "Giá thấp đến Cao",
            Children: <></>
        },
        {
            key: 'sort=-price',
            label: "Giá cao đến Thấp",
            Children: <></>
        },
    ]
    //list product
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [total, setTotal] = useState<number>(0);


    //sort and filter
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");

    //sort popular
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold")

    //fetch book
    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, filter, searchTerm])


    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) { query += `&${sortQuery}` }

        if (searchTerm) { query += `&mainText=/${searchTerm}/i` }
        const res = await getBookAPI(query);
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };


    //sort change value
    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`)
            } else {
                setFilter('');
            }
        }

    }





    //select 
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string
    }[]>([]);


    useEffect(() => {
        const fecthCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d)
            }
        }
        fecthCategory()
    }, [])
    //form
    const [form] = Form.useForm();


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (values.range.from >= 0 && values.range.to >= 0) {
            let f = `price>=${values.range.from}&price<=${values.range.to}`
            if (values.category.length) {
                const cate = values.category.join(',');
                f += `&category=${cate}`
            }
            setFilter(f);
        }
    };
    return (
        <div style={{ backgroundColor: "rgb(233 233 233)", padding: "10px" }}>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0} style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: "bold" }}><FilterTwoTone style={{ marginRight: "5px" }} />Bộ lọc tìm kiếm</span>
                            <ReloadOutlined title="Reset" onClick={() => { form.resetFields(); setFilter('') }} />
                        </div>
                        <Divider />
                        <Form onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <Form.Item
                                name="category"
                                label="Danh mục sản phẩm"
                                labelCol={{ span: 24 }}

                            >
                                <Checkbox.Group>
                                    <Row>
                                        {listCategory.map((item, index) => {
                                            return (<Col span={24} key={`index-${index}`} style={{ margin: '5px' }}>
                                                <Checkbox value={item.value}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>)
                                        })}

                                    </Row>

                                </Checkbox.Group>

                            </Form.Item>
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                                style={{ fontWeight: "bold" }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Form.Item name={["range", "from"]}>
                                        <InputNumber name="from"
                                            min={0}
                                            placeholder="đ từ"
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                        ></InputNumber>
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item name={["range", "to"]}>
                                        <InputNumber name="to"
                                            min={0}
                                            placeholder="đ đến"
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                        ></InputNumber>
                                    </Form.Item>
                                </div>
                                {/* onclick */}
                                <div className="">
                                    <Button style={{ width: "100%" }} onClick={() => form.submit()} type="primary">Áp dụng</Button>
                                </div>

                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}
                            >
                                <div >
                                    <Rate value={5} style={{ color: "#ffce3d", fontSize: "15px" }}></Rate>
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div >
                                    <Rate value={4} style={{ color: "#ffce3d", fontSize: "15px" }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div >
                                    <Rate value={3} style={{ color: "#ffce3d", fontSize: "15px" }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div >
                                    <Rate value={2} style={{ color: "#ffce3d", fontSize: "15px" }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div >
                                    <Rate value={1} style={{ color: "#ffce3d", fontSize: "15px" }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>

                        </Form>
                    </Col>
                    <Col md={20} xs={24} style={{
                        backgroundColor: "#fff", paddingLeft: "20px",
                        borderRadius: "8px", paddingBottom: '15px'
                    }} >
                        <Spin spinning={isLoading} tip="Loading...">
                            <Row>
                                <Tabs defaultActiveKey="sort=-sold" items={items} onChange={(value) => setSortQuery(value)} />
                            </Row>
                            <Row className="customize-row">
                                {listBook.map((item, index) => {
                                    return (

                                        <div className="column" key={`book-${index}`} onClick={() => navigate(`/book/${item._id}`)}>
                                            <div className="wrapper">
                                                <div className="thumbnail">
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="" />
                                                </div>
                                                <div className="text">{item.mainText}</div>
                                                <div className="price"> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</div>
                                                <div className="rating">
                                                    <Rate disabled value={5} style={{ color: "#ffce3d", fontSize: "12px" }}></Rate>
                                                    <span>Đã bán {item.sold ?? 0}</span>
                                                </div>
                                            </div>
                                        </div>)
                                })}

                            </Row>
                            <Divider />
                            <div className="" style={{ marginTop: 30 }}></div>
                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    current={current}
                                    pageSize={pageSize}

                                    total={total}

                                    onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </Spin>
                    </Col>
                </Row>
            </div>
            <Modal
                title="Chào mừng bạn!"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleOk}
                footer={null}
            >
                <p>Chào mừng bạn đã đăng nhập! Khám phá ngay các ưu đãi hấp dẫn!</p>
            </Modal>
        </div>
    )
}
export default HomePage;