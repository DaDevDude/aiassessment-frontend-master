const Subjective = ({ value, onChange }) => {
  return (
    <div className="w-full h-full overflow-scroll p-4">
      <textarea
        value={value}
        onChange={onChange}
        className="border-none outline-none w-full h-full"
      />
    </div>
  );
};

export default Subjective;
