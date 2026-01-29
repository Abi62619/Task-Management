const  = document.querySelector(".notes textarea");

    // 🔹 Load saved notes
    const savedNotes = localStorage.getItem("tutorNotes");
    if (savedNotes) {
        tutorNotes.value = savedNotes;
    }

    // 🔹 Save notes as user types
    tutorNotes.addEventListener("input", () => {
        localStorage.setItem("tutorNotes", tutorNotes.value);
    });