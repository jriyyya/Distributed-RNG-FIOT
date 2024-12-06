import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../layout";

import HomePage from "./HomePage/HomePage";
import ErrorPage from "./ErrorPage/ErrorPage";
import GeneratorPage from "./HomePage/GeneratorPage/GeneratorPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout.Default />}>
        <Route index element={<HomePage />} />
      </Route>
        <Route path="/distributed" element={<GeneratorPage />} />

      <Route path="*" element={<ErrorPage />} />
    </>
  )
);

export default router;
