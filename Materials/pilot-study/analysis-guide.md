# Analysis Guide

This guide walks through the analysis step by step, first in Google Sheets and then in Python. It ends with how to report the results honestly and how a study like this could be written up for a science fair or a student journal.

Decide your analysis **before** you look at the data (it's already written in `protocol.md`, Section 9). Changing the plan after seeing the results makes them less trustworthy.

## 1. Enter and check the data

1. Open `data-template.csv` in Google Sheets (File > Import) or any spreadsheet program.
2. Add one row per anonymous ID. Enter the letter each student chose for every question (`pre_q1` to `post_q20`), the total scores (`pre_score`, `post_score`, 0 to 20), the number of sessions attended, and the survey ratings (`S1` to `S8`, 1 to 5).
3. **Double-check:** have a second person re-score 5 random tests with the answer key. If any score disagrees, re-check every test.
4. Students who took only one test stay in the file but are left out of the paired analysis. Report how many there were.

## 2. Describe the data

For the students who took both tests, compute:

- **n**: how many students took both tests
- **mean** (average) pre-test score and post-test score
- **standard deviation (SD)** of each, which shows how spread out the scores are
- **gain** for each student: post-test score minus pre-test score
- **mean gain** and **SD of the gains**

It also helps to report the **median** (middle value) and the lowest and highest scores, because with a small group a few students can pull the average up or down.

### In Google Sheets

Suppose the pre-test scores are in column C (rows 2 to 21) and post-test scores in column D.

| What | Formula |
|---|---|
| Gain for row 2 (fill down) | `=D2-C2` (put in a new column, say E) |
| Mean pre-test | `=AVERAGE(C2:C21)` |
| Mean post-test | `=AVERAGE(D2:D21)` |
| SD pre-test | `=STDEV(C2:C21)` |
| Mean gain | `=AVERAGE(E2:E21)` |
| SD of gains | `=STDEV(E2:E21)` |
| Median gain | `=MEDIAN(E2:E21)` |
| Number of students who improved | `=COUNTIF(E2:E21,">0")` |
| Effect size (Cohen's d for paired data) | `=AVERAGE(E2:E21)/STDEV(E2:E21)` |

Make sure every row in your ranges has **both** scores.

**Item analysis.** For each question, compute the percent of students who got it right before and after. Questions where almost everyone was right on the pre-test can't show much growth (a "ceiling effect"). Questions that got worse may be confusing; look at them closely.

**Survey.** For each item S1 to S8, report the mean, the median, and the percent of students who chose 4 or 5. Read the open answers and group them into a few themes (for example, "sims helped," "too much reading," "cases were interesting"). Report how many answers fell in each theme and quote one or two short examples with no identifying details.

## 3. Test whether the gain is likely to be real

Because each student took both tests, the two sets of scores are **paired**. Use a test made for paired data.

### Option A: Paired t-test

A paired t-test asks: is the average gain bigger than we'd expect from random ups and downs? It works best when the gains are roughly bell-shaped, or when the group is larger (about 15 to 20 or more).

**Google Sheets:** `=T.TEST(C2:C21, D2:D21, 2, 1)`

- The `2` means two-tailed (we test for any change, up or down).
- The `1` means paired.
- The result is the **p-value**.

### Option B: Wilcoxon signed-rank test

The Wilcoxon signed-rank test is the paired test to use when the group is small or the gains are lopsided. It uses the ranks of the gains instead of their exact values. Google Sheets has no built-in function for it, so use Python (below) or ask your mentor about a statistics tool your school has. Students whose score didn't change (gain = 0) are usually dropped by this test, so report how many there were.

### What the p-value means

- If p is below 0.05, the gain is called **statistically significant**: a gain this large would be unlikely if the sessions truly had no effect and only chance was at work.
- If p is 0.05 or above, the data don't give strong evidence of a gain. This does **not** prove the book doesn't help, especially with a small group.
- Significance is not the same as importance. A 1-point gain could be "significant" in a large group but not matter much. Always report the size of the gain and the effect size, not just the p-value.

A rough guide for Cohen's d: about 0.2 is often called small, 0.5 medium, and 0.8 large. These labels are only conventions, so also describe the gain in plain points ("students answered about 4 more questions correctly out of 20").

### In Python

Install the libraries once with `pip install pandas scipy`. Save this as `analyze.py` in the same folder as your filled-in CSV, then run `python analyze.py`.

```python
import pandas as pd
from scipy import stats

df = pd.read_csv("data-template.csv")

# Keep only students with both scores
paired = df.dropna(subset=["pre_score", "post_score"]).copy()
paired["gain"] = paired["post_score"] - paired["pre_score"]
n = len(paired)

print(f"Students in file: {len(df)}; with both tests: {n}")
print(f"Pre-test:  mean {paired.pre_score.mean():.2f}, SD {paired.pre_score.std():.2f}")
print(f"Post-test: mean {paired.post_score.mean():.2f}, SD {paired.post_score.std():.2f}")
print(f"Gain:      mean {paired.gain.mean():.2f}, SD {paired.gain.std():.2f}, "
      f"median {paired.gain.median():.1f}")
print(f"Improved: {(paired.gain > 0).sum()}, same: {(paired.gain == 0).sum()}, "
      f"lower: {(paired.gain < 0).sum()}")

# Paired t-test (two-sided)
t = stats.ttest_rel(paired.post_score, paired.pre_score)
print(f"Paired t-test: t = {t.statistic:.2f}, p = {t.pvalue:.4f}")

# Wilcoxon signed-rank test (drops zero gains by default)
if (paired.gain != 0).sum() > 0:
    w = stats.wilcoxon(paired.post_score, paired.pre_score)
    print(f"Wilcoxon signed-rank: W = {w.statistic:.1f}, p = {w.pvalue:.4f}")

# Effect size: Cohen's d for paired data
d = paired.gain.mean() / paired.gain.std()
print(f"Cohen's d (paired): {d:.2f}")

# Survey averages
for item in ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]:
    col = df[item].dropna()
    if len(col):
        agree = (col >= 4).mean() * 100
        print(f"{item}: mean {col.mean():.2f}, median {col.median():.1f}, "
              f"agree or strongly agree {agree:.0f}% (n = {len(col)})")
```

A simple chart helps: a bar chart of the mean pre-test and post-test scores, or a "before and after" line for each student. Label the axes and say what n is.

## 4. Report honestly

A good report says exactly what was done, what was found, and what the study can't tell us. Include:

- **What you did:** the setting (described generally; no school name is needed), how many students took part, which chapters and MicroSims, how many sessions, and how long each lasted.
- **What you found:** n, mean and SD for each test, mean gain, the test you used, the p-value, and the effect size. Report the result even if it isn't significant.
- **Who was left out:** how many students took only one test, and why if you know (absent, lost ID card).
- **Limitations.** Say them plainly. For this design they include:
    - **No control group.** Without a comparison group that didn't use the book, you can't tell whether the gain came from the book or from something else, such as other classes or just thinking about the topic for a few weeks.
    - **Taking the same test twice.** Taking a test is itself a form of retrieval practice, which can improve later scores on its own (see Appendix A, Section A.4 of the book). Some of the gain may come from having seen the questions before.
    - **Small sample.** A few students can change the average a lot, and a real effect might be missed.
    - **Self-selection.** Club members or volunteers may be more interested in science than other students, so results may not apply to a typical class.
    - **Leader effects and possible bias.** An enthusiastic leader, or a leader connected to the book, may affect the sessions. Say who scored the tests.
    - **Short-term only.** The post-test came right after the sessions, so it doesn't show long-term memory.
    - **Self-report.** Survey items show how students felt, not what they learned.
- **What you can claim:** "Scores were higher after the sessions" is fair if the data show it. "The book caused students to learn" is **not** supported by this design. Use words like "was associated with" or "scores increased after," not "proved" or "caused."
- **Next steps:** suggest a stronger design, such as comparing with a group that used a different resource, using two different but matched versions of the test, or adding a delayed post-test a few weeks later.

## 5. Writing it up

### For a science fair

Follow your fair's rules. Fairs that follow Society for Science (ISEF) rules require IRB approval before any interaction with participants, so approval can't be added afterward. Check which human participant forms your fair requires. A typical board or paper includes: question, hypothesis, background, methods (with approval noted), results (tables and a chart), discussion with limitations, conclusion, and references. Don't display anything that could identify a participant, and don't display signed consent forms.

### For a student journal such as JEI

The [*Journal of Emerging Investigators*](https://emerginginvestigators.org/) (JEI) is an open-access journal that publishes hypothesis-driven research by middle and high school students. Things to know before you start, from JEI's guidelines:

- Every paper needs an adult **senior author** (for example, a teacher, research mentor, or parent) in addition to the student author or authors.
- Studies with human subjects, including surveys, must be approved by an SRC or IRB **before the project begins**, and you will need to submit documentation of that approval. If consent was required, include a blank copy of the consent form with your submission. See [JEI: Human subjects research](https://emerginginvestigators.org/submissions/human-subjects-research) for the full rules, including who may serve on an SRC.
- JEI says its published research must follow the ISEF guidelines for ethical research with human subjects.
- Use JEI's manuscript template and check its current author guidelines before writing.

In the paper, state in the methods section which committee approved the study and how consent and assent were obtained. Disclose any conflict of interest, such as a member of the research team being the book's author.

### Sharing with the book's author

Whatever you find, the author would like to know. Share a summary (group results only, no raw data) through the [GitHub issues page](https://github.com/aaryavvatts-lab/neuroscience-textbook/issues/new/choose).
