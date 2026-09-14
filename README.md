# Bicentennial Junior High School (BiHi) — Room 8 Master Repository (2026–2027)

**Lead Teacher:** Mr. Dave Waugh  
**Location:** Room 8, Bicentennial Junior High School, Dartmouth, Nova Scotia  
**School District:** Halifax Regional Centre for Education (HRCE) / GNSPES  
**Academic Year:** 2026–2027  

---

## 🏫 Welcome & LLM Architecture Orientation

This repository houses the complete educational operating system, digital curriculum applications, gamified simulations, assessment ledgers, and student cloud telemetry for **Room 8**.

All digital student and projector tools in this repository are engineered as **standalone, zero-dependency HTML5/CSS/JavaScript applications**. They require no build tools, bundlers, or server-side runtimes, enabling them to execute flawlessly in low-bandwidth classroom conditions, directly off local disk, or hosted via GitHub Pages (`dwaugh-edsim.github.io`).

---

## 📂 Subfolder Directory Guide

Click into any subfolder below to access its detailed architecture documentation:

| Subfolder | Subject / Mandate | Cohorts Served | Primary Documentation |
| :--- | :--- | :--- | :--- |
| [**`Citizenship 9/`**](Citizenship%209/README.md) | Grade 9 Citizenship Curriculum | Classes 901, 902, 903 | [Read Guide](Citizenship%209/README.md) |
| [**`HealthyLiving8/`**](HealthyLiving8/README.md) | Grade 8 Healthy Living (5 Dimensions) | Classes 801, 802, 803, 804 | [Read Guide](HealthyLiving8/README.md) |
| [**`HealthyLiving9/`**](HealthyLiving9/README.md) | Grade 9 Healthy Living (Sleep Telemetry) | Classes 901, 902, 903 | [Read Guide](HealthyLiving9/README.md) |
| [**`ILT/`**](ILT/README.md) | Instructional Leadership Time & Games | 7 ILT, 902, 903 | [Read Guide](ILT/README.md) |
| [**`Student_System/`**](Student_System/README.md) | PIN Auth, Master Rosters & Google Sync | All Classes (Grades 7, 8, 9) | [Read Guide](Student_System/README.md) |
| [**`Day1_Deliverables/`**](Day1_Deliverables/README.md) | Turnkey Opening Week Binder Packages | Homeroom 902 & All Classes | [Read Guide](Day1_Deliverables/README.md) |

---

## 🔑 Shared Infrastructure & Key Concepts

1. **Shared Cart Chromebook Resilience:**
   * Student Chromebooks rotate each period and wipe `localStorage` on logout.
   * Authentication is powered by unique 3-letter student PINs (e.g. `MON`, `JHB`, `NTT`) preloaded via `Student_System/students_roster_data.js`.
   * Real-time student work syncs directly to Google Apps Script via `StudentAPI` in `Student_System/api.js` using background debouncing (2s pause), tab switching triggers, and `mode: 'no-cors'` fallbacks.

2. **Room 8 Homeroom 902 Operations:**
   * Physical locker assignments, Dudley combination locks, and printable slips: `902-locker-assignments.html`, `902_desk_lock_slips.html`.
   * Complete 10-day cycle student clipboard with daily schedules and point rubrics: `902_Class_Clipboard_10Day_Cycle.html`.

3. **Substitute Teacher / Emergency Binder:**
   * All class lists, medical alerts, and course enrollments: `sub_folder_class_lists.html` and `SUB_FOLDER_CLASS_LISTS.md`.
   * 10-day cycle teacher schedules across all 5 daily periods: `sub_folder_schedules.html` and `SUB_FOLDER_SCHEDULES.md`.
   * Binder cover and spine inserts: `sub_folder_binder_cover_and_spine.html`.
