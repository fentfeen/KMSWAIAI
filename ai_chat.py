from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = FastAPI()

# Serve the static frontend files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the chosen model
model_name = "EleutherAI/gpt-j-6B"  # You can choose another model if needed
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat/")
async def chat(request: ChatRequest):
    inputs = tokenizer(request.prompt, return_tensors='pt')
    outputs = model.generate(**inputs, max_length=150, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": response}

# Serve the main index.html file
@app.get("/")
async def serve_index():
    with open(os.path.join('static', 'index.html')) as f:
        return f.read()
