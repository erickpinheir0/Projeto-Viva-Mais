import os
from decouple import config
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

os.environ["GROQ_API_KEY"] = config("GROQ_API_KEY")

class AI_Bot:
    
    def __init__(self):
        self.model = ChatGroq(model="deepseek-r1-distill-llama-70b")

    def invoke(self, query):
        prompt = PromptTemplate(
            input_variables=["text"], 
            template='''Você é um especialista da área da saúde, você deve analisar os sintomas do paciênte, realizar perguntas de como o paciênte está se sentindo e realizar um 
            levantamento das doenças que podem estar causando isso.
            Se o paciênte mandar um exame PDF, você deverá ler esse exame detalhadamente e fazer um resumo detalhado do que está alterado.
            Se o usuário perguntar sobre os sintomas de uma doença, ou características específicas dela, você deve ser capaz de responder de forma detalhada e completa, usando um linguajar
            que o paciênte possa entender.
            Seja sempre amigavel, procurando entender o que está se passando com paciênte e com o usuário
            <text>
            {query}
            <text>
            '''
        )
        chain = prompt | self.model | StrOutputParser()
        resposta = chain.invoke({"text": query})
        return resposta
    