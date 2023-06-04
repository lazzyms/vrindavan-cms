import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import {
  Category,
  Login,
  CategoryForm,
  AllCategories
} from './Pages';
import Product from './Pages/Categories/Product';
import BulkChange from './Pages/Categories/BulkChange';

const routes = [
  {
    path: '/',
    exact: true,
    component: <Layout view={<AllCategories />} />
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
    path: '/products/:pid',
    exact: true,
    component: <Layout view={<Product />} />
  },
  {
    path: '/products/discount',
    exact: true,
    component: <Layout view={<BulkChange />} />
  }
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
