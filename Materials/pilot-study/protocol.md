# Pilot Study Protocol

**Working title:** Learning neuroscience with an open textbook and interactive simulations: a pre-post pilot study in a high school setting

**Student researcher(s):** [name(s)]
**Adult mentor / supervising teacher:** [name, role, school]
**Setting:** [school name or "a high school neuroscience club"; city, state]
**Review committee:** [name of IRB or SRC] **Approval date:** [date] **Approval number, if any:** [number]
**Protocol version:** [1.0, date]

---

## 1. Research question

Do high school students score higher on a short neuroscience knowledge test after 2 to 3 sessions using selected chapters and MicroSims from the free textbook *From Neuron to Bedside*?

**Secondary question:** How do students rate the chapters and MicroSims for clarity, interest, and usefulness?

**Hypothesis:** Mean scores on the 20-question test will be higher on the post-test than on the pre-test.

## 2. Background (short)

*From Neuron to Bedside* is a free, open (CC BY-NC-SA 4.0) neuroscience textbook for high school students. Each chapter includes interactive p5.js simulations (MicroSims), a fictional clinical case, and practice questions. There is no published evidence yet about whether it helps students learn. This pilot is a first, small check that can guide a larger, better-controlled study later.

## 3. Design

A single-group pre-test / post-test design, with a short survey at the end.

```text
Approval -> Consent and assent -> Session 1: pre-test + content
         -> Session 2: content -> Session 3: content
         -> Final session: post-test + feedback survey
```

- **Pre-test:** the 20-question multiple-choice test in `pre-post-test.md`, given before any instruction. About 15 minutes.
- **Instruction:** 2 to 3 sessions of about 45 to 60 minutes using Chapters 1, 2, 3, and 14 and their MicroSims (see the session plan below).
- **Post-test:** the **same** 20 questions, given at the end of the last session or at the start of a separate short session. About 15 minutes.
- **Feedback survey:** the anonymous survey in `feedback-survey.md`. About 5 minutes.

Students do not see the answer key between the pre-test and the post-test, and the leader does not go over the test questions.

### Session plan

Choose the version that fits your schedule. The leader uses each chapter's text and the MicroSim's Lesson Plan (on the MicroSim's page). Do not teach directly to the test questions.

| Session | 3-session version | 4-session version |
|---|---|---|
| 1 | Pre-test (15 min). Chapter 1 + Neuron Explorer MicroSim. | Pre-test (15 min). Chapter 1 + Neuron Explorer. |
| 2 | Chapters 2 and 3 + Action Potential Simulator and Synapse Simulator. | Chapter 2 + Action Potential Simulator. |
| 3 | Chapter 14 + Stroke Territory Map. Post-test (15 min). Survey (5 min). | Chapter 3 + Synapse Simulator. |
| 4 | | Chapter 14 + Stroke Territory Map. Post-test. Survey. |

MicroSim pages:

- Neuron Explorer: `docs/sims/ch01-neuron-explorer/`
- Action Potential Simulator: `docs/sims/ch02-action-potential/`
- Synapse Simulator: `docs/sims/ch03-synapse/`
- Stroke Territory Map: `docs/sims/ch14-stroke-territories/`

Record for each session: the date, how long it lasted, which sections and sims were used, and how many people attended (a count only, no names).

## 4. Participants

- **Who:** high school students (grades 9 to 12) who are members of [club or class name].
- **How many:** all eligible students who agree, likely about [10 to 30]. No minimum is needed for a pilot.
- **Inclusion:** a signed parent/guardian permission form and a signed student assent form (unless the committee waives this in writing, see Section 8). Students 18 or older sign an adult consent form instead (adapt the parent form).
- **Exclusion:** none, other than not having permission. Students who don't take part still join the club activities as usual; they just don't take the tests or the survey, or their papers are not collected.
- **Recruitment:** a short announcement at a meeting or in class by [name], describing the study and handing out forms. There is no reward for joining and no penalty for not joining.
- **Grades:** taking part, or the scores, never affect any grade, club standing, or officer position.

## 5. Timeline

| When | What |
|---|---|
| Weeks 1 to 3 | Prepare materials. Submit to the review committee. **No contact with participants yet.** |
| After written approval | Announce the study. Hand out permission and assent forms. Allow about 1 to 2 weeks to return them. |
| Week A | Session 1 (pre-test + content) |
| Week A + 1 | Session 2 |
| Week A + 2 | Session 3 (post-test + survey in the 3-session version) |
| Week A + 3 | Session 4, if using the 4-session version |
| Following 2 weeks | Enter data, analyze, write up |
| After the write-up | Share a short summary of results with participants. Delete the paper tests once the data are entered and checked, if the committee approves. |

## 6. Data: what is and is not collected

**Collected:**

- an anonymous ID number (see below)
- the number correct on the pre-test and on the post-test (0 to 20), and the answer letter for each question
- the number of sessions attended (counted from the student's ID card, not by name)
- survey answers (1 to 5 ratings and two open-ended answers)

**Not collected:**

- names, student ID numbers, email addresses, birth dates, photos, audio, or video
- grades, test scores from school records, or any school records at all
- race, ethnicity, gender, disability status, or medical information
- IP addresses or device data (use paper, or a form tool with response tracking turned off and no sign-in required, if the committee approves an online version)

**How the anonymous ID works:** before the pre-test, the leader shuffles a stack of cards numbered 01 to [N] and lets each participant draw one. The student writes that number on the pre-test, the post-test, and the survey, and keeps the card (or the leader keeps the cards face-down in an envelope that students pull their own card from). **No list linking names to numbers is ever made.** If a student loses their card, they draw a new number and their pre- and post-tests are analyzed separately (unpaired), or dropped from the paired analysis.

**Open-ended answers:** if a student writes a name or anything identifying, the researcher removes it when typing up the answers.

## 7. Data storage

- Paper tests and surveys are kept in a sealed envelope in a locked drawer or cabinet at school, controlled by [adult mentor].
- The typed data file (`data-template.csv`, filled in) is kept in [a password-protected school account or folder], shared only with the research team and mentor.
- Signed consent and assent forms contain names, so they are stored **separately** from the data, in a different envelope, by [adult mentor]. They are never linked to ID numbers.
- Paper tests are shredded after the data are entered and double-checked, at [date], unless the committee asks you to keep them longer. Consent forms are kept for [the period your committee requires].
- Only group results (averages, counts) appear in any report or presentation.

## 8. Ethics and approval

**Risk level.** The study is designed to be minimal risk: the activities are ordinary learning activities, the tests are short and ungraded, and no identifying data are collected. Possible discomforts are mild boredom or feeling unsure on a test. Chapter 14 mentions stroke, concussion, and seizures; the leader gives a short heads-up before that session, and students may skip any question or activity.

**Approval before any data collection.** This study involves human participants, so it must be reviewed and approved **before** recruiting or collecting any data:

- **Science fairs following ISEF rules.** Society for Science's human participant rules require IRB approval before any interaction with participants, such as recruitment or data collection. They describe a school IRB with at least three members: an educator who is not the adult sponsor, a school administrator, and a medical or mental health professional. For minors (under 18), the rules require student assent and written parental permission. The written-consent waiver they describe applies to adult participants in minimal-risk, anonymous studies. Source: [ISEF Human Participants rules](https://www.societyforscience.org/isef/international-rules/human-participants/). Check the current year's rules and required forms with your fair.
- **Journal of Emerging Investigators (JEI).** JEI requires studies with human subjects, including surveys, to be approved by an SRC or IRB before the project begins. For researchers not at a regulated institution, JEI describes an SRC of at least three people (a medical professional with research experience, an educator, and a school administrator), and says parents, mentors, and authors cannot serve on it. JEI requires written consent from minors and a parent or guardian, and says the committee may waive consent only for minimal-risk projects that collect no personal information. Source: [JEI: Human subjects research](https://emerginginvestigators.org/submissions/human-subjects-research).

**Plan for this study:** get parent/guardian permission **and** student assent for every participant under 18, unless the review committee waives this in writing **and** the rules of every place you plan to present or publish allow that waiver. If you might enter a science fair, follow the stricter rule.

**Voluntary participation.** Students can say no, stop at any time, or skip any question, with no penalty. Recruitment avoids pressure: the researcher does not ask friends one by one, and club officers do not track who joins.

**Conflict of interest.** [State any connection between the research team and the book, for example "The student researcher is the author of the textbook."] To reduce bias, [name, not the author] scores the tests using the answer key.

## 9. Analysis plan (decided in advance)

- **Main outcome:** the change in score (post minus pre) for each student who took both tests.
- **Main test:** a paired t-test on pre and post scores, two-sided, alpha = 0.05. If the gains are clearly not bell-shaped or the sample is under about 15, also report a Wilcoxon signed-rank test.
- **Effect size:** mean gain divided by the standard deviation of the gains (Cohen's d for paired data).
- **Also reported:** the number of students who took each test and the number with both; mean and standard deviation of each test; item-by-item percent correct before and after; survey averages for each item; a summary of the open-ended answers grouped by theme.
- No other comparisons by group (gender, grade, etc.), since those data are not collected.

Details and step-by-step instructions are in `analysis-guide.md`.

## 10. Limitations known in advance

- No control group, so other causes of improvement (taking the same test twice, other classes, maturation) can't be ruled out.
- Small sample and volunteers who already like science (self-selection).
- The same test is used twice, so practice with the questions may raise scores.
- The leader may be enthusiastic about the book, which can affect how sessions go.
- Short time frame; the study doesn't measure long-term memory.

## 11. Materials checklist

- [ ] Approval letter or signed committee form
- [ ] Copies of `pre-post-test.md` (questions only, no key), two per student
- [ ] Copies of `feedback-survey.md`, one per student
- [ ] Numbered ID cards
- [ ] Signed permission and assent forms, stored separately
- [ ] Projector or screens for the MicroSims
- [ ] Session log (dates, length, attendance counts)
