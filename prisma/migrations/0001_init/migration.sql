CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "wallet_address" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_symbol" TEXT NOT NULL,
    "token_ca" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "pool_address" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "entry_price" DOUBLE PRECISION NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "stop_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "token_symbol" TEXT NOT NULL,
    "token_ca" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "pool_address" TEXT NOT NULL,
    "ai_direction" TEXT NOT NULL,
    "entry_price" DOUBLE PRECISION NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "stop_price" DOUBLE PRECISION NOT NULL,
    "user_choice" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "xp_awarded" INTEGER,
    "resolve_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolves_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "xp_change" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");
CREATE INDEX "users_xp_created_at_idx" ON "users"("xp" DESC, "created_at");
CREATE INDEX "analyses_user_id_idx" ON "analyses"("user_id");
CREATE UNIQUE INDEX "bets_analysis_id_key" ON "bets"("analysis_id");
CREATE INDEX "bets_status_resolves_at_idx" ON "bets"("status", "resolves_at");
CREATE INDEX "bets_user_id_created_at_idx" ON "bets"("user_id", "created_at");
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

ALTER TABLE "analyses" ADD CONSTRAINT "analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
