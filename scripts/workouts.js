document.addEventListener('DOMContentLoaded', function() {
    loadWorkouts();
});

function loadWorkouts() {
    const workoutsList = document.getElementById('workouts-list');
    
    // In the future, this will load from your backend
    // For now, we'll use sample data
    const sampleWorkouts = [
        {
            id: 1,
            name: 'Upper Body Strength',
            type: 'Strength',
            description: 'Focus on chest, shoulders, and back',
            exercises: 8
        },
        {
            id: 2,
            name: 'Lower Body Power',
            type: 'Power',
            description: 'Squats and deadlifts focus',
            exercises: 6
        }
    ];

    displayWorkouts(sampleWorkouts);
}

function displayWorkouts(workouts) {
    const workoutsList = document.getElementById('workouts-list');
    workoutsList.innerHTML = '';

    workouts.forEach(workout => {
        const workoutCard = createWorkoutCard(workout);
        workoutsList.appendChild(workoutCard);
    });
}

function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    
    card.innerHTML = `
        <h3>${workout.name}</h3>
        <div class='workout-meta'>
            <span>${workout.type}</span> • 
            <span>${workout.exercises} exercises</span>
        </div>
        <p>${workout.description}</p>
        <div class='workout-actions'>
            <button class='workout-button primary' onclick='viewWorkout(${workout.id})'>
                View Workout
            </button>
            <button class='workout-button secondary' onclick='editWorkout(${workout.id})'>
                Edit
            </button>
        </div>
    `;
    
    return card;
}

function viewWorkout(workoutId) {
    // Will be implemented when we create the workout detail page
    window.location.href = `workout-detail.html?id=${workoutId}`;
}

function editWorkout(workoutId) {
    // Will be implemented when we create the workout edit page
    window.location.href = `edit-workout.html?id=${workoutId}`;
}
