document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('create-workout-form');
    form.addEventListener('submit', handleFormSubmit);
}

function addExercise() {
    const exercisesList = document.getElementById('exercises-list');
    const exerciseId = Date.now(); // Unique ID for the exercise

    const exerciseHtml = `
        <div class='exercise-item' id='exercise-${exerciseId}'>
            <div class='exercise-header'>
                <h3>Exercise ${exercisesList.children.length + 1}</h3>
                <button type='button' class='button secondary' onclick='removeExercise(${exerciseId})'>Remove</button>
            </div>
            <div class='exercise-fields'>
                <div class='form-group'>
                    <label>Exercise Name</label>
                    <input type='text' name='exercise-name-${exerciseId}' required>
                </div>
                <div class='form-group'>
                    <label>Sets</label>
                    <input type='number' name='exercise-sets-${exerciseId}' min='1' required>
                </div>
                <div class='form-group'>
                    <label>Reps</label>
                    <input type='number' name='exercise-reps-${exerciseId}' min='1' required>
                </div>
                <div class='form-group'>
                    <label>Notes</label>
                    <input type='text' name='exercise-notes-${exerciseId}'>
                </div>
            </div>
        </div>
    `;

    exercisesList.insertAdjacentHTML('beforeend', exerciseHtml);
}

function removeExercise(exerciseId) {
    const exercise = document.getElementById(`exercise-${exerciseId}`);
    exercise.remove();
    updateExerciseNumbers();
}

function updateExerciseNumbers() {
    const exercises = document.querySelectorAll('.exercise-item h3');
    exercises.forEach((exercise, index) => {
        exercise.textContent = `Exercise ${index + 1}`;
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const workoutData = {
        name: document.getElementById('workout-name').value,
        type: document.getElementById('workout-type').value,
        description: document.getElementById('workout-description').value,
        exercises: getExercisesData(),
        createdAt: new Date().toISOString()
    };

    // Store in localStorage for now
    saveWorkout(workoutData);
    
    // Redirect to workouts list
    window.location.href = 'workouts.html';
}

function getExercisesData() {
    const exercises = [];
    const exerciseItems = document.querySelectorAll('.exercise-item');

    exerciseItems.forEach(item => {
        const id = item.id.split('-')[1];
        exercises.push({
            name: document.querySelector(`[name="exercise-name-${id}"]`).value,
            sets: parseInt(document.querySelector(`[name="exercise-sets-${id}"]`).value),
            reps: parseInt(document.querySelector(`[name="exercise-reps-${id}"]`).value),
            notes: document.querySelector(`[name="exercise-notes-${id}"]`).value
        });
    });

    return exercises;
}

function saveWorkout(workoutData) {
    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    workouts.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}
