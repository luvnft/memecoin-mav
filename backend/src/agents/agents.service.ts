import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from 'libs/logger/src';
import { PrismaService } from 'libs/prisma/src';
import { FereService } from '../fere/fere.service';
import { getPersonaStrings } from './utils/persona.utils';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateAgentResponse } from './types/create-agent.interface';
import { AgentPersona } from './types/agent-persona.enum';
import { GetHoldingsResponse } from './types/get-holdings.interface';
import { Omit } from 'lodash';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly fereService: FereService,
  ) {}

  async createAgent(
    createAgentDto: CreateAgentDto,
  ): Promise<CreateAgentResponse> {
    try {
      const {
        name,
        description,
        persona: selectedPersona,
        ownerAddress,
      } = createAgentDto;

      if (
        selectedPersona === undefined ||
        !Object.values(AgentPersona).includes(selectedPersona)
      ) {
        throw new BadRequestException(
          'Invalid personaId. Must be 0 (MOON_CHASER), 1 (MEME_LORD), or 2 (WHALE_WATCHER)',
        );
      }

      // Get persona strings
      const { personaPrompt, decisionPromptPool, decisionPromptPortfolio } =
        getPersonaStrings(selectedPersona);

      // Create disciple agent via Fere API
      const fereAgent = await this.fereService.createAgent({
        name,
        description,
        personaPrompt,
        decisionPromptPool,
        decisionPromptPortfolio,
      });

      // Create agent in database
      const agent = await this.prisma.agent.create({
        data: {
          externalId: fereAgent.id,
          name,
          description,
          persona: selectedPersona,
          ownerAddress,
          evmAddress: fereAgent.evm_address,
          solAddress: fereAgent.sol_address,
          isActive: fereAgent.is_active,
        },
      });

      this.logger.info(
        `Agent created with {id: ${agent.id}, name: ${agent.name}, persona: ${selectedPersona}, evmAddress: ${agent.evmAddress}, solAddress: ${agent.solAddress}, isActive: ${agent.isActive}, createdAt: ${agent.createdAt}}`,
      );

      // TODO: Should be done at DB call level for all queries
      const agentWithoutExternalId = Omit(agent, 'externalId');

      return {
        ...agentWithoutExternalId,
        solPvtKey: fereAgent.sol_pvt_key,
        evmPvtKey: fereAgent.evm_pvt_key,
        mnemonic: fereAgent.mnemonic,
      };
    } catch (error) {
      this.logger.error('Failed to create agent:', error);
      throw new InternalServerErrorException('Failed to create agent');
    }
  }

  async getHoldings(agentId: string): Promise<GetHoldingsResponse> {
    const holdings = await this.prisma.holding.findMany({
      where: { agentId },
    });

    // TODO: Should be done at DB call level for all queries
    const holdingsWithoutExternalId = holdings.map((holding) =>
      Omit(holding, 'externalId'),
    );

    return holdingsWithoutExternalId;
  }
}
