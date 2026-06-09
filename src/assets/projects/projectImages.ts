// ─── WMS ─────────────────────────────────────────────────────────────────────
import wmsCover from "./WMS/cover.webp";
import wmsAnalytics from "./WMS/Analytics.webp";
import wmsOrdersDashboard from "./WMS/Orders Dashboard.webp";
import wmsOrderPrep from "./WMS/Order Prep.webp";
import wmsReturnsCenter from "./WMS/Returns Center.webp";
import wmsCycleCount from "./WMS/Cycle Count.webp";
import wmsDriver from "./WMS/Driver.webp";
import wmsReports from "./WMS/Reports.webp";
import wmsResponsive from "./WMS/Responsive.webp";

// ─── Ertiqaa ──────────────────────────────────────────────────────────────────
import ertiqaaCover from "./Ertiqaa/cover.webp";
import ertiqaaMp4 from "./Ertiqaa/fullScreen.mp4";
import ertiqaaLessonPlayer from "./Ertiqaa/Lesson Player screen.webp";
import ertiqaaStudentProgress from "./Ertiqaa/Student Units Progress.webp";
import ertiqaaContentManagement from "./Ertiqaa/Teacher Content Management.webp";
import ertiqaaTeacherReports from "./Ertiqaa/Teacher Reports Dashboard.webp";
import ertiqaaCertificateBuilder from "./Ertiqaa/Certificate Builder.webp";
import ertiqaaResponsive from "./Ertiqaa/Responsive showcase.webp";

// ─── Haya ─────────────────────────────────────────────────────────────────────
import hayaCover from "./Haya/cover.webp";
import hayaMp4 from "./Haya/fullScreen.mp4";
import hayaInteractiveActivity from "./Haya/Interactive Activity.webp";
import hayaAnalyticsDashboard from "./Haya/Analytics Dashboard.webp";
import hayaActivityCategories from "./Haya/Activity Categories.webp";
import hayaManageActivities from "./Haya/Manage Activities.webp";
import hayaStudentLessons from "./Haya/Student Lessons.webp";
import hayaResponsive from "./Haya/05.webp";

// ─── Mrs. Ayat Asaad ──────────────────────────────────────────────────────────
import ayatCover from "./Mrs.AyatAsaad/cover.webp";
import ayatMp4 from "./Mrs.AyatAsaad/fullScreen.mp4";
import ayatQuestionBank from "./Mrs.AyatAsaad/Question Bank.webp";
import ayatAdminCategories from "./Mrs.AyatAsaad/Admin Categories.webp";
import ayatBootcampsCatalog from "./Mrs.AyatAsaad/Bootcamps Catalog.webp";
import ayatResponsive from "./Mrs.AyatAsaad/07.webp";
import ayatDarkMode from "./Mrs.AyatAsaad/Dark Mode Landing.webp";

// ─── Web Point ────────────────────────────────────────────────────────────────
import webPointCover from "./Web Point/cover.webp";
import webPoint02 from "./Web Point/02.webp";
import webPoint03 from "./Web Point/03.webp";
import webPoint04 from "./Web Point/04.webp";
import webPoint05 from "./Web Point/05.webp";
import webPoint06 from "./Web Point/06.webp";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectScreen {
  src: string;
  label: string;
}

export interface ProjectImages {
  id: string;
  cardVideo?: string;
  cover: string;
  screens: ProjectScreen[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const projectImages: ProjectImages[] = [
  {
    id: "wms",
    cardVideo: undefined,
    cover: wmsCover,
    screens: [
      { src: wmsCover,           label: "Overview" },
      { src: wmsAnalytics,       label: "Analytics" },
      { src: wmsOrdersDashboard, label: "Orders Dashboard" },
      { src: wmsOrderPrep,       label: "Order Preparation" },
      { src: wmsReturnsCenter,   label: "Returns Center" },
      { src: wmsCycleCount,      label: "Cycle Count Management" },
      { src: wmsDriver,          label: "Driver & Delivery" },
      { src: wmsReports,         label: "Reports Center" },
      { src: wmsResponsive,      label: "Responsive Design" },
    ],
  },
  {
    id: "ertiqaa-academy",
    cardVideo: ertiqaaMp4,
    cover: ertiqaaCover,
    screens: [
      { src: ertiqaaCover,              label: "Overview" },
      { src: ertiqaaLessonPlayer,       label: "Lesson Player" },
      { src: ertiqaaStudentProgress,    label: "Student Progress" },
      { src: ertiqaaContentManagement,  label: "Content Management" },
      { src: ertiqaaTeacherReports,     label: "Teacher Reports" },
      { src: ertiqaaCertificateBuilder, label: "Certificate Builder" },
      { src: ertiqaaResponsive,         label: "Responsive Design" },
    ],
  },
  {
    id: "haya-academy",
    cardVideo: hayaMp4,
    cover: hayaCover,
    screens: [
      { src: hayaCover,               label: "Overview" },
      { src: hayaInteractiveActivity, label: "Interactive Activity Builder" },
      { src: hayaAnalyticsDashboard,  label: "Student Analytics" },
      { src: hayaActivityCategories,  label: "Activity Categories" },
      { src: hayaManageActivities,    label: "Manage Activities" },
      { src: hayaStudentLessons,      label: "Student Lessons" },
      { src: hayaResponsive,          label: "Responsive Design" },
    ],
  },
  {
    id: "mrs-ayat-asaad",
    cardVideo: ayatMp4,
    cover: ayatCover,
    screens: [
      { src: ayatCover,            label: "Overview" },
      { src: ayatQuestionBank,     label: "Question Bank Dashboard" },
      { src: ayatAdminCategories,  label: "Admin Categories Panel" },
      { src: ayatBootcampsCatalog, label: "Bootcamps Catalog" },
      { src: ayatResponsive,       label: "Responsive Design" },
      { src: ayatDarkMode,         label: "Dark Mode View" },
    ],
  },
  {
    id: "web-point-erp",
    cardVideo: undefined,
    cover: webPointCover,
    screens: [
      { src: webPointCover, label: "Table Floor Map" },
      { src: webPoint02,    label: "POS Menu & Order Cart" },
      { src: webPoint03,    label: "Payment & Checkout" },
      { src: webPoint04,    label: "Sales Reports" },
      { src: webPoint05,    label: "Delivery Management" },
      { src: webPoint06,    label: "Inventory Management" },
    ],
  },
];
