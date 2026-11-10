# HAYA Academy

**A learning platform for schools: interactive Arabic-language lessons, homework that marks itself, and a report for every class and skill.**

## The problem

In the UAE, each school sets its own curriculum and is responsible for all of it, and the platforms available for teaching Arabic to non-native speakers were not at a high level. The client wanted to enter that market with a better product: one platform serving many schools, each with its own teachers and classes, simple enough for young children to use on their own.

## What was built

HAYA is one platform that serves many schools. Each school gets its own admin, teachers and classes, and only sees its own data. Students read interactive books, solve homework with five question types, and earn a certificate for each skill. Teachers build tasks from a shared question bank and see results right away. School admins follow progress by class and by skill.

## Key features

- Students solve matching, fill-the-blank, multiple-choice, true/false and essay questions, and most of them are marked the moment the task is submitted.
- Teachers assign homework to a whole class or to chosen students, with a time window and a set number of attempts.
- Each answer is reviewed after submission, so a student sees what was right, what was wrong and the correct answer.
- Teachers issue certificates for reading, listening, writing and speaking in a few clicks, one image per student.
- School admins see the top student and class results month by month, plus progress per skill for each class.
- Each account can sign in on a limited number of devices, so accounts aren't shared.

## My role

The only frontend developer on the project. I built everything the student sees: the Arabic and English landing page, login, the student area, the lesson player, all five question types (both the student screens and the teacher's question builder), result screens and the certificate templates. The backend was built by two backend developers. This is one of two Arabic-learning platforms for UAE schools whose frontend I built, for two different companies.

## Results

- Live at [hayaedu.com](https://www.hayaedu.com)
- 13 partner schools
- 8,923 students

## Under the hood

Laravel 11 with server-rendered Blade, MySQL, Bootstrap and jQuery. The student area is a separate module (nwidart/laravel-modules), and each role has its own route group and controllers. The project started from a ready-made LMS base and was extended with schools, classes, the question bank, homework, story assignments, certificates and reports.

Three decisions worth noting:

- **Matching with drawn connections.** Students tap an item on each side and a coloured arrow connects them. Both columns are shuffled on every attempt, and the pairs are sent as IDs, so the server can mark them without trusting the order on screen.
- **Fill-the-blank from plain text.** The teacher writes a sentence with `___` where the gaps go. The screen turns each gap into a drop zone and mixes the right answers with distractors as tappable chips.
- **Certificates rendered in the browser.** Each skill has its own illustrated template. The teacher's screen draws a certificate per student on a canvas and uploads the finished images, so the server never has to render artwork.

## Status

Live.
