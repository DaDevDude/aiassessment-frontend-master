import { Button } from "@/lib/ui/button";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SnowMan from "@/assets/snow_man.svg";
import { MoveLeft } from "lucide-react";
import { ScrollArea } from "@/lib/ui/scroll-area";
import {
  clearValidateSubjectiveAnswerDetailsState,
  downloadResume,
  getReport,
  validateSubjectiveAnswers,
} from "@/redux/slices/reports";
import { useDispatch, useSelector } from "react-redux";
import { axiosGptInstance } from "@/utils/api/instances";
import { gptRoutes } from "@/utils/api/routes";
import {
  updateFeedback,
  clearreportDataDetailsState,
} from "@/redux/slices/reports";
// import { downloadResume } from "@/redux/slices/reports";

const CandidateTestReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  let i = 0;
  const { reportDetails, assessmentDetails } = location.state || {};
  const { data, isSuccess, isLoading } = useSelector(
    (state) => state.reports.reportDataDetails
  );
  const { url, isSuccess: isResumeSuccess } = useSelector(
    (state) => state.reports.resumeDetails
  );
  const { feedbacks } = useSelector(
    (state) => state.reports.validateSubjectiveAnswersDetails
  );

  const feedbacksArray = [];
  console.log("feedbacks", feedbacks);
  // console.log("data",data);

  useEffect(() => {
    const handleValidateAnswers = async (
      question,
      answer,
      marksOutOf,
      index
    ) => {
      try {
        console.log("answer =>", answer);
        if (answer === "") {
          const tempFeedback = { feedback: "No Feedback", score: 0 };
          dispatch(updateFeedback({ index, feedback: tempFeedback })); // Modify feedbacks directly for empty answers
        } else {
          const response = await dispatch(
            validateSubjectiveAnswers({
              question: question,
              answer: answer,
              marksOutOf: marksOutOf,
              id: index,
            })
          );
          console.log("response", response);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };

    if (isSuccess && !isLoading) {
      dispatch(clearreportDataDetailsState());
      dispatch(clearValidateSubjectiveAnswerDetailsState());
      console.log("data before starting loop:", data);
      console.log("feedbacks before starting loop:", feedbacks);
      data.answers.map((ans, index) => {
        if (ans.Question.questionType === "subjective") {
          const question = ans.Question.question;
          const answer = ans.providedAnswer;
          const marksOutOf = ans.Question.marks;
          handleValidateAnswers(question, answer, marksOutOf, index);
        }
      });
    }
  }, []);

  const handleDownloadResumeClick = async () => {
    try {
      const resumeUrl = data?.candidate?.resume;
      console.log("resumeUrl", resumeUrl);
      let originalResumeUrl =
        "s3://dev-ai-assessment/resume/" + resumeUrl.split("resume/")[1];
      console.log("original Url", originalResumeUrl);
      const response = await dispatch(downloadResume(originalResumeUrl));
      console.log("response", response);
      if (response.payload.status === "success") {
        window.open(response.payload.data, "_blank");
      }
    } catch (error) {
      console.log("ERRor", error);
    }
    // console.log("resumeUrl", resumeUrl);
    // if(isResumeSuccess) {
    // } else{
    //   console.log("fetching error")
    // }
  };

  return (
    <div className="mx-2">
      <Button
        variant="ghost"
        className="hover:bg-slate-50 text-primary pl-0"
        onClick={() => {
          navigate(-1);
        }}
      >
        <MoveLeft className="mr-2 mt-0.5" />
        <p>Previous Page </p>
      </Button>
      <h2 className="text-muted-foreground text-xl my-2">
        Test Assessment Report
      </h2>
      <div className="flex flex-row align-center justify-between mb-5">
        <h2 className="text-foreground font-semibold text-3xl">
          Onelab Ventures | {assessmentDetails.designation}
        </h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className=" text-primary"
            onClick={handleDownloadResumeClick}
          >
            Download Resume
          </Button>
          <Button>Download Report</Button>
        </div>
      </div>
      <section className="grid grid-cols-3 gap-4 h-[650px]">
        <div className="px-1">
          <section className="bg-white border rounded-xl p-4 text-2xl mb-4">
            <img src={SnowMan} />
          </section>
          <section className="bg-white border rounded-xl p-4 text-2xl mb-4">
            <h2 className="text-foreground font-lg border-b pb-2">
              Candidate Information
            </h2>
            <h2 className="text-muted-foreground text-xl mt-2">
              Candidate Name:
            </h2>
            <h3 className="text-foreground font-semibold text-2xl mb-2">
              {reportDetails.candidate.name}
            </h3>
            <h2 className="text-muted-foreground">Candidate Email Address:</h2>
            <h3 className="text-foreground font-semibold text-2xl mb-2">
              {reportDetails.candidate.email}
            </h3>
            <h2 className="text-muted-foreground">LinkedIn Profile URL:</h2>
            <h3 className="text-foreground font-semibold text-2xl mb-2">
              {reportDetails.candidate.linkedin || "-"}
            </h3>
          </section>
        </div>
        <div>
          <section className="bg-white border rounded-xl p-4 text-2xl mb-4">
            <h2 className="text-foreground font-lg border-b pb-2">
              Test Summary
            </h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              <div className="my-2">
                <h2 className="text-muted-foreground text-xl">
                  Total Questions:
                </h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.testSummary?.totalQuestions}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-primary text-xl">Correct Answers:</h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.testSummary?.correctAnswers}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-destructive text-xl">Incorrect Answers:</h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.testSummary?.incorrectAnswers}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-yellow-500 text-xl">Percentage:</h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.testSummary?.percentage} %
                </p>
              </div>
            </div>
          </section>
          <section className="bg-white border rounded-xl p-4 text-2xl">
            <h2 className="text-foreground font-lg border-b pb-2">
              Proctoring Details
            </h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              <div className="my-2">
                <h2 className="text-muted-foreground text-xl">Tab Switched:</h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.proctor?.tabSwitched}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-muted-foreground text-xl">Out of Frame:</h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.proctor?.outOfFrame}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-muted-foreground text-xl">
                  Full Screen Exit:
                </h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.proctor?.fullScreenExited || 0}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-muted-foreground text-xl">
                  External Monitor:
                </h2>
                <p className="text-foreground text-4xl font-semibold">
                  {data?.proctor?.externalMonitorDetected || 0}
                </p>
              </div>
              <div className="my-2">
                <h2 className="text-gray-500 text-xl">Video URL:</h2>
                <p className="text-black-500 text-xl font-semibold">
                  
                  {data?.proctor?.videoUrl && (
                    <a
                      href={data?.proctor?.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      view video
                    </a>
                  )}
                  <br />
                  {data?.proctor?.videoChunks.length > 0
                    ? data?.proctor?.videoChunks.map((i, _i) => (
                        <>
                          <a
                            href={i.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {_i}
                          </a>{" "}
                        </>
                      ))
                    : "No video available"}
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="max-h-[650px]">
          <section className="bg-white border rounded-2xl p-4 text-2xl mb-4">
            <h2 className="text-foreground font-lg border-b pb-2">
              Skills Summary
            </h2>
            <ScrollArea className="h-[430px]">
              <p className="text-muted-foreground text-xl">Strong Skills:</p>
              <div className="flex flex-wrap">
                {data?.skillSections?.good.length ? (
                  data?.skillSections?.good?.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-primary px-2.5 py-2.5 rounded-2xl m-2 text-white text-xs"
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-lg">N/A</p>
                )}
              </div>
              <p className="text-muted-foreground text-xl">
                Scope of Improvement:
              </p>
              <div className="flex flex-wrap">
                {data?.skillSections?.bad ? (
                  data?.skillSections?.bad?.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-[#AAB9C5] px-2.5 py-2.5 rounded-2xl m-2 text-white text-xs"
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-lg">N/A</p>
                )}
              </div>
            </ScrollArea>
          </section>
          <section className="border rounded-2xl p-4 text-2xl mt-2 h-28">
            <h2 className="text-foreground font-lg border-b pb-2">
              Total Assessment Time
            </h2>
            <p className="text-foreground font-semibold text-4xl">1:44:24</p>
          </section>
        </div>
      </section>

      {/* Detailed Report Section */}
      <section className="">
        <h2 className="text-foreground text-2xl font-semibold pb-2 my-4">
          Detailed Report
        </h2>
        {data?.answers?.map((answer, index) => {
          let feedback = null;
          let score = 0;
          if (answer.Question.questionType === "subjective") {
            feedback = feedbacks[i]?.feedback;
            score = feedbacks[i]?.score;
            i++;
          }
          return (
            <section className="flex gap-4">
              <section className="bg-white border rounded-xl p-4 text-2xl mb-2 w-3/4">
                {answer.Question.questionType === "subjective" ? (
                  <div className="flex flex-row justify-between border-b pb-2">
                    <div>Question: {index + 1}</div>
                    <div className="flex text-base gap-4">
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Ideal Time
                        </h2>
                        <h2>{answer.Question.time + " mins"}</h2>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Correct
                        </h2>
                        <h2>
                          {score / answer.Question.marks > 0.5 ? "Yes" : "No"}
                        </h2>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Score
                        </h2>
                        <h2>{score + "/" + answer.Question.marks}</h2>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row justify-between border-b pb-2">
                    <div>Question: {index + 1}</div>
                    <div className="flex text-base gap-4">
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Ideal Time
                        </h2>
                        <h2>{answer.Question.time + " mins"}</h2>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Correct
                        </h2>
                        <h2>{answer.isCorrect ? "Yes" : "No"}</h2>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground font-semibold">
                          Score
                        </h2>
                        <h2>{answer.isCorrect ? answer.Question.marks : 0}</h2>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-lg pb-2 my-2  mt-4">
                  {answer.Question.question}
                </p>
                <p>
                  {answer.Question.questionType === "subjective" && (
                    <div>
                      <p className="text-primary font-medium text-2xl">
                        Response:{" "}
                      </p>
                      <p className="text-base">{answer.providedAnswer}</p>
                    </div>
                  )}
                </p>
                <p>
                  {(answer.Question.questionType === "mcq" ||
                    answer.Question.questionType === "aptitude") && (
                    <div>
                      <section className="flex align-center justify-between">
                        <p className="text-primary font-medium text-2xl">
                          Response:
                        </p>
                        <div className="flex align-center justify-center gap-2">
                          <div className="w-11 rounded-xl h-2 bg-primary self-center"></div>
                          <p className="text-xl">Correct Answer</p>
                          <div className="w-11 rounded-xl h-2 bg-destructive self-center ml-2"></div>
                          <p className="text-xl">Incorrect Answer</p>
                        </div>
                      </section>
                      <div>
                        {answer?.Question?.Options?.map((item) => {
                          let borderColor, dotColor;
                          if (item.isCorrect) {
                            borderColor = "border-primary";
                            dotColor = "bg-primary";
                          } else if (
                            !answer.isCorrect &&
                            answer.selectedOptionId === item.id
                          ) {
                            borderColor = "border-destructive";
                            dotColor = "bg-destructive";
                          } else {
                            borderColor = "border-gray-300";
                            dotColor = "bg-muted-foreground";
                          }

                          return (
                            <p
                              className={`text-base flex align-center justify-start border rounded-sm p-2 my-2 ${borderColor}`}
                            >
                              <div className="w-6 h-6 border border-muted-foreground rounded-full flex align-center justify-center mr-4">
                                <div
                                  className={`mt-1.5 w-2.5 h-2.5 rounded-full ${dotColor}`}
                                ></div>
                              </div>
                              {item.optionText}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </p>
              </section>
              {/* <section className="w-1/4 bg-muted"> */}
              {answer.Question.questionType === "subjective" && (
                <section className="w-1/4 bg-muted p-2 rounded-md">
                  <p className="text-primary text-2xl font-semibold border-b pb-2">
                    Feedback :
                  </p>
                  <p>{feedback && feedback}</p>
                </section>
              )}
              {/* </section> */}
            </section>
          );
        })}
      </section>
      {/* <section>
        <div className="bg-[hsl(179,100%,100%)] p-3">--background: hsl(179, 100%, 100%)</div>
        <div className="bg-[hsl(179,5%,10%)] p-3">--foreground: hsl(179, 5%, 10%)</div>
        <div className="bg-[hsl(179,50%,100%)] p-3">--card: hsl(179, 50%, 100%)</div>
        <div className="bg-[hsl(179,5%,15%)] p-3">--card-foreground: hsl(179, 5%, 15%)</div>
        <div className="bg-[hsl(179,100%,100%)] p-3">--popover: hsl(179, 100%, 100%)</div>
        <div className="bg-[hsl(179,100%,10%)] p-3">--popover-foreground: hsl(179, 100%, 10%)</div>
        <div className="bg-[hsl(179,49.7%,39%)] p-3">--primary: hsl(179, 49.7%, 39%)</div>
        <div className="bg-[hsl(0,0%,100%)] p-3">--primary-foreground: hsl(0, 0%, 100%)</div>
        <div className="bg-[hsl(179,30%,90%)] p-3">--secondary: hsl(179, 30%, 90%)</div>
        <div className="bg-[hsl(0,0%,0%)] p-3">--secondary-foreground: hsl(0, 0%, 0%)</div>
        <div className="bg-[hsl(141,30%,95%)] p-3">--muted: hsl(141, 30%, 95%)</div>
        <div className="bg-[hsl(179,5%,40%)] p-3">--muted-foreground: hsl(179, 5%, 40%)</div>
        <div className="bg-[hsl(141,30%,90%)] p-3">--accent: hsl(141, 30%, 90%)</div>
        <div className="bg-[hsl(179,5%,15%)] p-3">--accent-foreground: hsl(179, 5%, 15%)</div>
        <div className="bg-[hsl(0,100%,50%)] p-3">--destructive: hsl(0, 100%, 50%)</div>
        <div className="bg-[hsl(179,5%,100%)] p-3">--destructive-foreground: hsl(179, 5%, 100%)</div>
        <div className="bg-[hsl(179,30%,82%)] p-3">--border: hsl(179, 30%, 82%)</div>
        <div className="bg-[hsl(179,30%,50%)] p-3">--input: hsl(179, 30%, 50%)</div>
        <div className="bg-[hsl(179,49.7%,39%)] p-3">--ring: hsl(179, 49.7%, 39%)</div>

        <h2>Dark Mode</h2>
        <div className="bg-[hsl(179,50%,10%)] p-3">--background: hsl(179, 50%, 10%)</div>
        <div className="bg-[hsl(179,5%,100%)] p-3">--foreground: hsl(179, 5%, 100%)</div>
        <div className="bg-[hsl(179,50%,10%)] p-3">--card: hsl(179, 50%, 10%)</div>
        <div className="bg-[hsl(179,5%,100%)] p-3">--card-foreground: hsl(179, 5%, 100%)</div>
        <div className="bg-[hsl(179,50%,5%)] p-3">--popover: hsl(179, 50%, 5%)</div>
        <div className="bg-[hsl(179,5%,100%)] p-3">--popover-foreground: hsl(179, 5%, 100%)</div>
        <div className="bg-[hsl(179,49.7%,39%)] p-3">--primary: hsl(179, 49.7%, 39%)</div>
        <div className="bg-[hsl(0,0%,100%)] p-3">--primary-foreground: hsl(0, 0%, 100%)</div>
        <div className="bg-[hsl(179,30%,20%)] p-3">--secondary: hsl(179, 30%, 20%)</div>
        <div className="bg-[hsl(0,0%,100%)] p-3">--secondary-foreground: hsl(0, 0%, 100%)</div>
        <div className="bg-[hsl(141,30%,25%)] p-3">--muted: hsl(141, 30%, 25%)</div>
        <div className="bg-[hsl(179,5%,65%)] p-3">--muted-foreground: hsl(179, 5%, 65%)</div>
        <div className="bg-[hsl(141,30%,25%)] p-3">--accent: hsl(141, 30%, 25%)</div>
        <div className="bg-[hsl(179,5%,95%)] p-3">--accent-foreground: hsl(179, 5%, 95%)</div>
        <div className="bg-[hsl(0,100%,50%)] p-3">--destructive: hsl(0, 100%, 50%)</div>
        <div className="bg-[hsl(179,5%,100%)] p-3">--destructive-foreground: hsl(179, 5%, 100%)</div>
        <div className="bg-[hsl(179,30%,50%)] p-3">--border: hsl(179, 30%, 50%)</div>
        <div className="bg-[hsl(179,30%,50%)] p-3">--input: hsl(179, 30%, 50%)</div>
        <div className="bg-[hsl(179,49.7%,39%)] p-3">--ring: hsl(179, 49.7%, 39%)</div>
      </section> */}
    </div>
  );
};
export default CandidateTestReport;
