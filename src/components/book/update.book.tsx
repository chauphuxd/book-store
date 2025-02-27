import { App, Button, Col, Divider, Form, Input, InputNumber, Modal, Row } from "antd";
import { FormProps } from "antd";
import { useEffect, useState } from "react";
import { getCategoryAPI, updateBookAPI, uploadFileAPI } from "services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { Select } from "antd";
import { MAX_UPLOAD_IMAGE_SIZE } from "services/helper";
import { GetProp } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { v4 as uuidv4 } from 'uuid';
import { UploadRequestOption as RcCustomerRequestOptions } from "rc-upload/lib/interface";



type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IBookTable | null;
    setDataUpdate: (v: IBookTable | null) => void;

}

type FieldType = {
    _id: string,
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any
};




const UpdateBook = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();


    useEffect(() => {
        if (dataUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`
                }
            ]
            const arrSlider = dataUpdate.slider.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })

            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,
                thumbnail: arrThumbnail,
                slider: arrSlider
            })

            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(arrSlider as any);
        }
    }, [dataUpdate])


    // upload file
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    //gui form
    const [form] = Form.useForm();

    //su dung de update
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    //upload
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleUploadFile = async (options: RcCustomerRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, 'book');

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            } else {
                setFileListSlider((prev) => [...prev, { ...uploadedFile }])
            }

            if (onSuccess) onSuccess('ok')
        } else {
            message.error(res.message)
        }
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList
    }


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)

        const { _id, mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0].name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];
        const res = await updateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider)

        // success
        if (res && res.data) {
            message.success("Cập nhật book thành công")
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }

        setIsSubmit(false)
    };


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
    return (
        <>
            <Modal width={750} title="Update User" open={openModalUpdate} onCancel={() => { setOpenModalUpdate(false); form.resetFields(); setDataUpdate(null); setFileListSlider([]); setFileListThumbnail([]) }} onOk={() => { form.submit() }} confirmLoading={isSubmit} okText={"Cập nhật"} cancelText={"Hủy"} >

                <Form
                    form={form}
                    name="form-register"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"

                >
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="ID"
                            name="_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên sách không được để trống!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tác giả không được để trống!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Giá tiền không được để trống!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter="đ"
                                />

                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Thể loại không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=""
                                    style={{ width: 120 }}
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Số lượng không được để trống!",
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ảnh không được để trống!",
                                    },
                                ]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload

                                    listType="picture-card"
                                    className="avatar-upload"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div className="">
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: "8px" }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={6}>

                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Ảnh Slider"
                                name="slider"
                                rules={[
                                    {
                                        required: false,
                                        message: "Ảnh không được để trống!",
                                    },
                                ]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    name="slider"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    fileList={fileListThumbnail}

                                >
                                    <div className="">
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: "8px" }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal >
        </>
    )
}


export default UpdateBook