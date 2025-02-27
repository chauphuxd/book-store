import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
    title: string;
}

const ModalGallery = (props: IProps) => {

    const { isOpen, setIsOpen, currentIndex, items, title } = props

    const [activeIndex, setActiveIndex] = useState(0)
    const refGallery = useRef<ImageGallery>(null)
    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex)
        }
    }, [isOpen, currentIndex])

    return (
        <Modal open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            closable={false}
            className="modal-gallery"
            width={800}
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={activeIndex}
                        showThumbnails={false}
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0}
                    />
                </Col>
                <Col span={6}>
                    <div className="title-gallery" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{title}</div>
                    <Row gutter={[10, 10]} style={{ maxHeight: "400px", overflowY: "auto" }}>
                        {items?.map((item, i) => (
                            <Col key={`image-${i}`} span={24}>
                                <Image
                                    wrapperClassName={`img-thumb ${activeIndex === i ? "active" : ""}`}
                                    width={100}
                                    height={100}
                                    src={item.original}
                                    preview={false}
                                    onClick={() => {
                                        refGallery.current?.slideToIndex(i);
                                        setActiveIndex(i);
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        border: activeIndex === i ? "2px solid blue" : "none"
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>


        </Modal>
    )
}

export default ModalGallery