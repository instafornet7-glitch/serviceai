"use client";

import { deleteCategoryAction } from "@/lib/admin-actions";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteCategoryAction} onSubmit={(event) => {
      if (!window.confirm(`هل تريد حذف تصنيف «${name}»؟`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button className="admin-row-delete" type="submit">حذف</button>
    </form>
  );
}
