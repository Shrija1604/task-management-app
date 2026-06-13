import React, { useState, useEffect } from "react";
import { getAttachmentsByTask, addAttachment, deleteAttachment } from "../services/attachmentService";
import { Trash2, Link as LinkIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";

const TaskAttachments = ({ taskId }) => {
  const [attachments, setAttachments] = useState([]);
  const [uploadType, setUploadType] = useState("file"); // "file" or "url"
  const [newUrl, setNewUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const fetchAttachments = async () => {
    try {
      const res = await getAttachmentsByTask(taskId);
      if (res.success) {
        setAttachments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch attachments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (uploadType === "url" && (!newUrl.trim() || !newFileName.trim())) return;
    if (uploadType === "file" && !newFile) return;

    setIsSubmitting(true);
    try {
      let payload;
      if (uploadType === "file") {
        payload = new FormData();
        payload.append("file", newFile);
        if (newFileName.trim()) {
          payload.append("fileName", newFileName.trim());
        }
      } else {
        payload = {
          fileName: newFileName,
          fileUrl: newUrl,
        };
      }

      const res = await addAttachment(taskId, payload);
      if (res.success) {
        setAttachments([res.data, ...attachments]);
        setNewUrl("");
        setNewFileName("");
        setNewFile(null);
        toast.success("Attachment added");
      }
    } catch (error) {
      toast.error("Failed to add attachment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAttachment(id);
      if (res.success) {
        setAttachments(attachments.filter((a) => a._id !== id));
        toast.success("Attachment removed");
      }
    } catch (error) {
      toast.error("Failed to remove attachment");
    }
  };

  return (
    <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <LinkIcon className="h-4 w-4" /> Attachments
      </h4>

      {loading ? (
        <div className="text-center text-xs text-slate-500">Loading...</div>
      ) : (
        <div className="mb-3 max-h-32 overflow-y-auto space-y-2 pr-1">
          {attachments.length === 0 ? (
            <p className="text-xs italic text-slate-400 dark:text-slate-500">
              No attachments yet.
            </p>
          ) : (
            attachments.map((att) => {
              const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
              const fileUrl = att.fileUrl.startsWith('/') ? `${baseUrl}${att.fileUrl}` : att.fileUrl;
              return (
              <div
                key={att._id}
                className="group flex items-center justify-between rounded-md bg-white p-2 text-sm shadow-sm dark:bg-slate-700"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-slate-600 hover:text-indigo-600 hover:underline dark:text-slate-300"
                  >
                    {att.fileName}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(att._id)}
                  className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title="Remove"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              );
            })
          )}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-2">
        <div className="flex gap-2 mb-1">
          <button
            type="button"
            onClick={() => setUploadType("file")}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              uploadType === "file" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium" 
                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadType("url")}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              uploadType === "url" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium" 
                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Add URL
          </button>
        </div>

        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder={uploadType === "file" ? "File Name (optional)" : "File Name (e.g. Reference Doc)"}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        />
        
        <div className="flex gap-2">
          {uploadType === "file" ? (
            <input
              type="file"
              onChange={(e) => setNewFile(e.target.files[0])}
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 file:mr-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:file:bg-indigo-900/30 dark:file:text-indigo-300"
            />
          ) : (
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            />
          )}
          <button
            type="submit"
            disabled={isSubmitting || (uploadType === "url" && (!newUrl.trim() || !newFileName.trim())) || (uploadType === "file" && !newFile)}
            className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskAttachments;
