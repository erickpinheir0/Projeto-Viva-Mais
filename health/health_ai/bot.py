import os
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import json

load_dotenv()

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

class AI_Bot:
    
    def __init__(self):
        self.model = ChatGroq(model="deepseek-r1-distill-llama-70b")

    def invoke(self, question):
            prompt = PromptTemplate(
                input_variables=["text"], 
                template='''Você é um assistente especializado em saúde. Sua tarefa é:
                - Analisar os sintomas do paciente e sugerir possíveis diagnósticos.
                - Fazer perguntas adicionais para esclarecer o quadro do paciente.
                - Resumir exames médicos (se fornecidos) e explicar os resultados de forma compreensível.
                - Responder perguntas sobre doenças ou sintomas de forma clara e acessível.
                Seja sempre amigavel, procurando entender o que está se passando com paciênte e com o usuário.
                Você deve sempre responder em português.
                Responda com emojis de preferência.
                Gere uma unica resposta
                <text>
                {text}
                <text>
                '''
            )

            chain = prompt | self.model | StrOutputParser()
            resposta_completa = chain.invoke({"text": question})

            return resposta_completa

    