# SmartResumeTool - Architecture Documentation

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface (React)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  FileUpload  │  │ JobDesc Input│  │    Results   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌─────────▼────────┐
│  Custom Hooks  │            │   UI Components  │
│  - useFileUpload│            │   - Button       │
│  - useAnalysis  │            │   - Card         │
└────────┬────────┘            │   - Badge        │
         │                     │   - Alert        │
┌────────▼──────────────────┐  └──────────────────┘
│       Services Layer       │
│  ┌─────────────────────┐  │
│  │  File Parser        │  │  ┌─────────────────┐
│  │  - PDF parsing      │  │  │                 │
│  │  - DOCX parsing     │  │  │  Claude API     │
│  │  - TXT parsing      │◄─┼──┤  (Anthropic)    │
│  └─────────────────────┘  │  │                 │
│                            │  └─────────────────┘
│  ┌─────────────────────┐  │
│  │  Analysis Service   │  │
│  │  - Traditional algo │  │
│  │  - AI integration   │  │
│  └─────────────────────┘  │
└────────────────────────────┘
         │
┌────────▼──────────┐
│   Utilities       │
│   - Formatters    │
│   - Validators    │
│   - Helpers       │
└───────────────────┘
```

## 📁 File Structure Explained

### `/src/components/`
**Purpose**: Reusable React components for UI

**Key Components:**
- **Button.jsx**: Standardized button with variants (primary, secondary, outline, danger)
- **Card.jsx**: Container component with consistent styling
- **Badge.jsx**: Display tags, keywords, and status indicators
- **Alert.jsx**: Show notifications and error messages
- **upload/FileUpload.jsx**: Handle file upload with drag-and-drop

**Design Pattern**: Composition pattern - components can be nested and combined

### `/src/services/`
**Purpose**: Business logic separated from UI

**Services:**

#### `claudeAPI.js`
- Manages all API calls to Anthropic
- Handles authentication and error responses
- Methods:
  - `analyzeResume()`: Main analysis function
  - `enhanceBulletPoints()`: Improve resume bullets
  - `generateSummary()`: Create professional summary
  - `getCareerAdvice()`: Personalized career tips

#### `fileParser.js`
- Parses different file formats
- Uses PDF.js for PDFs
- Uses Mammoth.js for DOCX
- Returns structured data

#### `analysisService.js`
- Combines traditional algorithms with AI
- Performs keyword extraction
- Calculates ATS scores
- Generates recommendations
- Merges traditional + AI results

### `/src/hooks/`
**Purpose**: Custom React hooks for state management

#### `useFileUpload.js`
```javascript
const {
  file,              // File metadata
  parsedContent,     // Extracted text
  isLoading,         // Upload in progress
  progress,          // Upload progress %
  error,             // Error message
  uploadFile,        // Function to upload
  clearFile,         // Function to clear
  hasFile            // Boolean flag
} = useFileUpload();
```

#### `useAnalysis.js`
```javascript
const {
  results,           // Analysis results object
  isAnalyzing,       // Analysis in progress
  error,             // Error message
  useAI,             // AI enabled flag
  isAIAvailable,     // API configured flag
  analyzeResume,     // Function to analyze
  clearResults,      // Function to clear
  hasResults         // Boolean flag
} = useAnalysis();
```

### `/src/utils/`
**Purpose**: Helper functions and utilities

**Key Functions:**
- `formatFileSize()`: Convert bytes to readable format
- `formatDate()`: Format ISO dates
- `copyToClipboard()`: Copy text to clipboard
- `downloadTextFile()`: Download content as file
- `generateReport()`: Create analysis report
- `getScoreColor()`: Determine color based on score
- `storage`: LocalStorage helpers

### `/src/config/`
**Purpose**: Centralized configuration

**Constants:**
- `APP_CONFIG`: Application metadata
- `FILE_CONFIG`: File upload settings
- `CLAUDE_CONFIG`: API configuration
- `ANALYSIS_CONFIG`: Analysis parameters
- `SCORING_WEIGHTS`: Score calculation weights
- `ERROR_MESSAGES`: Standardized error messages
- `SUCCESS_MESSAGES`: Success notifications

## 🔄 Data Flow

### Resume Upload Flow
```
User selects file
  ↓
FileUpload component validates
  ↓
useFileUpload hook manages state
  ↓
fileParser service extracts text
  ↓
Progress updates shown to user
  ↓
Parsed content stored in state
```

### Analysis Flow
```
User clicks "Analyze"
  ↓
App validates inputs
  ↓
useAnalysis hook triggered
  ↓
analysisService.analyzeResume() called
  ↓
Traditional analysis performed (always)
  ↓
If AI enabled: claudeAPI.analyzeResume() called
  ↓
Results merged and returned
  ↓
UI updates with results
  ↓
User views recommendations
```

## 🎯 Design Patterns Used

### 1. Service Layer Pattern
**Why**: Separates business logic from UI
**Implementation**: All API calls and complex logic in `/services/`

### 2. Custom Hooks Pattern
**Why**: Reusable state logic
**Implementation**: `useFileUpload`, `useAnalysis`

### 3. Composition Pattern
**Why**: Flexible component combinations
**Implementation**: Card with CardHeader, CardTitle, CardContent

### 4. Singleton Pattern
**Why**: Single instance of services
**Implementation**: `export const claudeAPI = new ClaudeAPIService()`

### 5. Strategy Pattern
**Why**: Different analysis strategies (traditional vs AI)
**Implementation**: `analyzeResume(useAI)` parameter

## 🔐 Security Architecture

### API Key Protection
1. **Environment Variables**: API key never in code
2. **Client-side Only**: No backend to compromise
3. **HTTPS Required**: Encrypted transmission
4. **No Storage**: Keys not stored in browser

### Data Privacy
1. **Client-side Processing**: Files parsed in browser
2. **No Server Storage**: Files never uploaded to our servers
3. **Optional AI**: Users can disable AI analysis
4. **Temporary Only**: Data cleared on refresh

## ⚡ Performance Optimizations

### Code Splitting
```javascript
// Lazy loading components
const Results = lazy(() => import('./components/Results'));
```

### Build Optimizations
- Tree shaking removes unused code
- Minification reduces file size
- Gzip compression enabled
- CDN for external libraries

### Caching Strategy
- Static assets cached for 1 year
- API responses not cached (dynamic)
- Service worker for offline support (optional)

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Example test structure
describe('analysisService', () => {
  test('extractKeywords returns array', () => {
    const result = analysisService.extractKeywords('test text');
    expect(Array.isArray(result)).toBe(true);
  });
});
```

### Integration Tests
- Test full upload → analysis → results flow
- Mock Claude API responses
- Test error scenarios

### E2E Tests
- User uploads resume
- User enters job description
- User receives analysis results
- User exports report

## 📊 Analytics & Monitoring

### Key Metrics to Track
- Upload success rate
- Analysis completion rate
- API error rate
- Average analysis time
- User retention

### Error Tracking
```javascript
// Sentry integration example
try {
  await analyzeResume();
} catch (error) {
  Sentry.captureException(error);
  showErrorToUser(error.message);
}
```

## 🔄 State Management

### State Architecture
```
App State (React)
├── File Upload State (useFileUpload)
│   ├── file metadata
│   ├── parsed content
│   └── loading/error states
├── Analysis State (useAnalysis)
│   ├── results
│   ├── analyzing flag
│   └── error state
└── UI State (local useState)
    ├── job description
    ├── active tab
    └── modal visibility
```

### Why No Redux?
- State is simple enough for React hooks
- No need for global state management
- Keeps bundle size small
- Easier to understand and maintain

## 🚀 Scalability Considerations

### Current Limitations
- Client-side file processing (size limits)
- API rate limits
- Single-user sessions

### Future Scalability
To scale, consider:
1. **Backend API**: Handle large files server-side
2. **Database**: Store user resumes and analyses
3. **Queue System**: Handle high volume of analyses
4. **Caching Layer**: Redis for repeated analyses
5. **Load Balancing**: Multiple API instances

## 📚 Key Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",           // UI framework
  "axios": "^1.6.0",            // HTTP client
  "pdfjs-dist": "^3.11.174",    // PDF parsing
  "mammoth": "^1.6.0",          // DOCX parsing
  "react-dropzone": "^14.2.3",  // File upload
  "lucide-react": "^0.292.0",   // Icons
  "chart.js": "^4.4.0"          // Charts
}
```

### Why These Libraries?
- **React**: Industry standard, great ecosystem
- **Axios**: Better than fetch for API calls
- **PDF.js**: Mozilla's official PDF library
- **Mammoth**: Reliable DOCX parsing
- **Lucide**: Beautiful, consistent icons

## 🎨 UI/UX Design Principles

### Design System
- **Colors**: Teal primary, semantic colors
- **Typography**: Inter font family
- **Spacing**: 8px base unit
- **Shadows**: Layered depth
- **Animations**: Smooth, purposeful

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratio > 4.5:1
- Screen reader friendly
- Error messages clear and helpful

## 🔮 Future Enhancements

### Planned Features
1. **Resume Templates**: Pre-built templates
2. **Multi-Resume Comparison**: Compare multiple versions
3. **LinkedIn Integration**: Import from LinkedIn
4. **Career Pathways**: Suggest career directions
5. **Cover Letter Generator**: AI-powered cover letters
6. **Interview Prep**: Based on resume and job
7. **Version Control**: Track resume changes
8. **Team Collaboration**: Share and review resumes

### Technical Improvements
1. **TypeScript**: Add type safety
2. **Testing**: Comprehensive test suite
3. **Storybook**: Component documentation
4. **Internationalization**: Multi-language support
5. **PWA**: Offline functionality
6. **Backend**: Optional premium features

---

## 📖 Further Reading

### Understanding the Code
1. Start with `/src/App.jsx` - entry point
2. Review `/src/services/` - core logic
3. Examine `/src/components/` - UI building blocks
4. Study `/src/hooks/` - state management

### Contributing
See CONTRIBUTING.md for guidelines on:
- Code style
- Commit messages
- Pull request process
- Testing requirements

---

**Questions?** Contact David Madison at davidmadison95@yahoo.com
