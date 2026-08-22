import React from 'react'
import Navbar from '../components/navbar'
import { Link } from 'react-router-dom'
import UserDashboardProducts from '../components/UserDashboardProducts'

const Userdashboard = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-slate-900">User Dashboard</h1>
          <p className="mb-8 text-slate-600">Welcome back! Use the button below to create a new product.</p>
          <Link
            to="/create-Product"
            className="inline-flex rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Create New Product
          </Link>
        </div>
        <UserDashboardProducts/>
      </div>
    </>
  )
}

export default Userdashboard