# SuperGPT — Small GPT Architecture

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

SuperGPT is a lightweight **GPT-style language model built from scratch in PyTorch** and trained on Shakespeare's works.

It demonstrates the core mechanics of generative AI—tokenization, self-attention, neural network blocks, training loops, and real-time inference.

## Key Features

- **Custom GPT Core:** Built purely with PyTorch primitives (no pre-made model libraries)
- **Compact & Efficient:** ~0.84M parameters (~1M scale) optimized for fast local learning
- **Character Tokenizer:** Maps raw character strings directly to discrete embeddings
- **Modern Transformer Stack:** Pre-LayerNorm design with causal multi-head self-attention
- **Full-Stack Interface:** FastAPI backend coupled with a Next.js + Tailwind dark UI
- **Real-Time Streaming:** Server-Sent Events (SSE) deliver token-by-token character output

## Model Specifications

- **Total Parameters:** ~824,897 (0.84M)
- **Transformer Layers:** 4
- **Attention Heads:** 4
- **Embedding Dimension:** 128
- **Context Length:** 128 characters
- **Vocabulary Size:** 65 unique tokens

## System Flow

```text
Input Prompt
    │
    ▼
Character Tokenizer
    │
    ▼
Token + Position Embeddings
    │
    ▼
Transformer Blocks (x4)
    ├── Multi-Head Causal Attention
    ├── Feed-Forward Neural Network
    ├── Residual Skip Connections
    └── Layer Normalization
    │
    ▼
Final Layer Normalization
    │
    ▼
Language Model Head (Linear)
    │
    ▼
Temperature Sampling
    │
    ▼
Streamed Character Output
