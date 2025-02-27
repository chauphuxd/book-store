import { App, Modal, notification, Table } from "antd";
import { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { Buffer } from "buffer";
import Exceljs from 'exceljs'
import { createUserBulkAPI } from "services/api";
import templateFile from "assets/template/User.xlsx?url"

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;

}

interface IDataImport {
    fullName: string,
    email: string,
    phone: string
}

const { Dragger } = Upload;




const ImportUser = (props: IProps) => {
    const [dataImport, setDataImport] = useState<IDataImport[]>([])
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { message } = App.useApp();
    const { openModalImport, setOpenModalImport, refreshTable } = props

    const uploadProps: UploadProps = {



        name: 'file',
        multiple: false,
        maxCount: 1,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",


        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok")
            }, 1000)
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //read first row at data keys
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {

                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any;
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        }
                        )

                    })

                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    //get data on table and send to backend
    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))


        const res = await createUserBulkAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();

    }

    return (
        <>
            <Modal width={700} title="Import Data User" open={openModalImport} onOk={() => handleImport()} onCancel={() => { setOpenModalImport(false); setDataImport([]) }} okText={"Import data"} maskClosable={false} okButtonProps={{ disabled: dataImport.length > 0 ? false : true, loading: isSubmit }} destroyOnClose={true}>
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download >Download Sample File </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Dữ liệu up load:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}

                    />
                </div>

            </Modal>

        </>
    )
}


export default ImportUser