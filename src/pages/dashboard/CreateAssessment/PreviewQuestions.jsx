import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/ui/dialog";
import { useState } from "react";

const PreviewQuestions = ({
  isPreviewQuestionOpen,
  previewQuestionTopicDetails,
  closePreviewQuestions,
}) => {
  const [state, setState] = useState(0);

  const { difficultyLevel, questionType, questions, topic } =
    previewQuestionTopicDetails;

  const handlePrev = () => {
    if (state > 0) {
      setState((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (state < questions.length - 1) {
      setState((prev) => prev + 1);
    }
  };

  const { question, options } = questions[state];

  return (
    <Dialog open={isPreviewQuestionOpen} onOpenChange={closePreviewQuestions}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Topic</DialogTitle>
          <DialogDescription className>{topic}</DialogDescription>
          <div className="flex gap-2 uppercase m-[-3px]">
            <Badge variant="secondary">{difficultyLevel}</Badge>
            <Badge variant="secondary">{questionType}</Badge>
          </div>
        </DialogHeader>

        <div className="text-sm flex flex-col gap-2">
          <h1 className="font-medium">{question}</h1>
          <ul>
            {options &&
              options.map((option) => {
                return (
                  <li
                    key={option.id}
                    className={`${
                      option.isCorrect ? "text-green-700" : "text-slate-500"
                    }`}
                  >
                    {option.optionText}
                  </li>
                );
              })}
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handlePrev} variant="outline">
            Prev
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewQuestions;
