/*
  Warnings:

  - You are about to drop the `CommentDislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostDislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."CommentDislikes";

-- DropTable
DROP TABLE "public"."CommentLikes";

-- DropTable
DROP TABLE "public"."PostComments";

-- DropTable
DROP TABLE "public"."PostDislikes";

-- DropTable
DROP TABLE "public"."PostLikes";

-- DropTable
DROP TABLE "public"."UserPosts";

-- CreateTable
CREATE TABLE "PostLike" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostDislike" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PostDislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentDislike" (
    "id" SERIAL NOT NULL,
    "comment" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "CommentDislike_pkey" PRIMARY KEY ("id")
);
