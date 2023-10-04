import { useState } from 'react'

import Table from '~/components/table/table'

const ReportTicket = () => {
  const [page, setPage] = useState<string>('1')
  return (
    <>
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Tố cáo</p>
        <div className="flex flex-col gap-5 mt-10 pr-5 space-y-10">
          <div className="flex flex-col gap-3">
            <div className="text-xl font-bold">Chi tiết giao dịch</div>
            <Table
              dataHeader={['1', '2', '3']}
              dataBody={[
                ['apple', 'banana', 'cherry'],
                ['dog', 'cat', undefined],
                ['elephant', 'lion', 'zebra'],
              ]}
              pageCount={10}
              page={page}
              setPage={setPage}
              limit={'5'}
              totalItem={50}
              watchAction={true}
              deleteAction={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ReportTicket
