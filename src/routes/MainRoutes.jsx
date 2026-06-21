import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import UserList from '../pages/user/view/UserList';
import UserCreate from '../pages/user/entry/UserCreate';
import UserDetail from '../pages/user/view/UserDetail';
import UserUpdate from '../pages/user/entry/UserUpdate';
import CategoriesList from '../pages/categories/view/CategoriesList';
import CategoriesUpdate from '../pages/categories/entry/CategoriesUpdate';
import CategoriesDetail from '../pages/categories/entry/CategoriesDetail';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/user/list',
      element: <UserList />
    },
    {
      path: '/user/create',
      element: <UserCreate />,
      handle: { breadcrumb: 'Create User' }
    },
    {
      path: '/user/:id',
      element: <UserDetail />
    },
    {
      path: '/user/update/:id',
      element: <UserUpdate />
    },
        {
      path: '/categories/list',
      element: <CategoriesList />
    },
        {
      path: '/categories/update/:id',
      element: <CategoriesUpdate />
    },
        {
      path: '/categories/:id',
      element: <CategoriesDetail />
    },

  ]
};

export default MainRoutes;
