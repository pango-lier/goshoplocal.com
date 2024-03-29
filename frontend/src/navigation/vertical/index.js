import { Mail, Home, User, ExternalLink, ShoppingBag, List } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  // {
  //   id: 'connect',
  //   title: 'Connect',
  //   icon: <ExternalLink size={20} />,
  //   navLink: '/connects'
  // },
  {
    id: 'shops',
    title: 'Shops',
    icon: <ShoppingBag size={20} />,
    navLink: '/shops'
  },
  {
    id: 'listings',
    title: 'Listing',
    icon: <List size={20} />,
    navLink: '/listings'
  },
  // {
  //   id: 'users',
  //   title: 'Users',
  //   icon: <User size={20} />,
  //   navLink: '/users'
  // },
  // {
  //   id: 'secondPage',
  //   title: 'Second Page',
  //   icon: <Mail size={20} />,
  //   navLink: '/second-page'
  // }
]
