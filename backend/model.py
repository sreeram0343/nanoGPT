import torch
import torch.nn as nn
from torch.nn import functional as F

class SingleHeadAttention(nn.Module):
    """ One head of Causal Self-Attention """
    def __init__(self, n_embd: int, head_size: int, block_size: int, dropout: float = 0.0):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape
        k = self.key(x)   # (B, T, head_size)
        q = self.query(x) # (B, T, head_size)
        v = self.value(x) # (B, T, head_size)

        # Scaled dot-product attention scores
        wei = q @ k.transpose(-2, -1) * (k.shape[-1] ** -0.5)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)

        out = wei @ v
        return out


class MultiHeadAttention(nn.Module):
    """ Multiple heads of Causal Self-Attention in parallel """
    def __init__(self, num_heads: int, head_size: int, n_embd: int, block_size: int, dropout: float = 0.0):
        super().__init__()
        self.heads = nn.ModuleList([
            SingleHeadAttention(n_embd, head_size, block_size, dropout)
            for _ in range(num_heads)
        ])
        self.proj = nn.Linear(num_heads * head_size, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.dropout(self.proj(out))
        return out


class FeedForward(nn.Module):
    """ Simple linear layer followed by ReLU non-linearity and projection """
    def __init__(self, n_embd: int, dropout: float = 0.0):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.ReLU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class Block(nn.Module):
    """ Transformer block: communication (attention) followed by computation (FFN) """
    def __init__(self, n_embd: int, n_head: int, block_size: int, dropout: float = 0.0):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size, n_embd, block_size, dropout)
        self.ffwd = FeedForward(n_embd, dropout)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Pre-LN architecture with residual connections
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x


class TinyTransformer(nn.Module):
    """ 0.82M parameter character-level Transformer Language Model """
    def __init__(self, vocab_size: int, n_embd: int = 128, block_size: int = 128, n_head: int = 4, n_layer: int = 4, dropout: float = 0.0):
        super().__init__()
        self.vocab_size = vocab_size
        self.n_embd = n_embd
        self.block_size = block_size
        self.n_head = n_head
        self.n_layer = n_layer

        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[
            Block(n_embd, n_head, block_size, dropout) for _ in range(n_layer)
        ])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx: torch.Tensor, targets: torch.Tensor = None):
        B, T = idx.shape
        device = idx.device
        tok_emb = self.token_embedding_table(idx)
        pos_emb = self.position_embedding_table(torch.arange(T, device=device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits_flat = logits.view(B * T, C)
            targets_flat = targets.view(B * T)
            loss = F.cross_entropy(logits_flat, targets_flat)

        return logits, loss


def generate_sequence(
    model: TinyTransformer,
    prompt: str,
    max_tokens: int,
    temperature: float,
    stoi: dict,
    itos: dict,
    device: str = 'cpu'
) -> str:
    """ Autoregressively generates text given a prompt string """
    model.eval()
    
    # Fallback to default if prompt contains unseen characters
    clean_prompt = "".join([c for c in prompt if c in stoi])
    if not clean_prompt:
        clean_prompt = "ROMEO:"

    encoded = [stoi[c] for c in clean_prompt]
    x = torch.tensor([encoded], dtype=torch.long, device=device)

    with torch.no_grad():
        for _ in range(max_tokens):
            x_cond = x[:, -model.block_size:]
            logits, _ = model(x_cond)
            logits = logits[:, -1, :]  # Shape: (1, vocab_size)
            
            temp = max(float(temperature), 0.01)
            logits = logits / temp
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            x = torch.cat((x, idx_next), dim=1)

    generated_indices = x[0].tolist()
    text = "".join([itos[str(i)] if isinstance(itos.get(i), str) else itos.get(i, itos.get(str(i), '')) for i in generated_indices])
    return text


def generate_sequence_stream(
    model: TinyTransformer,
    prompt: str,
    max_tokens: int,
    temperature: float,
    stoi: dict,
    itos: dict,
    device: str = 'cpu'
):
    """ Autoregressively yields generated character strings token-by-token """
    model.eval()
    
    clean_prompt = "".join([c for c in prompt if c in stoi])
    if not clean_prompt:
        clean_prompt = "ROMEO:"

    encoded = [stoi[c] for c in clean_prompt]
    x = torch.tensor([encoded], dtype=torch.long, device=device)

    # Yield initial clean prompt
    yield clean_prompt

    with torch.no_grad():
        for _ in range(max_tokens):
            x_cond = x[:, -model.block_size:]
            logits, _ = model(x_cond)
            logits = logits[:, -1, :]
            
            temp = max(float(temperature), 0.01)
            logits = logits / temp
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            x = torch.cat((x, idx_next), dim=1)

            next_idx_val = idx_next.item()
            char = itos.get(str(next_idx_val), itos.get(next_idx_val, ''))
            yield char
