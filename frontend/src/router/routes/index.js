import { lazy } from 'react'
import Auth from './Auth'
import Connect from './Connect'
// ** Document title
const TemplateTitle = '%s - Listing Manager'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/shops',
    component: lazy(() => import('../../views/pages/Shop'))
  },
  {
    path: '/listings',
    component: lazy(() => import('../../views/pages/Listing')),
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/users',
    component: lazy(() => import('../../views/pages/User'))
  },
  ...Auth,
  ...Connect,
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
