const inc = document.getElementById("count");
const tasks = document.getElementById("tasks");
const input = document.getElementById("task");
const addButton = document.getElementById("add");
const radioButtons = document.getElementsByName("filter");

let idSet = 0;
let filter = "all";
let task_list = Array();

input.addEventListener("input", () => {
  let t = input.value.trim() === ""
  addButton.disabled = t
  addButton.style.cursor = t ? 'not-allowed': 'pointer'
});

function toBackend(f) {
  return new Promise(() => {
    const delay = Math.random() * 5000 + 1000;
    setTimeout(() => {
      f();
    }, delay);
  }).then(()=>rec());
}

function forButton() {
  toBackend(() => add_new_task());
  rec();
  addButton.disabled = true;
    addButton.style.cursor = 'not-allowed'

}

radioButtons.forEach((element) => {
  element.addEventListener("input", () => {
    for (const radio of radioButtons) {
      if (radio.checked) {
        filter = radio.id;
        break;
      }
    }
    update_tasks();
  });
});

function rec() {
  update_tasks();
  let count = 0;
  for (const child of tasks.children) {
    if (!child.children[0].checked) {
      count++;
      child.children[1].className = "ongoing";
    } else {
      child.children[1].className = "stopped";
    }
  }
  inc.textContent = count;
}

function add_new_task() {
  const holder = document.createElement("div");
  holder.style.width = "100%";
  holder.id = String(idSet);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "taskBox";
  checkbox.addEventListener("click", rec);

  const forgetMeNot = document.createElement("button");
  forgetMeNot.textContent = "-";
  forgetMeNot.className = "forgetMeNot";
  idSet++;

  const label = document.createElement("label");
  label.htmlFor = "taskBox";
  label.textContent = input.value;
  input.value = "";
  label.className = "ongoing";

  holder.append(checkbox, label, forgetMeNot);
  forgetMeNot.addEventListener("click", function (event) {
    const parentElement = this.parentElement;
    const index = task_list.indexOf(parentElement)
    forgetMeNot.disabled = true
    forgetMeNot.style.cursor = "not-allowed"

    let sw = true;

    setInterval(()=>{
      let text = sw ? `Σ(°ロ°)!!!`:`(-q-)`
      sw=!sw
      forgetMeNot.innerHTML = `
      <div class="cooldiv">${text}</div>
      `
      
      rec()
    }, 500)
    forgetMeNot.classList.add('bye')
    toBackend(() => {
      console.log("удаление")
      
      task_list.splice(index, 1);
      
    }).then(rec());
    toBackend(()=>rec())
  });

  task_list.push(holder);
  // tasks.append(holder) задеприкировали
  rec();
}

function update_tasks() {
  while (tasks.firstChild) {
    tasks.removeChild(tasks.firstChild);
  }
  task_list.forEach((element) => {
    if (filter === "all") {
      tasks.append(element);
    } else if (filter === "ongoing") {
      element.children[1].className === "ongoing"
        ? tasks.append(element)
        : null;
    } else {
      element.children[1].className === "stopped"
        ? tasks.append(element)
        : null;
    }
  });
}
