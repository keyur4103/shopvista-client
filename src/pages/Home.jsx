import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner";
import { authenticatedInstance } from "../utils/axios-instance";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const query1 = new URLSearchParams(useLocation().search);

  // Get individual parameters
  const queryParam = query1.get("query");
  const minParam = query1.get("min");
  const maxParam = query1.get("max");
  const categoryParam = query1.get("category");

  let query = {
    search: null,
    min: null,
    max: null,
    category: null,
  };

  const queryClient = useQueryClient();

  // <-------- Get All Products ---------------->

  const {
    isSuccess: isProductsSuccess,
    isFetching: isProductsFetching,
    data: productsData,
  } = useQuery({
    queryKey: ["allProducts", query1.toString()],
    queryFn: async () => {
      const response = await authenticatedInstance.get(
        query1.toString() ? `product?${query1.toString()}` : `product`
      );
      return response.data?.data;
    },
    refetchOnWindowFocus: false,
  });

  // <-------- Get All Categories ---------------->

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await authenticatedInstance.get("category"); // Replace with your API endpoint
      return response.data?.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isProductsSuccess) {
    console.log("🚀 ~ productsData:", productsData);
  }

  const handleRemoveFilter = () => {
    navigate("/");
    queryClient.invalidateQueries(["allProducts"]);
  };

  const handleSearchChange = (e) => {
    query = { ...query, search: e.target.value };
  };

  const handleMinPriceChange = (e) => {
    query = { ...query, min: e.target.value };
  };

  const handleMaxPriceChange = (e) => {
    query = { ...query, max: e.target.value };
  };

  const handleCategoryChange = (e) => {
    query = { ...query, category: e.target.value };
  };

  const queryString = (query) => {
    const params = [];

    if (query.search) {
      params.push(`query=${encodeURIComponent(query.search)}`);
    }

    if (query.min) {
      params.push(`min=${encodeURIComponent(query.min)}`);
    }

    if (query.max) {
      params.push(`max=${encodeURIComponent(query.max)}`);
    }

    if (query.category) {
      params.push(`category=${encodeURIComponent(query.category)}`);
    }

    return params.join("&");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`?${queryString(query)}`);
  };

  if (isProductsFetching) {
    return (
      <div className="flex items-center justify-center vh-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
          <div className="flex space-x-4 items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-blue-600">
              Products
            </h2>
            <form className="lg:pr-3" onSubmit={handleSubmit}>
              <div className="flex space-x-2 mt-1">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="string"
                    placeholder="Search"
                    name="search"
                    defaultValue={queryParam}
                    onChange={handleSearchChange}
                    className="border p-2 rounded-md"
                  />
                </div>

                {/* Min Price Input */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min Price"
                    name="minPrice"
                    defaultValue={minParam}
                    onChange={handleMinPriceChange}
                    className="border p-2 rounded-md"
                  />
                </div>

                {/* Max Price Input */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max Price"
                    name="maxPrice"
                    defaultValue={maxParam}
                    onChange={handleMaxPriceChange}
                    className="border p-2 rounded-md"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={categoryParam || ""}
                    onChange={handleCategoryChange}
                    className="border p-2 rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categoriesData?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <button className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                  Apply
                </button>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={handleRemoveFilter}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                >
                  Remove
                </button>
              </div>
            </form>
          </div>

          {/* Product Grid */}
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {productsData?.products?.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
