/**
 * FileUpload Component
 * Handles resume file upload with drag-and-drop support
 */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../Card';
import Alert from '../Alert';
import { formatFileSize } from '@utils/helpers';
import { FILE_CONFIG } from '@config/constants';

export function FileUpload({ onFileUpload, isLoading, error: uploadError }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    try {
      await onFileUpload(selectedFile, setProgress);
    } catch (error) {
      // Error handled by parent
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: FILE_CONFIG.maxSize,
    multiple: false,
    disabled: isLoading,
  });

  const rejectionErrors = fileRejections.map(({ errors }) => 
    errors.map(e => e.message).join(', ')
  );

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upload Resume</CardTitle>
          <span className="text-sm text-gray-500">Step 1 of 2</span>
        </div>
      </CardHeader>

      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragActive 
              ? 'border-teal-600 bg-teal-50 scale-105' 
              : 'border-teal-300 bg-teal-50 hover:border-teal-500'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} disabled={isLoading} />
          
          <div className="pointer-events-none">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
              ) : (
                <Upload className="w-8 h-8 text-teal-600" />
              )}
            </div>
            
            {isLoading ? (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Processing...</p>
                {progress && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {progress.stage} {progress.page && `(Page ${progress.page}/${progress.totalPages})`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports PDF, DOC, DOCX, TXT (Max {formatFileSize(FILE_CONFIG.maxSize)})
                </p>
              </>
            )}
          </div>
        </div>

        {/* Success Message */}
        {file && !isLoading && !uploadError && (
          <Alert variant="success" className="mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <div>
                <p className="font-medium">Resume uploaded successfully</p>
                <p className="text-sm mt-1">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* Error Messages */}
        {uploadError && (
          <Alert variant="error" className="mt-4">
            <p className="font-medium">Upload failed</p>
            <p className="text-sm mt-1">{uploadError}</p>
          </Alert>
        )}

        {rejectionErrors.length > 0 && (
          <Alert variant="error" className="mt-4">
            <p className="font-medium">File not accepted</p>
            <p className="text-sm mt-1">{rejectionErrors[0]}</p>
          </Alert>
        )}

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Tips for best results:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use a clean, well-formatted resume</li>
                <li>Avoid images or complex graphics</li>
                <li>PDF format recommended for best parsing</li>
                <li>Ensure text is not password-protected</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FileUpload;
