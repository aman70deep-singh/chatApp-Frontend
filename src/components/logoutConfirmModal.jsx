
const LogoutConfirmModal = ({ onCancel, onConfirm }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onCancel}
        />
  
        {/* Modal */}
        <div className="relative bg-[#2A3942] w-96 rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">
            Log out?
          </h2>
  
          <p className="text-gray-300 mb-6">
            Are you sure you want to log out?
          </p>
  
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              Cancel
            </button>
  
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LogoutConfirmModal;
