import { Request, Response } from "express";
import { Comments, Posts } from "../../config/database";
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
import { logRequest } from "../../middlewares/logging.middleware";
import { HttpStatus } from "../../types/httpStatus";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation.middleware";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  createPost,
  deletePostById,
  findAllPosts,
  findPostById,
  updatePostById,
} from "../../services/post.service";
import { findUserById } from "../../services/user.service";
import { findAllComments } from "../../services/comment.service";
import { buildRoute } from "../../config/apiPrefix";

@Router(buildRoute("v1/posts"))
class PostController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all posts",
      description:
        "Retrieve a list of all posts, optionally filtered by user ID",
    }),
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getPosts(@Req req: Request, @Res res: Response) {
    let posts: Posts = [];
    if (req.query.userId) {
      const userId = Number(req.query.userId);
      const user = findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      posts = findAllPosts(userId);
      return sendResponse(res, posts);
    } else {
      posts = findAllPosts();
      return sendResponse(res, posts);
    }
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new post",
      description:
        "Create a new post with title and content for a specific user",
    }),
    validateBody({
      rules: [
        {
          field: "userId",
          required: true,
          type: "number",
        },
        {
          field: "title",
          required: true,
          type: "string",
        },
        {
          field: "content",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async addPost(@Req req: Request, @Res res: Response) {
    const exitUser = findUserById(req.body.userId);
    if (!exitUser)
      return sendError(res, `User not found`, HttpStatus.NOT_FOUND);
    const post = createPost(req.body);
    return sendResponse(res, post);
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get post by ID",
      description: "Retrieve a specific post by its unique identifier",
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
  async getPostById(@Req req: Request, @Res res: Response) {
    const postId = Number(req.params.id);
    const post = findPostById(postId);
    if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
    return sendResponse(res, post);
  }

  @Get("/:id/comments")
  @Use(
    endpointMetadata({
      summary: "Get post comments",
      description:
        "Retrieve all comments for a specific post, optionally filtered by user ID",
    }),
    validateParams({
      rules: [
        {
          field: "id",
          required: false,
          type: "string",
        },
      ],
    }),
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getPostComments(@Req req: Request, @Res res: Response) {
    let comments: Comments = [];
    const postId = Number(req.params.id);
    const post = findPostById(postId);
    if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
    if (req.query.userId) {
      const userId = Number(req.query.userId);
      const user = findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      comments = findAllComments({ userId, postId });
      return sendResponse(res, comments);
    }
    comments = findAllComments({ postId });
    return sendResponse(res, comments);
  }

  @Patch("/:id")
  @Use(
    endpointMetadata({
      summary: "Update post",
      description: "Update an existing post's title and/or content",
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
          field: "title",
          required: false,
          type: "string",
        },
        {
          field: "content",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updatePost(@Req req: Request, @Res res: Response) {
    if (Number(req.params.id) !== Number(req.body.id))
      return sendError(
        res,
        "Resource to update not found",
        HttpStatus.BAD_REQUEST
      );
    const updatedPost = updatePostById(Number(req.params.id), req.body);
    return sendResponse(res, updatedPost);
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete post",
      description: "Delete a specific post by its unique identifier",
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
  async deletePost(@Req req: Request, @Res res: Response) {
    const postId = Number(req.params.id);
    const post = findPostById(postId);
    if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
    const deletedPost = deletePostById(postId);
    return sendResponse(res, deletedPost);
  }
}

export { PostController };
