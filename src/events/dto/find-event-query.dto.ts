import { IsOptional, IsString, MaxLength } from "class-validator";
import { paginationQueryDto } from "src/common/dto/pagination-query.dto";


export class FindEventQueryDto extends paginationQueryDto  {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

}



