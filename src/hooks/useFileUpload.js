/**
 * Custom React Hook: useFileUpload
 * Manages file upload state and parsing
 */

import { useState, useCallback } from 'react';
import { fileParser } from '@services/fileParser';
import { FILE_CONFIG } from '@config/constants';

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const handleProgressUpdate = useCallback((progressData) => {
    setProgress(progressData);
  }, []);

  const uploadFile = useCallback(async (uploadedFile) => {
    setIsLoading(true);
    setError(null);
    setProgress({ stage: 'starting', progress: 0 });

    try {
      // Validate file
      fileParser.validateFile(uploadedFile);
      
      // Store file info
      setFile({
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      });

      // Parse file
      const result = await fileParser.parseFile(uploadedFile, handleProgressUpdate);
      
      // Store parsed content
      setParsedContent(result);
      
      return result;
    } catch (err) {
      setError(err.message);
      setFile(null);
      setParsedContent(null);
      throw err;
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  }, [handleProgressUpdate]);

  const clearFile = useCallback(() => {
    setFile(null);
    setParsedContent(null);
    setError(null);
    setProgress(null);
  }, []);

  const retryUpload = useCallback(async () => {
    if (file) {
      // Re-create file object from stored info
      // Note: This is a limitation - we can't retry without the original file
      setError('Please upload the file again to retry');
    }
  }, [file]);

  return {
    file,
    parsedContent,
    isLoading,
    progress,
    error,
    uploadFile,
    clearFile,
    retryUpload,
    hasFile: !!parsedContent,
  };
}

export default useFileUpload;
