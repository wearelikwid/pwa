document.addEventListener('DOMContentLoaded', function() {
    loadWorkouts();
});

function loadWorkouts() {
    // Load workouts from localStorage
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    displayWorkouts(workouts);
}

function displayWorkouts(workouts) {
    const workoutsList = document.getElementById('workouts-list');
    workoutsList.innerHTML = '';

    if (workouts.length === 0) {
        workoutsList.innerHTML = `
            <div class="empty-state">
                <p>No workouts created yet.</p>
                <a href="create-workout.html" class="button primary">Create Your First Workout</a>
            </div>
        `;
        return;
    }

    workouts.forEach(workout => {
        const workoutCard = createWorkoutCard(workout);
        workoutsList.appendChild(workoutCard);
    });
}

function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    
    // Create a safe version of the workout object for the onclick handler
    const workoutStr = JSON.stringify(workout).replace(/'/g, "\'").replace(/"/g, '\"');
    
    card.innerHTML = `
        <h3>${workout.name}</h3>
        <div class='workout-meta'>
            <span>${workout.type}</span>
        </div>
        <div class='workout-actions'>
            <button class='button primary' onclick='startWorkout(JSON.parse("${workoutStr}"))'>
                Start Workout
            </button>
        </div>
    `;
    
    return card;
}

function startWorkout(workout) {
    // Store the selected workout in localStorage
    localStorage.setItem('currentWorkout', JSON.stringify(workout));
    // Navigate to the workout execution page
    window.location.href = 'start-workout.html';
}
