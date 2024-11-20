document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const week = params.get('week');
    const day = params.get('day');
    
    // Set the workout title
    const workoutTitle = document.getElementById('workout-title');
    workoutTitle.textContent = `Week ${week} - Lower Body`;
    
    // Sample workout data structure
    const workoutData = {
        circuits: [
            {
                name: "Circuit 1",
                exercises: [
                    {
                        name: "Sled push w/rage3 pull",
                        details: "backwards",
                        reps: "3 rounds"
                    }
                ]
            },
            {
                name: "Circuit 2",
                exercises: [
                    {
                        name: "Nordic quad extensions",
                        details: "10",
                        reps: "4 rounds"
                    },
                    {
                        name: "Barbell wall sit",
                        details: "30-40 seconds",
                        reps: "4 rounds"
                    }
                ]
            }
        ]
    };

    // Create and display the workout
    const workoutContainer = document.getElementById('workout-container');
    workoutContainer.innerHTML = ''; // Clear existing content

    workoutData.circuits.forEach((circuit, index) => {
        const circuitSection = document.createElement('div');
        circuitSection.className = 'section';

        const circuitTitle = document.createElement('h2');
        circuitTitle.textContent = circuit.name;
        circuitSection.appendChild(circuitTitle);

        const exerciseList = document.createElement('div');
        exerciseList.className = 'exercise-list';

        circuit.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';

            const exerciseName = document.createElement('div');
            exerciseName.className = 'exercise-name';
            exerciseName.textContent = exercise.name;

            const exerciseDetails = document.createElement('div');
            exerciseDetails.className = 'exercise-details';
            exerciseDetails.textContent = exercise.reps;

            exerciseItem.appendChild(exerciseName);
            exerciseItem.appendChild(exerciseDetails);
            exerciseList.appendChild(exerciseItem);
        });

        circuitSection.appendChild(exerciseList);
        workoutContainer.appendChild(circuitSection);
    });

    // Handle workout completion
    const completeButton = document.getElementById('complete-workout-button');
    completeButton.addEventListener('click', () => {
        completeButton.classList.toggle('active');
        const isCompleted = completeButton.classList.contains('active');
        
        if (isCompleted) {
            completeButton.textContent = 'Completed';
            // Save completion status
            localStorage.setItem(`workout_${week}_${day}`, 'completed');
        } else {
            completeButton.textContent = 'Mark as Complete';
            // Remove completion status
            localStorage.removeItem(`workout_${week}_${day}`);
        }
    });

    // Check if workout was previously completed
    const isCompleted = localStorage.getItem(`workout_${week}_${day}`) === 'completed';
    if (isCompleted) {
        completeButton.classList.add('active');
        completeButton.textContent = 'Completed';
    }
});
