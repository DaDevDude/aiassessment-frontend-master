import { useDispatch } from "react-redux";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";
import { saveAnswer } from "@/redux/slices/assessment/thunk";
import { Fragment, useEffect, useState } from "react";
import { QuestionType } from "@/utils/constants/questionType";
import Pagination from "./Pagination";

const QuestionAnswerCard = ({
  report,
  handleSubmit,
  isLoading,
  isReportLoading,
}) => {
  const dispatch = useDispatch();

  const [state, setState] = useState(0);
  const answer = report.answers[state];
  const [selectOptionId, setSelectOptionId] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const { id, providedAnswer, selectedOptionId, markedForReview, Question } =
    answer;
  const { questionType, question, Options } = Question;

  const handleMarkForReview = async (id, isMarkedForReview) => {
    dispatch(
      saveAnswer({
        answerId: id,
        answer: { markedForReview: isMarkedForReview },
      })
    );
  };

  const handleSaveAnswer = async (answerId, answer) => {
    dispatch(saveAnswer({ answerId, answer }));
  };

  const handleChangeAnswerText = (e) => {
    setAnswerText(e.target.value);
  };

  const handleSetSelectOptionId = (id) => {
    setSelectOptionId(id);
  };

  const getAnswerData = (id) => {
    if (questionType == QuestionType.SUBJECTIVE) {
      if (answerText === providedAnswer) {
        return null;
      } else {
        const answer = { providedAnswer: answerText };
        return { id, answer };
      }
    } else if (
      questionType == QuestionType.MCQ ||
      questionType == QuestionType.APTITUDE
    ) {
      if (selectedOptionId === selectOptionId) {
        return null;
      } else {
        const answer = { selectedOptionId: selectOptionId };
        return { id, answer };
      }
    }
  };

  const handlePrevious = (id) => {
    if (state > 0) {
      const data = getAnswerData(id);
      if (data !== null) {
        const { id, answer } = data;
        handleSaveAnswer(id, answer);
      }
      setState(state - 1);
    }
  };

  const handleNext = (id) => {
    if (state < report.answers.length - 1) {
      const data = getAnswerData(id);
      if (data !== null) {
        const { id, answer } = data;
        handleSaveAnswer(id, answer);
      }
      setState(state + 1);
    }
  };

  const onSubmit = async (id) => {
    let answer = {};
    if (questionType == QuestionType.SUBJECTIVE) {
      answer.providedAnswer = answerText;
    } else if (
      questionType == QuestionType.MCQ ||
      questionType == QuestionType.APTITUDE
    ) {
      answer.selectedOptionId = selectOptionId;
    }
    await dispatch(saveAnswer({ answerId: id, answer }));
    handleSubmit();
  };

  useEffect(() => {
    setSelectOptionId(selectedOptionId);
  }, [id, selectedOptionId]);

  useEffect(() => {
    setAnswerText(providedAnswer);
  }, [id, providedAnswer]);

  const itemForPagination = report.answers.map((item, index) => {
    return { page: index, ...item };
  });

  return (
    <Fragment>
      <Pagination
        items={itemForPagination}
        currentPage={state}
        changeCurrentPage={setState}
      />
      <div className="bg-gray-100 w-full h-[66vh] flex gap-4 p-4">
        <QuestionCard
          id={id}
          questionType={questionType}
          question={question}
          isMarkedForReview={markedForReview}
          handleMarkForReview={handleMarkForReview}
        />
        <AnswerCard
          id={id}
          isLastQuestion={report.answers.length - 1 === state}
          onSubmit={onSubmit}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          questionType={questionType}
          answerText={answerText}
          handleChangeAnswerText={handleChangeAnswerText}
          selectOptionId={selectOptionId}
          setSelectOptionId={handleSetSelectOptionId}
          options={Options}
          isLoading={isLoading}
          isReportLoading={isReportLoading}
        />
      </div>
    </Fragment>
  );
};

export default QuestionAnswerCard;
