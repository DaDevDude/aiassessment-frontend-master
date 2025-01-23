import SnowMan from "@/assets/snow_man.svg";
import Title from "@/components/shared/Title";

const AssessmentCompleted = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
      <img src={SnowMan} />
      <div className="text-center">
        <Title
          title="Assessment Completed !!"
          className="font-medium text-3xl"
        />
        <p>Thank you for giving the test , We will get back to you soon !</p>
      </div>
    </div>
  );
};

export default AssessmentCompleted;
