import LoginView from "@/components/Auth/LoginView.vue";
import StudentDashboard from "@/components/studentView/StudentDashborad.vue";
import TeacherDashboard from "@/components/teacherView/TeacherDashborad.vue";
import StudentViewBody from "@/components/studentView/StudentViewBody.vue";
import AvailableExamList from "@/components/studentView/AvailableExamList.vue";
import ViewMaterial from "@/components/studentView/ViewMaterial.vue";
import Setting from "@/components/studentView/Setting.vue";
import SettingAccount from "@/components/studentView/SettingAccount.vue";
import SettingSecurity from "@/components/studentView/SettingSecurity.vue";
import TeacherViewBady from "@/components/teacherView/TeacherViewBady.vue";
import ExamManagement from "@/components/teacherView/ExamManagement.vue";
import NewExam from "@/components/teacherView/NewExam.vue";
import StudentResult from "@/components/teacherView/StudentResult.vue";
import EditExam from "@/components/teacherView/EditExam.vue";
import Exam from "@/components/studentView/Exam.vue";

export default [
      {
    path: "/",
    component: LoginView,
    meta: { layout: "auth" },
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: UnauthorizedPage,
  },
  {
    path: "/student-dashboard",
    name: "studentDashboard",
    component: StudentDashboard,
    meta: { layout: "dashboard" },
    children: [
      {
        path: "",
        name: "studentViewBody",
        component: StudentViewBody,
      },
      {
        path: "available-exam",
        component: AvailableExamList,
      },
      {
        path: "view-materails",
        component: ViewMaterial,
      },
      {
        path: "exam/:id",
        name:"StartExam",
        component: Exam,
      },
      {
        path: "settings",
        component: Setting,
        children: [
          {
            path: "account",
            component: SettingAccount,
          },
          {
            path: "security",
            component: SettingSecurity,
          },

        ],
      },
    ],
  },
  {
    path: "/teacher-dashboard",
    name: "teacherDashboard",
    component: TeacherDashboard,
    meta: { layout: "dashboard" },
    children: [
      {
        path: "",
        name: "teacherbody",
        component: TeacherViewBady,
      },
      {
        path: "ExamManagement",
        name: "ExamManagement",
        component: ExamManagement,
      },
      {
        path: "exam-management/new",
        name: "newExam",
        component: NewExam,
      },
      {
        path: "student-results",
        name: "studentResults",
        component: StudentResult,
      },
      {
        path: "edit/:id",
        name: "editExams",
        component: EditExam,
      }
    ],
  },
]