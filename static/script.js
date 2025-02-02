

let restaurants = [];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");
const celebrationDiv = document.getElementById("celebration");
const optionCountInput = document.getElementById("optionCount");
const allRestaurantsButton = document.getElementById("allRestaurantsButton");
const fastFoodButton = document.getElementById("fastFoodButton");
const sitDownButton = document.getElementById("sitDownButton")
let arc;
let startAngle = 0; 
let isSpinning = false; 
let selectedIndex = null; 
let currentFilter = '';

function drawWheel(highlightIndex = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    for (let i = 0; i < restaurants.length; i++) {
        const angle = startAngle + i * arc;

        if (i === highlightIndex) {
            ctx.fillStyle = "#4caf50"; 
        } else {
            ctx.fillStyle = i % 2 === 0 ? "#4335A7" : "#80C4E9";
        }

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.closePath();
        ctx.fill();

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
    if (isSpinning || restaurants.length === 0) return;

    isSpinning = true;
    const spinTime = 4000; // Reduced spin duration (4 seconds)
    const totalSpins = 3; // Reduced number of full rotations
    const randomOffset = Math.random() * Math.PI * 2;
    const spinAngle = Math.PI * 2 * totalSpins + randomOffset;
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinTime, 1);

        // Adjust easing to slow down more smoothly
        const easeOut = 1 - Math.pow(1 - progress, 4);
        startAngle = easeOut * spinAngle;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            const totalAngle = (Math.PI * 3 - (startAngle % (Math.PI * 2))) % (Math.PI * 2);
            selectedIndex = Math.floor((totalAngle % (Math.PI * 2)) / arc) % restaurants.length;

            if (restaurants[selectedIndex]) {
                const selected = restaurants[selectedIndex];
                drawWheel(selectedIndex);
                setTimeout(() => {
                    resultDiv.innerHTML = `You got:<br>${selected}`;
                    showCelebration(selected);
                }, 500);
            }
        }
    }

    requestAnimationFrame(animate);
}

function showCelebration(selected) {
    celebrationDiv.innerHTML = `Congrats Fat Ass!<br><br>You got:<br><br>${selected}`;
    celebrationDiv.classList.add("show");

    setTimeout(() => {
        celebrationDiv.classList.remove("show");
    }, 3500);
}

async function fetchRestaurants(type = '', optionCount = 20) {
    console.log("called");
    console.log("type:", type);

    const lat = 43.6150;
    const lon = -116.2023;
    let url = `/api/restaurants?lat=${lat}&lon=${lon}`;
    if (type !== '') {
        url += `&type=${type}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        restaurants = data.map(r => r.name).slice(0, optionCount);
        console.log(restaurants);

        if (restaurants.length > 0) {
            arc = Math.PI * 2 / restaurants.length;
            drawWheel();
        }
    } catch (error) {
        console.error("Error fetching restaurants:", error);
    }
}

// Function to update options based on user input
function updateOptions() {
    const optionCount = parseInt(optionCountInput.value, 10);
    if (!isNaN(optionCount) && optionCount > 0) {
        fetchRestaurants('', optionCount);
    }
}

// Add event listener to the input field
optionCountInput.addEventListener('input', updateOptions);

allRestaurantsButton.addEventListener('click', () => fetchRestaurants('', parseInt(optionCountInput.value, 10)));
fastFoodButton.addEventListener('click', () => fetchRestaurants('fast_food', parseInt(optionCountInput.value, 10)));
sitDownButton.addEventListener('click', () => fetchRestaurants('restaurant', parseInt(optionCountInput.value, 10)))


spinButton.addEventListener("click", spinWheel);
document.addEventListener("DOMContentLoaded", () => fetchRestaurants());