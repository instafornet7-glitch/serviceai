"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";

function ToolbarButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={active ? "editor-tool is-active" : "editor-tool"} type="button" aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

export function RichTextEditor({ initialContent }: { initialContent: string }) {
  const [html, setHtml] = useState(initialContent);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: "rich-editor-content", "aria-label": "محتوى المقال" } },
    onUpdate: ({ editor: currentEditor }) => setHtml(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

  const addLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const address = window.prompt("أدخل رابطًا يبدأ بـ https://", previous ?? "https://");
    if (address === null) return;
    if (!address.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: address.trim() }).run();
  };

  return (
    <div className="rich-editor">
      <div className="editor-toolbar" role="toolbar" aria-label="تنسيق المقال">
        <ToolbarButton label="عنوان رئيسي" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></ToolbarButton>
        <ToolbarButton label="عنوان فرعي" active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={17} /></ToolbarButton>
        <span className="editor-divider" />
        <ToolbarButton label="غامق" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton>
        <ToolbarButton label="مائل" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
        <ToolbarButton label="قائمة نقطية" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List size={17} /></ToolbarButton>
        <ToolbarButton label="قائمة مرقمة" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></ToolbarButton>
        <ToolbarButton label="اقتباس" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote size={16} /></ToolbarButton>
        <ToolbarButton label="رابط" active={editor?.isActive("link")} onClick={addLink}><Link2 size={16} /></ToolbarButton>
        <span className="editor-divider" />
        <ToolbarButton label="تراجع" onClick={() => editor?.chain().focus().undo().run()}><Undo2 size={16} /></ToolbarButton>
        <ToolbarButton label="إعادة" onClick={() => editor?.chain().focus().redo().run()}><Redo2 size={16} /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name="content_html" value={html} />
    </div>
  );
}
