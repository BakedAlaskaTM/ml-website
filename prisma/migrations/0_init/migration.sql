-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."IdentityProvider" AS ENUM ('TMX', 'DEDIMANIA');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('GUEST', 'MEMBER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."Map" (
    "uid" TEXT NOT NULL,
    "tmx_id" BIGINT NOT NULL,
    "name" TEXT,
    "tmx_author_id" BIGINT[],
    "author_time" BIGINT,
    "author_login" TEXT,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."MatchedIdentity" (
    "provider" "public"."IdentityProvider" NOT NULL,
    "external_id" TEXT NOT NULL,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "MatchedIdentity_pkey" PRIMARY KEY ("provider","external_id","profile_id")
);

-- CreateTable
CREATE TABLE "public"."PlayerIdentity" (
    "provider" "public"."IdentityProvider" NOT NULL,
    "external_id" TEXT NOT NULL,
    "username" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlayerIdentity_pkey" PRIMARY KEY ("external_id","provider")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "display_name" TEXT NOT NULL,
    "role" "public"."Role",
    "merged_into_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "started_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN DEFAULT true,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "map_count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."ProjectMap" (
    "map_uid" TEXT NOT NULL,
    "project_slug" TEXT NOT NULL,

    CONSTRAINT "ProjectMap_pkey" PRIMARY KEY ("map_uid","project_slug")
);

-- CreateTable
CREATE TABLE "public"."Record" (
    "time" BIGINT NOT NULL,
    "driven_on" TIMESTAMPTZ(6),
    "map_uid" TEXT NOT NULL,
    "player_identity_id" TEXT NOT NULL,
    "leaderboard" "public"."IdentityProvider" NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("player_identity_id","map_uid","leaderboard")
);

-- CreateTable
CREATE TABLE "public"."WorldRecordHistory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "map_uid" TEXT NOT NULL,
    "player_identity_id" TEXT NOT NULL,
    "leaderboard" "public"."IdentityProvider" NOT NULL,
    "time" BIGINT NOT NULL,
    "driven_on" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorldRecordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_wr_history_identity" ON "public"."WorldRecordHistory"("leaderboard" ASC, "player_identity_id" ASC);

-- CreateIndex
CREATE INDEX "idx_wr_history_map" ON "public"."WorldRecordHistory"("map_uid" ASC);

-- AddForeignKey
ALTER TABLE "public"."MatchedIdentity" ADD CONSTRAINT "MatchedIdentity_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."MatchedIdentity" ADD CONSTRAINT "fk_matchedidentity_player_identity" FOREIGN KEY ("provider", "external_id") REFERENCES "public"."PlayerIdentity"("provider", "external_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_merged_into_id_fkey" FOREIGN KEY ("merged_into_id") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProjectMap" ADD CONSTRAINT "ProjectMap_map_uid_fkey" FOREIGN KEY ("map_uid") REFERENCES "public"."Map"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProjectMap" ADD CONSTRAINT "ProjectMap_project_slug_fkey" FOREIGN KEY ("project_slug") REFERENCES "public"."Project"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_map_uid_fkey" FOREIGN KEY ("map_uid") REFERENCES "public"."Map"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "fk_record_player_identity" FOREIGN KEY ("leaderboard", "player_identity_id") REFERENCES "public"."PlayerIdentity"("provider", "external_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."WorldRecordHistory" ADD CONSTRAINT "WorldRecordHistory_map_uid_fkey" FOREIGN KEY ("map_uid") REFERENCES "public"."Map"("uid") ON DELETE CASCADE ON UPDATE NO ACTION;
