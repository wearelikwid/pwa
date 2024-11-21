document.addEventListener('DOMContentLoaded', function() {
    loadWorkout();
    initializeCompleteButton();
});

function loadWorkout() {
    // Get the current workout from localStorage
    const workout = JSON.parse(localStorage.getItem('currentWorkout'));
    if (!workout) {
        window.location.href = 'workouts.html';
        return;
    }

    // Set workout name and type
    document.getElementById('workout-name').textContent = workout.name;
    document.getElementById('workout-type').textContent = workout.type;

    // Load sections
    displaySections(workout.sections);
}

function displaySections(sections) {
    const sectionsContainer = document.getElementById('workout-sections');
    sectionsContainer.innerHTML = '';

    sections.forEach((section, index) => {
        const sectionElement = createSectionElement(section, index + 1);
        sectionsContainer.appendChild(sectionElement);
    });
}

function createSectionElement(section, sectionNumber) {
    const sectionTemplate = document.getElementById('section-template');
    const sectionElement = document.importNode(sectionTemplate.content, true);
    
    // Set section title
    const titleElement = sectionElement.querySelector('.section-title');
    titleElement.textContent = `${section.type} ${sectionNumber}`;

    // Add exercises
    const exercisesList = sectionElement.querySelector('.exercises-list');
    section.exercises.forEach(exercise => {
        const exerciseElement = createExerciseElement(exercise);
        exercisesList.appendChild(exerciseElement);
    });

    return sectionElement;
}

function createExerciseElement(exercise) {
    const exerciseTemplate = document.getElementById('exercise-template');
    const exerciseElement = document.importNode(exerciseTemplate.content, true);
    
    // Set exercise details
    exerciseElement.querySelector('.exercise-name').textContent = exercise.name;
    
    // Only show notes if they exist
    const notesElement = exerciseElement.querySelector('.exercise-notes');
    if (exercise.notes) {
        notesElement.textContent = exercise.notes;
    } else {
        notesElement.style.display = 'none';
    }

    // Set reps and rounds
    const repsElement = exerciseElement.querySelector('.reps');
    const roundsElement = exerciseElement.querySelector('.rounds');
    
    repsElement.textContent = exercise.reps ? `${exercise.reps} reps` : '';
    roundsElement.textContent = exercise.rounds ? `${exercise.rounds} rounds` : '';

    return exerciseElement;
}

function initializeCompleteButton() {
    const completeButton = document.getElementById('complete-workout');
    completeButton.addEventListener('click', markWorkoutComplete);
}

function markWorkoutComplete() {
    const currentWorkout = JSON.parse(localStorage.getItem('currentWorkout'));
    
    // Get all workouts
    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    
    // Find and update the completed workout
    workouts = workouts.map(workout => {
        if (workout.name === currentWorkout.name && 
            workout.createdAt === currentWorkout.createdAt) {
            return {
                ...workout,
                completed: true,
                completedAt: new Date().toISOString()
            };
        }
        return workout;
    });

    // Save updated workouts
    localStorage.setItem('workouts', JSON.stringify(workouts));
    
    // Redirect to workouts list
    window.location.href = 'workouts.html';
}
