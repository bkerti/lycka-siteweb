
import { useRef, useEffect } from "react";
import ProjectHeader from "./projects/ProjectHeader";
import ProjectList from "./projects/ProjectList";
import ProjectFormCard from "./projects/ProjectFormCard";
import { useProjectsContext } from "@/hooks/useProjectsContext";

const AdminProjects = () => {
  const {
    projects,
    editingProject,
    setEditingProject,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel
  } = useProjectsContext();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // `editingProject` is `undefined` on initial load. 
    // It becomes `null` for "new" or an object for "edit".
    // We scroll in both cases, but not on initial load.
    if (editingProject !== undefined) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [editingProject]);

  return (
    <div>
      <ProjectHeader onNewProject={() => setEditingProject(null)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des projets existants */}
        <ProjectList
          key={projects.length} // Add key to force re-mount when projects change
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Formulaire d'édition */}
        <div ref={formRef}>
          <ProjectFormCard
            editingProject={editingProject}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
