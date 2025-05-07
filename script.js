const calendar = document.getElementById("calendar");
const taskArea = document.getElementById("taskArea");
const selectedDate = document.getElementById("selectedDate");
const taskInput = document.getElementById("taskInput");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekdayName(index) {
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return weekdays[index];
}

function generateCalendar(year, month) {
  calendar.innerHTML = "";

  // Cabeçalho dos dias da semana
  for (let i = 0; i < 7; i++) {
    const weekday = document.createElement("div");
    weekday.classList.add("weekday");
    weekday.textContent = getWeekdayName(i);
    calendar.appendChild(weekday);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getMonthDays(year, month);

  // Preenche os dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;

    const key = `${year}-${month + 1}-${day}`;
    if (localStorage.getItem(key)) {
      dayDiv.classList.add("has-task");
    }

    dayDiv.onclick = () => openTaskArea(year, month, day);
    calendar.appendChild(dayDiv);
  }

  monthYear.textContent = `${currentDate.toLocaleString("pt-BR", { month: "long" })} ${year}`;
}

function openTaskArea(year, month, day) {
  const key = `${year}-${month + 1}-${day}`;
  selectedDate.textContent = `Tarefas do dia ${day}/${month + 1}/${year}`;
  taskInput.value = localStorage.getItem(key) || "";
  taskArea.style.display = "block";
  taskArea.setAttribute("data-key", key);
}

function saveTask() {
  const key = taskArea.getAttribute("data-key");
  localStorage.setItem(key, taskInput.value);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  alert("Tarefa salva com sucesso!");
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  taskArea.style.display = "none";
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  taskArea.style.display = "none";
};

// **NOVO: Listener para receber tarefas do Landbot**
window.addEventListener('message', function(event) {
  // Segurança: opcionalmente, valide event.origin aqui
  if (event.data?.type === 'nova-tarefa') {
    const dataTarefa = event.data.data.data;        // Ex: "2025-05-10"
    const descricao = event.data.data.descricao;    // Ex: "Fazer exercício de matemática"

    // Converte a data para o formato da chave localStorage: "YYYY-M-D"
    const [ano, mes, dia] = dataTarefa.split('-');
    const key = `${ano}-${parseInt(mes)}-${parseInt(dia)}`;

    // Salva no localStorage
    localStorage.setItem(key, descricao);

    // Atualiza o calendário para mostrar o ícone da tarefa
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    alert(`✅ Tarefa recebida do chatbot!\n${descricao} em ${dia}/${mes}/${ano}`);
  }
});

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());