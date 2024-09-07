import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";

// Initialize the model

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })


let all_history = [];

async function getResponse(prompt) {
  // Prompt engineering for College Counselor version: Act and serve as my college counselor, help me write my essays... below you will get my resume details, write an essay for me to send to universities, BUT, leave specific blanks in between where i should add my own creativity, and in what way... Here are my resume details... + prompt
  const chat = model.startChat({ history: all_history });
  const message = await chat.sendMessage("Respond to the following prompt like in a pirate tone:" + prompt);
  const text = message.response.candidates[0].content.parts[0].text
  return text;
}







// User Chat Div
export const userDiv = (data) => {
  return `
  <!-- User Chat -->
  <div class="flex items-center justify-start gap-2">
    <img class="w-10 h-10 rounded-full" src="./user.jpg" alt="user-icon">
    <p class="bg-gemDeep text-white p-1 rounded-md shadow-md">
    ${data}
    </p>
  </div>  `
}


// AI Chat Div
export const aiDiv = (data) => {
  return `
  <!-- AI Chat -->
  <div class="flex gap-2 justify-end">
    <pre class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">${data}</pre>
    <img src="chat-bot.jpg" alt="ai-icon" class="w-10 h-10 rounded-full"/>
  </div>
  `
}

async function handleSubmit(event) {
  event.preventDefault();
  let userMessage = document.getElementById("prompt");
  const chatArea = document.getElementById("chat-container");

  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";

  const aiResponse = await getResponse(prompt);
  let md_text = md().render(aiResponse); 
  chatArea.innerHTML += aiDiv(md_text); //change to md_text for including markdown, but that seems to cause some issues with words outside of visible screen for long responses.

  // let newUserRole = {
  //   role: "user",
  //   parts: prompt
  // };
  // let newAiRole = {
  //   role: "model",
  //   parts: aiResponse
  // };
  // all_history.push(newUserRole);
  // all_history.push(newAiRole); // not needed anymore! Current gemini model version automatically adds to history when it reads from history... how cool!
  console.log(all_history)
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener('submit', handleSubmit)

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
});