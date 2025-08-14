"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";

interface MyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function MyDrawer({ isOpen, onClose }: MyDrawerProps) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose();
      }}
    >
      <DrawerContent className="right-0 top-0 h-screen w-[400px] ml-auto bg-white shadow-lg rounded-none">
        <DrawerHeader>
          <DrawerTitle>Add Category</DrawerTitle>
          <DrawerDescription>Enter category details below.</DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          {/* You can add your AddCategory form here */}
          <p>This is where your form will go.</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const CategoryManagement = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setDrawerOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Add Category
      </button>

      {drawerOpen && (
        <MyDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
};

export default CategoryManagement;
