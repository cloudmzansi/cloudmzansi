import React from "react";
import { supabase } from "@/lib/utils";

interface FileSharingTabProps {
  user: any;
}

const FileSharingTab: React.FC<FileSharingTabProps> = ({ user }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProjectsAndFiles = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      // Fetch client record for this user
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (clientError || !client) {
        setError("No client record found for this user.");
        setLoading(false);
        return;
      }
      // Fetch projects for this client
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, project_name')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });
      if (projectsError) {
        setError("Failed to fetch projects.");
        setLoading(false);
        return;
      }
      // For each project, fetch files
      const projectsWithFiles = await Promise.all(
        (projectsData || []).map(async (project: any) => {
          const { data: files, error: filesError } = await supabase
            .from('project_files')
            .select('id, file_name, url, uploaded_at')
            .eq('project_id', project.id)
            .order('uploaded_at', { ascending: false });
          return {
            ...project,
            files: files || [],
          };
        })
      );
      setProjects(projectsWithFiles);
      setLoading(false);
    };
    fetchProjectsAndFiles();
  }, [user, uploading]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // For demo: just simulate upload
    // In production: upload to Supabase Storage and insert record in project_files
    setTimeout(() => {
      setUploading(false);
      alert(`File '${file.name}' uploaded to project.`);
    }, 1200);
  };

  if (loading) return <div className="text-gray-500">Loading files...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!projects.length) return <div className="text-gray-500">No projects found.</div>;

  return (
    <div className="space-y-8">
      {projects.map(project => (
        <div key={project.id} className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{project.project_name}</h3>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={e => handleFileUpload(e, project.id)}
              />
              <span className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold">
                {uploading ? 'Uploading...' : 'Upload File'}
              </span>
            </label>
          </div>
          <div>
            {project.files.length === 0 ? (
              <div className="text-gray-500 text-sm">No files uploaded yet.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {project.files.map((file: any) => (
                  <li key={file.id} className="flex items-center justify-between py-2">
                    <span className="font-mono text-sm">{file.file_name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileSharingTab; 