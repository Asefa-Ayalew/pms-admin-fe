"use state";
import { allowedFontsFamilies } from "@/src/extensions/font-family-extension";
import { CustomRichTextEditorType } from "@/src/models/rich-text-editor.model";
import { ActionIcon, Tooltip } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import Highlight from "@tiptap/extension-highlight";
import { OrderedList } from "@tiptap/extension-ordered-list";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { AnyExtension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Columns, Rows, Table as TableIcon, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface CustomRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label: string;
  config?: CustomRichTextEditorType;
}

const CustomRichTextEditor = ({
  value,
  onChange,
  label,
  config,
}: CustomRichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      config?.hasColor && Color.configure({ types: ["textStyle"] }),
      config?.hasBulletList && BulletList,
      config?.hasOrderedList && OrderedList,
      config?.hasUnderline && Underline,
      config?.hasTextStyle && TextStyle,
      config?.hasLink && Link,
      config?.hasTextAlign && TextAlign.configure({ types: [] }),
      config?.hasSuperscript && Superscript,
      config?.hasSubscript && SubScript,
      config?.hasHighlight && Highlight,
      config?.hasFontFamily && FontFamily.configure({ types: ["textStyle"] }),
      config?.hasTable && Table.configure({ resizable: true }),
      config?.hasTable && Table.configure({ resizable: true }),
      config?.hasFontSize && FontSize.configure({ types: ["textStyle"] }),
      config?.hasTable && Table.configure({ resizable: true }),
      config?.hasTable && TableRow,
      config?.hasTable && TableCell,
      config?.hasTable && TableHeader,
    ].filter((extension): extension is AnyExtension => Boolean(extension)), // Removes undefined values
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value); // Update content when value changes
    }
  }, [value, editor]);
  const handleFontSizeChange = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  };
  const allowedFontSizes = [
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
  ];
  return (
    <div className="flex-col w-full">
      <span className="w-full">{label}</span>
      <RichTextEditor editor={editor} className="w-full">
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {/* Text Formatting */}
          <RichTextEditor.ControlsGroup>
            {config?.hasFontFamily && (
              <select
                title="Font Family"
                onChange={(e) =>
                  editor?.chain().focus().setFontFamily(e.target.value).run()
                }
                className="text-black p-1 text-sm border border-gray-300 bg-white rounded"
              >
                {allowedFontsFamilies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            )}
            <select
              title="Font Size"
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="text-black p-1 text-sm border border-gray-300 bg-white rounded"
            >
              {allowedFontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            {config?.hasColor && (
              <RichTextEditor.ColorPicker
                colors={[
                  "#25262b",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
              />
            )}
            {config?.hasBold && <RichTextEditor.Bold />}
            {config?.hasItalic && <RichTextEditor.Italic />}
            {config?.hasUnderline && <RichTextEditor.Underline />}
            {config?.hasStrikethrough && <RichTextEditor.Strikethrough />}
            {config?.hasClearFormatting && <RichTextEditor.ClearFormatting />}
            {config?.hasHighlight && <RichTextEditor.Highlight />}
          </RichTextEditor.ControlsGroup>

          {config?.hasHeaders && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>
          )}

          <RichTextEditor.ControlsGroup>
            {config?.hasBulletList && <RichTextEditor.BulletList />}
            {config?.hasOrderedList && <RichTextEditor.OrderedList />}
            {config?.hasBlockquote && <RichTextEditor.Blockquote />}
            {config?.hasSeparator && <RichTextEditor.Hr />}
          </RichTextEditor.ControlsGroup>
          {config?.hasTextAlign && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          )}
          {config?.hasTable && (
            <RichTextEditor.ControlsGroup>
              <Tooltip label="Insert Table">
                <ActionIcon
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3 })
                      .run()
                  }
                >
                  <TableIcon size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add Column Before">
                <ActionIcon
                  onClick={() =>
                    editor?.chain().focus().addColumnBefore().run()
                  }
                >
                  <Columns size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add Column After">
                <ActionIcon
                  onClick={() => editor?.chain().focus().addColumnAfter().run()}
                >
                  <Columns size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add Row Before">
                <ActionIcon
                  onClick={() => editor?.chain().focus().addRowBefore().run()}
                >
                  <Rows size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add Row After">
                <ActionIcon
                  onClick={() => editor?.chain().focus().addRowAfter().run()}
                >
                  <Rows size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete Column">
                <ActionIcon
                  onClick={() => editor?.chain().focus().deleteColumn().run()}
                  color="red"
                >
                  <Trash2 size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete Row">
                <ActionIcon
                  onClick={() => editor?.chain().focus().deleteRow().run()}
                  color="red"
                >
                  <Trash2 size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete Table">
                <ActionIcon
                  onClick={() => editor?.chain().focus().deleteTable().run()}
                  color="red"
                >
                  <Trash2 size={18} />
                </ActionIcon>
              </Tooltip>
            </RichTextEditor.ControlsGroup>
          )}
          {config?.hasLink && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          )}
          {config?.hasUndo && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          )}
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
};

export default CustomRichTextEditor;
