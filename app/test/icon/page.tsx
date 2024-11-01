"use client"


import { useState } from "react";
import { Heart, Star, Bell } from "lucide-react"; // Sample icons

export default function IconList() {
  const [items, setItems] = useState([
    { icon: Heart, label: "Heart Icon", value: "heart" },
    { icon: Star, label: "Star Icon", value: "star" },
  ]);

  const addItem = (icon, label, value) => {
    setItems((prevItems) => [...prevItems, { icon, label, value }]);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => addItem(Bell, "Bell Icon", "bell")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Bell Icon
      </button>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-2 border rounded bg-gray-50"
          >
            <item.icon className="h-6 w-6 mr-2 text-primary" />
            <div>
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-sm text-gray-600">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
