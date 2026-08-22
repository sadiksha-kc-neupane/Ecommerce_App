import axios from "axios";
import { useEffect, useState } from "react";

function Productlist() {
  const [product, setProduct] = useState([]);

  async function fetchProduct() {
    try {
      const response = await axios.get("http://localhost:3000/fetch-product");
      setProduct(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProduct();
    
  }, []);

  async function deleteProduct(id) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-product/${id}`
      );

      if (response.status === 200) {
        alert("Deleted successfully");
        fetchProduct(); // Refresh list after deleting
      }
    } catch (error) {
      alert("Something went wrong. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Product List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((products) => (
          <div
            key={products.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
          >
            <img src={products.image} />

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {products.name}
              </h2>

              <p className="text-lg text-green-600 font-bold">
                ${products.price}
              </p>
             <p className="text-lg text-green-600 font-bold">
                {products.description}
              </p>
                 <p className="text-lg text-green-600 font-bold">
                {products.Qty}
              </p>
             
              <button
                onClick={() => deleteProduct(products.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {product.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-10">
          No products found.
        </div>
      )}
    </div>
  );
}

export default Productlist;