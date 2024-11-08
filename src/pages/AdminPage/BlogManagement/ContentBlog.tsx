import { Form } from "antd";
import React, { useCallback } from "react";
import ReactQuill from "react-quill";

const ContentBlog = () => {
  const quillRef = React.useRef<ReactQuill>(null);
  // Handle image upload (for preview)
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target?.result as string;
          if (base64Image && quillRef.current) {
            // Insert base64 image into the editor
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", base64Image);
            }
          }
          // try {
          //   const response = await fetch('/api/upload-image', {
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify({ image: base64Image }),
          //   });
          //   const result = await response.json();
          //   const imageUrl = result.url; // Assuming server response contains the image URL

          //   if (imageUrl && quillRef.current) {
          //     const quill = quillRef.current.getEditor();
          //     const range = quill.getSelection();
          //     if (range) {
          //       quill.insertEmbed(range.index, 'custom-image', imageUrl);
          //       setUploadedImages((prevImages) => [...prevImages, imageUrl]);
          //       onContentChange(quill.root.innerHTML);
          //     }
          //   }
          // } catch (error) {
          //   console.error('Image upload failed:', error);
          // }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: ["small", "normal", "large", "huge"] }], // Added text size options
        ["link", "image"], // Add image handler to toolbar
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload, // Override default image handler with custom handler
      },
    },
  };

  const handleContentChange = (content: string) => {
    const parser = new DOMParser();
    parser.parseFromString(content, "text/html");
  };

  return (
    <Form.Item
      name="content"
      label="Blog Content"
      rules={[{ required: true, message: "Please input the blog content!" }]}
    >
      <ReactQuill
        ref={quillRef}
        modules={modules}
        theme="snow" // Use the "snow" theme for a Word-like editor
        onChange={handleContentChange}
      />
    </Form.Item>
  );
};

export default ContentBlog;
