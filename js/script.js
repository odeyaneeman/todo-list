
let currentPoints = parseInt(localStorage.getItem("userPoints")) || 0;
let currentLevel = parseInt(localStorage.getItem("userLevel")) || 1;


function updateGamificationUI() {
    const pointsBarFill = document.getElementById("pointsBarFill");
    const pointsText = document.getElementById("pointsText");
    const levelText = document.getElementById("levelText");
    const rankText = document.getElementById("rankText");

    if (pointsBarFill) pointsBarFill.style.width = `${currentPoints}%`;
    if (pointsText) pointsText.innerText = `${currentPoints} / 150 נקודות`;
    if (levelText) levelText.innerText = `רמה ${currentLevel}`;
    if (rankText) rankText.innerText = getRankTitle(currentLevel);
}


function gainPoints(priority) {
    let pointsToGained = 10;
    if (priority === "medium") pointsToGained = 20;
    if (priority === "high") pointsToGained = 30;

    currentPoints += pointsToGained;

    if (currentPoints >= 150) {
      
        currentPoints = currentPoints - 150; 
        currentLevel++;

        if (typeof confetti === "function") {
            confetti();
        }
    }

    localStorage.setItem("userPoints", currentPoints);
    localStorage.setItem("userLevel", currentLevel);
    updateGamificationUI();
}

document.addEventListener("DOMContentLoaded", () => {
    updateGamificationUI();
});



    function resetLevel() {
    currentLevel = 1;
    currentPoints = 0;

    localStorage.setItem("userLevel", currentLevel);
    localStorage.setItem("userPoints", currentPoints);

    updateGamificationUI();
}
   


function createTaskElement(taskText, isCompleted = false, priority="medium") {

    let li = document.createElement("li");

    li.classList.add("priority-"+priority);
    li.dataset.priority=priority;

    let textSpan = document.createElement("span");
    textSpan.innerText = taskText;
    
    if (isCompleted) {
        textSpan.classList.add("done");
    }

   textSpan.onclick = function () {
    if (textSpan.classList.contains("done")) {
        return; 
    }

    textSpan.classList.add("done");

    if (typeof confetti === "function") {
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
    }

    gainPoints(priority);

    saveTasks();
    updateCounter();
};

    li.appendChild(textSpan);

    document.getElementById("taskList").append(li);
    updateCounter();
}




function addTask() {

    let input = document.getElementById("taskInput");
    let priorityInput = document.getElementById("priorityInput");
    let taskText = input.value;
    let priority = priorityInput.value;

    if (taskText === "") {
        return;
    }

    createTaskElement(taskText, false, priority); 
    saveTasks(); 
    input.value = "";

    priorityInput.value = "medium";
}




function clearTasks() {
    document.getElementById("taskList").innerHTML = "";
    saveTasks(); 
            updateCounter();

}



function saveTasks() {
    let tasks = [];
    let lis = document.querySelectorAll("#taskList li");
    
    lis.forEach(function(li) {
        let span = li.querySelector("span"); 
        
        if (span) { 
            tasks.push({
                text: span.innerText,
                completed: span.classList.contains("done"),
                priority: li.dataset.priority
            });
        }
    });
    
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}




function loadTasks() {
    let savedTasks = localStorage.getItem("myTasks");
    
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        
        tasks.forEach(function(task) {
            createTaskElement(task.text, task.completed, task.priority);
        });
        updateCounter();
    }
}

loadTasks();



function filterTasks(filterType) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');

    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(li => {
        const isCompleted = li.querySelector('span').classList.contains('done');

        switch (filterType) {

            case 'all':
                li.style.display = 'flex'; 
                break;

            case 'active':
                li.style.display = isCompleted ? 'none' : 'flex';
                break;

            case 'completed':
                li.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}



let timerInterval;

let totalSeconds = 0;

function startTimer() {

    let minutes =
        document.getElementById("timerInput").value;

    totalSeconds = minutes * 60;

    clearInterval(timerInterval);

    timerInterval = setInterval(function () {

        let mins =
            Math.floor(totalSeconds / 60);

        let secs =
            totalSeconds % 60;

        mins =
            String(mins).padStart(2, "0");

        secs =
            String(secs).padStart(2, "0");

        document.getElementById("timerDisplay").innerText =
            `${mins}:${secs}`;

        totalSeconds--;

        if (totalSeconds < 0) {

            clearInterval(timerInterval);

            alert("הטיימר הסתיים!");

            document.getElementById("timerDisplay").innerText =
                "00:00";
        }

    }, 1000);
}




function stopTimer() {

    clearInterval(timerInterval);

}



function resetTimer() {

    clearInterval(timerInterval);

    totalSeconds = 0;

    document.getElementById("timerDisplay").innerText =
        "00:00";

    document.getElementById("timerInput").value = "";
}




function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    
    let btn = document.querySelector(".dark-mode-btn");
    
    if (document.body.classList.contains("dark-mode")) {
        btn.innerText = "☀️ מצב יום";
    } else {
        btn.innerText = "🌙 מצב לילה";
    }
}



const quotes = [
        "הדרך היחידה לעשות עבודה נהדרת היא לאהוב את מה שאתה עושה",
        "ההצלחה היא הסכום של מאמצים קטנים, שחוזרים עליהם יום אחר יום",
        "העתיד שייך לאלו המאמינים ביופי של החלומות שלהם",
        "קשה עכשיו? זה רק אומר שאתה בעלייה",
        "הצעד הראשון הוא תמיד הכי קשה, אבל הוא זה שמשנה את הכל",
        "אל תחכה להזדמנות, תיצור אותה בעצמך",
        "הכישלון הגדול ביותר הוא לא לנסות בכלל",
        "הסוד להקדים אחרים הוא פשוט להתחיל",
        "מה שנראה לך היום כמו הר גבוה, מחר ייראה כמו גבעה קטנה",
        "כל יום הוא הזדמנות חדשה להיות הגרסה הטובה ביותר של עצמך",
        "אל תפסיק עד שתהיה גאה בעצמך",
        "המוטיבציה היא מה שמניע אותך להתחיל, ההרגל הוא מה שגורם לך להמשיך",
        "זה תמיד נראה בלתי אפשרי עד שזה נעשה",
        "התמדות קטנות מובילות לתוצאות גדולות",
        "המשמעת העצמית היא הגשר בין המטרות לבין ההישגים שלך",
        "אל תסתכל על השעון, תעשה מה שהוא עושה - תמשיך לנוע",
        "אתה מסוגל להרבה יותר ממה שאתה חושב שאתה מסוגל",
        "הדרך הטובה ביותר לחזות את העתיד היא לייצר אותו",
        "ניצחונות קטנים בכל יום בונים הצלחה ענקית בטווח הארוך"
    ];



function generateQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    
    let selectedQuote = quotes[randomIndex];
    
    document.getElementById("quoteDisplay").innerText = selectedQuote;
}




function updateCounter(){
let activeTasks = document.querySelectorAll("#taskList span:not(.done)").length;
let counterElement = document.getElementById("taskCounter");

if (activeTasks === 0) {
        counterElement.innerText = "כל הכבוד! אין לך משימות פתוחות להיום🎉";
    } else if (activeTasks === 1) {
        counterElement.innerText = "נשארה לך רק משימה אחת אחרונה💪";
    } else {
        counterElement.innerText = `נשארו לך עוד ${activeTasks} משימות להיום☺️`;
    }
}



function addSurpriseTask() {

    let surprises = [
        "לשתות כוס מים גדולה ",
        "לעשות מתיחות לצוואר ולגב למשך דקה ",
        "לקום ולעשות 10 קפיצות במקום ",
        "לנשום 3 נשימות עמוקות ואיטיות ",
        "לעצום את העיניים ל-30 שניות ולנוח ",
        "לעשות סיבוב הליכה קצר בבית או בחוץ ",
        
        "לנקות את מסך הטלפון או המחשב ",
        "לסדר 3 חפצים שנמצאים לא במקום בחדר ",
        "למחוק 5 מיילים או הודעות ספאם ישנות ",
        "לרוקן את סל המחזור במחשב ",
        "לארגן את שולחן העבודה שלך למשך 2 דקות ",
        
        "לשלוח הודעה נחמדה לחבר או בן משפחה ",
        "לשמוע שיר אחד שאת ממש אוהבת ומקפיץ אותך ",
        "לחשוב על דבר אחד טוב שקרה לך היום ",
        "לשטוף פנים במים קרים לרענון ",
        "לעשות הפסקה קטנה מהמסכים ולשתות תה או קפה "
    ];
    
    let randomIndex = Math.floor(Math.random() * surprises.length);
    let randomTask = surprises[randomIndex];
    
    createTaskElement(randomTask, false, "low");
    saveTasks();
}