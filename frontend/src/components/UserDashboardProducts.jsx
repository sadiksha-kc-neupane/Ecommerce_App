import axios from 'axios';
import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';

function UserDashboardProducts  () {
    const [dashboardproducts,setDashboardProducts] = useState([]);

    //fetching products

    //fetching all products
    async function fetchDashboardProducts() {
     try {
       const response = await axios.get("http://localhost:3000/fetch-product");
       const products = response.data.data || [];
       setDashboardProducts(products.slice(-4).reverse());
     } catch (error) {
       console.error(error);
     }
    }
    
    
//delete product with id
async function deleteProduct(id) {
    try {
        const response = await axios.delete( //server hit 
            `http://localhost:3000/delete-product/${id}`
        );
        
        if (response.status === 200) {
            alert("Deleted successfully");
            fetchDashboardProducts(); // Refresh list after deleting
        }
    } catch (error) {
      alert("Something went wrong. Try again.", error);
    }
}

useEffect(() => {
    // let isActive = true;

    // const loadProducts = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:3000/fetch-product");
    //         if (!isActive) return;

    //         const products = response.data.data || [];
    //         setDashboardProducts(products.slice(-4).reverse());
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // loadProducts();

    // return () => {
    //     isActive = false;
    // };

    fetchDashboardProducts()
},[])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Product List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dashboardproducts.map((products) => (
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

      {dashboardproducts.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-10">
          No products found.
        </div>
      )}
    </div>
  );
}



export default UserDashboardProducts 



