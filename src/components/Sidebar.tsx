export function Sidebar() {
  const items = [
    { id: "item-1", name: "Item 1" },
    { id: "item-2", name: "Item 2" },
    { id: "item-3", name: "Item 3" },
    { id: "item-4", name: "Item 4" },
    { id: "item-5", name: "Item 5" },
  ];

  return (
    <div className="sidebar bg-shark p-2 flex flex-col">
      {items.map((item) => (
        <div
          draggable
          key={item.id}
          className="hover:bg-arsenic py-2 px-4 rounded-[20px] cursor-pointer text-white/50 hover:text-white"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
