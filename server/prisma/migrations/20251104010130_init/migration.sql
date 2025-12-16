-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "password" VARCHAR(127) NOT NULL,
    "email" VARCHAR(127) NOT NULL,
    "username" VARCHAR(31) NOT NULL,
    "permission_level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "liked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "disliked_by" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "title" VARCHAR(127) NOT NULL,
    "content" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
