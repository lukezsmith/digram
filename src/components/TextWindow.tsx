import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { useEffect } from "react";

type textType = {
    exampleText: string;
  };

const TextWindow = ({ exampleText }: textType) => {

    const [value, setValue] = useState('' ?? '');
    useEffect(() => setValue('' ?? ''), ['']);

    const log = () => {
      alert(value);
    }

    return(
      <Editor
        apiKey="wte0d2yf1t85oza86puswoi9z2hgavvdebwlb1e2t08r339a"
        initialValue={''}
        value={value}
        onEditorChange={(newValue, editor) => setValue(newValue)}
        onSubmit={log}
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

export default TextWindow;