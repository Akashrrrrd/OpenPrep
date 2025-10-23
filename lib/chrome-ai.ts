// Chrome AI Service for OpenPrep
// This service provides easy access to Chrome's built-in AI APIs with fallbacks

export interface ChromeAICapabilities {
    languageModel: boolean;
    summarizer: boolean;
    writer: boolean;
    rewriter: boolean;
    translator: boolean;
    proofreader: boolean;
}

// Mock data for fallbacks when Chrome AI is not available
const MOCK_QUESTIONS = {
    technical: [
        "Explain the difference between let, const, and var in JavaScript.",
        "How does React's virtual DOM work and what are its benefits?",
        "What is the difference between synchronous and asynchronous programming?"
    ],
    hr: [
        "Tell me about a challenging project you worked on and how you overcame obstacles.",
        "How do you handle working under tight deadlines?",
        "Describe a time when you had to learn a new technology quickly."
    ]
};

export class ChromeAIService {
    // Check if Chrome AI is available
    static isAvailable(): boolean {
        return typeof window !== 'undefined' && 'ai' in window;
    }

    // Check which AI capabilities are available with proper error handling
    static async getCapabilities(): Promise<ChromeAICapabilities> {
        if (!this.isAvailable()) {
            return {
                languageModel: false,
                summarizer: false,
                writer: false,
                rewriter: false,
                translator: false,
                proofreader: false
            };
        }

        try {
            const ai = (window as any).ai;
            const capabilities: ChromeAICapabilities = {
                // Check each API individually with proper error handling
                languageModel: await this.checkAPIAvailability(() => ai.languageModel?.create()),
                summarizer: await this.checkAPIAvailability(() => ai.summarizer?.create()),
                writer: await this.checkAPIAvailability(() => ai.writer?.create()),
                rewriter: await this.checkAPIAvailability(() => ai.rewriter?.create()),
                translator: await this.checkAPIAvailability(() => ai.translator?.create({ sourceLanguage: 'en', targetLanguage: 'es' })),
                proofreader: await this.checkAPIAvailability(() => ai.proofreader?.create())
            };

            return capabilities;
        } catch (error) {
            console.error('Error checking Chrome AI capabilities:', error);
            return {
                languageModel: false,
                summarizer: false,
                writer: false,
                rewriter: false,
                translator: false,
                proofreader: false
            };
        }
    }

    // Helper method to check if an API is actually available
    private static async checkAPIAvailability(createFn: () => Promise<any>): Promise<boolean> {
        try {
            if (!createFn) return false;
            const session = await createFn();
            if (session?.destroy) {
                session.destroy();
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    // Generate interview questions using Prompt API with fallback
    static async generateInterviewQuestions(
        type: 'technical' | 'hr',
        topic?: string,
        difficulty?: 'junior' | 'mid' | 'senior'
    ): Promise<string[] | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('languageModel' in (window as any).ai)) {
                try {
                    const session = await (window as any).ai.languageModel.create();

                    const prompt = type === 'technical'
                        ? `Generate 3 ${difficulty || 'mid-level'} technical interview questions about ${topic || 'JavaScript and React'}. Format as a simple list.`
                        : `Generate 3 ${difficulty || 'mid-level'} HR/behavioral interview questions for software developers. Format as a simple list.`;

                    const response = await session.prompt(prompt);

                    // Parse the response into an array of questions
                    const questions = response
                        .split('\n')
                        .filter((line: string) => line.trim().length > 0)
                        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
                        .filter((q: string) => q.length > 10);

                    session.destroy();
                    return questions.slice(0, 3); // Ensure we only return 3 questions
                } catch (aiError) {
                    console.warn('Chrome AI failed, using fallback questions:', aiError);
                    // Fall through to mock data
                }
            }

            // Fallback to mock questions when Chrome AI is not available
            console.log('Using mock interview questions (Chrome AI not available)');
            return MOCK_QUESTIONS[type] || null;
        } catch (error) {
            console.error('Error generating interview questions:', error);
            // Return mock data as final fallback
            return MOCK_QUESTIONS[type] || null;
        }
    }

    // Summarize content using Summarizer API with fallback
    static async summarizeContent(content: string): Promise<string | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('summarizer' in (window as any).ai)) {
                try {
                    const summarizer = await (window as any).ai.summarizer.create();
                    const summary = await summarizer.summarize(content);
                    summarizer.destroy();
                    return summary;
                } catch (aiError) {
                    console.warn('Chrome AI Summarizer failed, using fallback:', aiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Simple text truncation with key points
            console.log('Using fallback summarization (Chrome AI not available)');
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
            if (sentences.length <= 3) return content;
            
            // Return first 2 sentences as a basic summary
            const summary = sentences.slice(0, 2).join('. ').trim() + '.';
            return `Summary: ${summary} (Note: This is a basic summary. For AI-powered summarization, please use Chrome 127+ with AI features enabled.)`;
        } catch (error) {
            console.error('Error summarizing content:', error);
            return null;
        }
    }

    // Improve writing using Writer API with fallback
    static async improveWriting(
        text: string,
        context: 'question' | 'answer' | 'experience' = 'answer'
    ): Promise<string | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('writer' in (window as any).ai)) {
                try {
                    const writer = await (window as any).ai.writer.create();

                    const prompt = context === 'question'
                        ? `Improve this technical question to be clearer and more specific: "${text}"`
                        : context === 'experience'
                            ? `Improve this interview experience description to be more helpful and detailed: "${text}"`
                            : `Improve this answer to be more professional and comprehensive: "${text}"`;

                    const improved = await writer.write(prompt);
                    writer.destroy();
                    return improved;
                } catch (aiError) {
                    console.warn('Chrome AI Writer failed, using fallback:', aiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Basic text improvements
            console.log('Using fallback writing improvement (Chrome AI not available)');
            let improved = text.trim();
            
            // Basic improvements
            improved = improved.charAt(0).toUpperCase() + improved.slice(1);
            if (!improved.endsWith('.') && !improved.endsWith('!') && !improved.endsWith('?')) {
                improved += '.';
            }
            
            return `${improved} (Note: For AI-powered writing improvement, please use Chrome 127+ with AI features enabled.)`;
        } catch (error) {
            console.error('Error improving writing:', error);
            return null;
        }
    }

    // Rewrite content using Rewriter API with fallback
    static async rewriteContent(
        text: string,
        tone: 'professional' | 'casual' | 'concise' = 'professional'
    ): Promise<string | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('rewriter' in (window as any).ai)) {
                try {
                    const rewriter = await (window as any).ai.rewriter.create();
                    const rewritten = await rewriter.rewrite(text, { tone });
                    rewriter.destroy();
                    return rewritten;
                } catch (aiError) {
                    console.warn('Chrome AI Rewriter failed, using fallback:', aiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Basic tone adjustments
            console.log('Using fallback rewriting (Chrome AI not available)');
            let rewritten = text.trim();
            
            if (tone === 'professional') {
                rewritten = rewritten.replace(/\b(gonna|wanna|gotta)\b/gi, (match) => {
                    const replacements: { [key: string]: string } = {
                        'gonna': 'going to',
                        'wanna': 'want to',
                        'gotta': 'have to'
                    };
                    return replacements[match.toLowerCase()] || match;
                });
            }
            
            return `${rewritten} (Note: For AI-powered rewriting, please use Chrome 127+ with AI features enabled.)`;
        } catch (error) {
            console.error('Error rewriting content:', error);
            return null;
        }
    }

    // Proofread content using Proofreader API with fallback
    static async proofreadContent(text: string): Promise<string | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('proofreader' in (window as any).ai)) {
                try {
                    const proofreader = await (window as any).ai.proofreader.create();
                    const corrected = await proofreader.proofread(text);
                    proofreader.destroy();
                    return corrected;
                } catch (aiError) {
                    console.warn('Chrome AI Proofreader failed, using fallback:', aiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Basic grammar corrections
            console.log('Using fallback proofreading (Chrome AI not available)');
            let corrected = text.trim();
            
            // Basic corrections
            corrected = corrected.replace(/\bi\b/g, 'I'); // Capitalize 'i'
            corrected = corrected.replace(/\s+/g, ' '); // Remove extra spaces
            corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1); // Capitalize first letter
            
            return `${corrected} (Note: For AI-powered proofreading, please use Chrome 127+ with AI features enabled.)`;
        } catch (error) {
            console.error('Error proofreading content:', error);
            return null;
        }
    }

    // Translate content using Translator API with fallback
    static async translateContent(
        text: string,
        targetLanguage: string,
        sourceLanguage: string = 'en'
    ): Promise<string | null> {
        try {
            // Try Chrome AI first
            if (this.isAvailable() && ('translator' in (window as any).ai)) {
                try {
                    const translator = await (window as any).ai.translator.create({
                        sourceLanguage,
                        targetLanguage
                    });

                    const translated = await translator.translate(text);
                    translator.destroy();
                    return translated;
                } catch (aiError) {
                    console.warn('Chrome AI Translator failed, using fallback:', aiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Inform user about limitation
            console.log('Using fallback translation (Chrome AI not available)');
            const languageNames: { [key: string]: string } = {
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'it': 'Italian',
                'pt': 'Portuguese',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese'
            };
            
            return `[Translation to ${languageNames[targetLanguage] || targetLanguage} not available - Chrome AI required. Original text: "${text}"]`;
        } catch (error) {
            console.error('Error translating content:', error);
            return null;
        }
    }

    // Generate follow-up questions based on user's answer
    static async generateFollowUpQuestion(
        originalQuestion: string,
        userAnswer: string,
        type: 'technical' | 'hr'
    ): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('languageModel' in (window as any).ai)) {
                return null;
            }

            const session = await (window as any).ai.languageModel.create();

            const prompt = type === 'technical'
                ? `Based on this technical question: "${originalQuestion}" and the user's answer: "${userAnswer}", generate one relevant follow-up technical question to dive deeper.`
                : `Based on this HR question: "${originalQuestion}" and the user's answer: "${userAnswer}", generate one relevant follow-up behavioral question.`;

            const followUp = await session.prompt(prompt);
            session.destroy();

            return followUp.trim();
        } catch (error) {
            console.error('Error generating follow-up question:', error);
            return null;
        }
    }

    // Evaluate interview answer quality
    static async evaluateAnswer(
        question: string,
        answer: string,
        type: 'technical' | 'hr'
    ): Promise<{ score: number; feedback: string } | null> {
        try {
            if (!this.isAvailable() || !('languageModel' in (window as any).ai)) {
                return null;
            }

            const session = await (window as any).ai.languageModel.create();

            const prompt = type === 'technical'
                ? `Evaluate this technical interview answer on a scale of 1-10. Question: "${question}" Answer: "${answer}". Provide a score and brief feedback on technical accuracy and clarity.`
                : `Evaluate this HR interview answer on a scale of 1-10. Question: "${question}" Answer: "${answer}". Provide a score and brief feedback on communication and professionalism.`;

            const evaluation = await session.prompt(prompt);
            session.destroy();

            // Parse the evaluation (this is a simple implementation)
            const scoreMatch = evaluation.match(/(\d+)\/10|(\d+) out of 10|score.*?(\d+)/i);
            const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) : 7;

            return {
                score: Math.min(Math.max(score, 1), 10), // Ensure score is between 1-10
                feedback: evaluation
            };
        } catch (error) {
            console.error('Error evaluating answer:', error);
            return null;
        }
    }
}

// Type declarations for Chrome AI APIs
declare global {
    interface Window {
        ai?: {
            languageModel?: {
                create(): Promise<{
                    prompt(text: string): Promise<string>;
                    destroy(): void;
                }>;
            };
            summarizer?: {
                create(): Promise<{
                    summarize(text: string): Promise<string>;
                    destroy(): void;
                }>;
            };
            writer?: {
                create(): Promise<{
                    write(prompt: string): Promise<string>;
                    destroy(): void;
                }>;
            };
            rewriter?: {
                create(): Promise<{
                    rewrite(text: string, options?: { tone?: string }): Promise<string>;
                    destroy(): void;
                }>;
            };
            translator?: {
                create(options: { sourceLanguage: string; targetLanguage: string }): Promise<{
                    translate(text: string): Promise<string>;
                    destroy(): void;
                }>;
            };
            proofreader?: {
                create(): Promise<{
                    proofread(text: string): Promise<string>;
                    destroy(): void;
                }>;
            };
        };
    }
}