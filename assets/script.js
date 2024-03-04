// Made with ChatGPT in a rush!
document.addEventListener('DOMContentLoaded', function () {
    const yearFilter = document.getElementById('year-filter');
    const gradeFilter = document.getElementById('grade-filter');
    const subjectFiler = document.getElementById('subject-filter');
    const examPapers = document.getElementById('exam-papers');

    // Function to render exam papers based on selected filters
    function renderExamPapers() {
        const selectedYear = yearFilter.value;
        const selectedGrade = gradeFilter.value;
        const selectedSubject = subjectFiler.value;

        const filteredPapers = examData.filter(paper => {
            return (selectedYear === 'all' || paper.year === selectedYear) &&
                (selectedGrade === 'all' || paper.grade === selectedGrade) &&
                (selectedSubject === 'all' || paper.subject === selectedSubject);
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

                // Set download attribute to force download on PC and laptops
                paperLink.download = '';

                examPapers.appendChild(paperLink);
                examPapers.appendChild(document.createElement('br')); // Add line break for separation
            });
        }
    }

    // Event listeners for filter changes
    yearFilter.addEventListener('change', renderExamPapers);
    gradeFilter.addEventListener('change', renderExamPapers);
    subjectFiler.addEventListener('change', renderExamPapers);

    // Initial render
    renderExamPapers();
});
