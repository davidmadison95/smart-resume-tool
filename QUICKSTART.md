# 🚀 Quick Start Guide

Get SmartResumeTool running in **5 minutes**!

## Prerequisites
- ✅ Node.js 18+ installed ([download here](https://nodejs.org/))
- ✅ Anthropic API key ([get one free](https://console.anthropic.com/))

## Fast Setup

### 1. Get API Key (2 minutes)
```bash
# Visit: https://console.anthropic.com/
# Sign up → Settings → API Keys → Create Key
# Copy the key (starts with sk-ant-)
```

### 2. Install & Configure (2 minutes)
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and paste your API key
# VITE_CLAUDE_API_KEY=sk-ant-your-key-here
```

### 3. Run (1 minute)
```bash
npm run dev
```

Open **http://localhost:3000** - Done! 🎉

## 📝 Quick Test

1. **Upload a resume** - drag & drop or click to browse
2. **Paste a job description** - copy from any job posting
3. **Click "Analyze My Resume"** - wait 5-10 seconds
4. **View results** - see scores, keywords, and AI suggestions!

## 🎯 What You Get

### Without API Key (Traditional Analysis)
- ✅ Keyword matching
- ✅ ATS score calculation  
- ✅ Basic recommendations
- ✅ Format assessment

### With API Key (AI-Enhanced)
- ✅ Everything above PLUS:
- ✅ Deep semantic analysis
- ✅ AI-generated improvements
- ✅ Context-aware suggestions
- ✅ Enhanced bullet points

## 🐛 Quick Troubleshooting

**Port 3000 in use?**
```bash
# Use different port
npm run dev -- --port 3001
```

**API key not working?**
```bash
# Verify it's set correctly
echo $VITE_CLAUDE_API_KEY  # Mac/Linux
echo %VITE_CLAUDE_API_KEY%  # Windows
```

**Install errors?**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

- Read [README.md](./README.md) for full features
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the code

## 💡 Pro Tips

1. **Use PDF resumes** - best parsing results
2. **Include full job posting** - better keyword matching
3. **Try both modes** - see difference with/without AI
4. **Export reports** - save your analysis results

## 🆘 Need Help?

- **Documentation**: See README.md
- **Issues**: Check troubleshooting section
- **Contact**: davidmadison95@yahoo.com
- **LinkedIn**: [/in/davidmadison95](https://linkedin.com/in/davidmadison95)

---

**That's it!** You're ready to optimize resumes with AI. 🚀
