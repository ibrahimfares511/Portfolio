# Ertiqaa Academy

**An Arabic-learning platform for schools: students practise listening, speaking, reading and writing through short lessons and interactive questions, while teachers and schools follow their progress.**

## The problem
In the UAE, each school sets its own curriculum and is responsible for all of it, and the platforms available for teaching Arabic to non-native speakers were not at a high level. The client wanted to enter that market with a better product: one place for the whole learning path: lessons in different formats, practice that gives instant feedback, timed quizzes, and a way for teachers to see who is moving ahead and who needs help.

## What was built
One web app with four roles. The platform admin builds the curriculum (grades, levels, units, lessons) and a shared question bank. Schools add their teachers and students, or import them from Excel. Teachers assign tasks and exams, grade open answers, issue certificates and read reports. Students follow their units, watch or read the lesson, practise, and take timed quizzes.

## Key features
- Students answer six question types: multiple choice, true/false, drag-and-drop blanks, word-to-picture matching, sentence ordering, and voice answers recorded in the browser.
- In practice mode a wrong answer resets with a sound, so the student tries again until it's right. In quiz mode a countdown timer runs.
- Lessons come in six formats (text, image, PDF, audio, video file, video link), each with its own player.
- After a quiz, students see every answer next to the correct one, plus the teacher's note and grade on voice answers.
- Teachers see skill-by-skill progress, their strongest students and the students who need support.
- Staff accounts get exactly the permissions they need (read, add, edit or delete, per section).

## My role
Frontend developer in a two-person frontend team. I led the student learning experience: the lesson players, all six question types, the quiz flow and timer, results and the student profile. I also built parts of the admin dashboard, the landing page and the API layer. The teacher and school dashboards were mainly built by my teammate, and the Laravel backend by a separate team. This is one of two Arabic-learning platforms for UAE schools whose frontend I built, for two different companies.

## Results
- Used by 8 schools.
- 8,311 students on the platform.
- 4 roles served by one app (student, teacher, school, admin).
- 6 interactive question types and 6 lesson formats.
- 2 languages with full right-to-left / left-to-right switching.

## Under the hood
React 18, TypeScript, Vite, Redux Toolkit with RTK Query, Tailwind with shadcn/Radix, MUI, framer-motion, react-dnd, i18next and Firebase Cloud Messaging, on a Laravel REST API.

- **One engine for every question type.** Each type implements the same `verify()` / `reset()` handle, and a single container drives the flow: retry with sound in practice, auto-advance and a countdown in quizzes. Adding a new type doesn't change the flow.
- **Voice answers in the browser.** The essay question records the student with the MediaRecorder API and uploads the file, so speaking practice happens inside the quiz.
- **Direction switching across three styling systems.** Changing the language flips i18next, the document direction, the MUI theme and an emotion RTL cache together, so Tailwind, Radix and MUI components all mirror correctly.
- **Safe token refresh.** The API layer (51 RTK Query slices) refreshes an expired token behind a mutex, so parallel requests trigger only one refresh.

## Status
Live and in use. The platform was launched in 2025 and is still running.

Live site: https://ertiqaaedu.com/
