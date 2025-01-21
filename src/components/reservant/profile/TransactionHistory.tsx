import { format, formatDate } from 'date-fns'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchGET, fetchPOST } from '../../../services/APIconn'
import { FetchError } from '../../../services/Errors'
import { TransactionType, PaginationType } from '../../../services/types'
import { CircularProgress } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Dialog from '../../reusableComponents/Dialog'
import { TransactionListType } from '../../../services/enums'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface TranstacionHistoryProps {
  listType: TransactionListType
}

const TransactionHistory: React.FC<TranstacionHistoryProps> = ({
  listType
}) => {
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [wallet, setWallet] = useState<number>(0)
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [showMoneyDialog, setShowMoneyDialog] = useState<boolean>(false)
  const [value, setValue] = useState<number>(0)

  const { userId } = useParams<{ userId: string }>()

  const [t] = useTranslation('global')

  const transactionsApiRoutes: Record<TransactionListType, string> = {
    [TransactionListType.Client]: '/wallet/history',
    [TransactionListType.CustomerService]: `/users/${userId}/payment-history`
  }

  const walletApiRoutes: Record<TransactionListType, string> = {
    [TransactionListType.Client]: '/wallet/status',
    [TransactionListType.CustomerService]: `/users/${userId}/wallet-status`
  }

  useEffect(() => {
    fetchWalletBalance()
  }, [])

  const fetchTransactions = async () => {
    try {
      const result: PaginationType = await fetchGET(
        `${transactionsApiRoutes[listType]}?page=${page}`
      )
      const newTransactions = result.items as TransactionType[]

      if (newTransactions.length < 10) {
        setHasMore(false)
      } else {
        if (!hasMore) setHasMore(true)
      }

      if (page > 0) {
        setTransactions(prevTransactions => [
          ...prevTransactions,
          ...newTransactions
        ])
      } else {
        setTransactions(newTransactions)
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const addFunds = async () => {
    try {
      const body = JSON.stringify({
        title: 'Funds deposit',
        amount: value
      })

      await fetchPOST('/wallet/add-money', body)

      if (page === 0) {
        fetchTransactions()
      } else {
        setPage(0)
      }

      fetchWalletBalance()
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error(error)
    }
  }

  const fetchWalletBalance = async () => {
    try {
      const res = await fetchGET(walletApiRoutes[listType])
      setWallet(res.balance)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error')
      }
    }
  }

  const formatDate = (timestamp: string): string => {
    return format(new Date(timestamp), 'yyyy-MM-dd, HH:mm')
  }

  return (
    <div className="h-full">
      <div className="h-[7rem]">
        <h1 className="font-mont-bd text-lg">
          {t('customer-service.user.transaction_history')}
        </h1>
        <div className="flex justify-between items-center">
          <h1 className="text-md font-mont-bd">
            {t('profile.transaction-history.wallet')}
          </h1>
          {listType === TransactionListType.Client && (
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-md p-1 border-green text-green transition hover:scale-105 hover:bg-green hover:text-white"
              onClick={() => {
                setShowMoneyDialog(true)
              }}
            >
              <AttachMoneyIcon className="w-4 h-4" />
              {t('profile.transaction-history.add-funds')}
            </button>
          )}
        </div>
        <h1 className="text-sm font-mont-bd">{`${t('profile.transaction-history.account-balance')}: ${wallet} zł`}</h1>
        <h1 className="text-sm">
          {t('customer-service.user.transaction_history')}
        </h1>
      </div>
      <div className="h-[calc(100%-7rem)]">
        <div
          id="scrollableDiv"
          className="w-full h-full rounded-lg overflow-y-auto scroll bg-grey-0 dark:bg-grey-6"
        >
          <InfiniteScroll
            dataLength={transactions.length}
            next={() => setPage(prevPage => prevPage + 1)}
            hasMore={hasMore}
            loader={
              <CircularProgress className="self-center text-grey-2 w-10 h-10" />
            }
            endMessage={
              <div className="flex w-full justify-center p-2">
                <h1 className="text-grey-2 text-sm">
                  {t('profile.transaction-history.no-more')}
                </h1>
              </div>
            }
            scrollableTarget="scrollableDiv"
            className="overflow-y-hidden flex flex-col rounded-lg p-2"
          >
            <div className="flex flex-col gap-1 h-full items-center divide-y-[1px] divide-grey-2">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex w-full p-2 justify-between text-sm"
                  >
                    <div className="flex gap-2 items-center">
                      <h1>
                        {transaction.amount > 0 ? (
                          <AddIcon className="text-green" />
                        ) : (
                          <RemoveIcon className="text-error" />
                        )}
                      </h1>
                      <h1 className="">{transaction.title}:</h1>
                      <h1>{transaction.amount} PLN</h1>
                    </div>
                    <h1>{formatDate(transaction.time.toString())}</h1>
                  </div>
                ))
              ) : (
                <h1 className="text-grey-2 text-sm">
                  {t('profile.transaction-history.no-transactions')}
                </h1>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      {showMoneyDialog && (
        <Dialog
          onClose={() => {
            setShowMoneyDialog(false)
            setValue(0)
          }}
          title={t('profile.transaction-history.add-funds')}
          open={showMoneyDialog}
        >
          <div className="p-6 flex flex-col gap-6 dark:text-white">
            <div className="flex gap-2 items-center">
              <label htmlFor="fundsInput" className="font-mont-md">
                {t('profile.transaction-history.add-funds')}
              </label>
              <input
                id="fundsInput"
                type="number"
                min={5}
                step={5}
                max={1000}
                value={value}
                onChange={e => setValue(parseInt(e.target.value))}
                className="border-[1px] border-grey-1 px-2 py-1 w-20 rounded-sm"
              />
              <h1>PLN</h1>
            </div>
            <button
              className="self-end flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-md p-1 border-green text-green transition enabled:hover:scale-105 enabled:hover:bg-green enabled:hover:text-white"
              onClick={() => {
                setShowMoneyDialog(false)
                addFunds()
                setValue(0)
              }}
              disabled={value < 1}
            >
              {t('profile.transaction-history.confirm')}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default TransactionHistory
