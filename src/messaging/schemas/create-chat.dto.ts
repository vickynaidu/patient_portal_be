import { IsNotEmpty } from "class-validator";

export class CreateChatDto {

    @IsNotEmpty()
    readonly sender_id: string;

    @IsNotEmpty()
    readonly receiver_id: string;

    @IsNotEmpty()
    readonly content: string;
}
