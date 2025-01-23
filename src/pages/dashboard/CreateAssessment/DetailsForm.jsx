import { Button } from "@/lib/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { Badge } from "@/lib/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { axiosGptInstance } from "@/utils/api/instances";
import { gptRoutes } from "@/utils/api/routes";
import { toast } from "@/lib/ui/use-toast";
import Title from "@/components/shared/Title";
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";

const DetailsForm = ({ form, setTopics, setIsQuestionsGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getTopics = async (value) => {
    setIsLoading(true);
    setIsQuestionsGenerated(false);

    // Clear previous topics
    setTopics([]);

    const {
      experience,
      questionType,
      designation,
      skills,
      description,
      totalTopics,
    } = value;
    try {
      const response = await axiosGptInstance.post(gptRoutes.generateTopic, {
        experience: experience,
        job_designation: designation,
        skills: skills.join(","),
        job_description: description,
        number_of_topics: Number(totalTopics),
        question_type: questionType,
      });

      const data = response.data;

      // Fix required
      const newData = data.map((item, index) => {
        // format the data here....
        return {
          id: index,
          topic: item.topic_name,
          questionType: item.question_type.toLowerCase(),
          difficultyLevel: "medium",
          totalQuestions: "10",
        };
      });

      // Set new topics
      setTopics(newData);
      setIsLoading(false);
    } catch (err) {
      toast({
        description:
          err.response?.data?.message || err.message || "Internal server error",
      });
      setIsLoading(false);
    }
  };

  function onSubmit(values) {
    getTopics(values);
  }

  const handleInputKeyDown = (e, field) => {
    if (e.key === "Enter" && field.name === "skills") {
      e.preventDefault();
      const tagInput = e.target;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 50) {
          return form.setError("skills", {
            type: "required",
            message: "Skill must be less than 50 characters.",
          });
        }
        // checking if tagValue doest exists already
        if (!field.value.includes(tagValue)) {
          const tagValue_ = tagValue[0].toUpperCase() + tagValue.slice(1);
          form.setValue("skills", [...field.value, tagValue_]);
          tagInput.value = "";
          form.clearErrors("skills");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (skill, field) => {
    const newSkills = field.value.filter((s) => s !== skill);
    form.setValue("skills", newSkills);
  };

  const handleQuestionTypeChange = (type, field) => {
    const currentTypes = field.value
      ? field.value.split(",").map((t) => t.trim())
      : [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    form.setValue("questionType", updatedTypes.join(", "));
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-white border border-dashed rounded-lg">
      <Title title="A. Assessment Details" className="font-semibold" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Description</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Experience"
                    min="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem className="space-y-1 col-span-1">
                <FormLabel className="text-black">Skills</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <Input
                      type="text"
                      placeholder="Add skills"
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        {field.value.map((skill) => (
                          <Badge
                            key={skill}
                            onClick={() => {}}
                            className="flex gap-2 bg-[#2F8D8C] hover:bg-[#2F8D8C]/80"
                          >
                            {skill}
                            <X
                              size="14"
                              className="cursor-pointer"
                              onClick={() => handleTagRemove(skill, field)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalTopics"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Total Topics</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        {field.value ? `${field.value}` : "Total topics"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-full max-h-48 overflow-y-auto"
                      style={{ width: "100%" }}
                    >
                      {Array.from({ length: 21 }, (_, i) => i + 5).map(
                        (num) => (
                          <DropdownMenuItem
                            key={num}
                            onClick={() => field.onChange(String(num))} // Convert number to string here
                          >
                            {num}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questionType"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-black">Question Type</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          {"Select question type"}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-full max-h-48 overflow-y-auto"
                        style={{ width: "100%" }}
                      >
                        {["MCQ", "Subjective", "Aptitude"].map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() =>
                              handleQuestionTypeChange(type, field)
                            }
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-wrap gap-2">
                      {field.value
                        ? field.value.split(",").map((type, index) => (
                            <Badge
                              key={index}
                              className="flex items-center gap-2 bg-[#2F8D8C] hover:bg-[#2F8D8C]/80"
                            >
                              {type.trim()}
                              <X
                                size="14"
                                className="cursor-pointer"
                                onClick={() =>
                                  handleQuestionTypeChange(type.trim(), field)
                                }
                              />
                            </Badge>
                          ))
                        : null}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full mt-2 items-center">
            <Button disabled={isLoading} variant="secondary" type="submit">
              {isLoading ? <LoadingSpinner /> : "Generate Topics"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DetailsForm;
