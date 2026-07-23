# CalorIA 🔥📸

**CalorIA** é um aplicativo pessoal de controle alimentar que utiliza inteligência artificial para estimar as calorias de uma refeição a partir de uma simples foto.  
Tire uma foto do seu prato, deixe a IA identificar os alimentos e calcular as calorias, e acompanhe seu consumo diário de forma simples e privada.

---

## ✨ Funcionalidades

- 📷 **Foto do prato** – Use a câmera ou galeria para capturar a refeição.
- 🤖 **Análise por IA** – Reconhecimento automático de alimentos e estimativa de porções.
- 🔢 **Cálculo calórico** – Calorias totais da refeição e macronutrientes (proteínas, gorduras, carboidratos).
- 📅 **Diário alimentar** – Visualize o total de calorias consumidas no dia.
- 📜 **Histórico** – Consulte refeições passadas.
- ✏️ **Ajuste manual** – Corrija alimentos ou porções quando necessário (essencial para maior precisão).
- 💰 **Custo zero** – Totalmente gratuito para uso pessoal (utiliza cotas gratuitas de APIs cloud).
- 🔒 **Privacidade** – Seus dados ficam sob seu controle (possibilidade de rodar offline no futuro).

---

## 🧱 Arquitetura

O app se comunica com um backend serverless (Node.js + Express) que orquestra as chamadas às APIs de visão computacional e base de dados nutricionais.  
Os dados das refeições são armazenados localmente no celular usando SQLite.

---

## 🛠️ Tecnologias

| Camada           | Tecnologia                          |
|------------------|-------------------------------------|
| **Mobile**       | React Native (Expo com Expo Router) |
| **Linguagem**    | TypeScript                          |
| **Backend**      | NodeJs                              |
| **Banco local**  | SQLite (expo-sqlite)                |
| **IA / APIs**    | Gemini                              |
| **Hospedagem**   |                                     |

---

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Aplicativo **Expo Go** instalado no celular (Android/iOS)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/calorIA.git
cd calorIA
