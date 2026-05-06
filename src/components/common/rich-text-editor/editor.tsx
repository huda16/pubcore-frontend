import { ReactNode, useCallback, useRef } from "react";

import { Box } from "@mui/material";
import type { EditorOptions } from "@tiptap/core";
import {
  LinkBubbleMenu,
  RichTextEditor,
  type RichTextEditorRef,
  TableBubbleMenu,
  insertImages,
} from "mui-tiptap";

import { EditorMenuControls } from "./editor-menu-control";
import { useExtensions } from "./use-extensions";

type EditorProps = {
  name?: string;
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function fileListToImageFiles(fileList: FileList): File[] {
  // You may want to use a package like attr-accept
  // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
  // types.
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}

export function Editor({
  placeholder,
  disabled,
  value,
  onChange,
}: EditorProps) {
  const extensions = useExtensions({ placeholder });
  const rteRef = useRef<RichTextEditorRef>(null);

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      // For the sake of a demo, we don't have a server to upload the files to,
      // so we'll instead convert each one to a local "temporary" object URL.
      // This will not persist properly in a production setting. You should
      // instead upload the image files to your server, or perhaps convert the
      // images to bas64 if you would like to encode the image data directly
      // into the editor content, though that can make the editor content very
      // large. You will probably want to use the same upload function here as
      // for the MenuButtonImageUpload `onUploadFiles` prop.

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    [],
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);

          // Return true to treat the event as handled. We call preventDefault
          // ourselves for good measure.
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles],
    );

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (_view, event) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files,
        );
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          // Return true to mark the paste event as handled. This can for
          // instance prevent redundant copies of the same image showing up,
          // like if you right-click and copy an image from within the editor
          // (in which case it will be added to the clipboard both as a file and
          // as HTML, which Tiptap would otherwise separately parse.)
          return true;
        }

        // We return false here to allow the standard paste-handler to run.
        return false;
      },
      [handleNewImageFiles],
    );

  return (
    <>
      <Box
        sx={{
          // An example of how editor styles can be overridden. In this case,
          // setting where the scroll anchors to when jumping to headings. The
          // scroll margin isn't built in since it will likely vary depending on
          // where the editor itself is rendered (e.g. if there's a sticky nav
          // bar on your site).
          "& .ProseMirror": {
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              scrollMarginTop: 50,
            },
          },
        }}
        width="100%"
      >
        <RichTextEditor
          ref={rteRef}
          content={value}
          extensions={extensions}
          editable={!disabled}
          editorProps={{
            handleDrop: handleDrop,
            handlePaste: handlePaste,
          }}
          onUpdate={(content) => {
            onChange?.(content.editor.getHTML());
          }}
          renderControls={() => <EditorMenuControls />}
          RichTextFieldProps={{
            // The "outlined" variant is the default (shown here only as
            // example), but can be changed to "standard" to remove the outlined
            // field border from the editor
            variant: "outlined",
            MenuBarProps: {
              hide: false,
            },
            // Below is an example of adding a toggle within the outlined field
            // for showing/hiding the editor menu bar, and a "submit" button for
            // saving/viewing the HTML content
            // footer: (
            //   <Stack
            //     direction="row"
            //     spacing={2}
            //     sx={{
            //       borderTopStyle: "solid",
            //       borderTopWidth: 1,
            //       borderTopColor: (theme) => theme.palette.divider,
            //       py: 1,
            //       px: 1.5,
            //     }}
            //   >
            //     <MenuButton
            //       value="formatting"
            //       tooltipLabel={
            //         showMenuBar ? "Hide formatting" : "Show formatting"
            //       }
            //       size="small"
            //       onClick={() =>
            //         setShowMenuBar((currentState) => !currentState)
            //       }
            //       selected={showMenuBar}
            //       IconComponent={TextFields}
            //     />

            //     <MenuButton
            //       value="formatting"
            //       tooltipLabel={
            //         isEditable
            //           ? "Prevent edits (use read-only mode)"
            //           : "Allow edits"
            //       }
            //       size="small"
            //       onClick={() => setIsEditable((currentState) => !currentState)}
            //       selected={!isEditable}
            //       IconComponent={isEditable ? Lock : LockOpen}
            //     />

            //     <Button
            //       variant="contained"
            //       size="small"
            //       onClick={() => {
            //         setSubmittedContent(
            //           rteRef.current?.editor?.getHTML() ?? "",
            //         );
            //       }}
            //     >
            //       Save
            //     </Button>
            //   </Stack>
            // ),
          }}
          immediatelyRender={false}
        >
          {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>

      {/* <Typography variant="h5" sx={{ mt: 5 }}>
        Saved result:
      </Typography>

      {submittedContent ? (
        <>
          <pre style={{ marginTop: 10, overflow: "auto", maxWidth: "100%" }}>
            <code>{submittedContent}</code>
          </pre>

          <Box mt={3}>
            <Typography variant="overline" sx={{ mb: 2 }}>
              Read-only saved snapshot:
            </Typography>

            <RichTextReadOnly
              content={submittedContent}
              extensions={extensions}
              immediatelyRender={false}
            />
          </Box>
        </>
      ) : (
        <>
          Press “Save” above to show the HTML markup for the editor content.
          Typically you’d use a similar <code>editor.getHTML()</code> approach
          to save your data in a form.
        </>
      )} */}
    </>
  );
}
