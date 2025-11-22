import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-background bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-800 hover:shadow-lg hover:scale-105 shadow-md"
      aria-label="Toggle dark mode"
    >
      {/* Sliding Circle */}
      <span
        className={`inline-flex h-10 w-10 transform rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 shadow-xl border-2 border-gray-200 dark:border-gray-700 items-center justify-center ${
          isDarkMode ? 'translate-x-12' : 'translate-x-1'
        }`}
      >
        {/* Moon Icon (Dark Mode) */}
        {isDarkMode ? (
          <svg
            className="h-6 w-6 text-yellow-400 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          /* Sun Icon (Light Mode) */
          <svg
            className="h-6 w-6 text-yellow-500 animate-spin-slow"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      {/* Optional: Background Glow Effect */}
      <span className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
        isDarkMode 
          ? 'bg-blue-500 opacity-20' 
          : 'bg-yellow-400 opacity-20'
      }`} />
    </button>
  );
};

export default ThemeToggle;