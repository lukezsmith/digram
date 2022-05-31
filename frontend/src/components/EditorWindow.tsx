import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { useEffect } from "react";

type codeBlockProptypes = {
    submissionHandler: Function;
    exampleText: string;
  };

const EditorWindow = ({ submissionHandler, exampleText }: codeBlockProptypes) => {

    const [value, setValue] = useState('' ?? '');
    useEffect(() => setValue('' ?? ''), ['']);

    return(
      <Editor
        apiKey="wte0d2yf1t85oza86puswoi9z2hgavvdebwlb1e2t08r339a"
        initialValue={''}
        value={value}
        onEditorChange={(newValue, editor) => {
          setValue(newValue);
          submissionHandler(newValue);
        }}
        init={{
          plugins: [
            "codesample",
            "link",
            "image",
            "fullscreen"
          ],
          toolbar: "undo redo | styleselect | bold italic | link image | codesample | fullscreen",
          menubar: false,
          statusbar: false,
          placeholder: exampleText,
          height: 500,
        }}
      />
    );
  }

export default EditorWindow;