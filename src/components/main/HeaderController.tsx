import React, { useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import '../../global.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

// Types
interface UserDetails {
  email: string;
  role: string;
  facultyInfo?: {
    fact_Name: string;
  };
  schoolCreationEntity?: {
    ownerName: string;
  };
  adminCreationEntity?: {
    name: string;
  };
}

// Header Component
const HeaderController: React.FC = () => {
  const { userDetails, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserName = () => {
    if (!userDetails) return 'Guest User';

    switch (userDetails.role) {
      case 'admin':
        return userDetails.adminCreationEntity?.name || 'Admin';
      case 'user':
        return userDetails.schoolCreationEntity?.ownerName || 'School Owner';
      case 'sub-user':
        return userDetails.facultyInfo?.fact_Name || 'Faculty';
      default:
        return 'Guest User';
    }
  };

  const userName = getUserName();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 header z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Username */}
          <div className="flex items-center space-x-4">
            <img src="/icon.jpg" alt="Logo" className="h-8 w-auto rounded-full" />
            <span className="text-xl text-white">{userName}</span>
          </div>

          {/* Right Side: Menu */}
          <Menu as="div" className="relative headerMenu">
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center space-x-3 p-2 rounded-full transition-colors duration-200">
                  <UserCircleIcon className="h-8  w-8 text-white" />
                  <span className="hidden sm:inline text-sm font-medium text-white">
                    {userName}
                  </span>
                  <FaCaretDown className="h-4 w-4 text-white" />
                </Menu.Button>

                <Transition
                  show={open}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute HeaderMenuItem right-0 mt-3 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${active ? '' : ''} flex items-center px-4 py-2 text-sm text-white`}
                        >
                          <UserIcon className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/setting"
                          className={`${active ? '' : ''} flex items-center px-4 py-2 text-sm text-white`}
                        >
                          <SettingsIcon className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          role="button"
                          tabIndex={0}
                          className={`${active ? '' : ''} flex items-center px-4 py-2 text-sm text-white cursor-pointer`}
                          onClick={handleLogout}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                        >
                          <LogOutIcon className="mr-3 h-4 w-4" />
                          Logout
                        </span>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default HeaderController;
