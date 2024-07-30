import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { Category, Login, CategoryForm, AllCategories } from "./Pages";
import Product from "./Pages/Categories/Product";
import BulkChange from "./Pages/Categories/BulkChange";
import Banners from "./Pages/Banners";
import BannerForm from "./Pages/BannerForm";
import Wishlists from "./Pages/Wishlists";
import Portfolio from "./Pages/Portfolios/Portfolio";
import PortfolioForm from "./Pages/Portfolios/PortfolioForm";

const routes = [
  {
    path: "/",
    exact: true,
    component: <Layout view={<AllCategories />} />,
  },
  {
    path: "/login",
    exact: true,
    component: <Login />,
  },
  {
    path: "/categories/:id",
    exact: true,
    component: <Layout view={<Category />} />,
  },
  {
    path: "/categories/new",
    exact: true,
    component: <Layout view={<CategoryForm />} />,
  },
  {
    path: "/categories/edit/:id",
    exact: true,
    component: <Layout view={<CategoryForm />} />,
  },
  {
    path: "/products/:pid",
    exact: true,
    component: <Layout view={<Product />} />,
  },
  {
    path: "/products/discount",
    exact: true,
    component: <Layout view={<BulkChange />} />,
  },
  {
    path: "/banners",
    exact: true,
    component: <Layout view={<Banners />} />,
  },
  {
    path: "/banners/new",
    exact: true,
    component: <Layout view={<BannerForm />} />,
  },
  {
    path: "/wishlists",
    exact: true,
    component: <Layout view={<Wishlists />} />,
  },
  {
    path: "/portfolio",
    exact: true,
    component: <Layout view={<Portfolio />} />,
  },
  {
    path: "/portfolio/new",
    exact: true,
    component: <Layout view={<PortfolioForm />} />,
  },
  {
    path: "/portfolio/edit/:pid",
    exact: true,
    component: <Layout view={<PortfolioForm />} />,
  },
  {
    path: "/testimonials",
    exact: true,
    component: <Layout view={<>Coming soon...</>} />,
  },
  {
    path: "/queries",
    exact: true,
    component: <Layout view={<>Coming soon...</>} />,
  },
  {
    path: "/orders",
    exact: true,
    component: <Layout view={<>Coming soon...</>} />,
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
