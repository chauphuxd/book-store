import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { getOrdersAPI, getUserAPI } from 'services/api';
import { Pagination } from 'antd';
import { dateRangeValidate } from 'services/helper';

const columns: ProColumns<IOrderTable>[] = [
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
                <a href="#">{entity._id}</a>
            </Space>
        ),
    },
    {
        title: 'Full name',
        dataIndex: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Price',
        dataIndex: 'totalPrice',
        sorter: true,
        hideInSearch: true,

        render: (text, entity) => (
            <>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
            </>

        ),

    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        valueType: 'date',
        sorter: true,
        hideInSearch: true

    },

];
type TSearch = {

    name: string,
    address: string,
    createdAt: string,
    createdAtRange: string
}

export default function TableOrder() {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    return (
        <ProTable<IOrderTable, TSearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                let query = "";
                if (params) {
                    query += `current=${params.current}&pageSize=${params.pageSize}`
                    if (params.name) {
                        query += `&name=/${params.name}/i`
                    }

                    if (params.address) {
                        query += `&address=/${params.address}/i`
                    }



                    const createDateRange = dateRangeValidate(params.createdAtRange)
                    if (createDateRange) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                    }

                }

                if (sort && sort.createdAt) {
                    query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                } else query += `&sort=-createdAt`

                const res = await getOrdersAPI(query);
                if (res.data) {
                    setMeta(res.data.meta)
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
                    icon={<PlusOutlined />}
                    onClick={() => {
                        actionRef.current?.reload();
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
    );
};