# 📂 Papers Archive Folder
This folder contains organized exam papers, categorized by Grade, Year, Subject, and Place for easy navigation and retrieval. The naming structure ensures that both users and backend systems can efficiently access and sort exam papers without confusion. **This structure heavily rely on the system's alphabetical sorting**.

# 📌 Organization
Each exam paper follows a structured format to maintain consistency and allow for alphabetical sorting based on grade and year.

## Naming Paper Files:

```bash
/papers/{Grade}_{Year}_{Subject}_{Place}.pdf
```

Grade `(GXX)`: Represents the academic level (e.g., G09 for Grade 9).

Year `(YYYY)`: The year the exam was conducted or released.

Subject `(Short Name)`: Standardized subject abbreviations (e.g., Sci for Science, Math for Mathematics).

Place: The location (state, division, or city) where the exam was conducted.

Example:
```bash
/papers/G09_2024_Math_Magway_Minbu.pdf
```

| Abbreviation (in order) | Meaning   |
|--------------|-----------|
| G09          | Grade 9   |
| 2025         | Exam Year |
| Math         | Subject   |
| Yangon_Botahtaung | Place[^1] |

### Abbreviation Explained (PaperPocket)
| Abbreviated Word | Whole Word         |
|------------------|--------------------|
| My               | _Myanmar (မြန်မာစာ)_ |
| Eng              | _English (အင်္ဂလိပ်စာ)_ |
| Math             | _Mathematics (သင်္ချာ)_ |
| Geo              | _Geography (ပထဝီဝင်)_ |
| Hist             | _History (သမိုင်း)_ |
| SS[^2]           | _Social Studies (လူမှုရေးဘာသာ)_ |
| Chem             | _Chemistry (ဓာတုဗေဒ)_ |
| Phys             | _Physics (ရူပဗေဒ)_ |
| Bio              | _Biology (ဇီဝဗေဒ)_ |

## 📌 Why This Structure?
- 🗂 Easy Sorting: Exams are sorted alphabetically by Grade → Year → Subject → Place for quick access, prioritizing Year and Subject as there are many places with different variations of one exam paper.

- 🔍 Efficient Search (Cons): We assumed that the user do not care if there is a folder structure or not. The content of the file is only useful 

- _🚀 Optimized Storage (Cons, no idea how to do this): Short file and folder names prevent file system errors caused by long paths_.

- _🤖 Backend-Friendly: Designed for seamless integration with databases and automated retrieval systems_.


[^1]: In Myanmar, there are 7 states and 7 divisions, 14 in total. Thus, the naming convention has to come down to the actual exam papers that was made for the state or division. The naming convention will be further developed from older repositories.

[^2]: https://www.abbreviations.com/social%20studies