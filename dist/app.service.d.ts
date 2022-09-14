import { ConfigService } from '@nestjs/config';
export declare class AppService {
    config: ConfigService;
    getHello(): string;
}
