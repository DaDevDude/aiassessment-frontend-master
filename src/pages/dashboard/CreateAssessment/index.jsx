import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assessmentDetailsSchema,
  assessmentTopicsSchema,
} from "@/utils/validations";
import Title from "@/components/shared/Title";
import DetailsForm from "./DetailsForm";
import TopicsForm from "./TopicsForm";
import PreviewQuestions from "./PreviewQuestions";

const CreateAssessment = () => {
  const [isPreviewQuestionOpen, setIsPreviewQuestionOpen] = useState(false);
  const [previewQuestionTopicDetails, setPreviewQuestionsDetails] =
    useState(null);
  const [isQuestionsGenerated, setIsQuestionsGenerated] = useState(false);

  const detailsForm = useForm({
    resolver: zodResolver(assessmentDetailsSchema),
    defaultValues: {
      title: "",
      experience: "",
      designation: "",
      skills: [],
      description: "",
      totalTopics: "",
      questionType: "",
    },
  });

  const topicsForm = useForm({
    resolver: zodResolver(assessmentTopicsSchema),
    defaultValues: {
      topics: [],
    },
  });

  const handleSetTopics = (data) => {
    topicsForm.setValue("topics", data);
  };

  const openPreviewQuestions = (topicId) => {
    const topics = topicsForm.getValues().topics;
    const topicDetailById = topics.find((topic) => topic.id === topicId);
    setIsPreviewQuestionOpen(true);
    setPreviewQuestionsDetails(topicDetailById);
  };

  const closePreviewQuestions = () => {
    setIsPreviewQuestionOpen(false);
    setPreviewQuestionsDetails(null);
  };

  const { topics } = topicsForm.watch();

  return (
    <div className="flex flex-col gap-10">
      <Title title="Create New Assessment" className="text-2xl" />
      <DetailsForm
        form={detailsForm}
        setTopics={handleSetTopics}
        isQuestionsGenerated={isQuestionsGenerated}
        setIsQuestionsGenerated={setIsQuestionsGenerated}
      />
      {topics.length > 0 && (
        <TopicsForm
          form={topicsForm}
          detailsForm={detailsForm}
          setQuestions={handleSetTopics}
          openPreviewQuestions={openPreviewQuestions}
          isQuestionsGenerated={isQuestionsGenerated}
          setIsQuestionsGenerated={setIsQuestionsGenerated}
        />
      )}
      {previewQuestionTopicDetails && (
        <PreviewQuestions
          isPreviewQuestionOpen={isPreviewQuestionOpen}
          previewQuestionTopicDetails={previewQuestionTopicDetails}
          closePreviewQuestions={closePreviewQuestions}
        />
      )}
    </div>
  );
};

export default CreateAssessment;
