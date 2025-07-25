"use client"

import { useNavigate } from "react-router-dom"
import { GraduationCap, Hotel, Building2, Users, Settings, ArrowRight } from "lucide-react"

const SelectionScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#126666] via-[#1e7878] to-[#0f5555] relative overflow-hidden">
      {/* Subtle Background Elements */}
    

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Logo and Title Section - Reduced margin */}
          <div className="flex flex-col items-center mb-6 text-center">
           
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 tracking-wide drop-shadow-lg">
              EasyWaySolution
            </h1>
            <p className="text-white text-base sm:text-lg mt-2 tracking-wide font-light drop-shadow-md">
              Unified Management Platform
            </p>
            <div className="w-20 h-1 bg-white bg-opacity-50 rounded-full mt-3"></div>
          </div>

          {/* Platform Selection Card - Reduced size and padding */}
          <div className="w-full max-w-xl">
            <div className="bg-white bg-opacity-25 rounded-2xl border border-white border-opacity-30 shadow-2xl p-4 sm:p-6">
              {/* Header - Reduced spacing */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-white bg-opacity-30 rounded-full">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-gray-800 text-xl sm:text-2xl font-semibold tracking-wide mb-2 drop-shadow-sm">
                  Select Service Module
                </h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                  Choose the module you want to access:
                </p>
              </div>

              {/* Service Cards - Reduced padding */}
              <div className="space-y-3">
                {/* School Management Card */}
                <div
                  onClick={() => navigate("/login-hotel")}
                  className="group relative w-full p-4 bg-white bg-opacity-80 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl bg-green-100 border border-green-200 group-hover:bg-green-200 transition-all duration-300">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-1">School Management</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">Educational institution management</p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0 ml-3">
                          <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-green-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                {/* Hotel Management Card */}
                <div
                  onClick={() => navigate("/login-hotel")}
                  className="group relative w-full p-4 bg-white bg-opacity-80 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 group-hover:bg-blue-200 transition-all duration-300">
                        <Hotel className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-1">Hotel Management</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">Hospitality management platform</p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0 ml-3">
                          <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>

              {/* Call to Action - Reduced margin */}
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-xs">Need help? Contact support</p>
              </div>
            </div>
          </div>

          {/* Footer - Reduced margin and size */}
          <div className="mt-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 mb-2">
              <div className="flex items-center space-x-1 text-white text-opacity-70">
                <Building2 className="w-3 h-3" />
                <span className="text-xs">Enterprise Solutions</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white bg-opacity-40 rounded-full"></div>
              <div className="flex items-center space-x-1 text-white text-opacity-70">
                <Users className="w-3 h-3" />
                <span className="text-xs">Trusted by 1000+ Organizations</span>
              </div>
            </div>
            <p className="text-white text-opacity-60 text-xs">© 2024 EasyWaySolution. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectionScreen
