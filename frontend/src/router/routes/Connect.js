import { lazy } from 'react'

const ConnectRoutes = [
  {
    path: '/connects',
    component: lazy(() => import('../../views/pages/Connect')),
  },
  {
    path: '/connects/register',
    component: lazy(() => import('../../views/pages/authentication/Register')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/connects/:uuid/oauth2',
    component: lazy(() => import('../../views/pages/misc/RegisterEtsyOauth2')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/connects/oauth2/error',
    component: lazy(() => import('../../views/pages/misc/ErrorEtsyOauth2')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/connects/oauth2/success',
    component: lazy(() => import('../../views/pages/misc/SuccessEtsyOauth2')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
]

export default ConnectRoutes
