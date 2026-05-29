import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// Payload para modo automático
class TimerPayload {
  @IsNumber()
  verde!: number;

  @IsNumber()
  amarillo!: number;

  @IsNumber()
  rojo!: number;
}

// Payload para modo manual
class ManualPayload {
  @IsString()
  @IsIn(['verde', 'amarillo', 'rojo'])
  color!: 'verde' | 'amarillo' | 'rojo';
}

export class SemaforoDto {
  @IsString()
  @IsIn(['automatico', 'manual', 'emergencia'])
  mode!: 'automatico' | 'manual' | 'emergencia';

  @IsNumber()
  semaforo!: 0 | 1 | 2 | 3 | 4;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  payload?: TimerPayload | ManualPayload | Record<string, never>;
}
