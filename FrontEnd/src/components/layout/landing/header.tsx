import React,{useState,useEffect} from "react";
import { X,Code,Menu } from "lucide-react";
import { A_tag } from "../../atoms/Elements";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import { User } from "lucide-react";
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {user}=useAuth()
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechMaster
            </span>
          </div>                                    

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <A_tag href="#courses" label="Courses"/>
            <A_tag href="#interviews" label="Mock Interviews"/>
            <A_tag href="#about" label="About"/>
            {/* <A_tag href="#about" label="About"/> */}
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
          {user? <Link to='/admin/dashboard'><User/></Link>: <Link to='/login'><button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Login</button></Link> }
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#courses" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Courses</a>
              <a href="#interviews" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Mock Interviews</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <button className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">Login</button>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full w-fit font-medium">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header
