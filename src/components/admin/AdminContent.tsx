import React from "react";
import AdminServices from "@/components/admin/AdminServices";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminLyckaHome from "@/components/admin/AdminLyckaHome";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminMediaInteractions from "@/components/admin/AdminMediaInteractions";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminLyckaBlog from "@/components/admin/AdminLyckaBlog";
import AdminBlogComments from "@/components/admin/AdminBlogComments";
import AdminLyckaHomeComments from "@/components/admin/AdminLyckaHomeComments";
import VisitorChart from "./VisitorChart";

interface AdminContentProps {
  activeSection: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  if (activeSection === 'services') {
    return <AdminServices />;
  }

  if (activeSection === 'projects') {
    return <AdminProjects />;
  }

  if (activeSection === 'lycka-home') {
    return <AdminLyckaHome />;
  }

  if (activeSection === 'lycka-home-comments') {
    return <AdminLyckaHomeComments />;
  }

  if (activeSection === 'media-interactions') {
    return <AdminMediaInteractions />;
  }

  if (activeSection === 'testimonials') {
    return <AdminTestimonials />;
  }

  if (activeSection === 'lycka-blog') {
    return <AdminLyckaBlog />;
  }

  if (activeSection === 'blog-comments') {
    return <AdminBlogComments />;
  }

  if (activeSection === 'statistics') {
    return <VisitorChart />;
  }

  return <AdminOverview />;
};

export default AdminContent;