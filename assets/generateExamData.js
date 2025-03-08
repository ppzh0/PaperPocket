const fs = require('fs');
const path = require('path');

// Define lists of subjects, grades, and years
const subjects = ['Myanmar', 'English', 'Mathematics', 'Geography', 'History', 'Science']; // List of subjects
const grades = ['Grade-9', 'Grade-5']; // List of grades
const years = ['2024', '2025']; // List of years

// Define list of states and divisions in Myanmar
const statesAndDivisions = ['Kachin', 'Kayah', 'Kayin', 'Chin', 'Sagaing', 'Tanintharyi', 'Bago', 'Magway', 'Mandalay', 'Mon', 'Rakhine', 'Yangon', 'Shan', 'Ayeyarwady'];

const examData = [];

// Generate exam data for each state or division
statesAndDivisions.forEach(state => {
    subjects.forEach(subject => {
        grades.forEach(grade => {
            years.forEach(year => {
                // Generate exam paper name dynamically
                const examName = `Grade ${grade.split('-')[1]} ${subject} ${year} (${state})`;
                // Generate exam paper URL dynamically
                // Papers that do not exist in the papers folder will show up as errors. Please check the console for details.
                const examUrl = `./../papers/${grade}_${subject}_${year}_${state}.pdf`; // Fixed URL structure
                const filePath = path.join(__dirname, examUrl);
                // Check if the file exists
                if (fs.existsSync(filePath)) {
                    // Push the generated data to the examData array
                    examData.push({ year, grade, subject, place: state, name: examName, url: examUrl });
                } else {
                    console.log(`File does not exist: ${filePath}`);
                }
            });
        });
    });
});

// Flag for JSON formatting: true for human-readable, false for minimized
const humanReadable = false;

// Write the generated exam data to a JSON file
fs.writeFileSync('examData.json', JSON.stringify(examData, null, humanReadable ? 2 : 0));

console.log('\nExam data generated successfully. Touch some grass! (╯▽╰ ) \n');
console.log('Papers that do not exist in the papers folder will show up as errors. \nPlease contribute to the papers folder if you have the missing papers.');
