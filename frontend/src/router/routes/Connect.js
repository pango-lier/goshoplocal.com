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

]

export default ConnectRoutes
