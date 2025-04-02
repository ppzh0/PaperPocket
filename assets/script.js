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
                const noPapersMessage = document.createElement('p');
                noPapersMessage.innerHTML = `<p class="text-body-secondary">မေးခွန်းစာရွက်များမရှိသေးပါ။ No exam papers found. Some papers aren't here yet!</p>
                <a href="mailto:paperpocket0@gmail.com" class="d-block btn btn-outline-primary">Contribute to make this more accessible!</a>`;
                noPapersMessage.style.opacity = '0'; // Start hidden
                noPapersMessage.style.transition = 'opacity 0.8s ease-in-out'; // Smooth fade-in
                examPapers.appendChild(noPapersMessage);

                // Apply fade-in effect after a short delay
                setTimeout(() => {
                    noPapersMessage.style.opacity = '1';
                }, 50);
            } else {
                filteredPapers.forEach(paper => {
                    const paperLink = document.createElement('a');
                    paperLink.textContent = paper.name;
                    paperLink.href = paper.url;
                    paperLink.classList.add('d-inline-flex', 'focus-ring', 'focus-ring-dark', 'py-1', 'px-2', 'my-1', 'link-primary', 'link-offset-2', 'link-underline-opacity-25', 'link-underline-opacity-100-hover');
                    paperLink.download = ''; // Enable download on PC
                    examPapers.appendChild(paperLink);
                    examPapers.appendChild(document.createElement('br')); // Add line break
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

// FOR COPYING SITE URL

// Function to copy URL and show the alert box
function copyURL() {
    const url = window.location.href;
    const alertBox = document.getElementById("alertBox");
    try {
        // Use the Clipboard API for modern browsers
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    showAlert(alertBox);
                })
                .catch((err) => {
                    console.error("Failed to copy: ", err);
                    fallbackCopy(url, alertBox);
                });
        } else {
            // Fallback for older browsers (execCommand)
            fallbackCopy(url, alertBox);
        }
    } catch (err) {
        console.error("Error while copying: ", err);
        fallbackCopy(url, alertBox);
    }
}

// Show the alert box for a set period (4 seconds)
function showAlert(alertBox) {
    alertBox.style.display = "block";
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 7000);
}

// Fallback function using execCommand for older browsers
function fallbackCopy(url, alertBox) {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices
    try {
        document.execCommand("copy");
        showAlert(alertBox);
    } catch (err) {
        console.error("Fallback copy failed: ", err);
    } finally {
        document.body.removeChild(textArea);
    }
}
