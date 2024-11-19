document.addEventListener('DOMContentLoaded', async function() {
    // Generate all week sections
    const weeksContainer = document.getElementById('weeks-container');
    let weeksHTML = '';
    let weekNumber = 1;
    
    while (true) {
        try {
            // Try to fetch the workout file
            const response = await fetch(`workouts/week${weekNumber}.json`);
            if (!response.ok) {
                break; // Stop if we can't find the next week's file
            }
            weeksHTML += createWeekSection(weekNumber);
            weekNumber++;
        } catch (error) {
            break; // Stop if there's an error fetching the file
        }
    }

    if (weekNumber === 1) {
        weeksContainer.innerHTML = '<div class="error-message">No workout files found</div>';
    } else {
        weeksContainer.innerHTML = weeksHTML;
        
        // Load saved progress
        loadProgress();

        // Add click handlers to all complete buttons
        document.querySelectorAll('.complete-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const week = this.dataset.week;
                const type = this.dataset.type;
                toggleWorkoutCompletion(week, type, this);
            });
        });
    }
});
