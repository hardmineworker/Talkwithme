let questions = [];
let current = 0;

let scores = {
  empathetic: 0,
  logical: 0,
  social: 0,
  independent: 0,
  aggressive: 0,
  anxious: 0
};

Promise.all([
  fetch("questions.json").then(res => res.json()),
  fetch("results.json").then(res => res.json())
]).then(([qData, rData]) => {
  questions = qData;
  resultsData = rData;
  loadQuestion();
});


function loadQuestion() {
  const q = questions[current];

  document.getElementById("question").innerText = q.text;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  for (let i = 0; i < q.options.length; i++) {
    const div = document.createElement("div");
    div.className = "option";

    div.innerText = q.options[i].text;
    div.onclick = () => {
      for (let key in q.options[i].score) {
        scores[key] += q.options[i].score[key];
      }

      current++;

      if (current < questions.length) {
        loadQuestion();
      } else {
        showResult();
      }
    };

    answersDiv.appendChild(div);
  }
}

let resultsData = [];


function evaluateCondition(condition) {
  try {
    return Function("scores", "return " + condition)(scores);
  } catch {
    return false;
  }
}

function showResult() {
  let resultText = "";

  resultsData.forEach(item => {
    if (evaluateCondition(item.condition)) {
      resultText += item.text + "\n\n";
    }
  });

  document.querySelector(".page").innerHTML = `
    <h1>분석 결과</h1>
    <p style="white-space: pre-line;">${resultText}</p>
  `;
} 

