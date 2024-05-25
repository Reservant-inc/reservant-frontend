import React from "react";

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="aspect-square w-8 animate-spin rounded-full border-t-2 border-primary-2 dark:border-secondary" />
    </div>
  );
}
