import os
import json
import time
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch

try:
    from model import TinyTransformer, generate_sequence
except ImportError:
    from backend.model import TinyTransformer, generate_sequence

app = FastAPI(
    title="Tiny Shakespeare Transformer API",
    description="Backend API for 0.82M parameter PyTorch character-level Transformer model",
    version="1.0.0"
)

# Enable CORS for all origins (frontend Vercel deployment support)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and metadata
model: Optional[TinyTransformer] = None
metadata: dict = {}
device = 'cuda' if torch.cuda.is_available() else 'cpu'

def locate_file(filename: str) -> str:
    """ Search for target file in local dir or parent dir """
    possible_paths = [
        filename,
        os.path.join(os.path.dirname(__file__), filename),
        os.path.join(os.path.dirname(__file__), "..", filename)
    ]
    for path in possible_paths:
        if os.path.exists(path):
            return path
    return filename

@app.on_event("startup")
def load_model_and_metadata():
    global model, metadata
    meta_path = locate_file("metadata.json")
    weights_path = locate_file("tiny_transformer.pt")

    if os.path.exists(meta_path) and os.path.exists(weights_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)

        vocab_size = metadata.get("vocab_size", 65)
        n_embd = metadata.get("n_embd", 128)
        block_size = metadata.get("block_size", 128)
        n_head = metadata.get("n_head", 4)
        n_layer = metadata.get("n_layer", 4)

        model = TinyTransformer(
            vocab_size=vocab_size,
            n_embd=n_embd,
            block_size=block_size,
            n_head=n_head,
            n_layer=n_layer
        ).to(device)

        state_dict = torch.load(weights_path, map_location=device)
        model.load_state_dict(state_dict)
        model.eval()
        print(f"Successfully loaded TinyTransformer model ({metadata.get('param_count', 824897):,} params) on {device}.")
    else:
        print(f"Warning: Model or metadata files not found at {weights_path} or {meta_path}.")

class GenerateRequest(BaseModel):
    prompt: str = Field(default="ROMEO:", description="Initial text prompt for text completion")
    max_tokens: int = Field(default=150, ge=10, le=500, description="Number of tokens/characters to generate")
    temperature: float = Field(default=0.8, ge=0.01, le=2.5, description="Sampling temperature")

class GenerateResponse(BaseModel):
    text: str
    prompt: str
    generated_length: int
    latency_ms: float

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "device": device
    }

@app.get("/api/info")
def get_info():
    param_count = metadata.get("param_count", 824897)
    return {
        "model_name": "Tiny Shakespeare Transformer",
        "parameter_count": param_count,
        "formatted_parameters": f"{param_count / 1e6:.2f}M",
        "context_window": metadata.get("block_size", 128),
        "layers": metadata.get("n_layer", 4),
        "heads": metadata.get("n_head", 4),
        "embedding_dim": metadata.get("n_embd", 128),
        "vocab_size": metadata.get("vocab_size", 65),
        "dataset": "Tiny Shakespeare",
        "architecture": "Decoder-only Causal Transformer (Pre-LayerNorm)"
    }

@app.post("/api/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    if model is None or not metadata:
        # Re-attempt loading if model wasn't ready at startup
        load_model_and_metadata()
        if model is None or not metadata:
            raise HTTPException(status_code=503, detail="Model weights not loaded on server.")

    start_time = time.time()
    generated_text = generate_sequence(
        model=model,
        prompt=req.prompt,
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        stoi=metadata["stoi"],
        itos=metadata["itos"],
        device=device
    )
    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    return GenerateResponse(
        text=generated_text,
        prompt=req.prompt,
        generated_length=req.max_tokens,
        latency_ms=elapsed_ms
    )
