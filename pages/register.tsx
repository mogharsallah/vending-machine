import { useFormik } from 'formik'
import Head from 'next/head'
import Link from 'next/link'
import React, { FC } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { createUserSchema } from '@/common/validators'
import { Button } from '@/web/components/Button'
import { Input } from '@/web/components/Input'
import useUser from '@/web/hooks/useUser'

type RegisterProps = {}

const Register: FC<RegisterProps> = ({}) => {
  const { mutateUser } = useUser({ redirectIfFound: true })
  const registerForm = useFormik({
    initialValues: {
      username: '',
      password: '',
      role: 'buyer',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(createUserSchema),
    async onSubmit(values, helpers) {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (response.ok) {
          mutateUser(response.json(), false)
        } else if (response.status === 409) {
          helpers.setFieldError('username', 'Username already exist')
        }
      } catch (e) {
        // TODO: handle remaining error cases
      }
    },
  })

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={registerForm.handleSubmit}>
        <main className="flex flex-col justify-center items-center min-h-screen">
          <div className="bg-white rounded-lg border-1 border-slate-100 p-6 w-full sm:w-96">
            <h1 className="text-center">Register</h1>

            <Input
              placeholder="Username"
              name="username"
              type="text"
              className="mt-8"
              onChange={registerForm.handleChange('username')}
              onBlur={registerForm.handleBlur('username')}
              error={registerForm.touched.username && registerForm.errors.username}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              onChange={registerForm.handleChange('password')}
              onBlur={registerForm.handleBlur('password')}
              error={registerForm.touched.password && registerForm.errors.password}
            />
            <div className="flex">
              <Button
                type="button"
                className="mr-2"
                variant={registerForm.values.role === 'buyer' ? 'contained' : 'outlined'}
                onClick={() => registerForm.setFieldValue('role', 'buyer')}
              >
                Buyer
              </Button>
              <Button
                type="button"
                variant={registerForm.values.role === 'seller' ? 'contained' : 'outlined'}
                onClick={() => registerForm.setFieldValue('role', 'seller')}
              >
                Seller
              </Button>
            </div>
            <Button loading={registerForm.isSubmitting} type="submit" className="mt-6">
              Create account
            </Button>
            <p className="mt-2">
              You already have an account?{' '}
              <Link href="/login" className="underline">
                Sign-in
              </Link>
            </p>
          </div>
        </main>
      </form>
    </>
  )
}

export default Register
