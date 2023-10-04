import { CheckOne, CloseOne, Delete, Eyes, ReduceOne, Write } from '@icon-park/react'

import React, { useState } from 'react'

import { Table, Tag } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../../public/empty_error.png'

const tableDataMapping = (data?) => {
  const list: {}[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        ...item,
      }
      list.push(rowItem)
    })
  }
  return list
}

const mappingRecipientType = {
  ALL: 'Tất cả',
  FIRST_TIME_BOOKING: 'Người lần đầu thuê',
  PREVIOUS_BOOKING: ' Người đã từng thuê',
  TOP_5_BOOKER: ' Top 5 người thuê',
  TOP_10_BOOKER: ' Top 10 người thuê',
}
const mappingStatus = {
  true: <Tag className="bg-green-600 rounded-lg text-white px-2 py-1 m-0">Đã duyệt</Tag>,
  PENDING: <Tag className="bg-yellow-600 rounded-lg text-white px-2 py-1 m-0">Chờ duyệt</Tag>,
  false: <Tag className="bg-red-600 rounded-lg text-white px-2 py-1 m-0">Bị từ chối</Tag>,
}

const mappingType = {
  DISCOUNT: 'Giảm giá',
  CASHBACK: 'Hoàn tiền',
}

const ProviderVoucherTable = ({ data }) => {
  const listData = tableDataMapping(data?.row)

  const columns = [
    {
      title: 'Tên',
      key: 'name',
      render: (record) => (
        <div className="max-w-[9rem]">
          <p> {record.name}</p>
          <p className="text-gray-400"> {record.code}</p>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <div className="w-full flex justify-center">Loại</div>,
      dataIndex: 'type',
      key: 'type',
      render: (type) => <div className="w-full flex justify-center ">{mappingType[type]}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Giá trị</div>,
      key: 'discountValue',
      render: (record) => {
        if (record.discountUnit == 'PERCENT')
          return <div className="w-full flex justify-center">{record.discountValue + '%'}</div>
        else if (record.discountUnit == 'CASH')
          return <div className="w-full flex justify-center">{record.discountValue + 'Coin'}</div>
      },
    },
    {
      title: <div className="w-full flex justify-center">Bắt đầu</div>,
      key: 'startDate',
      dataIndex: 'startDate',
      render: (date) => <div className="w-full flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Kết thúc</div>,
      key: 'endDate',
      dataIndex: 'endDate',
      render: (date) => <div className="w-full flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Trạng thái</div>,
      key: 'status',
      dataIndex: 'status',
      render: (text) => <div className="w-full flex justify-center">{mappingStatus[text]}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Đối tượng</div>,
      key: 'recipientType',
      dataIndex: 'recipientType',
      render: (text) => <div className="w-full flex justify-center">{mappingRecipientType[text]}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return (
          <>
            <div className="flex justify-center items-center max-w-[5rem]">
              <Eyes
                onClick={() => {}}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#1677ff"
              />

              {record.status != 'PENDING' ? (
                <div className="flex pointer-events-none opacity-40">
                  <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="18" fill="#fff" />

                  <CloseOne className="p-2 rounded-full hover:bg-gray-600" theme="outline" size="18" fill="#fff" />
                </div>
              ) : (
                <div className="flex">
                  <CheckOne
                    onClick={() => {
                      console.log('approve')
                    }}
                    className="p-2 rounded-full hover:bg-gray-500"
                    theme="outline"
                    size="18"
                    fill="#85ea2d"
                  />

                  <CloseOne
                    onClick={() => {
                      console.log('deny')
                    }}
                    className="p-2 rounded-full hover:bg-gray-600"
                    theme="outline"
                    size="18"
                    fill="#ff0000"
                  />
                </div>
              )}
            </div>
          </>
        )
      },
    },
  ]

  let locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }

  return (
    <div className="mt-5 ">
      <Table locale={locale} pagination={false} columns={columns} dataSource={listData} />
    </div>
  )
}

export default ProviderVoucherTable
