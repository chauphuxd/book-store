import { CloudUploadOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { App, Button, Dropdown, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { deleteUserAPI, getUserAPI } from 'services/api';
import { dateRangeValidate } from 'services/helper';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';

type TSearch = {
    fullName: string,
    email: string,
    createdAt: string,
    createdAtRange: string
}


export default function TableUser() {


    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            hideInSearch: true,
            render: (text, entity) => (
                <Space size="middle">
                    <a onClick={() => {
                        setOpenViewDetail(true);
                        setDataViewDetail(entity);
                    }} href="#">{entity._id}</a>
                </Space>
            ),
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true


        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            sorter: true,
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render: (text, entity) => (
                <Space size="middle">
                    <EditOutlined style={{ color: "#FFA500", cursor: "pointer" }} onClick={() => { setOpenModalUpdate(true); setDataUpdate(entity) }} />
                    <Popconfirm
                        title="Delete the task"
                        placement="bottomLeft"

                        description="Are you sure to delete this task?"
                        onConfirm={() => { handleDeleteUser(entity._id) }}
                        // onCancel={cancel}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ loading: isDeleteUser }}
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />

                    </Popconfirm>
                </Space>
            ),


        }
    ];




    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);


    //modal create user
    const [openModal, setOpenModal] = useState<boolean>(false);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    // modal import user
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);


    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    //export user
    const [currenDataTable, setCurrenDataTable] = useState<IUserTable[]>([])

    //modal update user
    const [openModalUpdate, setOpenModalUpdate,] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null)


    //delete user
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true)
        const res = await deleteUserAPI(_id)
        if (res && res.data) {
            message.success('Xoá user thành công')
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }
        setIsDeleteUser(false)

    }
    return (
        <div>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";

                    // search
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }



                    //sort default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;



                    const res = await getUserAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        //get data table
                        setCurrenDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }





                }}

                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]} - {range[1]} trên {total} rows</div>) }
                }}
                headerTitle="Table User"

                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink data={currenDataTable} filename='export-user.csv'>
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {

                            setOpenModalImport(true);
                        }}
                        type="primary"

                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {

                            setOpenModal(true);
                        }}
                        type="primary"

                    >
                        Add New
                    </Button>,
                    <Dropdown
                        key="menu"
                        menu={{
                            items: [
                                {
                                    label: '1st item',
                                    key: '1',
                                },
                                {
                                    label: '2nd item',
                                    key: '2',
                                },
                                {
                                    label: '3rd item',
                                    key: '3',
                                },
                            ],
                        }}
                    >
                        <Button>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>,
                ]}

            />
            <DetailUser openViewDetail={openViewDetail} setOpenViewDetail={setOpenViewDetail} dataViewDetail={dataViewDetail} setDataViewDetail={setDataViewDetail} />
            <CreateUser openModal={openModal} setOpenModal={setOpenModal} refreshTable={refreshTable} />
            <ImportUser openModalImport={openModalImport} setOpenModalImport={setOpenModalImport} refreshTable={refreshTable} />
            <UpdateUser openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} refreshTable={refreshTable} setDataUpdate={setDataUpdate} dataUpdate={dataUpdate} />
        </div>
    );
};