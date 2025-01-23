const OutlinedBadge = ({
  icon,
  title,
  description,
  mainClassName,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div
      className={`bg-white p-2 pl-3 pr-3 rounded-md border flex items-center gap-1 ${mainClassName}`}
    >
      <span>{icon}</span>
      <span className={`font-semibold ${titleClassName}`}>{title}</span> :{" "}
      <span className={`${descriptionClassName}`}>{description}</span>
    </div>
  );
};

export default OutlinedBadge;
