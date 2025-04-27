
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

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.5 }); // Quando metade da questão estiver visível
        
        document.querySelectorAll('.question').forEach((question) => {
            observer.observe(question);
        });

        let scrollTimeout;

        const questionsArray = Array.from(document.querySelectorAll('.question'));
        const progressBar = document.getElementById('progress-bar');
        const main = document.querySelector('main');

        main.addEventListener('scroll', () => {
            const scrollTop = main.scrollTop;
            const scrollHeight = main.scrollHeight - main.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;

            progressBar.style.opacity = 1; // sempre mostra ao começar a rolar

        clearTimeout(scrollTimeout); // limpa o timer anterior
        scrollTimeout = setTimeout(() => {
            progressBar.style.opacity = 0; // esconde depois de parar de rolar
        }, 800); // 800 milissegundos depois de parar

            // Atualiza a largura da barra
            progressBar.style.width = `${scrolled}%`;

            // Calcula a cor com base no progresso (0 = vermelho, 100 = verde)
            const hue = (scrolled * 120) / 100; // 0 (vermelho) a 120 (verde)
            progressBar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
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

