import React from "react";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown'
import 'github-markdown-css'



const Terms: React.FC = () => {

  const [markdownContent, setMarkdownContent] = useState("");
 
  useEffect(() => {
    fetch("/TERMS.md")
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text));
  }, []);

  return (
    <div className='markdown-body'>
      <Markdown>{markdownContent}</Markdown>

    </div>
  );
};

export default Terms;