const fs = require('fs');
const path = require('path');

const abbrSubjects = {
    'My': 'မြန်မာစာ',
    'Eng': 'English',
    'Math': 'သင်္ချာ',
    'Geo': 'ပထဝီဝင်',
    'Hist': 'သမိုင်း',
    'Sci': 'သိပ္ပံ',
    'SS': 'လူမှုရေးဘာသာ',
    'Chem': 'Chemistry',
    'Phys': 'Physics',
    'Bio': 'Biology'
};

const abbrGrades = {
    'G12': 'Grade 12',
    'G09': 'Grade 9',
    'G05': 'Grade 5',
};

const statesAndDivisionsNames = {
    'Kachin': 'ကချင်ပြည်နယ်',
    'Kayah': 'ကယားပြည်နယ်',
    'Kayin': 'ကရင်ပြည်နယ်',
    'Chin': 'ချင်းပြည်နယ်',
    'Sagaing': 'စစ်ကိုင်းတိုင်းဒေသကြီး',
    'Tanintharyi': 'တနင်္သာရီတိုင်းဒေသကြီး',
    'Bago': 'ပဲခူးတိုင်းဒေသကြီး',
    'Magway': 'မကွေးတိုင်းဒေသကြီး',
    'Mandalay': 'မန္တလေးတိုင်းဒေသကြီး',
    'Mon': 'မွန်ပြည်နယ်',
    'Rakhine': 'ရခိုင်ပြည်နယ်',
    'Yangon': 'ရန်ကုန်တိုင်းဒေသကြီး',
    'Shan': 'ရှမ်းပြည်နယ်',
    'Ayeyarwady': 'ဧရာဝတီတိုင်းဒေသကြီး',
    'Naypyitaw': 'နေပြည်တော်'
};

const subjects = Object.keys(abbrSubjects);
const grades = Object.keys(abbrGrades);
const statesAndDivisions = Object.keys(statesAndDivisionsNames);
const years = ['2025', '2024'];

const examData = [];

console.time('Process Time');
statesAndDivisions.forEach(state => {
    subjects.forEach(subject => {
        grades.forEach(grade => {
            years.forEach(year => {
                const paperInfo = `${abbrGrades[grade]} - ${year} (${abbrSubjects[subject]}) [ ${statesAndDivisionsNames[state]} ]`;
                const fileName = `${grade}_${year}_${subject}_${state}.pdf`;
                const fileURL = `./../papers/${fileName}`;
                const filePath = path.join(__dirname, fileURL);

                if (fs.existsSync(filePath)) {
                    examData.push({
                            name: paperInfo,
                            url: fileURL,
                            grade: grade,
                            year: year,
                            subject: subject,
                            place: state
                    });
                    console.log(`   
                        \u2705 File found for ${grade} ${subject} for ${state}
                        `); // File exists!
                } else {
                    console.log(`\u274C File not found for ${grade} ${subject} for ${state}`); // File missing
                }
            });
        });
    });
});


// Check for "--readable" flag
const humanReadable = process.argv.includes('--readable');

// Write the generated exam data to a JSON file (force UTF-8 encoding)
fs.writeFileSync('examData.json', JSON.stringify(examData, null, humanReadable ? 2 : 0), 'utf8');

console.log('\nExam data generated successfully (to root\\assets\\examData.json).');
if (!humanReadable) console.log('(!) Use the flag \`--readable\` for readable JSON format');

console.timeEnd('Process Time');