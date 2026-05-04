'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

export default function TipTapEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  if (!editor) return null

  const btn = (active: boolean, action: () => void, label: string) => (
    <button
      type="button"
      onClick={action}
      style={{ background: active ? '#1A1A1A' : 'white', color: active ? 'white' : '#1A1A1A', border: '1px solid #E8E2D5', padding: '3px 8px', fontSize: '12px', fontWeight: active ? 600 : 400 }}
      className="font-sans"
    >{label}</button>
  )

  return (
    <div style={{ border: '1px solid #E8E2D5' }}>
      <div style={{ borderBottom: '1px solid #E8E2D5', padding: '6px 8px', background: '#FAF7F2', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B')}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I')}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '• List')}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1. List')}
        {btn(false, () => editor.chain().focus().setHardBreak().run(), 'BR')}
      </div>
      <EditorContent
        editor={editor}
        style={{ minHeight: '160px', padding: '12px', color: '#1A1A1A', fontSize: '14px', lineHeight: '1.7', fontFamily: 'var(--font-inter)' }}
      />
    </div>
  )
}
