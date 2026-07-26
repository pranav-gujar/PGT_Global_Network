// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// export const usePageLoading = () => {
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 200); // Adjust timing as needed

//     return () => clearTimeout(timer);
//   }, [location.pathname]);

//   return loading;
// };

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoading = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const prevPathname = useRef(location.pathname);

  // Synchronously update loading state to true when location.pathname changes during render.
  if (prevPathname.current !== location.pathname) {
    prevPathname.current = location.pathname;
    setLoading(true);
  }

  useEffect(() => {
    // Show loader for a fixed duration to let the page transition smoothly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // 600ms transition time

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return loading;
};

