const fs = require('fs');

// Define lists of subjects, grades, and years
const subjects = ['Myanmar', 'English', 'Mathematics', 'Geography', 'History', 'Science']; // List of subjects
const grades = ['Grade-9']; // List of grades
const years = ['2024']; // List of years

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
                const examUrl = `papers/${grade}_${subject}_${year}_${state}.pdf`; // Fixed URL structure
                // Push the generated data to the examData array
                examData.push({ year, grade, subject, place: state, name: examName, url: examUrl });
            });
        });
    });
});

// Write the generated exam data to a JSON file
fs.writeFileSync('examData.json', JSON.stringify(examData, null, 2));

console.log('Exam data generated successfully. Touch some grass!');
