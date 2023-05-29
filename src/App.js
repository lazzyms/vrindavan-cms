import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import {
  Category,
  Dashboard,
  Login,
  CategoryForm,
  AllCategories
} from './Pages';
import Product from './Pages/Categories/Product';

const routes = [
  {
    path: '/',
    exact: true,
    component: <Layout view={<Dashboard />} heading='Dashboard' />
  },
  {
    path: '/login',
    exact: true,
    component: <Login />
  },
  {
    path: '/categories/:id',
    exact: true,
    component: <Layout view={<Category />} />
  },
  {
    path: '/categories/new',
    exact: true,
    component: <Layout view={<CategoryForm />} />
  },
  {
    path: '/categories/edit/:id',
    exact: true,
    component: <Layout view={<CategoryForm />} />
  },
  {
    path: '/categories',
    exact: true,
    component: <Layout view={<AllCategories />} />
  },
  {
    path: '/products/:pid',
    exact: true,
    component: <Layout view={<Product />} />
  },
];

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, i) => (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={<>{route.component}</>}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
