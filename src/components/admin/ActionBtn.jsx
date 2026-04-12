function ActionBtn({ icon, color, bg, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 border-none rounded-lg transition-colors duration-200 hover:opacity-80"
      style={{ color, backgroundColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = bg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <i className={icon} style={{ fontSize: 13 }}></i>
    </button>
  );
}

export default ActionBtn;
