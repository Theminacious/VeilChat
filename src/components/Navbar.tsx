'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { motion } from 'framer-motion';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 shadow-md bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 text-white"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.a
          href="#"
          className="text-2xl font-extrabold mb-4 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
          whileHover={{ scale: 1.1 }}
        >
          VeilChat
        </motion.a>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="mr-4 text-lg">
              Welcome, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-white text-black rounded-lg shadow-md hover:bg-gray-200 focus:ring focus:ring-gray-300"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-white text-black rounded-lg shadow-md hover:bg-gray-200 focus:ring focus:ring-gray-300"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;