import { Col, Row, Skeleton } from 'antd';




const BookLoader = () => {
    return (<>
        <div style={{ backgroundColor: "#efefef", padding: "20px" }}>
            <div className="skeleton-page" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    {/* Image Skeleton */}
                    <Col md={10} sm={24} xs={24}>
                        <Skeleton.Image active={true} style={{ width: '500px', height: 300, borderRadius: 8 }} />
                    </Col>

                    {/* Text Skeleton */}
                    <Col md={14} sm={24} xs={24}>
                        <Skeleton active paragraph={{ rows: 4 }} />
                        <Skeleton.Button active style={{ width: 150, marginTop: 10 }} />
                        <Skeleton.Button active style={{ width: 100, marginLeft: 10, marginTop: 10 }} />
                    </Col>
                </Row>
            </div>
        </div>
    </>)
}


export default BookLoader