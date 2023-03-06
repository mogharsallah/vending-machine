import { useFormik } from 'formik'
import Head from 'next/head'
import Link from 'next/link'
import React, { FC } from 'react'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { usernameSchema } from '@/common/validators'
import { Button } from '@/web/components/Button'
import { Input } from '@/web/components/Input'
import useUser from '@/web/hooks/useUser'

type LoginProps = {}

const loginSchema = z.object({
  username: usernameSchema,
})
const Login: FC<LoginProps> = ({}) => {
  const { mutateUser } = useUser({ redirectIfFound: true })

  const loginForm = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(loginSchema),
    async onSubmit(values, helpers) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (response.ok) {
          mutateUser(response.json(), false)
        } else if (response.status === 404) {
          helpers.setFieldError('username', 'Username does not exist')
        } else if (response.status === 400) {
          helpers.setFieldError('password', 'Wrong password')
        }
      } catch (error) {
        // TODO: handle remaining error cases
      }
    },
  })

  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={loginForm.handleSubmit}>
        <main className="flex flex-col justify-center items-center min-h-screen">
          <div className="bg-white rounded-lg border-slate-100 p-6 w-full sm:w-96">
            <h1 className="text-center">Sign-in</h1>

            <Input
              placeholder="Username"
              name="username"
              type="text"
              className="mt-8"
              onChange={loginForm.handleChange('username')}
              onBlur={loginForm.handleBlur('username')}
              error={loginForm.touched.username && loginForm.errors.username}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              onChange={loginForm.handleChange('password')}
              onBlur={loginForm.handleBlur('password')}
              error={loginForm.touched.password && loginForm.errors.password}
            />
            <Button loading={loginForm.isSubmitting} type="submit">
              Sign-in
            </Button>
            <p className="mt-2">
              You do not have an account?{' '}
              <Link href="/register" className="underline">
                Create account
              </Link>
            </p>
          </div>
        </main>
      </form>
    </>
  )
}

export default Login
