// Chrome AI Service for OpenPrep
// This service provides easy access to Chrome's built-in AI APIs

export interface ChromeAICapabilities {
    languageModel: boolean;
    summarizer: boolean;
    writer: boolean;
    rewriter: boolean;
    translator: boolean;
    proofreader: boolean;
}

export class ChromeAIService {
    // Check if Chrome AI is available
    static isAvailable(): boolean {
        return typeof window !== 'undefined' && 'ai' in window;
    }

    // Check which AI capabilities are available - Focus on core 3 APIs
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

        const capabilities: ChromeAICapabilities = {
            // CORE APIs - Essential for interview preparation
            languageModel: 'languageModel' in (window as any).ai,
            summarizer: 'summarizer' in (window as any).ai,
            proofreader: 'proofreader' in (window as any).ai,

            // OPTIONAL APIs - Only if naturally needed
            writer: 'writer' in (window as any).ai,
            rewriter: 'rewriter' in (window as any).ai,
            translator: 'translator' in (window as any).ai
        };

        return capabilities;
    }

    // Generate interview questions using Prompt API
    static async generateInterviewQuestions(
        type: 'technical' | 'hr',
        topic?: string,
        difficulty?: 'junior' | 'mid' | 'senior'
    ): Promise<string[] | null> {
        try {
            if (!this.isAvailable() || !('languageModel' in (window as any).ai)) {
                return null;
            }

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
        } catch (error) {
            console.error('Error generating interview questions:', error);
            return null;
        }
    }

    // Summarize content using Summarizer API
    static async summarizeContent(content: string): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('summarizer' in (window as any).ai)) {
                return null;
            }

            const summarizer = await (window as any).ai.summarizer.create();
            const summary = await summarizer.summarize(content);
            summarizer.destroy();

            return summary;
        } catch (error) {
            console.error('Error summarizing content:', error);
            return null;
        }
    }

    // Improve writing using Writer API
    static async improveWriting(
        text: string,
        context: 'question' | 'answer' | 'experience' = 'answer'
    ): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('writer' in (window as any).ai)) {
                return null;
            }

            const writer = await (window as any).ai.writer.create();

            const prompt = context === 'question'
                ? `Improve this technical question to be clearer and more specific: "${text}"`
                : context === 'experience'
                    ? `Improve this interview experience description to be more helpful and detailed: "${text}"`
                    : `Improve this answer to be more professional and comprehensive: "${text}"`;

            const improved = await writer.write(prompt);
            writer.destroy();

            return improved;
        } catch (error) {
            console.error('Error improving writing:', error);
            return null;
        }
    }

    // Rewrite content using Rewriter API
    static async rewriteContent(
        text: string,
        tone: 'professional' | 'casual' | 'concise' = 'professional'
    ): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('rewriter' in (window as any).ai)) {
                return null;
            }

            const rewriter = await (window as any).ai.rewriter.create();
            const rewritten = await rewriter.rewrite(text, { tone });
            rewriter.destroy();

            return rewritten;
        } catch (error) {
            console.error('Error rewriting content:', error);
            return null;
        }
    }

    // Proofread content using Proofreader API
    static async proofreadContent(text: string): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('proofreader' in (window as any).ai)) {
                return null;
            }

            const proofreader = await (window as any).ai.proofreader.create();
            const corrected = await proofreader.proofread(text);
            proofreader.destroy();

            return corrected;
        } catch (error) {
            console.error('Error proofreading content:', error);
            return null;
        }
    }

    // Translate content using Translator API
    static async translateContent(
        text: string,
        targetLanguage: string,
        sourceLanguage: string = 'en'
    ): Promise<string | null> {
        try {
            if (!this.isAvailable() || !('translator' in (window as any).ai)) {
                return null;
            }

            const translator = await (window as any).ai.translator.create({
                sourceLanguage,
                targetLanguage
            });

            const translated = await translator.translate(text);
            translator.destroy();

            return translated;
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