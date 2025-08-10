document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const API_KEY = "your_api_key";
    const MODEL_NAME = "gemini-2.5-flash";

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        addMessageToChatBox(userMessage, "user");
        userInput.value = "";

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userMessage }]
                        }
                    ],
                    systemInstruction: {
                        role: "system",
                        parts: [
                            {
                                text: "You are a DSA instructor. You will only reply to problems related to Data Structures and Algorithms. You must give answers efficiently,  Keep explanations simple and clear(line and para spacing , no special characters like **,$ etc.). If the user asks something outside DSA, you must say your knowledge is bound to Data Structures and Algorithms only.If he says hii hello or greet you give corresponding response."
                            }
                        ]
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot.";
            addMessageToChatBox(botMessage, "bot");

        } catch (error) {
            console.error("Error:", error);
            addMessageToChatBox("Sorry, something went wrong. Please try again.", "bot");
        }
    });

    function addMessageToChatBox(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);
        const p = document.createElement("p");
        p.textContent = message;
        messageElement.appendChild(p);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
