# SuperGPT: Character-Level Transformer Language Model

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

SuperGPT is a compact, character-level generative language model built entirely from PyTorch primitives and inspired by Andrej Karpathy's NanoGPT.

The project is designed as an end-to-end exploration of Transformer architecture, autoregressive language modeling, tokenization, attention mechanisms, model training, inference, and real-time AI application deployment.

SuperGPT combines a custom decoder-only GPT architecture with a modern full-stack web interface capable of streaming generated text in real time.

---

Key Highlights

- Built from scratch using native PyTorch modules.
- No Hugging Face "Trainer" abstractions or pretrained model dependencies.
- Custom implementation of embeddings, causal self-attention, Transformer blocks, normalization, MLPs, and language-model output projection.
- Compact model footprint of approximately 0.84M parameters.
- Character-level tokenizer with a vocabulary of 65 unique characters.
- Trained on the Tiny Shakespeare dataset.
- Real-time character streaming through Server-Sent Events (SSE).
- FastAPI backend for model inference.
- Next.js and Tailwind CSS frontend.
- Decoupled frontend/backend architecture.
- Designed as a foundation for progressively scaling toward a subword-based language model.

---

Model Architecture

SuperGPT is an autoregressive, decoder-only Transformer language model trained on the Tiny Shakespeare dataset.

Input Character Sequence
        |
        v
Token Embeddings + Positional Embeddings
        |
        v
+--------------------------------------+
|       Transformer Block x4            |
|                                      |
|  Pre-LayerNorm                       |
|        |                             |
|  Multi-Head Self-Attention (4 Heads) |
|        |                             |
|  Causal Masking                      |
|        |                             |
|  Residual Connection                 |
|        |                             |
|  Feed-Forward MLP                    |
|        |                             |
|  Residual Connection                 |
+--------------------------------------+
        |
        v
Final Layer Normalization
        |
        v
Language Model Head
        |
        v
Logits (Vocabulary = 65)
        |
        v
Softmax / Sampling
        |
        v
Next Character

The model predicts the next character based on the preceding context and performs autoregressive generation one character at a time.

---

Hyperparameters

Hyperparameter| Value| Description
Total Parameters| ~824,897 (~0.84M)| Total trainable parameter count
Embedding Dimension| 128| Vector dimension for token representations
Transformer Layers| 4| Number of stacked decoder blocks
Attention Heads| 4| Parallel self-attention heads
Head Dimension| 32| Dimension per attention head
Context Window| 128| Maximum number of characters processed as context
Vocabulary Size| 65| Number of unique characters
Dropout| 0.1| Regularization probability
Training Dataset| Tiny Shakespeare| Character-level language modeling dataset
Evaluation Loss| ~1.56| Approximate converged evaluation loss
Initial Loss| ~4.22| Approximate initial training/evaluation loss

---

Transformer Components

Token Embeddings

Each character is mapped to a learnable vector representation.

Character ID
     |
     v
Embedding Table
     |
     v
128-dimensional Vector

Positional Embeddings

Since self-attention does not inherently encode sequence order, learnable positional embeddings are added to the token representations.

Token Embedding + Position Embedding
                    |
                    v
              Transformer Input

Multi-Head Self-Attention

SuperGPT uses four attention heads.

Each head computes:

Attention(Q, K, V) = softmax(QK^T / sqrt(d_head))V

where:

d_head = 128 / 4 = 32

The attention mechanism allows the model to determine which previous characters are relevant when predicting the next character.

Causal Masking

A causal attention mask prevents the model from accessing future characters during training.

Token 1 -> sees Token 1
Token 2 -> sees Token 1-2
Token 3 -> sees Token 1-3
Token 4 -> sees Token 1-4
...

This maintains the autoregressive nature of the model.

Feed-Forward Network

Each Transformer block contains a position-wise feed-forward network following the attention mechanism.

Input
  |
  v
Linear Projection
  |
  v
Non-Linearity
  |
  v
Linear Projection
  |
  v
Output

Residual Connections

Residual connections allow information to flow through the network and improve optimization of deeper Transformer architectures.

Layer Normalization

Pre-LayerNorm is used within each Transformer block to stabilize training.

---

Training Objective

SuperGPT is trained using next-character prediction.

Given a sequence:

ROMEO:

the model learns to predict:

R -> O
O -> M
M -> E
E -> O
O -> :
: -> next character

The model is optimized using categorical cross-entropy loss.

Loss = CrossEntropy(predicted_logits, target_character)

The objective is to maximize the probability of the correct next character for every position in the training sequence.

---

System Architecture

SuperGPT uses a decoupled frontend and backend architecture.

+----------------------------------+
|        Next.js Frontend          |
|                                  |
|  React + Tailwind CSS            |
|  Gemini-inspired UI              |
|  Real-Time Text Rendering        |
+----------------+-----------------+
                 |
                 | HTTP / SSE
                 v
+----------------------------------+
|       FastAPI Backend            |
|                                  |
|  REST API                        |
|  SSE Streaming                   |
|  PyTorch Inference Engine        |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|       SuperGPT Model             |
|                                  |
|  Character Tokenizer             |
|  Transformer                     |
|  Autoregressive Generation       |
|  Temperature Sampling            |
+----------------------------------+

Frontend

The frontend is built using:

- Next.js
- React
- Tailwind CSS
- Server-Sent Events

The interface receives generated characters from the backend and progressively renders them to the user.

Backend

The backend is built using:

- FastAPI
- PyTorch
- Python
- Server-Sent Events

The backend loads the trained model, processes the prompt, performs autoregressive generation, and streams generated characters to the frontend.

---

Real-Time Streaming Pipeline

SuperGPT uses Server-Sent Events to stream generated characters as they are produced.

User Prompt
     |
     v
Next.js Frontend
     |
     | POST /api/generate-stream
     v
FastAPI Backend
     |
     v
Tokenization
     |
     v
PyTorch Transformer
     |
     v
Next-Character Prediction
     |
     v
Sampling
     |
     v
Generated Character
     |
     | SSE
     v
Next.js Frontend
     |
     v
Real-Time UI Update

This avoids waiting for the complete generation before displaying the result.

---

API Documentation

POST "/api/generate-stream"

Generates text from a given prompt and streams the result using Server-Sent Events.

Request

{
  "prompt": "ROMEO:",
  "max_tokens": 150,
  "temperature": 0.8
}

Parameters

Parameter| Type| Description
"prompt"| string| Initial text provided to the model
"max_tokens"| integer| Maximum number of characters to generate
"temperature"| float| Controls randomness during sampling

Response

Content type:

text/event-stream

Example:

data: {"token": "R", "type": "prompt"}

data: {"token": "O", "type": "prompt"}

data: {"token": "M", "type": "prompt"}

data: {"token": "E", "type": "prompt"}

data: {"token": "O", "type": "prompt"}

data: {"token": ":", "type": "prompt"}

data: {"token": "\n", "type": "completion"}

data: {"token": "S", "type": "completion"}

data: {"token": "h", "type": "completion"}

---

Project Structure

SuperGPT/
│
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── tokenizer.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── data/
│   └── input.txt
│
├── notebooks/
│   └── training.ipynb
│
├── checkpoints/
│   └── model.pt
│
├── LICENSE
└── README.md

The exact structure may vary depending on the current implementation.

---

Getting Started

Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js 18+
- npm
- PyTorch 2.0+
- Git

---

1. Clone the Repository

git clone https://github.com/your-username/SuperGPT.git
cd SuperGPT

---

2. Set Up the Backend

Navigate to the backend directory:

cd backend

Install Python dependencies:

pip install -r requirements.txt

Start the FastAPI development server:

uvicorn app:app --reload --port 8000

The backend will be available at:

http://127.0.0.1:8000

---

3. Set Up the Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Create the local environment configuration.

Windows PowerShell

"NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" | Out-File -Encoding utf8 .env.local

macOS / Linux

echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

Start the development server:

npm run dev

The frontend will be available at:

http://localhost:3000

---

Training the Model

SuperGPT can be trained from scratch using the Tiny Shakespeare dataset.

The training pipeline consists of:

Dataset
   |
   v
Character Vocabulary
   |
   v
Character Encoding
   |
   v
Training Batch Generation
   |
   v
Transformer Forward Pass
   |
   v
Cross-Entropy Loss
   |
   v
Backpropagation
   |
   v
AdamW Optimizer
   |
   v
Model Checkpoint

The model learns to predict the next character from the preceding context.

---

Generation

During inference, SuperGPT performs autoregressive generation.

Prompt
  |
  v
Encode Characters
  |
  v
Transformer Forward Pass
  |
  v
Generate Logits
  |
  v
Apply Temperature
  |
  v
Probability Distribution
  |
  v
Sample Next Character
  |
  v
Append Character
  |
  v
Repeat

Temperature controls the randomness of the generation.

Lower values generally produce more deterministic outputs, while higher values produce more diverse outputs.

---

Example Prompt

ROMEO:

Example generated output:

ROMEO:
What light is this that rises from the night?
The stars are bright above the silent hall,
And every voice is carried by the wind...

Because the model is trained on Tiny Shakespeare, its generated text primarily reflects Shakespeare-like patterns rather than general-purpose conversational intelligence.

---

Current Limitations

SuperGPT is intentionally small and educational.

Current limitations include:

- Character-level tokenization.
- Small vocabulary of 65 characters.
- Approximately 0.84M parameters.
- Limited context window of 128 characters.
- Training primarily on Tiny Shakespeare.
- No instruction tuning.
- No conversational fine-tuning.
- No retrieval system.
- No external knowledge integration.
- No KV caching.
- Limited generalization beyond the training distribution.
- Not intended to compete with modern large language models.

The purpose of the project is to understand how language models work internally rather than to reproduce the capabilities of production-scale LLMs.

---

Roadmap

The long-term goal is to evolve SuperGPT from a character-level educational Transformer into a compact subword language model capable of handling more diverse datasets and applications.

Phase 1: Architecture and Tokenization Enhancements

Byte-Pair Encoding

- [ ] Replace character-level tokenization with a custom BPE tokenizer.
- [ ] Increase vocabulary from 65 characters to approximately 4,096 subword tokens.
- [ ] Improve token density and context efficiency.
- [ ] Implement tokenizer training and vocabulary generation from scratch.
- [ ] Build encode/decode pipelines compatible with the new tokenizer.

Rotary Position Embeddings

- [ ] Replace learned positional embeddings with RoPE.
- [ ] Support improved relative positional representation.
- [ ] Experiment with longer context windows.

Modern Activation Functions

- [ ] Replace ReLU-based feed-forward layers with GELU.
- [ ] Experiment with SwiGLU.
- [ ] Benchmark different activation functions.

---

Phase 2: Parameter Scaling and Dataset Expansion

Model Scaling

- [ ] Scale from approximately 0.84M parameters to 10M–50M parameters.
- [ ] Increase embedding dimension from 128 toward 512.
- [ ] Increase Transformer depth from 4 toward 12 layers.
- [ ] Increase attention heads from 4 toward 8.
- [ ] Experiment with larger context windows.

Dataset Scaling

- [ ] Move beyond Tiny Shakespeare.
- [ ] Experiment with broader text corpora.
- [ ] Experiment with curated educational datasets.
- [ ] Experiment with Python and programming-language datasets.
- [ ] Build a proper data preprocessing and deduplication pipeline.

Potential datasets include:

- OpenWebText
- FineWeb-Edu
- Curated Python code datasets

Inference Optimization

- [ ] Implement Key-Value caching.
- [ ] Optimize autoregressive generation.
- [ ] Benchmark tokens/second.
- [ ] Reduce inference latency.
- [ ] Explore mixed-precision inference.

---

Phase 3: Alignment and Application Integration

Instruction Tuning

- [ ] Create an instruction-following dataset.
- [ ] Implement supervised fine-tuning.
- [ ] Fine-tune the base model for task-oriented responses.
- [ ] Evaluate instruction-following capabilities.

Preference Optimization

- [ ] Experiment with Direct Preference Optimization.
- [ ] Build preference datasets.
- [ ] Evaluate response quality and alignment.

Retrieval-Augmented Generation

- [ ] Implement a RAG pipeline.
- [ ] Integrate a vector database.
- [ ] Implement document ingestion.
- [ ] Implement embedding generation.
- [ ] Implement retrieval and context injection.
- [ ] Evaluate retrieval quality.

Potential vector database options:

- ChromaDB
- Pinecone

---

Phase 4: Toward a Small General-Purpose Language Model

Future development will explore:

Character-Level GPT
        |
        v
BPE Tokenizer
        |
        v
Modern Transformer
        |
        v
10M–50M Parameter Model
        |
        v
Large-Scale Dataset
        |
        v
Pretraining
        |
        v
Instruction Tuning
        |
        v
Preference Optimization
        |
        v
RAG + Tool Use
        |
        v
Small General-Purpose LM

The goal is not simply to increase parameter count, but to understand how each component contributes to model capability, efficiency, and reliability.

---

Learning Objectives

This project was built to gain practical understanding of:

- Transformer architecture.
- Self-attention.
- Multi-head attention.
- Causal masking.
- Tokenization.
- Positional encoding.
- Embeddings.
- Residual connections.
- Layer normalization.
- Feed-forward networks.
- Cross-entropy loss.
- Autoregressive generation.
- Temperature sampling.
- PyTorch model implementation.
- Training loops.
- Model checkpointing.
- Inference optimization.
- FastAPI model serving.
- Server-Sent Events.
- Real-time AI interfaces.
- Full-stack AI application architecture.

---

Why Build SuperGPT?

Modern LLM APIs make it easy to call powerful language models, but they can hide the underlying mechanics.

SuperGPT takes the opposite approach.

Instead of starting with:

API
  |
  v
LLM
  |
  v
Response

the project starts with:

Raw Text
   |
   v
Tokenizer
   |
   v
Embeddings
   |
   v
Attention
   |
   v
Transformer Blocks
   |
   v
Logits
   |
   v
Sampling
   |
   v
Generated Text

The project is therefore intended as a practical foundation for understanding and eventually building language models from the ground up.

---

Tech Stack

Machine Learning

- Python
- PyTorch
- NumPy

Backend

- FastAPI
- Uvicorn
- Server-Sent Events

Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript

Deployment

- Vercel
- Cloud-based backend hosting

---

License

This project is distributed under the MIT License.

See the "LICENSE" file for more information.

---

Author

Sreeram M R

Computer Science & Engineering Student
AI/ML Engineer in Training

SuperGPT is an ongoing learning and engineering project focused on understanding the foundations behind modern language models by implementing them from first principles.
