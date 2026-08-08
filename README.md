# SuperGPT — Character-Level Transformer

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

SuperGPT is a compact **GPT-style language model built from scratch with PyTorch**, trained on the Tiny Shakespeare dataset.

It is designed to understand the core mechanics behind modern language models, including tokenization, self-attention, Transformer blocks, training, inference, and real-time generation.

## Features

- Custom decoder-only Transformer
- Character-level tokenizer
- Multi-head causal self-attention
- Pre-LayerNorm architecture
- Autoregressive text generation
- ~0.84M trainable parameters
- 4 Transformer layers
- 4 attention heads
- 128-dimensional embeddings
- 128-token context window
- 65-character vocabulary
- FastAPI inference backend
- Next.js + Tailwind frontend
- Real-time SSE text streaming

## Architecture

```text
Input Text
    |
    v
Character Tokenization
    |
    v
Token + Position Embeddings
    |
    v
Transformer Block x4
    |
    +-- Multi-Head Causal Attention
    +-- Feed-Forward Network
    +-- Residual Connections
    +-- Layer Normalization
    |
    v
Language Model Head
    |
    v
Logits
    |
    v
Sampling
    |
    v
Generated Text
