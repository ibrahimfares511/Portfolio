// ─── WMS ─────────────────────────────────────────────────────────────────────
import wmsCover from "./WMS/cover.png";
import wmsAnalytics from "./WMS/Analytics.png";
import wmsOrdersDashboard from "./WMS/Orders Dashboard.png";
import wmsOrderPrep from "./WMS/Order Prep.png";
import wmsReturnsCenter from "./WMS/Returns Center.png";
import wmsCycleCount from "./WMS/Cycle Count.png";
import wmsDriver from "./WMS/Driver.png";
import wmsReports from "./WMS/Reports.png";
import wmsResponsive from "./WMS/Responsive.png";

// ─── Ertiqaa ──────────────────────────────────────────────────────────────────
import ertiqaaCover from "./Ertiqaa/cover.png";
import ertiqaaGif from "./Ertiqaa/fullScreen.gif";
import ertiqaaLessonPlayer from "./Ertiqaa/Lesson Player screen.png";
import ertiqaaStudentProgress from "./Ertiqaa/Student Units Progress.png";
import ertiqaaContentManagement from "./Ertiqaa/Teacher Content Management.png";
import ertiqaaTeacherReports from "./Ertiqaa/Teacher Reports Dashboard.png";
import ertiqaaCertificateBuilder from "./Ertiqaa/Certificate Builder.png";
import ertiqaaResponsive from "./Ertiqaa/Responsive showcase.png";

// ─── Haya ─────────────────────────────────────────────────────────────────────
import hayaCover from "./Haya/cover.png";
import hayaGif from "./Haya/fullScreen.gif";
import hayaInteractiveActivity from "./Haya/Interactive Activity.png";
import hayaAnalyticsDashboard from "./Haya/Analytics Dashboard.png";
import hayaActivityCategories from "./Haya/Activity Categories.png";
import hayaManageActivities from "./Haya/Manage Activities.png";
import hayaStudentLessons from "./Haya/Student Lessons.png";
import hayaResponsive from "./Haya/05.png";

// ─── Mrs. Ayat Asaad ──────────────────────────────────────────────────────────
import ayatCover from "./Mrs.AyatAsaad/cover.png";
import ayatGif from "./Mrs.AyatAsaad/fullScreen.gif";
import ayatQuestionBank from "./Mrs.AyatAsaad/Question Bank.png";
import ayatAdminCategories from "./Mrs.AyatAsaad/Admin Categories.png";
import ayatBootcampsCatalog from "./Mrs.AyatAsaad/Bootcamps Catalog.png";
import ayatResponsive from "./Mrs.AyatAsaad/07.png";
import ayatDarkMode from "./Mrs.AyatAsaad/Dark Mode Landing.png";

// ─── Web Point ────────────────────────────────────────────────────────────────
import webPointCover from "./Web Point/cover.png";
import webPoint02 from "./Web Point/02.png";
import webPoint03 from "./Web Point/03.png";
import webPoint04 from "./Web Point/04.png";
import webPoint05 from "./Web Point/05.png";
import webPoint06 from "./Web Point/06.png";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectScreen {
  src: string;
  label: string;
}

export interface ProjectImages {
  id: string;
  cardGif?: string;
  cover: string;
  screens: ProjectScreen[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const projectImages: ProjectImages[] = [
  {
    id: "wms",
    cardGif: undefined,
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
    cardGif: ertiqaaGif,
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
    cardGif: hayaGif,
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
    cardGif: ayatGif,
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
    cardGif: undefined,
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
