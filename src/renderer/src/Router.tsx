import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { categoryRoute, ingredientsRoute, ordersRoute, productsRoute, startRoute } from "./lib/routes";
import Start from "./pages/Start";
import Products from "./pages/Products";
import Ingredients from "./pages/Ingredients";
import PublicLayout from "./layouts/PublicLayout";
import { Login } from "./pages/Login";
import Category from "./pages/Category";
import Orders from "./pages/Orders";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path={startRoute} element={<Start />} />
          <Route path={productsRoute} element={<Products />} />
          <Route path={ingredientsRoute} element={<Ingredients />} />
          <Route path={categoryRoute} element={<Category />} />
          <Route path={ordersRoute} element={<Orders />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;
