import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your content...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 text-sm rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Numbered List"
          >
            <NumberedListIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="Add Image"
          >
            <PhotoIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;