import { HashRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { categoryRoute, configurationRoute, ingredientsRoute, ordersRoute, productsRoute, startRoute } from "./lib/routes";
import Start from "./pages/Start";
import Products from "./pages/Products";
import Ingredients from "./pages/Ingredients";
import PublicLayout from "./layouts/PublicLayout";
import { Login } from "./pages/Login";
import Category from "./pages/Category";
import Orders from "./pages/Orders";
import Configuration from "./pages/Configuration";


const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path={startRoute} element={<Start />} />
          <Route path={productsRoute} element={<Products />} />
          <Route path={ingredientsRoute} element={<Ingredients />} />
          <Route path={categoryRoute} element={<Category />} />
          <Route path={ordersRoute} element={<Orders />} />
          <Route path={configurationRoute} element={<Configuration />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<Login />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default Router;
