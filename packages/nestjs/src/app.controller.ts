import { Controller, Get, UseGuards } from '@nestjs/common'
import { MppGuard } from './mpp.guard.js'

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      framework: 'nestjs',
      version: '11.1.17',
    }
  }

  @Get('free')
  free() {
    return {
      message: 'This is free!',
      timestamp: Date.now(),
    }
  }

  @Get('paid')
  @UseGuards(MppGuard)
  paid() {
    return {
      message: 'Premium content unlocked!',
      timestamp: Date.now(),
    }
  }
}
