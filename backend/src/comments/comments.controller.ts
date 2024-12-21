import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UserService } from 'src/users/users.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthRole } from 'src/common/const/auth.const';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly userService: UserService,
  ) {}

  @Get('seller/:sellerId')
  @Roles(AuthRole.Guest)
  async findBySellerId(@Param('sellerId') sellerId: string) {
    // Получаем все комментарии для указанного carId
    const comments =
      await this.commentsService.findCommentsBySellerId(sellerId);

    if (comments.length === 0) return [];

    // Извлекаем уникальные authorId из комментариев
    const authorIds = [...new Set(comments.map((comment) => comment.authorId))];

    // Находим всех пользователей с указанными authorId
    const authors = await this.userService.findUsersByIds(authorIds);

    // Создаем словарь (map) для быстрого доступа к данным пользователей по их ID
    const authorsMap = authors.reduce((map, author) => {
      map[author._id.toString()] = {
        profilePicture: author.profilePicture,
        nickname: author.nickname,
        email: author.email,
      };
      return map;
    }, {});

    // Дополняем комментарии информацией о продавцах
    const commentsWithAuthor = comments.map((comment) => ({
      ...comment, // Преобразуем комментарий в обычный объект, если используется Mongoose
      author: authorsMap[comment.authorId] || null, // Добавляем продавца или null, если не найден
    }));

    return commentsWithAuthor;
  }

  @Get(':carId')
  @Roles(AuthRole.Guest)
  async findByCarId(@Param('carId') carId: string) {
    // Получаем все комментарии для указанного carId
    const comments = await this.commentsService.findCommentsByCarId(carId);

    // Извлекаем уникальные authorId из комментариев
    const authorIds = [...new Set(comments.map((comment) => comment.authorId))];

    // Находим всех пользователей с указанными authorId
    const authors = await this.userService.findUsersByIds(authorIds);

    // Создаем словарь (map) для быстрого доступа к данным пользователей по их ID
    const authorsMap = authors.reduce((map, author) => {
      map[author._id.toString()] = {
        profilePicture: author.profilePicture,
        nickname: author.nickname,
        email: author.email,
      };
      return map;
    }, {});

    // Дополняем комментарии информацией о продавцах
    const commentsWithAuthor = comments.map((comment) => ({
      ...comment, // Преобразуем комментарий в обычный объект, если используется Mongoose
      author: authorsMap[comment.authorId] || null, // Добавляем продавца или null, если не найден
    }));

    return commentsWithAuthor;
  }

  @Post(':carId')
  @Roles(AuthRole.User)
  async create(
    @Param('carId') carId: string,
    @Body() commentDto: any,
    @Req() req: any,
  ) {
    const user = req.user;

    const comment = await this.commentsService.create(carId, {
      ...commentDto,
      authorId: user.id,
    });

    return {
      id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      author: {
        profilePicture: user.profilePicture,
        nickname: user.nickname,
        email: user.email,
        author: {
          profilePicture: user.profilePicture,
          nickname: user.nickname,
          email: user.email,
        },
      },
    };
  }

  @Post('seller/:sellerId')
  @Roles(AuthRole.User)
  async createSellerComment(
    @Param('sellerId') sellerId: string,
    @Body() commentDto: any,
    @Req() req: any,
  ) {
    const user = req.user;

    const comment = await this.commentsService.createSellerComment(sellerId, {
      ...commentDto,
      authorId: user.id,
      sellerId,
    });

    return {
      id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      author: {
        profilePicture: user.profilePicture,
        nickname: user.nickname,
        email: user.email,
        author: {
          profilePicture: user.profilePicture,
          nickname: user.nickname,
          email: user.email,
        },
      },
    };
  }
}
