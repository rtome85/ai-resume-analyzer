import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { formatSize } from "~/lib/utils";

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    setSelectedFile(file);
    onFileSelect?.(file);
  }, [onFileSelect]);

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive
            ? "border-brand-400 bg-brand-50"
            : "border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/40"
          }
        `}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="uploader-selected-file m-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src="/images/pdf.png" alt="PDF" className="w-9 h-9 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                onFileSelect?.(null);
              }}
            >
              <img src="/icons/cross.svg" alt="Remove" className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
            <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                <span className="text-brand-600 font-semibold">Click to upload</span>
                {" "}or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF only · Max {formatSize(maxFileSize)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
