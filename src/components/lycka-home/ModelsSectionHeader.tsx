
import InViewAnimator from "../animators/InViewAnimator";

interface ModelsSectionHeaderProps {
  title: string;
  description: string;
}

const ModelsSectionHeader = ({ title, description }: ModelsSectionHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <InViewAnimator>
        <h2 className="mb-4">{title}</h2>
      </InViewAnimator>
      <InViewAnimator delay={0.1}>
        <p className="text-gray-700 max-w-3xl mx-auto">
          {description}
        </p>
      </InViewAnimator>
    </div>
  );
};

export default ModelsSectionHeader;
