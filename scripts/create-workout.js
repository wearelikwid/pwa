document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('create-workout-form');
    form.addEventListener('submit', handleFormSubmit);
}

function addSection() {
    const sectionsContainer = document.getElementById('workout-sections');
    const sectionTemplate = document.getElementById('section-template');
    const sectionElement = document.importNode(sectionTemplate.content, true);
    
    // Add event listeners for this section
    const removeButton = sectionElement.querySelector('.remove-section');
    removeButton.addEventListener('click', function(e) {
        e.target.closest('.workout-section').remove();
    });

    const addExerciseButton = sectionElement.querySelector('.add-exercise');
    addExerciseButton.addEventListener('click', function(e) {
        const exercisesList = e.target.previousElementSibling;
        addExerciseToSection(exercisesList);
    });

    sectionsContainer.appendChild(sectionElement);
}

function addExerciseToSection(exercisesList) {
    const exerciseTemplate = document.getElementById('exercise-template');
    const exerciseElement = document.importNode(exerciseTemplate.content, true);
    
    // Add event listener for exercise removal
    const removeButton = exerciseElement.querySelector('.remove-exercise');
    removeButton.addEventListener('click', function(e) {
        e.target.closest('.exercise-item').remove();
    });

    exercisesList.appendChild(exerciseElement);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const workoutData = {
        name: document.getElementById('workout-name').value,
        type: document.getElementById('workout-type').value,
        sections: getSectionsData(),
        createdAt: new Date().toISOString()
    };

    // Store in localStorage
    saveWorkout(workoutData);
    
    // Redirect to workouts list
    window.location.href = 'workouts.html';
}

function getSectionsData() {
    const sections = [];
    const sectionElements = document.querySelectorAll('.workout-section');

    sectionElements.forEach(sectionElement => {
        const sectionData = {
            type: sectionElement.querySelector('.section-type').value,
            name: sectionElement.querySelector('.section-name').value,
            exercises: getExercisesDataForSection(sectionElement)
        };
        sections.push(sectionData);
    });

    return sections;
}

function getExercisesDataForSection(sectionElement) {
    const exercises = [];
    const exerciseItems = sectionElement.querySelectorAll('.exercise-item');

    exerciseItems.forEach(item => {
        exercises.push({
            name: item.querySelector('.exercise-name').value,
            rounds: parseInt(item.querySelector('.exercise-rounds').value),
            reps: parseInt(item.querySelector('.exercise-reps').value),
            notes: item.querySelector('.exercise-notes').value
        });
    });

    return exercises;
}

function saveWorkout(workoutData) {
    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    workouts.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

// Add initial section when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add first section automatically
    addSection();
});
