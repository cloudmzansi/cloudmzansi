import React from "react";
import { supabase } from "@/lib/utils";

interface ProjectStatusTabProps {
  user: any;
}

const ProjectStatusTab: React.FC<ProjectStatusTabProps> = ({ user }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
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
        .select('id, project_name, status, start_date, estimated_completion, plan_id')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });
      if (projectsError) {
        setError("Failed to fetch projects.");
        setLoading(false);
        return;
      }
      // For each project, fetch milestones
      const projectsWithMilestones = await Promise.all(
        (projectsData || []).map(async (project: any) => {
          const { data: milestones, error: milestonesError } = await supabase
            .from('project_milestones')
            .select('id, title, status, due_date, completed_at')
            .eq('project_id', project.id)
            .order('due_date', { ascending: true });
          return {
            ...project,
            milestones: milestones || [],
          };
        })
      );
      setProjects(projectsWithMilestones);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  if (loading) return <div className="text-gray-500">Loading project status...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!projects.length) return <div className="text-gray-500">No projects found.</div>;

  return (
    <div className="space-y-8">
      {projects.map(project => {
        // Calculate progress
        const total = project.milestones.length;
        const completed = project.milestones.filter((m: any) => m.status === 'complete').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return (
          <div key={project.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{project.project_name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : project.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{project.status.replace('_', ' ')}</span>
            </div>
            <div className="mb-4">
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{progress}% complete &middot; Est. completion: {project.estimated_completion || 'TBD'}</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.milestones.map((m: any) => (
                <span key={m.id} className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'complete' ? 'bg-green-100 text-green-700' : m.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{m.title}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectStatusTab; 