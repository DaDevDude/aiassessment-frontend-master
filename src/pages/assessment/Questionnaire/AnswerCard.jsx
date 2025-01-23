import { Button } from "@/lib/ui/button";
import { QuestionType } from "@/utils/constants/questionType";
import Subjective from "./Subjective";
import MultipleChoice from "./MultipleChoice";
import Title from "@/components/shared/Title";
import LoadingSpinner from "@/components/shared/LoaderSpinner";

const AnswerCard = ({
  id,
  isLastQuestion,
  onSubmit,
  handlePrevious,
  handleNext,
  questionType,
  answerText,
  handleChangeAnswerText,
  selectOptionId,
  setSelectOptionId,
  options,
  isLoading,
  isReportLoading,
}) => {
  const title =
    questionType == QuestionType.SUBJECTIVE ? "Your Answer:" : "Choose option:";
  return (
    <div className="w-1/2 h-full flex flex-col justify-between gap-2">
      <div className="h-[calc(100%-40px)] bg-white flex flex-col rounded-xl border border-gray-300">
        <Title
          title={title}
          className="text-lg font-semibold p-4 border-b border-gray-300 text-primary"
        />
        {questionType == QuestionType.SUBJECTIVE && (
          <Subjective value={answerText} onChange={handleChangeAnswerText} />
        )}
        {(questionType == QuestionType.MCQ ||
          questionType == QuestionType.APTITUDE) && (
          <MultipleChoice
            selectOptionId={selectOptionId}
            setSelectOptionId={setSelectOptionId}
            options={options}
          />
        )}
      </div>
      <div className="h-10 flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          className="text-primary hover:text-primary"
          onClick={() => handlePrevious(id)}
        >
          Previous Question
        </Button>
        {isLastQuestion ? (
          <Button
            size="sm"
            disabled={isLoading || isReportLoading}
            onClick={() => onSubmit(id)}
          >
            {isLoading ? <LoadingSpinner /> : "Submit"}
          </Button>
        ) : (
          <Button size="sm" onClick={() => handleNext(id)}>
            Save & Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnswerCard;
