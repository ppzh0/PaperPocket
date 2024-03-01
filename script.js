// script.js
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const input = document.getElementById("yearInput").value;
    const searchType = getInputType(input);

    if (searchType === "year") {
        searchByYear(input);
    } else if (searchType === "grade") {
        searchByGrade(input);
    }
});

document.getElementById("yearInput").addEventListener("input", function() {
    const inputValue = this.value;
    displaySuggestions(inputValue);
});

// Sample exam paper data
const examPapers = [
    { grade: 5, year: 2023, division: "Yangon", question: "Sample question 1" },
    { grade: 5, year: 2023, division: "Mandalay", question: "Sample question 2" },
    { grade: 9, year: 2022, division: "Sagaing", question: "Sample question 3" },
    { grade: 9, year: 2022, division: "Ayeyarwady", question: "Sample question 4" },
    { grade: 12, year: 2021, division: "Tanintharyi", question: "Sample question 5" },
    { grade: 12, year: 2021, division: "Kachin", question: "Sample question 6" }
    // Add more exam paper data here
];

function searchByYear(year) {
    // Perform search for exam papers based on the selected year
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = ""; // Clear previous results

    const resultList = document.createElement("ul");
    examPapers.forEach(function(examPaper) {
        if (examPaper.year == year) {
            const listItem = document.createElement("li");
            listItem.textContent = "Grade " + examPaper.grade + ", " + examPaper.year + " - " + examPaper.division + ": " + examPaper.question;
            resultList.appendChild(listItem);
        }
    });

    if (resultList.childNodes.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found for year " + year;
        searchResultsContainer.appendChild(noResultsMessage);
    } else {
        searchResultsContainer.appendChild(resultList);
    }
}

function searchByGrade(gradeInput) {
    // Convert shorthand grade input to full grade number (e.g., "g5" to "5")
    const grade = parseGradeInput(gradeInput);

    // Perform search for exam papers based on the selected grade
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = ""; // Clear previous results

    const resultList = document.createElement("ul");
    examPapers.forEach(function(examPaper) {
        if (examPaper.grade == grade) {
            const listItem = document.createElement("li");
            listItem.textContent = "Grade " + examPaper.grade + ", " + examPaper.year + " - " + examPaper.division + ": " + examPaper.question;
            resultList.appendChild(listItem);
        }
    });

    if (resultList.childNodes.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found for grade " + grade;
        searchResultsContainer.appendChild(noResultsMessage);
    } else {
        searchResultsContainer.appendChild(resultList);
    }
}

function displaySuggestions(inputValue) {
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = ""; // Clear previous suggestions

    if (inputValue.trim() === "") {
        return; // Don't display suggestions if input is empty
    }

    // Check if input represents a year or grade
    const searchType = getInputType(inputValue);

    if (searchType === "year") {
        // Filter unique years based on input value
        const matchingYears = examPapers.reduce(function(years, examPaper) {
            if (examPaper.year.toString().startsWith(inputValue)) {
                if (!years.includes(examPaper.year)) {
                    years.push(examPaper.year);
                }
            }
            return years;
        }, []);

        // Create dropdown list for suggestions
        const dropdownList = document.createElement("ul");
        dropdownList.classList.add("dropdown-list");

        matchingYears.forEach(function(year) {
            const listItem = document.createElement("li");
            listItem.textContent = year;
            listItem.addEventListener("click", function() {
                document.getElementById("yearInput").value = year;
                searchByYear(year);
            });
            dropdownList.appendChild(listItem);
        });

        searchResultsContainer.appendChild(dropdownList);
    } else if (searchType === "grade") {
        // Filter grades based on input value
        const matchingGrades = examPapers.reduce(function(grades, examPaper) {
            if (examPaper.grade.toString().startsWith(inputValue)) {
                if (!grades.includes(examPaper.grade)) {
                    grades.push(examPaper.grade);
                }
            }
            return grades;
        }, []);

        // Create dropdown list for suggestions
        const dropdownList = document.createElement("ul");
        dropdownList.classList.add("dropdown-list");

        matchingGrades.forEach(function(grade) {
            const listItem = document.createElement("li");
            listItem.textContent = "Grade " + grade;
            listItem.addEventListener("click", function() {
                document.getElementById("yearInput").value = "g" + grade;
                searchByGrade("g" + grade);
            });
            dropdownList.appendChild(listItem);
        });

        searchResultsContainer.appendChild(dropdownList);
    }
}

function getInputType(inputValue) {
    // Check if input represents a year or grade
    if (!isNaN(inputValue)) {
        return "year";
    } else if (inputValue.toLowerCase().startsWith("g")) {
        const gradeInput = inputValue.substring(1);
        if (!isNaN(gradeInput)) {
            return "grade";
        }
    }
    return "";
}

function parseGradeInput(gradeInput) {
    // Parse shorthand grade input to full grade number (e.g., "g5" to "5")
    if (gradeInput.toLowerCase().startsWith("g")) {
        return parseInt(gradeInput.substring(1));
    }
    return parseInt(gradeInput);
}
