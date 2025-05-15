// TiptapEditor.jsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

const TiptapEditor = ({ markdownText }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown.configure({
                html: true,
                tightLists: true,
                bulletListMarker: '-',
                linkify: true,
                breaks: false,
            }),
        ],
        content: '',
    });

    useEffect(() => {
        if (editor && markdownText) {
            editor.commands.setContent(markdownText, false, {
                parseOptions: { preserveWhitespace: true },
            });
        }
    }, [editor, markdownText]);

    return <EditorContent editor={editor} />;
};

export default TiptapEditor;
