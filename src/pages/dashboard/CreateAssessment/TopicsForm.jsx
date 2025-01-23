import { Button } from "@/lib/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Eye, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { axiosGptInstance } from "@/utils/api/instances";
import { gptRoutes } from "@/utils/api/routes";
import { toast } from "@/lib/ui/use-toast";
import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { useNavigate } from "react-router-dom";

const TopicsForm = ({
  form,
  detailsForm,
  setQuestions,
  openPreviewQuestions,
  isQuestionsGenerated,
  setIsQuestionsGenerated,
}) => {
  const navigate = useNavigate();

  const [isGenerateQuestionLoading, setIsGenerateQuestionLoading] =
    useState(false);

  const [isSaveQuestionLoading, setIsSaveQuestionLoading] = useState(false);

  async function callApiWithRetry(topic_data, retries = 3) {
    const { id, topic, questionType, difficultyLevel, totalQuestions } =
      topic_data;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axiosGptInstance.post(
          questionType === "aptitude"
            ? gptRoutes.generateAptitude
            : gptRoutes.generateAssessment,
          {
            topic,
            question_type: questionType,
            difficulty: difficultyLevel,
            number_of_questions: Number(totalQuestions),
          }
        );

        const data = response.data;

        const newData = data.map((item, index) => {
          const options =
            item.options &&
            Array.isArray(item.options) &&
            item.options.length > 0 &&
            !item.options.includes(null)
              ? item.options.map((option, optionIndex) => ({
                  ...option,
                  id: optionIndex,
                }))
              : [];

          return { ...item, id: index, options };
        });

        return {
          id,
          topic,
          questionType,
          difficultyLevel,
          questions: newData || [],
          totalQuestions,
        };
      } catch (error) {
        console.error(
          `Attempt ${attempt} failed for topic ID ${topic.id}. Error:`,
          error
        );

        if (attempt === retries) {
          console.error(
            `All ${retries} attempts failed for topic ID ${topic.id}. Moving to the next topic.`
          );
          return error.message;
        }
      }
    }
  }

  const processTopics = async (topics) => {
    const results = [];

    for (const topic of topics) {
      const result = await callApiWithRetry(topic);
      results.push(result);
    }

    return results;
  };

  const getQuestions = async (values) => {
    const { topics } = values;

    await processTopics(topics)
      .then((results) => {
        console.log("All results:", results);
        const successfulResults = results.filter(
          (result) => typeof result !== "string"
        );
        setQuestions(successfulResults);
        setIsGenerateQuestionLoading(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description:
            error.response?.data?.message ||
            error.message ||
            "Internal server error",
        });
        setIsGenerateQuestionLoading(false);
      });
  };

  const onSubmit = async (values) => {
    setIsQuestionsGenerated(false);
    setIsGenerateQuestionLoading(true);
    await getQuestions(values);
    setIsQuestionsGenerated(true);
  };

  const handleSaveAssessment = async () => {
    setIsSaveQuestionLoading(true);
    try {
      const topics = form.getValues().topics;
      const { title, experience, designation, description } =
        detailsForm.getValues();

      const newTopicData = topics.map((topic) => {
        const { topic: topicName, questionType, difficultyLevel } = topic;
        const newQuestions = topic.questions.map((questionData) => {
          const { marks, time } = questionData;
          const newOptions = questionData.options.map((option) => {
            return {
              optionText: option.optionText,
              isCorrect: option.isCorrect,
            };
          });
          const { question } = questionData;
          return {
            question,
            options: newOptions,
            questionType,
            difficultyLevel,
            marks,
            time,
          };
        });
        return { name: topicName, questions: newQuestions };
      });

      const finalData = {
        title,
        experience: Number(experience),
        designation,
        description,
        topics: newTopicData,
        totalTopics: newTopicData.length,
      };

      await axiosServerInstance.post(serverRoutes.saveAssessment, finalData);
      setIsSaveQuestionLoading(false);
      navigate("/dashboard/manage-assessment");
      return;
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          err.response?.data?.message || err.message || "Internal server error",
      });
      setIsSaveQuestionLoading(false);
    }
  };

  const onChangeHandler = (id, name, value) => {
    const topics = form.getValues().topics;
    const newTopics = topics.map((item) => {
      if (item.id === id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    form.setValue("topics", newTopics);
  };

  const onRemoveHandler = (id) => {
    const topics = form.getValues().topics;
    const newTopics = topics.filter((item) => item.id !== id);
    form.setValue("topics", newTopics);
  };

  const onAddHandler = () => {
    setIsQuestionsGenerated(false);
    const topics = form.getValues().topics;
    const newTopic = {
      id: topics.length ? topics.length + 2 : 1,
      topic: "",
      questionType: "",
      difficultyLevel: "",
      totalQuestions: "",
    };
    form.setValue("topics", [...topics, newTopic]);
  };

  const topics = form.watch("topics");

  return (
    <div className="flex flex-col gap-5 p-5 bg-white border border-dashed rounded-lg">
      <h1 className="font-semibold">B. Topics Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Table className="bg-white">
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="w-[200px]">Question Type</TableHead>
                <TableHead className="w-[200px]">Difficulty Level</TableHead>
                <TableHead className="w-[150px]">Total Questions</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((item, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <FormField
                        name={`topics[${index}].topic`}
                        control={form.control}
                        defaultValue={item.topic}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <textarea
                                  {...field}
                                  value={field.value}
                                  placeholder="Enter Topics"
                                  className="ring-0 w-[100%] h-full outline-none border-none resize-none overflow-hidden"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    onChangeHandler(
                                      item.id,
                                      "topic",
                                      e.target.value
                                    );
                                  }}
                                  rows={3} // Number of rows can be adjusted based on preference
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <FormField
                        name={`topics[${index}].questionType`}
                        control={form.control}
                        defaultValue={item?.questionType}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  className="ring-0 outline-none border-none"
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                    onChangeHandler(item.id, "questionType", e);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="subjective">
                                      Subjective
                                    </SelectItem>
                                    <SelectItem value="mcq">MCQ</SelectItem>
                                    <SelectItem value="aptitude">
                                      Aptitude
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <FormField
                        name={`topics[${index}].difficultyLevel`}
                        control={form.control}
                        defaultValue={item?.difficultyLevel}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  className="ring-0 outline-none border-none"
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                    onChangeHandler(
                                      item.id,
                                      "difficultyLevel",
                                      e
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <FormField
                        name={`topics[${index}].totalQuestions`}
                        control={form.control}
                        defaultValue={item?.totalQuestions}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  className="ring-0 outline-none border-none"
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                    onChangeHandler(
                                      item.id,
                                      "totalQuestions",
                                      e
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="7">7</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-1"
                        onClick={() => openPreviewQuestions(item.id)}
                        disabled={!isQuestionsGenerated}
                      >
                        <Eye size="16" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-1"
                        onClick={() => onRemoveHandler(item.id)}
                      >
                        <Trash2 size="16" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center">
                  <Button
                    className="h-8 w-8 p-1"
                    onClick={onAddHandler}
                    variant="outline"
                  >
                    <Plus size="16" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-3">
            <Button variant="secondary" type="submit">
              {isGenerateQuestionLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Generate Questions"
              )}
            </Button>
            {isQuestionsGenerated && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAssessment}
              >
                {isSaveQuestionLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Save Assessment"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TopicsForm;
