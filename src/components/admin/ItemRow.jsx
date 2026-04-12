function ItemRow({ item, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-[5fr_2fr_3fr_auto] gap-2 items-center mb-2">
      <input
        value={item.desc}
        onChange={(e) => onChange({ ...item, desc: e.target.value })}
        placeholder="Description"
        className="border-2 border-gray-200 bg-gray-50 rounded-lg px-2.5 py-2 text-xs font-poppins outline-none focus:border-primary-600"
      />
      <input
        type="number"
        value={item.qty}
        min={1}
        onChange={(e) => onChange({ ...item, qty: +e.target.value })}
        className="border-2 border-gray-200 bg-gray-50 rounded-lg px-2.5 py-2 text-xs font-poppins outline-none text-center focus:border-primary-600"
      />
      <input
        type="number"
        value={item.rate}
        min={0}
        onChange={(e) => onChange({ ...item, rate: +e.target.value })}
        className="border-2 border-gray-200 bg-gray-50 rounded-lg px-2.5 py-2 text-xs font-poppins outline-none text-right focus:border-primary-600"
      />
      <button
        onClick={onRemove}
        className="bg-none border-none text-red-500 cursor-pointer p-2 hover:text-red-700 transition-colors"
      >
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  );
}

export default ItemRow;
