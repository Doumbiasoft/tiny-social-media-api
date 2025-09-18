import { Request, Response } from "express";
import { Comments, Users } from "../../config/database";
import { sendResponse, sendError } from "../../utils/apiResponseFormat";
import {
  Router,
  Get,
  Post,
  Delete,
  Patch,
  Use,
  Req,
  Res,
} from "@reflet/express";
import { HttpStatus } from "../../types/httpStatus";
import {
  validateBody,
  validateParams,
  validateQuery,
  ValidationPatterns,
} from "../../middlewares/validation.middleware";
import { logRequest } from "../../middlewares/logging.middleware";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  findAllUsers,
  findUserById,
  createUser,
  findUser,
  updateUserById,
  deleteUserById,
} from "../../services/user.service";
import { findAllPosts, findPostById } from "../../services/post.service";
import { findAllComments } from "../../services/comment.service";
import { buildRoute } from "../../config/apiPrefix";

@Router(buildRoute("v1/users"))
class UserController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all users",
      description: "Retrieve a list of all registered users",
    }),
    logRequest()
  )
  async getUsers(@Req req: Request, @Res res: Response) {
    const users: Users = findAllUsers();
    return sendResponse(res, users);
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new user",
      description: "Register a new user with name, username, and email",
    }),
    validateBody({
      rules: [
        {
          field: "name",
          required: true,
          type: "string",
          minLength: 3,
          maxLength: 50,
        },
        {
          field: "username",
          required: true,
          type: "string",
          minLength: 3,
          maxLength: 50,
        },
        {
          field: "email",
          required: true,
          type: "string",
          pattern: ValidationPatterns.EMAIL,
        },
      ],
    }),
    logRequest()
  )
  async addUser(@Req req: Request, @Res res: Response) {
    const exitUser = findUser({ username: req.body.username });
    if (exitUser)
      return sendError(
        res,
        `This username: ${req.body.username} is already taken`,
        HttpStatus.BAD_REQUEST
      );
    const user = createUser(req.body);
    return sendResponse(res, user);
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get user by ID",
      description: "Retrieve a specific user by their unique identifier",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getUserById(@Req req: Request, @Res res: Response) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
    return sendResponse(res, user);
  }

  @Get("/:id/posts")
  @Use(
    endpointMetadata({
      summary: "Get user posts",
      description: "Retrieve all posts created by a specific user",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getUserPosts(@Req req: Request, @Res res: Response) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
    const posts = findAllPosts(userId);
    return sendResponse(res, posts);
  }

  @Get("/:id/comments")
  @Use(
    endpointMetadata({
      summary: "Get user comments",
      description:
        "Retrieve all comments made by a specific user, optionally filtered by post ID",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    validateQuery({
      rules: [
        {
          field: "postId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getUserComments(@Req req: Request, @Res res: Response) {
    let comments: Comments = [];
    const userId = Number(req.params.id);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);

    if (req.query.postId) {
      const postId = Number(req.query.postId);
      const post = findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      comments = findAllComments({ userId, postId });
      return sendResponse(res, comments);
    }
    comments = findAllComments({ userId });
    return sendResponse(res, comments);
  }

  @Patch("/:id")
  @Use(
    endpointMetadata({
      summary: "Update user",
      description: "Update an existing user's name, email, or username",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    validateBody({
      rules: [
        {
          field: "id",
          required: true,
          type: "number",
        },
        {
          field: "name",
          required: false,
          type: "string",
        },
        {
          field: "email",
          required: false,
          type: "string",
        },
        {
          field: "username",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updateUser(@Req req: Request, @Res res: Response) {
    if (Number(req.params.id) !== Number(req.body.id))
      return sendError(
        res,
        "Resource to update not found",
        HttpStatus.BAD_REQUEST
      );
    const userId = Number(req.params.id);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
    const updatedUser = updateUserById(userId, req.body);
    return sendResponse(res, updatedUser);
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete user",
      description: "Delete a specific user by their unique identifier",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async deleteUser(@Req req: Request, @Res res: Response) {
    const userId = Number(req.params.id);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
    const deletedUser = deleteUserById(userId);
    return sendResponse(res, deletedUser);
  }
}

export { UserController };
