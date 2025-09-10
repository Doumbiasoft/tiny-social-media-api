import { Request, Response } from "express";
import { Comments } from "../../config/database";
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
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation.middleware";
import { findUserById } from "../../services/user.service";
import {
  createComment,
  deleteCommentById,
  findAllComments,
  findCommentById,
  updateCommentById,
} from "../../services/comment.service";
import { findPostById } from "../../services/post.service";
import { buildRoute } from "../../config/apiPrefix";

@Router(buildRoute("v1/comments"))
class CommentController {
  @Get()
  @Use(
    endpointMetadata({
      summary: "Get all comments",
      description:
        "Retrieve comments, optionally filtered by user ID and/or post ID",
    }),
    validateQuery({
      rules: [
        {
          field: "userId",
          required: false,
          type: "string",
        },
        {
          field: "postId",
          required: false,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async getComments(@Req req: Request, @Res res: Response) {
    let comments: Comments = [];
    if (req.query.userId && req.query.postId) {
      const userId = Number(req.query.userId);
      const user = findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      const postId = Number(req.query.postId);
      const post = findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      comments = findAllComments({ userId, postId });
      return sendResponse(res, comments);
    }
    if (req.query.userId) {
      const userId = Number(req.query.userId);
      const user = findUserById(userId);
      if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
      comments = findAllComments({ userId });
      return sendResponse(res, comments);
    }
    if (req.query.postId) {
      const postId = Number(req.query.postId);
      const post = findPostById(postId);
      if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
      comments = findAllComments({ postId });
      return sendResponse(res, comments);
    }
    comments = findAllComments();
    return sendResponse(res, comments);
  }
  @Post()
  @Use(
    endpointMetadata({
      summary: "Create a new comment",
      description: "Add a new comment to a specific post by a specific user",
    }),
    validateBody({
      rules: [
        {
          field: "userId",
          required: true,
          type: "number",
        },
        {
          field: "postId",
          required: true,
          type: "number",
        },
        {
          field: "body",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async addComment(@Req req: Request, @Res res: Response) {
    const userId = Number(req.body.userId);
    const user = findUserById(userId);
    if (!user) return sendError(res, "User not found", HttpStatus.NOT_FOUND);
    const postId = Number(req.body.postId);
    const post = findPostById(postId);
    if (!post) return sendError(res, "Post not found", HttpStatus.NOT_FOUND);
    const comment = createComment(req.body);
    return sendResponse(res, comment);
  }
  @Get("/:id")
  @Use(
    endpointMetadata({
      summary: "Get comment by ID",
      description: "Retrieve a specific comment by its unique identifier",
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
  async getCommentById(@Req req: Request, @Res res: Response) {
    const commentId = Number(req.params.id);
    const comment = findCommentById(commentId);
    if (!comment)
      return sendError(res, "Comment not found", HttpStatus.NOT_FOUND);
    return sendResponse(res, comment);
  }
  @Patch("/:id")
  @Use(
    endpointMetadata({
      summary: "Update comment",
      description: "Update the content of an existing comment",
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
          field: "body",
          required: true,
          type: "string",
        },
      ],
    }),
    logRequest()
  )
  async updateComment(@Req req: Request, @Res res: Response) {
    if (Number(req.params.id) !== Number(req.body.id))
      return sendError(
        res,
        "Resource to update not found",
        HttpStatus.BAD_REQUEST
      );
    const updatedComment = updateCommentById(Number(req.params.id), req.body);
    return sendResponse(res, updatedComment);
  }
  @Delete("/:id")
  @Use(
    endpointMetadata({
      summary: "Delete comment",
      description: "Delete a specific comment by its unique identifier",
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
  async deleteComment(@Req req: Request, @Res res: Response) {
    const commentId = Number(req.params.id);
    const comment = findCommentById(commentId);
    if (!comment)
      return sendError(res, "Comment not found", HttpStatus.NOT_FOUND);
    const deletedComment = deleteCommentById(commentId);
    return sendResponse(res, deletedComment);
  }
}

export { CommentController };
