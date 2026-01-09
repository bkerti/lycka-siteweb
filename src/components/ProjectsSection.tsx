import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  media: { url: string; type: string }[];
  status: string;
  location: string;
  year: string;
  price: number;
}

const ProjectsSection = () => {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <section className="section bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">Nos Projets Récents</h2>
          <p className="text-foreground max-w-3xl mx-auto">
            Découvrez nos réalisations récentes dans différents domaines : résidentiel, commercial, institutionnel et industriel.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              category={project.category}
              imageUrl={project.media && project.media.length > 0 ? project.media[0].url : "/placeholder.svg"}
              images={project.media.map(m => m.url)}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="hover:bg-lycka-secondary hover:text-primary-foreground">
            <Link to="/projects">Voir tous nos projets</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;