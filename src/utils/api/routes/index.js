const serverRoutes = {
  // AUTHENTICATION
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  getProfile: "/api/auth/profile",
  saveAssessment: "/api/assessment/save",
  // ASSESSMENT
  getAssessmentDetails: "/api/assessment/details/",
  generateAssessment: "/api/candidate/generate-test/",
  getAssessmentReportByCookie: "/api/candidate/get-test",
  changeProctoringStatus: "/api/proctor",
  saveAnswer: "/api/answer/",
  submitAssessment: "/api/candidate/submit-test/",
  submitVideoUrl: "/api/proctor/submit-videouri/",
  // Upload File
  uploadResume: "/api/app/upload-file/resume",
  uploadCandidatePhoto: "/api/app/upload-file/candidate_photo",
  downloadResume: "/api/app/download",
  // Manage Assessment
  deleteAssessment: "/api/assessment/",
  getReport: "/api/report/",
  // Proctor
};

const gptRoutes = {
  generateTopic: "/api/gpt/generate-topics",
  generateAssessment: "/api/gpt/generate-assessment",
  generateAptitude: "/api/gpt/generate-aptitude-mcqs",

  validateSubjectiveAnswers: "/api/gpt/validate-answers",
};

export { serverRoutes, gptRoutes };
