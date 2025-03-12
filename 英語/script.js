const questions = [
    {
        question: "Look at the girl ( ) long hair",
        options: ["①with", "②on", "③for", "④at"],
        correctAnswer: 1
    },
    {
        question: "I was born ( ) January 29, 1964",
        options: ["①by", "②on", "③at", "④during"],
        correctAnswer: 2
    },
    {
        question: "The airplane was flying ( ) the tower",
        options: ["①on", "②over", "③up", "④in"],
        correctAnswer: 2
    },
    {
        question: "Mr.Brown has been living in Hong Kong ( ) almost five years",
        options: ["①during", "②while", "③for", "④since"],
        correctAnswer: 3
    },
    {
        question: "He sailed ( ) the Pacific Ocean on a small boat",
        options: ["①by", "②across", "③along", "④among"],
        correctAnswer: 2
    }
];

//     {
//    question: "",
//    options: ["①", "②", "③", "④"],
//    correctAnswer: 3
//}



let currentQuestionIndex = 0;
let score = 0;
let incorrectQuestions = []; // 保存する配列
let incorrectQuestionsIndex = []; // 間違えた問題のインデックス

const questionElement = document.getElementById("question");
const optionsElements = document.querySelectorAll(".option");
const nextButton = document.getElementById("next-button");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("reset-button");
const feedbackElement = document.getElementById("feedback");
const reviewElement = document.getElementById("review"); // 振り返り用の表示部分
const retryIncorrectButton = document.getElementById("retry-incorrect-button"); // 間違えた問題を再試行ボタン
const viewIncorrectButton = document.getElementById("view-incorrect-button"); // 間違えた問題の全てを表示するボタン

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElements.forEach((option, index) => {
        option.textContent = currentQuestion.options[index];
        option.disabled = false; // 再試行時に選択肢を有効にする
    });

    // Remove feedback message before each new question
    feedbackElement.textContent = "";
}

function handleOptionClick(event) {
    const selectedAnswer = parseInt(event.target.dataset.answer);
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    // Show feedback for correct or incorrect answer
    if (selectedAnswer === correctAnswer) {
        score++;
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.style.color = "red";
        // 間違えた問題を保存
        incorrectQuestions.push(questions[currentQuestionIndex]);
        incorrectQuestionsIndex.push(currentQuestionIndex); // 間違えた問題のインデックスも保存
    }

    // Disable the options after an answer is selected
    optionsElements.forEach(option => option.disabled = true);
    
    // Show next button
    nextButton.style.display = "inline-block";
}

optionsElements.forEach(option => {
    option.addEventListener("click", handleOptionClick);
});

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        nextButton.style.display = "none";

        // Enable options again for the next question
        optionsElements.forEach(option => option.disabled = false);
    } else {
        showResult();
    }
});

function showResult() {
    questionElement.textContent = "Quiz Completed!";
    optionsElements.forEach(option => option.style.display = "none");
    nextButton.style.display = "none";
    resultElement.classList.remove("hidden");
    scoreElement.textContent = score;
    
    // 振り返り部分を表示
    if (incorrectQuestions.length > 0) {
        displayReview();
        retryIncorrectButton.style.display = "inline-block"; // 再試行ボタンを表示
        viewIncorrectButton.style.display = "inline-block"; // 間違えた問題を表示するボタンを表示
    } else {
        reviewElement.textContent = "You answered all questions correctly!";
        retryIncorrectButton.style.display = "none"; // 再試行ボタンを非表示
        viewIncorrectButton.style.display = "none"; // 間違えた問題ボタンを非表示
    }
}

// ...existing code...

function displayReview() {
    reviewElement.innerHTML = "<h3>Incorrect Questions:</h3>";
    incorrectQuestions.forEach((incorrectQuestion, index) => {
        const userAnswerIndex = incorrectQuestionsIndex[index];
        const userAnswer = questions[userAnswerIndex].options[parseInt(optionsElements[userAnswerIndex].dataset.answer) - 1];
        reviewElement.innerHTML += `
            <div class="review-question">
                <p><strong>Question:</strong> ${incorrectQuestion.question}</p>
                <p><strong>Your Answer:</strong> ${userAnswer}</p>
                <p><strong>Correct Answer:</strong> ${incorrectQuestion.options[incorrectQuestion.correctAnswer - 1]}</p>
            </div>
        `;
    });
}

retryIncorrectButton.addEventListener("click", () => {
    // 間違えた問題だけを再度表示する
    if (incorrectQuestionsIndex.length > 0) {
        currentQuestionIndex = incorrectQuestionsIndex[0]; // 最初の間違えた問題のインデックスに移動
        loadQuestion();
        nextButton.style.display = "none";
        feedbackElement.textContent = "";

        // 再試行時に選択肢を有効にする
        optionsElements.forEach(option => {
            option.disabled = false; // 選択肢を有効化
            option.style.display = "inline-block"; // 選択肢を再表示
        });

        // 再試行後は間違えた問題を振り返りから削除
        incorrectQuestions = [];
        incorrectQuestionsIndex = [];
        retryIncorrectButton.style.display = "none"; // ボタンを非表示にする
    }
});
// ...existing code...
viewIncorrectButton.addEventListener("click", () => {
    // 振り返りモードで間違えた問題を全て表示
    reviewElement.innerHTML = "<h3>All Incorrect Questions:</h3>";
    incorrectQuestions.forEach((incorrectQuestion, index) => {
        reviewElement.innerHTML += `
            <div class="review-question">
                <p><strong>Question ${index + 1}:</strong> ${incorrectQuestion.question}</p>
                <ul>
                    ${incorrectQuestion.options.map((option, i) => {
                        return `<li>${option}</li>`;
                    }).join("")}
                </ul>
                <p><strong>Your Answer:</strong> ${incorrectQuestion.options[incorrectQuestion.correctAnswer - 1]}</p>
                <p><strong>Correct Answer:</strong> ${incorrectQuestion.options[incorrectQuestion.correctAnswer - 1]}</p>
            </div>
        `;
    });
    retryIncorrectButton.style.display = "none"; // 再試行ボタンを非表示にする
});

resetButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    incorrectQuestions = []; // 振り返りリセット
    incorrectQuestionsIndex = [];
    resultElement.classList.add("hidden");
    feedbackElement.textContent = "";
    reviewElement.innerHTML = "";
    loadQuestion();
    optionsElements.forEach(option => option.style.display = "block");
    nextButton.style.display = "none";
    retryIncorrectButton.style.display = "none"; // ボタンを非表示
    viewIncorrectButton.style.display = "none"; // 間違えた問題ボタンを非表示
});

loadQuestion();
