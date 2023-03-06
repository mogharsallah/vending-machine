import { useFormik } from 'formik'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'

import { coins } from '@/common/coins'
import { NextPageWithLayout } from '@/common/types'
import { BackLink } from '@/web/components/BackLink'
import { Button } from '@/web/components/Button'
import { MainLayout } from '@/web/components/MainLayout'
import { NumberInput } from '@/web/components/NumberInput'
import useUser from '@/web/hooks/useUser'
import { formatCurrency } from '@/web/lib/currency'

interface Props {}
const Deposit: NextPageWithLayout<Props> = ({}) => {
  const router = useRouter()
  const { user, refreshUser } = useUser()
  const [isResetting, setResetting] = useState(false)
  const initialValues = useMemo(
    () =>
      coins.reduce((acc, coin) => {
        acc[coin] = 0
        return acc
      }, {} as { [key: string]: number }),
    []
  )

  const depositForm = useFormik({
    initialValues: initialValues,
    validateOnBlur: true,
    async onSubmit(values) {
      const deposit = Object.entries(values).flatMap(([coin, amount]) => {
        return Array.from({ length: amount }, () => parseInt(coin, 10))
      })
      try {
        const response = await fetch('/api/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deposit }),
        })

        if (response.ok) {
          const result = await response.json()
          window.alert(`Success! your new deposit is: ${formatCurrency(result.deposit)}`)
          refreshUser()
        }
      } catch (error) {
        // TODO: handle remaining error cases
      }
    },
  })

  const submitEnabled = Object.entries(depositForm.values).some(([coin, amount]) => amount > 0)

  const resetDeposit = useCallback(async () => {
    try {
      setResetting(true)
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        await response.json()
        window.alert(`Success! your new deposit is now: ${formatCurrency(0)}`)
        refreshUser()
      }
    } catch (e) {
    } finally {
      setResetting(false)
    }
  }, [refreshUser])

  return (
    <>
      <Head>
        <title>Deposit</title>
      </Head>

      <BackLink href="#" onClick={() => router.back()}>
        Go back
      </BackLink>
      <div className="mt-4 max-w-sm">
        <h2>Deposit</h2>
        {user && <p> Your current deposit is: {formatCurrency(user.deposit)}</p>}
        <form onSubmit={depositForm.handleSubmit}>
          <div className="mt-8">
            {coins.map((coin) => (
              <div className="mb-4 " key={coin}>
                <Image
                  priority
                  src={`/coin-images/${coin}.png`}
                  alt={`coin-image-${coin}`}
                  width={100}
                  height={100}
                  className="my-4 mx-auto overflow-hidden"
                />
                <NumberInput
                  min={1}
                  title="Available amount"
                  value={depositForm.values[coin]}
                  onChange={(value) => depositForm.setFieldValue(coin.toString(), value || 0)}
                  onBlur={depositForm.handleBlur('amount')}
                  hint={depositForm.errors[coin]}
                />
              </div>
            ))}

            <Button disabled={!submitEnabled} loading={depositForm.isSubmitting} className="mt-4" type="submit">
              Deposit
            </Button>
          </div>
        </form>
        <Button onClick={resetDeposit} loading={isResetting} variant="outlined" className="mt-6">
          Reset deposit
        </Button>
      </div>
    </>
  )
}

export default Deposit

Deposit.getLayout = MainLayout
