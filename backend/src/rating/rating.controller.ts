import { Controller, Post, Body } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async toggleRating(@Body() rating: { userId: string; carId: string }) {
    return this.ratingService.toggleRating(rating);
  }
}
