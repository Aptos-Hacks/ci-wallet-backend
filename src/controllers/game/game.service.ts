import { BadRequestException, Injectable } from "@nestjs/common"
import { SavePayload, SaveResponseData } from "./dtos"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AccountEntity, GameEntity } from "@database"
import { timestampConfig } from "@config"

@Injectable()
export class GameService {
    constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    ) {}

    public async save(
        { balance, totalBonus, timestamp }: SavePayload,
        { accountId }: AccountEntity,
    ): Promise<SaveResponseData> {
        const game = await this.gameRepository.findOne({
            where: {
                accountId,
            },
        })

        if (
            new Date().getMilliseconds() - timestamp.getMilliseconds() >
      timestampConfig().deadline
        ) {
            throw new BadRequestException("Request has expired. Please try again.")
        }

        const gameId = game ? game.gameId : undefined
        await this.gameRepository.save({
            gameId,
            balance,
            totalBonus,
            accountId,
        })

        return {
            message: "Save successfully.",
        }
    }
}
