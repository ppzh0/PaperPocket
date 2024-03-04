document.addEventListener('DOMContentLoaded', function () {
    const gradeFilter = document.getElementById('grade-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const placeFilter = document.getElementById('place-filter');
    const yearFilter = document.getElementById('year-filter');
    const examPapers = document.getElementById('exam-papers');

    // Function to fetch exam data from JSON file
    async function fetchExamData() {
        try {
            const response = await fetch('assets/examData.json');
            if (!response.ok) {
                throw new Error('Failed to fetch exam data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exam data:', error);
            return []; // Return an empty array if fetching fails
        }
    }

    // Function to render exam papers based on selected filters
    async function renderExamPapers() {
        try {
            const examData = await fetchExamData();

            const selectedGrade = gradeFilter.value;
            const selectedSubject = subjectFilter.value;
            const selectedPlace = placeFilter.value;
            const selectedYear = yearFilter.value;

            const filteredPapers = examData.filter(paper => {
                return (selectedYear === 'all' || paper.year === selectedYear) &&
                    (selectedGrade === 'all' || paper.grade === selectedGrade) &&
                    (selectedSubject === 'all' || paper.subject === selectedSubject) &&
                    (selectedPlace === 'all' || paper.place === selectedPlace);
            });

            examPapers.innerHTML = '';

            if (filteredPapers.length === 0) {
                examPapers.innerHTML = "<p>No exam papers found. Some papers aren't here yet! <a href=\"mailto:paperpocket0@gmail.com\">Contribute to make this more accessible!</a></p>";
            } else {
                filteredPapers.forEach(paper => {
                    const paperLink = document.createElement('a');
                    paperLink.textContent = paper.name;
                    paperLink.href = paper.url;
                    paperLink.classList.add('exam-paper-link');
                    paperLink.download = ''; // Set download attribute to force download on PC and laptops
                    examPapers.appendChild(paperLink);
                    examPapers.appendChild(document.createElement('br')); // Add line break for separation
                });
            }
        } catch (error) {
            console.error('Error rendering exam papers:', error);
        }
    }

    // Event listeners for filter changes
    gradeFilter.addEventListener('change', renderExamPapers);
    subjectFilter.addEventListener('change', renderExamPapers);
    placeFilter.addEventListener('change', renderExamPapers);
    yearFilter.addEventListener('change', renderExamPapers);

    // Initial render
    renderExamPapers();
});
