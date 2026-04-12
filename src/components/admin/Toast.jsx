function Toast({ msg, visible }) {
  return (
    <div className={`fixed bottom-6 right-6 z-500 bg-gray-900 text-white font-poppins text-sm px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 transition-opacity duration-300 pointer-events-none ${visible ? "opacity-100" : "opacity-0"}`}>
      <i className="fas fa-check-circle text-green-400"></i>
      <span>{msg}</span>
    </div>
  );
}

export default Toast;
