/*
  Warnings:

  - You are about to drop the column `disliked_by` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `liked_by` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `disliked_by` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `liked_by` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `permission_level` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_author_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "disliked_by",
DROP COLUMN "liked_by";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "author_id",
DROP COLUMN "disliked_by",
DROP COLUMN "liked_by",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission_level";

-- CreateTable
CREATE TABLE "UserPermission" (
    "user_id" INTEGER NOT NULL,
    "permission_level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserComments" (
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(31) NOT NULL,
    "comments_created" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "UserComments_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserPosts" (
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(31) NOT NULL,
    "posts_created" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "UserPosts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "post_id" INTEGER NOT NULL,
    "liked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "PostDislikes" (
    "post_id" INTEGER NOT NULL,
    "disliked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "PostDislikes_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "PostComments" (
    "post_id" INTEGER NOT NULL,
    "comments" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "PostComments_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "comment_id" INTEGER NOT NULL,
    "liked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "CommentDislikes" (
    "comment_id" INTEGER NOT NULL,
    "disliked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "CommentDislikes_pkey" PRIMARY KEY ("comment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserComments_username_key" ON "UserComments"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserPosts_username_key" ON "UserPosts"("username");
