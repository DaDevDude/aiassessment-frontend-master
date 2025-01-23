import OutlinedBadge from "@/components/shared/OutlinedBadge";
import { Button } from "@/lib/ui/button";

const QuestionCard = ({
  id,
  questionType,
  question,
  isMarkedForReview,
  handleMarkForReview,
}) => {
  return (
    <div className="w-1/2 h-full bg-white flex flex-col rounded-lg border border-gray-300">
      <div className="flex justify-between p-4 border-b border-gray-300">
        <OutlinedBadge
          title="Question Type"
          description={
            questionType === "subjective"
              ? "Subjective"
              : "mcq"
              ? "MCQ"
              : "Aptitude"
          }
          mainClassName="text-sm inline-block !p-1 !pl-3 !pr-3 border-none !bg-gray-200 text-gray-700"
        />
        <Button
          size="sm"
          variant="outline"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
          onClick={() => handleMarkForReview(id, !isMarkedForReview)}
        >
          {isMarkedForReview ? "Remove Mark for Review" : "Mark for Review"}
        </Button>
      </div>
      <p className="h-full overflow-y-scroll p-4">{question}</p>
    </div>
  );
};

export default QuestionCard;
