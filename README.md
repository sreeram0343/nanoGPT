# SuperGPT — Character-Level Transformer

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

SuperGPT is a lightweight **decoder-only Transformer built entirely from scratch in PyTorch**, trained on the Tiny Shakespeare corpus.

It serves as an end-to-end implementation of foundational LLM mechanics, covering custom tokenization, multi-head attention, residual stacks, training, inference, and streaming execution.

## Features

- Native PyTorch GPT implementation
- Bidirectional character tokenizer
- Multi-head causal self-attention
- Pre-LayerNorm residual blocks
- Autoregressive sampling logic
- ~0.84M trainable parameters
- 4 Transformer block layers
- 4 parallel attention heads
- 128-dimensional hidden states
- 128-character context window
- 65-token character vocabulary
- FastAPI backend inference API
- Next.js + Tailwind web interface
- Server-Sent Events (SSE) streaming

## Architecture

```text
Input Tokens
    |
    v
Character Encoding
    |
    v
Token + Position Embeddings
    |
    v
Transformer Stack x4
    |
    +-- LayerNorm & Multi-Head Attention
    +-- Residual Skip Connections
    +-- LayerNorm & Feed-Forward Network
    +-- Non-Linear Activations
    |
    v
Final Layer Normalization
    |
    v
Language Model Head (LM Head)
    |
    v
Softmax & Temperature Sampling
    |
    v
Streamed Tokens
