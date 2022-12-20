import { lazy } from 'react'

const AuthRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/pages/authentication/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/register-basic',
    component: lazy(() => import('../../views/pages/authentication/RegisterBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/register-cover',
    component: lazy(() => import('../../views/pages/authentication/RegisterCover')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('../../views/pages/authentication/ForgotPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/forgot-password-basic',
    component: lazy(() => import('../../views/pages/authentication/ForgotPasswordBasic')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/forgot-password-cover',
    component: lazy(() => import('../../views/pages/authentication/ForgotPasswordCover.js')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/reset-password-basic',
    component: lazy(() => import('../../views/pages/authentication/ResetPasswordBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/reset-password-cover',
    component: lazy(() => import('../../views/pages/authentication/ResetPasswordCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/verify-email-basic',
    component: lazy(() => import('../../views/pages/authentication/VerifyEmailBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/verify-email-cover',
    component: lazy(() => import('../../views/pages/authentication/VerifyEmailCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/two-steps-basic',
    component: lazy(() => import('../../views/pages/authentication/TwoStepsBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/two-steps-cover',
    component: lazy(() => import('../../views/pages/authentication/TwoStepsCover')),
    layout: 'BlankLayout'
  },
]

export default AuthRoutes
