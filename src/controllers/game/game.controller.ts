import { Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiTags,
} from "@nestjs/swagger"
import { SavePayload, SaveRequestBody, SaveResponseData } from "./dtos"
import { GameService } from "./game.service"
import { Account, AuthInterceptor, AuthGuard, Payload } from "../shared"
import { AccountEntity } from "@database"

@ApiTags("Game")
@Controller("api/v1/game")
@Controller()
export class GameController {
    constructor(private readonly gameService: GameService) {}

  @ApiBody({
      type: SaveRequestBody
  })
  @ApiCreatedResponse({
      type: SaveResponseData,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Post("save")
    async save(
    @Payload() payload: SavePayload,
    @Account() account: AccountEntity,
    ) {
        return this.gameService.save(payload, account)
    }
}
