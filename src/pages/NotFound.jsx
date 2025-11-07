import { Link } from 'react-router-dom'; // Asumsi menggunakan React Router

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400">404</h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        {/* Tombol kembali ke Beranda */}
        <Link 
          to="/"
          className="mt-6 inline-block px-6 py-3 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;