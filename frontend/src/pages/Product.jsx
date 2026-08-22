import Navbar from "../components/navbar";

function Product() {
  return (
    <div>
      <Navbar />
      <div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        {/* wrapper */}
        <div className="max-w-6xl mx-auto space-y-6">
          {/* recent products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent products
              </h2>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-gray-100 text-gray-700">
                4 items
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="rounded-lg bg-white shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <a href="#">
                    <img
                      alt="product"
                      className="w-full h-48 object-cover rounded-t-lg"
                      src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
                    />
                  </a>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors absolute top-2 right-2 bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <a href="#">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        Tesla Model 3 - Premium Electric Car
                      </h3>
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                      <i className="fas fa-map-marker-alt text-xs text-gray-500" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#E26038]">
                        $89
                      </span>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs">
                        Cars
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <i className="far fa-eye text-xs" />
                          124
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-heart text-xs" />8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <a href="#">
                    <img
                      alt="product"
                      className="w-full h-48 object-cover rounded-t-lg"
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
                    />
                  </a>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors absolute top-2 right-2 bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <a href="#">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        Tesla Model 3 - Premium Electric Car
                      </h3>
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                      <i className="fas fa-map-marker-alt text-xs text-gray-500" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#E26038]">
                        $89
                      </span>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs">
                        Cars
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <i className="far fa-eye text-xs" />
                          124
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-heart text-xs" />8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <a href="#">
                    <img
                      alt="product"
                      className="w-full h-48 object-cover rounded-t-lg"
                      src="https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
                    />
                  </a>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors absolute top-2 right-2 bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <a href="#">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        Tesla Model 3 - Premium Electric Car
                      </h3>
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                      <i className="fas fa-map-marker-alt text-xs text-gray-500" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#E26038]">
                        $89
                      </span>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs">
                        Cars
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <i className="far fa-eye text-xs" />
                          124
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-heart text-xs" />8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <a href="#">
                    <img
                      alt="product"
                      className="w-full h-48 object-cover rounded-t-lg"
                      src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
                    />
                  </a>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors absolute top-2 right-2 bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <a href="#">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        Tesla Model 3 - Premium Electric Car
                      </h3>
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                      <i className="fas fa-map-marker-alt text-xs text-gray-500" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#E26038]">
                        $89
                      </span>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs">
                        Cars
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <i className="far fa-eye text-xs" />
                          124
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-heart text-xs" />8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* top products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Top products
              </h2>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-gray-100 text-gray-700">
                3 bookings
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white shadow-sm border">
                <div className="p-4">
                  <div className="flex gap-4">
                    <img
                      alt
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      src="https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          BMW X5 SUV
                        </h3>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs bg-green-100 text-green-800">
                          Active
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                            <img
                              className="aspect-square h-full w-full object-cover"
                              src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200"
                            />
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            Travis Lynch
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="far fa-calendar-alt text-xs text-gray-500 mr-2" />
                          <span className="truncate">
                            Dec 28, 2024 - Dec 30, 2024
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#E26038]">
                            $267
                          </span>
                          <a href="#">
                            <button className="inline-flex items-center justify-center gap-2 transition-colors border h-9 rounded-md px-3 text-xs">
                              View Details
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white shadow-sm border">
                <div className="p-4">
                  <div className="flex gap-4">
                    <img
                      alt
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          BMW X5 SUV
                        </h3>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs bg-green-100 text-green-800">
                          Active
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                            <img
                              className="aspect-square h-full w-full object-cover"
                              src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200"
                            />
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            Glen McCormick
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="far fa-calendar-alt text-xs text-gray-500 mr-2" />
                          <span className="truncate">
                            Dec 28, 2024 - Dec 30, 2024
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#E26038]">
                            $267
                          </span>
                          <a href="#">
                            <button className="inline-flex items-center justify-center gap-2 transition-colors border h-9 rounded-md px-3 text-xs">
                              View Details
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white shadow-sm border">
                <div className="p-4">
                  <div className="flex gap-4">
                    <img
                      alt
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      src="https://plus.unsplash.com/premium_photo-1679513691641-9aedddc94f96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxwcm9kdWN0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          BMW X5 SUV
                        </h3>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-xs bg-green-100 text-green-800">
                          Active
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                            <img
                              className="aspect-square h-full w-full object-cover"
                              src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200"
                            />
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            Fanny Wade
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="far fa-calendar-alt text-xs text-gray-500 mr-2" />
                          <span className="truncate">
                            Dec 28, 2024 - Dec 30, 2024
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#E26038]">
                            $267
                          </span>
                          <a href="#">
                            <button className="inline-flex items-center justify-center gap-2 transition-colors border h-9 rounded-md px-3 text-xs">
                              View Details
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
