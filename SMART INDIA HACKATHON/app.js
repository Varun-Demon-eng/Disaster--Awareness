// Application Data
const appData = {
    disasters: [
        {
            type: "Earthquake",
            icon: "🏠",
            description: "Learn about earthquake safety and preparedness",
            progress: 75,
            modules: [
                {
                    title: "Understanding Earthquakes",
                    content: "Earthquakes occur when tectonic plates shift suddenly. The shaking can cause buildings to collapse, so it's important to know how to protect yourself.",
                    quiz: [
                        {
                            question: "What should you do during an earthquake?",
                            options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in doorway", "Use elevator"],
                            correct: 1
                        }
                    ]
                },
                {
                    title: "Earthquake Preparedness",
                    content: "Prepare an emergency kit with water, food, and first aid supplies. Know your evacuation routes and safe spots in your home.",
                    quiz: [
                        {
                            question: "How much water should you store per person per day?",
                            options: ["1 liter", "2 liters", "4 liters", "5 liters"],
                            correct: 2
                        }
                    ]
                }
            ]
        },
        {
            type: "Fire",
            icon: "🔥",
            description: "Fire safety and evacuation procedures",
            progress: 60,
            modules: [
                {
                    title: "Fire Prevention",
                    content: "Keep flammable materials away from heat sources. Install smoke detectors and check batteries regularly.",
                    quiz: [
                        {
                            question: "What is the first step if you discover a fire?",
                            options: ["Fight the fire", "Sound the alarm", "Gather belongings", "Call someone"],
                            correct: 1
                        }
                    ]
                }
            ]
        },
        {
            type: "Flood",
            icon: "🌊",
            description: "Flood preparedness and response",
            progress: 40,
            modules: [
                {
                    title: "Flood Safety",
                    content: "Never walk or drive through flood water. Just 6 inches of moving water can knock you down.",
                    quiz: [
                        {
                            question: "How deep flood water can knock you down?",
                            options: ["1 foot", "6 inches", "2 feet", "3 feet"],
                            correct: 1
                        }
                    ]
                }
            ]
        },
        {
            type: "Cyclone",
            icon: "🌀",
            description: "Cyclone preparedness and safety measures",
            progress: 20,
            modules: [
                {
                    title: "Cyclone Basics",
                    content: "Cyclones form over warm ocean waters and can bring destructive winds and flooding.",
                    quiz: [
                        {
                            question: "When should you evacuate during a cyclone?",
                            options: ["When it starts raining", "When authorities advise", "When wind picks up", "When power goes out"],
                            correct: 1
                        }
                    ]
                }
            ]
        }
    ],
    drills: [
        {
            name: "Fire Evacuation Drill",
            type: "fire",
            description: "Practice safe evacuation from a building fire",
            scenarios: [
                {
                    situation: "You smell smoke in the classroom. What do you do first?",
                    options: ["Investigate the source", "Alert the teacher immediately", "Pack your belongings", "Open windows"],
                    correct: 1,
                    feedback: "Correct! Always alert the teacher or authority figure first."
                },
                {
                    situation: "The fire alarm sounds. What is your next step?",
                    options: ["Walk calmly to nearest exit", "Run to the exit", "Hide under desk", "Call your parents"],
                    correct: 0,
                    feedback: "Right! Walk calmly to avoid panic and accidents."
                }
            ]
        },
        {
            name: "Earthquake Drill",
            type: "earthquake", 
            description: "Practice Drop, Cover, and Hold On procedure",
            scenarios: [
                {
                    situation: "Ground starts shaking during class. Your immediate action?",
                    options: ["Run outside", "Get under desk", "Stand still", "Call for help"],
                    correct: 1,
                    feedback: "Correct! Drop, cover, and hold on under a sturdy desk."
                }
            ]
        }
    ],
    userData: {
        name: "Student Demo",
        points: 1250,
        badges: ["Fire Safety Expert", "Earthquake Prepared", "Quiz Master"],
        level: 5,
        completedModules: 8,
        drillsCompleted: 3
    },
    adminData: {
        totalStudents: 450,
        moduleCompletions: {
            Earthquake: 85,
            Fire: 72,
            Flood: 45,
            Cyclone: 28
        },
        averageScore: 78,
        drillParticipation: 92
    }
};

// Application State
let currentQuiz = null;
let currentQuizIndex = 0;
let currentDrill = null;
let currentDrillIndex = 0;
let drillTimer = null;
let userScore = 0;

// Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = btn.dataset.section;
            
            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active section
            sections.forEach(s => s.classList.remove('active'));
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Initialize section-specific content
            if (targetSection === 'learning') {
                initLearningModules();
            } else if (targetSection === 'dashboard') {
                setTimeout(initDashboard, 100); // Small delay to ensure section is visible
            }
        });
    });
}

// Learning Modules
function initLearningModules() {
    const modulesGrid = document.getElementById('modulesGrid');
    if (!modulesGrid) return;
    
    modulesGrid.innerHTML = '';

    appData.disasters.forEach((disaster, disasterIndex) => {
        disaster.modules.forEach((module, moduleIndex) => {
            const moduleCard = createModuleCard(disaster, module, disasterIndex, moduleIndex);
            modulesGrid.appendChild(moduleCard);
        });
    });
}

function createModuleCard(disaster, module, disasterIndex, moduleIndex) {
    const card = document.createElement('div');
    card.className = 'module-card';
    
    const isCompleted = Math.random() > 0.4; // Mock completion status
    const points = Math.floor(Math.random() * 100) + 50;
    
    card.innerHTML = `
        <div class="module-header">
            <div class="module-icon">${disaster.icon}</div>
            <h3 class="module-title">${module.title}</h3>
        </div>
        <div class="module-content">${module.content}</div>
        <div class="module-actions">
            <button class="btn ${isCompleted ? 'btn--secondary' : 'btn--primary'}" 
                    onclick="startQuiz(${disasterIndex}, ${moduleIndex})">
                ${isCompleted ? 'Review Quiz' : 'Take Quiz'}
            </button>
            <span class="status ${isCompleted ? 'status--success' : 'status--info'}">
                ${isCompleted ? `✅ ${points} pts` : '📚 Not started'}
            </span>
        </div>
    `;
    
    return card;
}

function startQuiz(disasterIndex, moduleIndex) {
    const disaster = appData.disasters[disasterIndex];
    const module = disaster.modules[moduleIndex];
    
    if (!module.quiz || module.quiz.length === 0) {
        showNotification('No quiz available for this module', 'warning');
        return;
    }
    
    currentQuiz = module.quiz;
    currentQuizIndex = 0;
    userScore = 0;
    
    const quizTitle = document.getElementById('quizTitle');
    if (quizTitle) {
        quizTitle.textContent = `${disaster.type}: ${module.title} Quiz`;
    }
    
    showQuizQuestion();
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function showQuizQuestion() {
    if (!currentQuiz || currentQuizIndex >= currentQuiz.length) return;
    
    const question = currentQuiz[currentQuizIndex];
    const questionElement = document.getElementById('quizQuestion');
    if (questionElement) {
        questionElement.innerHTML = `
            <h3>Question ${currentQuizIndex + 1} of ${currentQuiz.length}</h3>
            <p>${question.question}</p>
        `;
    }
    
    const optionsContainer = document.getElementById('quizOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectQuizOption(index);
            optionDiv.dataset.index = index;
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    const feedback = document.getElementById('quizFeedback');
    const submitBtn = document.getElementById('quizSubmit');
    const nextBtn = document.getElementById('quizNext');
    
    if (feedback) feedback.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
}

function selectQuizOption(index) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    if (options[index]) {
        options[index].classList.add('selected');
    }
}

function submitQuiz() {
    const selectedOption = document.querySelector('.quiz-option.selected');
    if (!selectedOption) {
        showNotification('Please select an answer', 'warning');
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const question = currentQuiz[currentQuizIndex];
    const isCorrect = selectedIndex === question.correct;
    
    // Show feedback
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        if (index === question.correct) {
            opt.classList.add('correct');
        } else if (opt.classList.contains('selected') && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    const feedback = document.getElementById('quizFeedback');
    if (feedback) {
        feedback.innerHTML = isCorrect 
            ? '<strong>Correct!</strong> Well done!' 
            : `<strong>Incorrect.</strong> The correct answer is: ${question.options[question.correct]}`;
        feedback.classList.remove('hidden');
    }
    
    if (isCorrect) {
        userScore += 10;
        updateUserPoints(10);
    }
    
    const submitBtn = document.getElementById('quizSubmit');
    const nextBtn = document.getElementById('quizNext');
    if (submitBtn) submitBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < currentQuiz.length) {
        showQuizQuestion();
    } else {
        // Quiz completed
        const totalQuestions = currentQuiz.length;
        const correctAnswers = Math.floor(userScore / 10);
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        showNotification(`Quiz completed! You scored ${correctAnswers}/${totalQuestions} (${percentage}%)`, 'success');
        closeQuiz();
    }
}

function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentQuiz = null;
    currentQuizIndex = 0;
}

// Virtual Drills
function startDrill(drillType) {
    const drill = appData.drills.find(d => d.type === drillType || d.name.toLowerCase().includes(drillType));
    if (!drill) {
        showNotification('Drill not found', 'error');
        return;
    }
    
    currentDrill = drill;
    currentDrillIndex = 0;
    userScore = 0;
    
    const drillTitle = document.getElementById('drillTitle');
    if (drillTitle) {
        drillTitle.textContent = drill.name;
    }
    
    showDrillScenario();
    startDrillTimer();
    
    const modal = document.getElementById('drillModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function showDrillScenario() {
    if (!currentDrill || currentDrillIndex >= currentDrill.scenarios.length) return;
    
    const scenario = currentDrill.scenarios[currentDrillIndex];
    const scenarioElement = document.getElementById('drillScenario');
    if (scenarioElement) {
        scenarioElement.innerHTML = `
            <h3>Scenario ${currentDrillIndex + 1} of ${currentDrill.scenarios.length}</h3>
            <p><strong>${scenario.situation}</strong></p>
        `;
    }
    
    const optionsContainer = document.getElementById('drillOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        scenario.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'drill-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectDrillOption(index);
            optionDiv.dataset.index = index;
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    const feedback = document.getElementById('drillFeedback');
    const submitBtn = document.getElementById('drillSubmit');
    const nextBtn = document.getElementById('drillNext');
    
    if (feedback) feedback.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
}

function selectDrillOption(index) {
    const options = document.querySelectorAll('.drill-option');
    options.forEach(opt => opt.classList.remove('selected'));
    if (options[index]) {
        options[index].classList.add('selected');
    }
}

function startDrillTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('drillTimer');
    
    if (drillTimer) {
        clearInterval(drillTimer);
    }
    
    if (timerElement) {
        timerElement.textContent = timeLeft;
    }
    
    drillTimer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(drillTimer);
            submitDrill();
        }
    }, 1000);
}

function submitDrill() {
    if (drillTimer) {
        clearInterval(drillTimer);
    }
    
    const selectedOption = document.querySelector('.drill-option.selected');
    if (!selectedOption) {
        showNotification('Time up! No answer selected.', 'warning');
        nextScenario();
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const scenario = currentDrill.scenarios[currentDrillIndex];
    const isCorrect = selectedIndex === scenario.correct;
    
    const feedback = document.getElementById('drillFeedback');
    if (feedback) {
        feedback.innerHTML = `<strong>${isCorrect ? 'Excellent!' : 'Not quite right.'}</strong> ${scenario.feedback}`;
        feedback.classList.remove('hidden');
    }
    
    if (isCorrect) {
        userScore += 20;
        updateUserPoints(20);
    }
    
    const submitBtn = document.getElementById('drillSubmit');
    const nextBtn = document.getElementById('drillNext');
    if (submitBtn) submitBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

function nextScenario() {
    currentDrillIndex++;
    if (currentDrillIndex < currentDrill.scenarios.length) {
        showDrillScenario();
        startDrillTimer();
    } else {
        // Drill completed
        const totalScenarios = currentDrill.scenarios.length;
        const correctAnswers = Math.floor(userScore / 20);
        const percentage = Math.round((correctAnswers / totalScenarios) * 100);
        
        let badge = '';
        if (percentage >= 80) badge = '🏅 Expert';
        else if (percentage >= 60) badge = '🥈 Advanced';
        else badge = '🥉 Beginner';
        
        showNotification(`Drill completed! You scored ${correctAnswers}/${totalScenarios} (${percentage}%) - ${badge}`, 'success');
        closeDrill();
    }
}

function closeDrill() {
    if (drillTimer) {
        clearInterval(drillTimer);
    }
    const modal = document.getElementById('drillModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentDrill = null;
    currentDrillIndex = 0;
}

// Emergency Tools
function callEmergency(number) {
    showNotification(`Calling ${number}...\n\nIn a real emergency, this would dial the emergency number.\nFor demonstration purposes only.`, 'info');
}

// User Data Management
function updateUserPoints(points) {
    appData.userData.points += points;
    const userPointsElement = document.getElementById('userPoints');
    if (userPointsElement) {
        userPointsElement.textContent = appData.userData.points;
    }
    
    // Update level based on points
    const newLevel = Math.floor(appData.userData.points / 250) + 1;
    if (newLevel > appData.userData.level) {
        appData.userData.level = newLevel;
        const userLevelElement = document.getElementById('userLevel');
        if (userLevelElement) {
            userLevelElement.textContent = newLevel;
        }
        showNotification(`Level up! You've reached Level ${newLevel}!`, 'success');
    }
}

// Dashboard
function initDashboard() {
    const chartCanvas = document.getElementById('moduleChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        createModuleCompletionChart();
    }
}

function createModuleCompletionChart() {
    const ctx = document.getElementById('moduleChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destroy existing chart if it exists
    if (window.moduleChart) {
        window.moduleChart.destroy();
    }
    
    const data = appData.adminData.moduleCompletions;
    
    try {
        window.moduleChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Students Completed',
                    data: Object.values(data),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderColor: ['#13A5B8', '#E6A96B', '#A13A32', '#D4CDB8'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Module Completion Statistics',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        },
                        title: {
                            display: true,
                            text: 'Number of Students'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Disaster Types'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `status status--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Disaster Preparedness Education System...');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize home page disaster cards click functionality
    const disasterCards = document.querySelectorAll('.disaster-card');
    disasterCards.forEach(card => {
        card.addEventListener('click', () => {
            // Switch to learning modules section
            const learningBtn = document.querySelector('[data-section="learning"]');
            if (learningBtn) {
                learningBtn.click();
            }
        });
    });
    
    // Initialize checklist functionality
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                updateUserPoints(5);
                showNotification('Checklist item completed! +5 points', 'success');
            }
        });
    });
    
    // Initialize modal close functionality
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    console.log('Disaster Preparedness Education System initialized successfully!');
});

// Export functions for global access (make them available in the global scope)
window.startQuiz = startQuiz;
window.selectQuizOption = selectQuizOption;
window.submitQuiz = submitQuiz;
window.nextQuestion = nextQuestion;
window.closeQuiz = closeQuiz;
window.startDrill = startDrill;
window.selectDrillOption = selectDrillOption;
window.submitDrill = submitDrill;
window.nextScenario = nextScenario;
window.closeDrill = closeDrill;
window.callEmergency = callEmergency;