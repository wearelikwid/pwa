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
    
    // Create a data attribute to store the workout ID
    const workoutId = workout.createdAt; // Using createdAt as a unique identifier
    card.setAttribute('data-workout-id', workoutId);
    
    card.innerHTML = `
        <h3>${workout.name}</h3>
        <div class='workout-meta'>
            <span>${workout.type}</span>
        </div>
        <div class='workout-actions'>
            <button class='button primary' onclick='startWorkout("${workoutId}")'>
                Start Workout
            </button>
        </div>
    `;
    return card;
}
function startWorkout(workoutId) {
    // Get all workouts and find the matching one
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const workout = workouts.find(w => w.createdAt === workoutId);
    
    if (workout) {
        localStorage.setItem('currentWorkout', JSON.stringify(workout));
        window.location.href = 'start-workout.html';
    }
}
