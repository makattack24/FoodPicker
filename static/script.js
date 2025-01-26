const restaurants = ["Chipotle", "Chili's", "Red Robin", "Momos", "Freddy's", "Five Guys", "Big Bun", "Popeyes", 
    "Jersey Mike's", "Idaho Pizza", "Los Betos", "Luciano's", "Olive Garden", "Yen Ching", "Outback SteakHouse", 
    "IHOP", "The Reef", "Papa Murphy's", "Texas RoadHouse", "Dairy Queen", "Sonic", "Tango's Empanada"];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");
const celebrationDiv = document.getElementById("celebration");

const arc = Math.PI * 2 / restaurants.length; // Calculate the angle of each segment
let startAngle = 0; // Initial rotation angle
let isSpinning = false; // Prevent multiple spins
let selectedIndex = null; // Store the index of the selected segment

function drawWheel(highlightIndex = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    for (let i = 0; i < restaurants.length; i++) {
        const angle = startAngle + i * arc;

        // Highlight the selected segment
        if (i === highlightIndex) {
            ctx.fillStyle = "#4caf50"; // Highlight color
        } else {
            ctx.fillStyle = i % 2 === 0 ? "#ff9800" : "#e91e63"; // Alternate colors
        }

        // Draw the segment
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.closePath();
        ctx.fill();

        // Add restaurant name
        ctx.save();
        ctx.translate(
            250 + Math.cos(angle + arc / 2) * 180,
            250 + Math.sin(angle + arc / 2) * 180
        );
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(restaurants[i], 0, 0);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    const spinTime = 8000; // Spin duration (8 seconds)
    const totalSpins = 5; // Minimum number of full rotations
    const randomOffset = Math.random() * Math.PI * 2; // Random offset angle
    const spinAngle = Math.PI * 2 * totalSpins + randomOffset; // Total spin angle
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinTime, 1); // Normalize progress

        // Slow down effect using easing
        const easeOut = 1 - Math.pow(1 - progress, 3); // Ease-out effect

        // Update the start angle for a smooth spin
        startAngle = spinAngle * easeOut;

        drawWheel(); // Redraw the wheel with the updated angle

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;

            // Determine selected segment
            const totalAngle = (Math.PI * 3 - (startAngle % (Math.PI * 2))) % (Math.PI * 2); // Adjusted for pointer
            selectedIndex = Math.floor(totalAngle / arc) % restaurants.length;
            const selected = restaurants[selectedIndex];

            // Highlight the selected segment
            drawWheel(selectedIndex);

            // Display the result
            setTimeout(() => {
                resultDiv.textContent = `You got: ${selected}!`;
                showCelebration(selected);
            }, 500); // Add slight delay for clarity
        }
    }

    requestAnimationFrame(animate);
}

function showCelebration(selected) {
    celebrationDiv.textContent = `Congratulations! You got: ${selected}!`;
    celebrationDiv.classList.add("show");

    setTimeout(() => {
        celebrationDiv.classList.remove("show");
    }, 3000); // Show celebration for 3 seconds
}

spinButton.addEventListener("click", spinWheel);
drawWheel(); // Draw the initial wheel