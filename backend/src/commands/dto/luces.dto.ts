import {
  IsString,
  IsIn,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ManualPayload {
  @IsNumber()
  @Min(0)
  @Max(100)
  intensidad!: number;
}

class ApagarPayload {
  // opcional, podrías no tener payload
  @IsOptional()
  on?: boolean; // true = encender, false = apagar
}

export class LucesDto {
  @IsString()
  zona!: 'oeste' | 'este'; // o el enum de zonas que manejes

  @IsString()
  @IsIn(['manual', 'eco', 'apagar'])
  mode!: 'manual' | 'eco' | 'apagar';

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  payload?: ManualPayload | ApagarPayload | Record<string, never>;
}
