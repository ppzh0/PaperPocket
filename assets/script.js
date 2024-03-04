document.addEventListener('DOMContentLoaded', function () {
    const yearFilter = document.getElementById('year-filter');
    const gradeFilter = document.getElementById('grade-filter');
    const examPapers = document.getElementById('exam-papers');

    // Mock data for exam papers (replace with your actual data)
    const examData = [
        { year: '2022', grade: 'grade-10', name: '2022 Grade 10 Math Exam', url: 'brb' },
        { year: '2022', grade: 'grade-10', name: '2022 Grade 10 Science Exam', url: 'path_to_pdf_file2.pdf' },
        // Add more exam papers here
    ];

    // Function to render exam papers based on selected filters
    function renderExamPapers() {
        const selectedYear = yearFilter.value;
        const selectedGrade = gradeFilter.value;

        const filteredPapers = examData.filter(paper => {
            return (selectedYear === 'all' || paper.year === selectedYear) &&
                (selectedGrade === 'all' || paper.grade === selectedGrade);
        });

        examPapers.innerHTML = '';

        if (filteredPapers.length === 0) {
            examPapers.innerHTML = '<p>No exam papers found.</p>';
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

    // Initial render
    renderExamPapers();
});
