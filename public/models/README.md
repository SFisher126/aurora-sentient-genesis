# Local Transformers.js Models

This directory contains the necessary configuration files for running Transformers.js models locally.

## Models included:
- `Xenova/distilbert-base-uncased-finetuned-sst-2-english` - For sentiment analysis
- `Xenova/gpt2-small` - For text generation

## Note:
The actual ONNX model files (.onnx) are not included due to their large size. 
The application will attempt to download them automatically when needed, or you can manually place them here following the same directory structure.

## Directory structure:
```
public/models/
├── Xenova/
│   ├── distilbert-base-uncased-finetuned-sst-2-english/
│   │   ├── config.json
│   │   ├── tokenizer.json
│   │   └── tokenizer_config.json
│   └── gpt2-small/
│       ├── config.json
│       ├── tokenizer.json
│       └── tokenizer_config.json
```