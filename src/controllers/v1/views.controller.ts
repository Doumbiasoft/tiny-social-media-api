import { Request, Response } from "express";
import { Get, Post, Req, Res, Router, Use } from "@reflet/express";
import { buildRoute } from "../../config/apiPrefix";
import { endpointMetadata } from "../../middlewares/endpointMetadata.middleware";
import * as db from "../../config/database";
import { findUserById } from "../../services/user.service";
import { validateBody } from "../../middlewares/validation.middleware";
import { logRequest } from "../../middlewares/logging.middleware";
import { sendError } from "../../utils/apiResponseFormat";
import { HttpStatus } from "../../types/httpStatus";
import { createPost } from "../../services/post.service";

@Router(buildRoute("v1/views"))
class ViewController {
  @Get("/posts")
  @Use(
    endpointMetadata({
      summary: "Display posts",
      description: "Display the list of posts on a view",
    })
  )
  async list(@Req req: Request, @Res res: Response) {
    const postsFormatted = db.posts.map((post) => {
      const user = findUserById(post.userId);
      const returnPost = {
        ...user,
        ...post,
      };
      return returnPost;
    });
    const data = {
      posts: postsFormatted.sort((a, b) => b.id - a.id),
    };
    res.render("posts-list", data);
  }
  @Get("/add-post")
  @Use(
    endpointMetadata({
      summary: "Display posts",
      description: "Display the list of posts on a view",
    })
  )
  async addPostForm(@Req req: Request, @Res res: Response) {
    const data = {
      users: db.users,
    };
    res.render("add-post", data);
  }
  @Post("/posts")
  @Use(
    endpointMetadata({
      summary: "Create a new post via a form view",
      description:
        "Create a new post with title and content for a specific user",
    }),
    validateBody({
      rules: [
        {
          field: "userId",
          required: true,
          type: "string",
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
  async createPost(@Req req: Request, @Res res: Response) {
    const exitUser = findUserById(Number(req.body.userId));
    if (!exitUser)
      return sendError(res, `User not found`, HttpStatus.NOT_FOUND);
    createPost(req.body);
    return res.redirect("/api/v1/views/posts");
  }
}

export { ViewController };
