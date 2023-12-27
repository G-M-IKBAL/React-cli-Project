import React, { useRef, forwardRef } from 'react';

// FileUpload component forwards ref for external usage
const FileUpload = forwardRef(({ onFileSelectSuccess, onFileSelectError }, ref) => {
  // Creating a ref for the input element
  const fileInputRef = useRef(null);

  // Handle file change when a file is selected
  const handleFileChange = (e) => {
    // Retrieve the selected file
    const selectedFile = e.target.files?.[0];

    // Check if a file is selected
    if (selectedFile) {
      // Callback function for successful file selection
      onFileSelectSuccess(selectedFile);
    } else {
      // Callback function for error on file selection
      onFileSelectError('No file selected');
    }
  };
  
  // Return the input element for file selection
  return (
    <input
      type="file"
      ref={ref} // Pass ref to the parent component
      style={{ display: 'none' }} // Hide the input element
      onChange={handleFileChange} // Handle file change
    />
  );
});

export default FileUpload;
