document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const week = urlParams.get('week');
    const type = urlParams.get('type');

    document.getElementById('workout-title').textContent = `Week ${week} - ${formatWorkoutType(type)}`;

    // Add completion button
    const completeButton = document.createElement('button');
    completeButton.id = 'complete-workout-button';
    completeButton.className = 'complete-workout-button';
    completeButton.innerHTML = 'Mark as Complete';
    document.querySelector('.workout-header').appendChild(completeButton);

    // Check if workout is already completed
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress) {
        const completedWorkouts = JSON.parse(savedProgress);
        const isCompleted = completedWorkouts.some(workout => 
            workout.week === week && workout.type === type);
        if (isCompleted) {
            completeButton.classList.add('active');
            completeButton.innerHTML = 'Completed';
        }
    }

    // Add click handler for completion
    completeButton.addEventListener('click', function() {
        toggleWorkoutCompletion(week, type, this);
    });

    // Load workout data
    fetch(`workouts/week${week}.json`)
        .then(response => response.json())
        .then(data => {
            const workoutData = data[type];
            if (workoutData) {
                displayWorkout(workoutData);
            } else {
                displayError(`No ${formatWorkoutType(type)} workout found for Week ${week}`);
            }
        })
        .catch(error => {
            console.error('Error loading workout:', error);
            displayError(`Error loading workout for Week ${week}`);
        });
});

function formatWorkoutType(type) {
    const words = type.split(/(?=[A-Z])/);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function displayWorkout(workout) {
    const workoutContainer = document.getElementById('workout-container');
    let html = '';

    // Display warmup if it exists
    if (workout.warmup && workout.warmup.exercises) {
        html += '<div class="section"><h2>Warm-up</h2>';
        html += '<ul class="exercise-list">';
        workout.warmup.exercises.forEach(exercise => {
            html += createExerciseListItem(exercise);
        });
        html += '</ul></div>';
    }

    // Display circuits if they exist
    if (workout.circuits) {
        workout.circuits.forEach((circuit, index) => {
            html += `<div class="section"><h2>${circuit.name || `Circuit ${index + 1}`}</h2>`;
            html += '<ul class="exercise-list">';
            circuit.exercises.forEach(exercise => {
                html += createExerciseListItem(exercise);
            });
            html += '</ul></div>';
        });
    }

    // Display single circuit if it exists
    if (workout.circuit && workout.circuit.exercises) {
        html += '<div class="section"><h2>Circuit</h2>';
        html += '<ul class="exercise-list">';
        workout.circuit.exercises.forEach(exercise => {
            html += createExerciseListItem(exercise);
        });
        html += '</ul></div>';
    }

    workoutContainer.innerHTML = html;
}

function createExerciseListItem(exercise) {
    let details = `${exercise.reps}`;
    if (exercise.weight) details += ` - ${exercise.weight}`;
    if (exercise.notes) details += ` (${exercise.notes})`;
    if (exercise.rounds) details += ` - ${exercise.rounds} rounds`;
    
    return `
        <li class="exercise-item">
            <span class="exercise-name">${exercise.exercise}</span>
            <span class="exercise-details">${details}</span>
        </li>
    `;
}

function displayError(message) {
    const workoutContainer = document.getElementById('workout-container');
    workoutContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

function toggleWorkoutCompletion(week, type, button) {
    let completedWorkouts = [];
    const savedProgress = localStorage.getItem('workoutProgress');
    
    if (savedProgress) {
        completedWorkouts = JSON.parse(savedProgress);
    }

    const workoutIndex = completedWorkouts.findIndex(workout => 
        workout.week === week && workout.type === type);

    if (workoutIndex === -1) {
        // Add to completed workouts
        completedWorkouts.push({ week, type });
        button.classList.add('active');
        button.innerHTML = 'Completed';
    } else {
        // Remove from completed workouts
        completedWorkouts.splice(workoutIndex, 1);
        button.classList.remove('active');
        button.innerHTML = 'Mark as Complete';
    }

    localStorage.setItem('workoutProgress', JSON.stringify(completedWorkouts));
}