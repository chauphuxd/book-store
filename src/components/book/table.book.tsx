import { CloudUploadOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { App, Button, Dropdown, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { deleteBookAPI, getBookAPI } from 'services/api';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';
import { CSVLink } from 'react-csv';






type TSearch = {
    mainText: string,
    author: string,

}


export default function TableBook() {
    const columns: ProColumns<IBookTable>[] = [
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
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,


        },
        {
            title: 'Thể loại',
            dataIndex: 'category',

            hideInSearch: true



        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,

        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,

            render: (text, entity) => (
                <>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                </>

            ),


        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true



        },

        {
            title: 'Action',
            render: (text, entity) => (
                <Space size="middle">
                    <EditOutlined style={{ color: "#FFA500", cursor: "pointer" }} onClick={() => { setOpenModalUpdate(true); setDataUpdate(entity) }} />
                    <Popconfirm
                        title="Delete the task"
                        placement="bottomLeft"

                        description="Are you sure to delete this task?"
                        onConfirm={() => { handleDeleteBook(entity._id) }}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ loading: isDeleteBook }}
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />

                    </Popconfirm>
                </Space>
            ),
            hideInSearch: true


        }
    ];


    //export book
    const [currenDataTable, setCurrenDataTable] = useState<IBookTable[]>([])
    //modal update book
    const [openModalUpdate, setOpenModalUpdate,] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null)



    // detail book
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

    //modal create user
    const [openModal, setOpenModal] = useState<boolean>(false);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })


    //delete user
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteBook = async (_id: string) => {
        setIsDeleteBook(true)
        const res = await deleteBookAPI(_id)
        if (res && res.data) {
            message.success('Xoá Book thành công')
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }
        setIsDeleteBook(false)

    }
    return (
        <div>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                    }


                    //sort default

                    if (sort) {
                        if (sort.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else if (sort.mainText) {
                            query += `&sort=${sort.mainText === "ascend" ? "bookName" : "-bookName"}`;
                        } else if (sort.author) {
                            query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`;
                        } else if (sort.price) {
                            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
                        } else {
                            query += `&sort=-createdAt`;
                        }
                    }

                    const res = await getBookAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        //get data book
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
                headerTitle="Table Book"
                toolBarRender={() => [
                    <CSVLink data={currenDataTable} filename='export-book.csv' >
                        <Button
                            key="button"
                            icon={<ExportOutlined />}

                            type="primary"

                        >
                            Export
                        </Button>
                    </CSVLink>
                    ,
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
            <DetailBook openViewDetail={openViewDetail} setOpenViewDetail={setOpenViewDetail} dataViewDetail={dataViewDetail} setDataViewDetail={setDataViewDetail} />
            <CreateBook openModal={openModal} setOpenModal={setOpenModal} refreshTable={refreshTable} />
            <UpdateBook openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} refreshTable={refreshTable} setDataUpdate={setDataUpdate} dataUpdate={dataUpdate} />

        </div>
    );
};