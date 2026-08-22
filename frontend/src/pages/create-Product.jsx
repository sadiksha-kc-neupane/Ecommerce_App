import Navbar from "../components/navbar"
import axios from "axios";
import { useState } from "react";


export default function CreateProduct(){
    let[name , setName] = useState('')
    let[price , setPrice] = useState('')
    let[Qty , setQuantity] = useState('')
    let[description , setDescription] = useState('')
    let[image , setImage] = useState('')


    async function sendDataToBackend(e){
    e.preventDefault()
    await axios.post("http://localhost:3000/product",{
       name, price , Qty, description, image
    })
  }
    
    return(
        <>
        <Navbar/>
        <div className="flex items-center justify-center p-12">
        {/* Author: FormBold Team */}
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <form onSubmit={sendDataToBackend}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Name
              </label>
              <input
                onChange={(e)=>setName(e.target.value)}
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Price
              </label>
              <input
               onChange={(e)=>setPrice(e.target.value)}
                type="number"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Quantity
              </label>
              <input
                onChange={(e)=>setQuantity(e.target.value)}
                type="number"
                name="quantity"
                id="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
               Description
              </label>
              <input
                onChange={(e)=>setDescription(e.target.value)}
                type="text"
                name="description"
                id="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
               Image
              </label>
              <input
                onChange={(e)=>setImage(e.target.value)}
                type="text"
                name="image"
                id="email"
                placeholder="Enter your Image URL"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div>
              <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Register product
              </button>
            </div>
          </form>
        </div>
      </div>

        </>
    )
}

