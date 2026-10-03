"use client";

import { deleteArticleAction } from "@/lib/admin-actions";

export function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  return (
    <form action={deleteArticleAction} onSubmit={(event) => {
      if (!window.confirm(`هل تريد حذف مقال «${title}» نهائيًا؟`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button className="admin-row-delete" type="submit">حذف</button>
    </form>
  );
}
