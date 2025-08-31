"use client"

import { useNavigate } from "react-router-dom"
import {
  GraduationCap,
  Hotel,
  Building2,
  ArrowRight,
  Phone,
  Mail,
  Users,
  Shield,
  BarChart3,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { ToastContainer } from "react-toastify"

const SelectionScreen = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="text-[#126666] w-8 h-8" />
            <h1 className="text-[#126666] font-bold text-lg md:text-2xl">
              <span className="hidden sm:inline">EasyWaySolution</span>
              <span className="sm:hidden">EasyWay</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-xl"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-xl"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-xl"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-[#126666] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0f5555] transition-colors text-base">
              Request Demo
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3 pt-4 px-2">
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-50 text-lg"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-50 text-lg"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#126666] transition-colors font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-50 text-lg"
              >
                Contact
              </button>
              <button className="bg-[#126666] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#0f5555] transition-colors text-lg mx-4 mt-2">
                Request Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#126666] via-[#1e7878] to-[#0f5555] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Best School & Hotel Management Software in India</h2>
            <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-white/90">
              Transform your educational institution or hospitality business with our comprehensive management system.
              Get complete school administration software and hotel booking management solutions designed for Indian
              businesses.
            </p>
            <button
              onClick={() => scrollToSection("services")}
              className="bg-white text-[#126666] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>View Our Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="text-3xl font-bold text-[#095555] mb-4">Services</div>
              <div className="text-2xl text-[#126666] mb-4">
                School Management System & Hotel Management Software
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose from our specialized management solutions designed for educational institutions and hospitality
                businesses across India
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* School Management Card */}
              <article
                onClick={() => navigate("/login")}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#126666] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gradient-to-br from-[#126666] to-[#1e7878] rounded-full mb-4 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#126666] mb-3">School Management System</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Complete school ERP software for student admission, attendance management, fee collection, exam
                    results, and academic records. Perfect for schools, colleges, and coaching institutes.
                  </p>
                  <div className="flex items-center text-[#126666] font-semibold group-hover:translate-x-1 transition-transform">
                    <span className="mr-2">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>

              {/* Hotel Management Card */}
              <article
                onClick={() => navigate("/login-hotel")}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#126666] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gradient-to-br from-[#1e7878] to-[#126666] rounded-full mb-4 group-hover:scale-105 transition-transform">
                    <Hotel className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#126666] mb-3">Hotel Management System</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Advanced hotel booking software with room reservation, guest check-in/out, billing system,
                    housekeeping management, and restaurant POS. Ideal for hotels, resorts, and guest houses.
                  </p>
                  <div className="flex items-center text-[#126666] font-semibold group-hover:translate-x-1 transition-transform">
                    <span className="mr-2">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[#126666] mb-4">
                Why Choose EasyWaySolution for School & Hotel Management?
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                India's trusted management software provider with 1000+ satisfied customers across education and
                hospitality sectors
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-[#126666] to-[#1e7878] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#126666] mb-3">User-Friendly Interface</h4>
                <p className="text-gray-600 leading-relaxed">
                  Simple and intuitive design that requires minimal training. Perfect for schools and hotels of all
                  sizes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e7878] to-[#0f5555] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#126666] mb-3">100% Secure & Cloud-Based</h4>
                <p className="text-gray-600 leading-relaxed">
                  Bank-level security with automatic backups. Access your school or hotel data from anywhere, anytime.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0f5555] to-[#126666] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#126666] mb-3">Smart Reports & Analytics</h4>
                <p className="text-gray-600 leading-relaxed">
                  Get detailed insights with automated reports for better decision making in your school or hotel
                  business.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 bg-gradient-to-br from-[#126666] via-[#1e7878] to-[#0f5555] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Get Free Demo of School & Hotel Management Software</h3>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Ready to digitize your school or hotel operations? Book a free demo today and see how our software can
                transform your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Call Us Now</h4>
                    <p className="text-white/90">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email Support</h4>
                    <p className="text-white/90">support@easywaysolution.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-4">Book Free Demo</h4>
                <form className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <select className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50">
                    <option value="">Select Service Type</option>
                    <option value="school">School Management Software</option>
                    <option value="hotel">Hotel Management Software</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-white text-[#126666] p-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Free Demo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0f5555] text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Building2 className="text-white w-6 h-6" />
                  <span className="text-white font-bold text-xl">EasyWaySolution</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Leading provider of school management system and hotel management software in India. Trusted by 1000+
                  institutions for complete digital transformation.
                </p>
              </div>

              <div className="text-center">
                <h4 className="font-bold text-lg text-white mb-3">Our Solutions</h4>
                <ul className="space-y-2 text-white/80">
                  <li>School ERP Software</li>
                  <li>Hotel Booking System</li>
                  <li>Student Management</li>
                  <li>Room Reservation System</li>
                </ul>
              </div>

              <div className="text-right">
                <h4 className="font-bold text-lg text-white mb-3">Contact Details</h4>
                <div className="space-y-2 text-white/80">
                  <p>+91 98765 43210</p>
                  <p>support@easywaysolution.com</p>
                  <p>24/7 Customer Support</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6 text-center">
              <p className="text-white/60">
                © 2024 EasyWaySolution. Best School Management System & Hotel Management Software in India.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SelectionScreen
