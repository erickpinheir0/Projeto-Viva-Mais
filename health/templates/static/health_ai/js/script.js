document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const archiveButton = document.getElementById("archiveButton");
    const clearChatButton = document.getElementById("clearChatButton"); // Botão Limpar Chat
    const chatBox = document.querySelector(".chat-box"); // Contêiner de histórico de mensagens
    const fileInput = document.getElementById("fileInput");
    const resultsList = document.getElementById("resultsList");
    const urlpost = "/VivaMais/post/";
    const urlget = "/VivaMais/get/";
    let currentConversation = [];

    // Função para adicionar a frase inicial
    function addInitialMessage() {
        const initialMessage = document.createElement("div");
        initialMessage.classList.add("initial-message");
        initialMessage.textContent = "Me diga, como você está";
        chatBox.appendChild(initialMessage); // Adiciona ao chat-box
    }

    // Função para adicionar mensagens ao chat
    function addMessage(text, sender) {
        // Remove a frase inicial se ela existir
        const initialMessage = chatBox.querySelector(".initial-message");
        if (initialMessage) {
            initialMessage.classList.add("fade-out"); // Aplica animação de fade-out
            setTimeout(() => {
                initialMessage.remove(); // Remove a frase após a animação
            }, 500); // Duração da animação (0.5s)
        }

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
        
        if (sender === "ai") {
            // Substitui quebras de linha por <br>
            const formattedText = text.replace(/\n/g, '<br>');
            messageDiv.innerHTML = formattedText;
        } else {
            messageDiv.textContent = text;
        }

        // Adiciona a mensagem ao contêiner
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageDiv);

        // Salva a mensagem na conversa atual
        currentConversation.push({ sender, text });

        // Força o reflow para garantir que o layout seja recalculado
        void messageDiv.offsetHeight;
        // Aguarda a animação terminar e rola automaticamente para baixo
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight; // Aplica o scroll ao chat-box
        }, 100); // Atraso de 100ms para garantir que a animação termine
    }

    // ***Função para processar e tratar a resposta da IA 
    function responseIA(resposta) {
            // Remove blocos indesejados (como <think>)
        if (resposta.includes("<think>") && resposta.includes("</think>")) {
            const start = resposta.indexOf("</think>") + "</think>".length;
            resposta = resposta.substring(start).trim();
        }
        // Converte sequências Unicode para caracteres legíveis
        resposta = resposta.replace(/\\u([\d\w]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        // Remove quebras de linha e espaços extras
      //  resposta = resposta.replace(/\n/g, " ").trim();
            addMessage(`Resposta da IA: "${resposta}"`, "ai") // Adiciona a mensagem ao chat;
    }

    // Evento de envio de mensagem
    async function sendMessage() {
        var userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Exibe mensagem do usuário
        addMessage(userMessage, "user");
        userInput.value = "";
        userInput.focus();

        try {
            const response = await fetch(urlpost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            const data = await response.json();
            // Utiliza a resposta retornada do POST
            if (data.response) {
                responseIA(data.response);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage("Erro ao processar mensagem", "error");
        }
    }

    // Evento de clique no botão "Enviar"
    sendButton.addEventListener("click", sendMessage);

    // Permitir enviar mensagem com Enter
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Impede o comportamento padrão do Enter (pular linha)
            sendMessage();
        }
    });

    // Evento de upload de arquivo
    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Simula o processamento do arquivo
        addMessage(`Processando arquivo: ${file.name}`, "user");

        const aiResponse = await simulateAIResponse(`Análise do arquivo: ${file.name}`);
        addMessage(aiResponse, "ai");
    });

    // Evento de arquivar conversa
    archiveButton.addEventListener("click", () => {
        if (currentConversation.length === 0) return;

        // Salva a conversa como um resultado
        saveConversation("Conversa Arquivada");

        // Limpa a área de mensagens
        const messagesContainer = document.getElementById("messages");
        messagesContainer.innerHTML = "";
        currentConversation = [];
    });

    // Função para salvar a conversa como um resultado
    function saveConversation(title) {
        const resultCard = document.createElement("div");
        resultCard.classList.add("result-card");

        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        resultCard.innerHTML = `
            <div class="result-date">${formattedDate}</div>
            <div class="result-summary">${title}</div>
            <div class="expand-details">Ver detalhes</div>
            <div class="remove-button">Remover</div>
        `;

        // Armazena a conversa no card
        resultCard.conversation = currentConversation;

        // Adiciona evento para expandir detalhes
        resultCard.querySelector(".expand-details").addEventListener("click", () => {
            showConversationDetails(resultCard.conversation);
        });

        // Adiciona evento para remover o card
        resultCard.querySelector(".remove-button").addEventListener("click", () => {
            resultCard.remove(); // Remove o card da DOM
            checkResultsList(); // Verifica se a lista está vazia
        });

        // Adiciona o card à lista de resultados
        resultsList.appendChild(resultCard);

        // Remove a mensagem "Nenhuma análise no momento..." se existir
        removeNoResultsMessage();
    }

    // Função para mostrar detalhes da conversa
    function showConversationDetails(conversation) {
        const messagesContainer = document.getElementById("messages");
        messagesContainer.innerHTML = ""; // Limpa o chat
        conversation.forEach(({ sender, text }) => {
            addMessage(text, sender);
        });

        // Atualiza a conversa atual
        currentConversation = [...conversation];
    }

    // Função para verificar se a lista de resultados está vazia
    function checkResultsList() {
        if (resultsList.children.length === 0) {
            addNoResultsMessage();
        }
    }

    // Função para adicionar a mensagem "Nenhuma análise no momento..."
    function addNoResultsMessage() {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.classList.add("no-results-message");
        noResultsMessage.textContent = "Nenhuma análise no momento...";
        resultsList.appendChild(noResultsMessage);
    }

    // Função para remover a mensagem "Nenhuma análise no momento..."
    function removeNoResultsMessage() {
        const noResultsMessage = resultsList.querySelector(".no-results-message");
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // Função para limpar o chat
    function clearChat() {
        const messagesContainer = document.getElementById("messages");
        messagesContainer.innerHTML = ""; // Limpa todas as mensagens
        currentConversation = []; // Reseta a conversa atual

        // Reexibe a frase inicial
        addInitialMessage();
    }

    // Evento de clique no botão "Limpar Chat"
    clearChatButton.addEventListener("click", clearChat);

    // Adiciona a frase inicial ao carregar o sistema
    addInitialMessage();

    // Verifica se a lista de resultados está vazia ao carregar o sistema
    checkResultsList();
});