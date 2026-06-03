import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoaderAnimation from './LoaderAnimation';

interface UploadCardProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export default function UploadCard({ onUpload, isUploading }: UploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  }, [onUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });
  
  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`glass-card p-12 text-center cursor-pointer transition-all border-2 ${isDragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/20 hover:border-cyan-500/50'}`}>
        <input {...getInputProps()} />
        <FiUploadCloud className="text-5xl text-cyan-400 mx-auto mb-4" />
        <p className="text-lg font-medium">{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}</p>
        <p className="text-white/40 text-sm mt-2">or click to browse (PDF only)</p>
      </div>
      
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <FiFile className="text-cyan-400 text-2xl" />
              <div className="flex-1">
                <p className="font-medium">Resume Preview</p>
                <p className="text-white/40 text-sm">PDF ready for analysis</p>
              </div>
              {isUploading && <LoaderAnimation />}
            </div>
            {!isUploading && <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center text-white/40">Resume content will be analyzed by AI</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}