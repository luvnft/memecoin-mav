import { Inject, Injectable } from '@nestjs/common';
import { LLM_PROVIDER } from './constants';
import { LlmProvider } from './types/llm-provider.interface';
import {
  TradingSignal,
  TradingSignalSchema,
} from './types/trading-signal.schema';
import { SocialPost } from 'src/social/types/social-post.interface';
import { LoggerService } from 'libs/logger/src/logger.service';

@Injectable()
export class AIService {
  constructor(
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Generate a trading signal for a given coin
   * @param coinName - The name of the coin
   * @param socialPosts - The social posts for the coin
   * @returns The trading signal
   */
  async generateTradingSignal(
    coinName: string,
    socialPosts: SocialPost[],
  ): Promise<TradingSignal> {
    try {
      const prompt = `Analyze the following Farcaster social data for ${coinName} and generate a trading signal.

      Social Data:
      ${JSON.stringify(socialPosts, null, 2)}

      Based on the social data, determine:
      1. Whether to BUY or SELL or HOLD ${coinName}
      2. The exact percentage of holdings to trade (between -100% to +100%)
         - Use negative percentage for SELL (-100% means sell all holdings)
         - Use positive percentage for BUY (100% means maximum buy)
         - Use 0% for HOLD the current holdings
      3. Signal strength (WEAK/MODERATE/STRONG) based on data confidence

      Consider:
      - Post volume and engagement trends
      - Sentiment analysis of discussions
      - Notable influencer activity
      - Market timing signals
      - Unusual patterns or anomalies

      Return a structured signal focusing on actionable percentage-based trade recommendation.`;

      return await this.llmProvider.getStructuredResponse<TradingSignal>(
        prompt,
        TradingSignalSchema,
      );
    } catch (error) {
      this.logger.error(
        `Error generating trading signal for ${coinName}: ${error}`,
      );
      throw error;
    }
  }
}
