document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".question");
    const tableBody = document.querySelector("#resumo-respostas tbody");
    const tabela = document.querySelector("#resumo-respostas");
    const btnRevelar = document.querySelector("#revelar-tabela");

    btnRevelar.addEventListener("click", () => {
        tabela.style.display = "table"; 
        btnRevelar.style.display = "none"; 
    });

    questions.forEach((question) => {
        const options = question.querySelectorAll(".option");
        const responderBtn = question.querySelector(".responder-btn");
        let selectedOption = null;
        let answered = false;

        options.forEach((option) => {
            const button = option.querySelector("button");

            button.addEventListener("click", () => {
                if (answered) return;

                options.forEach((opt) => {
                    opt.querySelector("button").classList.remove("selected");
                });

                button.classList.add("selected");
                selectedOption = button;
                responderBtn.disabled = false;
            });
        });

        responderBtn.addEventListener("click", () => {
            if (selectedOption) {
                const questionNumber = question.getAttribute("data-question");
                const correctAnswer = question.getAttribute("data-correct");
                const selectedValue = selectedOption.parentElement.getAttribute("data-value");

                let row = document.createElement("tr");
                let cellQuestion = document.createElement("td");
                let cellCorrectAnswer = document.createElement("td");
                let cellChosenAnswer = document.createElement("td");

                cellQuestion.textContent = questionNumber;
                cellCorrectAnswer.textContent = correctAnswer;
                cellChosenAnswer.textContent = selectedValue;

                if (selectedValue === correctAnswer) {
                    selectedOption.classList.add("correct");
                    cellChosenAnswer.classList.add("resposta-correta"); 
                } else {
                    selectedOption.classList.add("incorrect");
                    cellChosenAnswer.classList.add("resposta-incorreta");

                    options.forEach((option) => {
                        const button = option.querySelector("button");
                        if (option.getAttribute("data-value") === correctAnswer) {
                            button.classList.add("correct");
                        }
                    });
                }

                row.appendChild(cellQuestion);
                row.appendChild(cellCorrectAnswer);
                row.appendChild(cellChosenAnswer);
                tableBody.appendChild(row);

                responderBtn.disabled = true;
                answered = true;
            }
        });
    });
});
