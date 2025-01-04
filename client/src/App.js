import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blogs from "./pages/blogs-pages/Blogs";
import EditBlog from "./pages/blogs-pages/EditBlog";
import Countries from "./pages/countries-pages/Countries";
import EditCountries from "./pages/countries-pages/EditCountries";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/countries" element={<Countries/>}/>
        <Route path="/edit-country/:id" element={<EditCountries />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
