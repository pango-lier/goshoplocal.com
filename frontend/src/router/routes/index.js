import { lazy } from 'react'
import Auth from './Auth'
import Connect from './Connect'
// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

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
    path: '/users',
    component: lazy(() => import('../../views/pages/User'))
  },
  {
    path: '/about-us',
    component: lazy(() => import('../../views/SecondPage')),
    meta: {
      publicRoute: true
    }
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
