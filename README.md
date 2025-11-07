# SmartResumeTool v2.0

**AI-Powered Resume Analyzer with Real Claude Integration**

A professional, production-ready web application that analyzes resumes against job descriptions using advanced algorithms and Anthropic's Claude AI to provide actionable insights and recommendations.

## 🚀 Features

### Core Functionality
- **Multi-Format Support**: Upload PDF, DOC, DOCX, or TXT files
- **Real AI Integration**: Powered by Anthropic's Claude 4 for intelligent analysis
- **Hybrid Analysis**: Combines traditional algorithms with AI insights
- **ATS Optimization**: Scores resume compatibility with Applicant Tracking Systems
- **Keyword Matching**: Identifies matched and missing keywords from job descriptions
- **AI-Enhanced Suggestions**: Get concrete improvements for bullet points, summaries, and more
- **Comprehensive Reporting**: Export detailed analysis reports
- **Professional UI/UX**: Modern, responsive design with smooth animations

### Technical Highlights
- **React 18** with hooks and modern patterns
- **Modular Architecture**: Properly separated concerns (services, components, utils)
- **Real-time Progress**: Live feedback during file parsing and analysis
- **Error Handling**: Comprehensive error management and user feedback
- **Type Safety**: Proper validation and error boundaries
- **Performance**: Code splitting and optimized bundle size
- **Accessibility**: WCAG compliant components

## 📋 Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get one at https://console.anthropic.com/)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/davidmadison95/smart-resume-tool.git
cd smart-resume-tool
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```env
VITE_CLAUDE_API_KEY=your_api_key_here
```

### 4. Run development server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🏗️ Project Structure

```
SmartResumeTool/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── upload/         # File upload components
│   │   ├── analysis/       # Analysis display components
│   │   ├── results/        # Results visualization
│   │   ├── Button.jsx      # Reusable button
│   │   ├── Card.jsx        # Card container
│   │   ├── Badge.jsx       # Badge/tag component
│   │   └── Alert.jsx       # Alert/notification
│   ├── services/            # Business logic
│   │   ├── claudeAPI.js    # Claude API integration
│   │   ├── fileParser.js   # File parsing service
│   │   └── analysisService.js  # Analysis logic
│   ├── hooks/               # Custom React hooks
│   │   ├── useFileUpload.js
│   │   └── useAnalysis.js
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── config/              # Configuration
│   │   └── constants.js
│   ├── styles/              # Global styles
│   └── App.jsx              # Main application
├── .env.example             # Environment template
├── package.json             # Dependencies
├── vite.config.js           # Build configuration
├── tailwind.config.js       # Tailwind CSS config
└── README.md                # This file
```

## 🎯 Usage

### Basic Workflow

1. **Upload Resume**: Drag and drop or click to upload your resume (PDF, DOCX, DOC, or TXT)
2. **Enter Job Description**: Paste the complete job posting
3. **Analyze**: Click "Analyze My Resume" to start AI-powered analysis
4. **Review Results**: See scores, matched/missing keywords, and recommendations
5. **View AI Suggestions**: Get enhanced versions of your resume content
6. **Export Report**: Download detailed analysis report

### AI Features

#### Traditional Analysis (Always Available)
- Keyword extraction and matching
- ATS score calculation
- Format assessment
- Structure evaluation
- Basic recommendations

#### AI-Enhanced Analysis (Requires API Key)
- Deep semantic analysis
- Context-aware keyword matching
- Intelligent recommendations
- AI-generated improvements for:
  - Bullet points
  - Professional summary
  - Skills section
  - Achievement statements

### Scoring System

**Overall ATS Score** (0-100):
- **40%** - Keyword Match: Alignment with job requirements
- **25%** - ATS Format: Resume formatting quality
- **20%** - Content Structure: Organization and sections
- **10%** - Contact Info: Completeness of contact details
- **5%** - Measurable Results: Quantified achievements

**Score Interpretation**:
- **80-100**: Excellent - Resume is ATS-optimized
- **60-79**: Good - Minor improvements needed
- **40-59**: Fair - Significant improvements recommended
- **0-39**: Needs Work - Major revision required

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_CLAUDE_API_KEY` | Anthropic API key | Yes* | - |
| `VITE_APP_NAME` | Application name | No | SmartResumeTool |
| `VITE_MAX_FILE_SIZE` | Max upload size (bytes) | No | 5242880 (5MB) |
| `VITE_ENABLE_AI_SUGGESTIONS` | Enable AI features | No | true |
| `VITE_ENABLE_EXPORT` | Enable report export | No | true |

\* Required for AI-enhanced analysis. Traditional analysis works without API key.

### Customization

#### Adjust Scoring Weights
Edit `src/config/constants.js`:
```javascript
export const SCORING_WEIGHTS = {
  KEYWORD_MATCH: 40,    // Adjust these values
  ATS_FORMAT: 25,
  CONTENT_STRUCTURE: 20,
  CONTACT_INFO: 10,
  MEASURABLE_RESULTS: 5,
};
```

#### Add Keywords to Stop List
Edit `src/config/constants.js`:
```javascript
export const ANALYSIS_CONFIG = {
  stopWords: new Set([
    // Add words to filter out
  ]),
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Drag dist/ folder to Netlify or use CLI
```

### Environment Variables in Production
Remember to set `VITE_CLAUDE_API_KEY` in your hosting platform's environment settings.

## 🧪 Testing

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## 📈 Performance

- **Initial Load**: < 3s on 3G
- **File Parsing**: PDF (500KB) ~2-3s, DOCX ~1-2s
- **Analysis**: Traditional ~500ms, AI-enhanced ~5-10s
- **Bundle Size**: ~200KB gzipped

## 🔐 Security & Privacy

- All file processing happens **client-side** (browser)
- Files are **never stored** on servers
- Resume content is sent to Claude API only if AI analysis is enabled
- API key is stored in environment variables (never in code)
- No tracking or analytics by default

## 🐛 Troubleshooting

### Common Issues

**"Invalid API key" error**
- Verify your Anthropic API key in `.env`
- Ensure key starts with `sk-ant-`
- Check API key has not expired

**File parsing fails**
- Ensure file is not password-protected
- Try converting to PDF for best results
- Check file size is under 5MB

**AI analysis not working**
- Traditional analysis will still work
- Check console for specific API errors
- Verify API rate limits not exceeded

**Build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist .vite`

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**David Madison**
- Email: davidmadison95@yahoo.com
- LinkedIn: [linkedin.com/in/davidmadison95](https://www.linkedin.com/in/davidmadison95/)
- Portfolio: [https://davidmadison95.github.io/Business-Portfolio/]

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- UI Components: [Tailwind CSS](https://tailwindcss.com/)
- Icons: [Lucide React](https://lucide.dev/)
- PDF Parsing: [PDF.js](https://mozilla.github.io/pdf.js/)
- DOCX Parsing: [Mammoth.js](https://github.com/mwilliamson/mammoth.js/)

## 📊 Version History

### v2.0.0 (Current)
- Complete architectural rebuild
- Real Claude API integration
- Modular component structure
- Enhanced error handling
- Production-ready code quality
- Comprehensive documentation

### v1.0.0 (Legacy)
- Initial single-file prototype
- Basic algorithmic analysis
- Simple UI

## 🗺️ Roadmap

- [ ] Add resume templates
- [ ] Support for multiple resumes comparison
- [ ] Integration with LinkedIn profile import
- [ ] Career path suggestions based on resume
- [ ] Interview preparation tips
- [ ] Cover letter generator
- [ ] Resume version tracking
- [ ] Collaborative editing features

---

**Built with ❤️ by David Madison | Showcasing Modern React & AI Integration**
