# Resume-Based Technical Interview Implementation

## Current Status
- [x] Plan approved by user
- [ ] Create resume upload component
- [ ] Add resume analysis functionality
- [ ] Modify interview page to remove HR option
- [ ] Update interview start API for resume handling
- [ ] Implement personalized question selection
- [ ] Test end-to-end flow

## Detailed Tasks

### 1. Resume Upload Component
- [ ] Create `components/resume-upload.tsx`
- [ ] Add file validation (PDF, DOCX, max size 5MB)
- [ ] Implement drag-and-drop interface
- [ ] Add upload progress indicator
- [ ] Handle file preview/extraction

### 2. Resume Analysis Utility
- [ ] Create `lib/resume-analysis.ts`
- [ ] Use Chrome AI for text extraction from PDF/DOCX
- [ ] Extract skills, technologies, experience
- [ ] Generate keywords for question matching
- [ ] Handle analysis errors gracefully

### 3. Interview Page Modifications
- [ ] Update `app/interview/page.tsx`
- [ ] Remove HR interview card and options
- [ ] Add resume upload step before technical interview
- [ ] Update UI flow and messaging
- [ ] Add resume analysis loading state

### 4. API Updates
- [ ] Modify `app/api/interview/start/route.ts`
- [ ] Accept resume data in request
- [ ] Store resume temporarily for analysis
- [ ] Pass analyzed data to question selection

### 5. Question Personalization
- [ ] Update `lib/interview-questions.ts`
- [ ] Add `getPersonalizedQuestions()` function
- [ ] Match resume keywords with question categories
- [ ] Fallback to random selection if needed

### 6. Testing & Validation
- [ ] Test resume upload with various file types
- [ ] Verify Chrome AI analysis works
- [ ] Test personalized question generation
- [ ] Ensure smooth user experience
- [ ] Handle edge cases (no resume, analysis failure)

## Notes
- Use Chrome AI for resume analysis when available
- Support anonymous users for testing
- Maintain backward compatibility where possible
- Focus on technical interview only as requested
