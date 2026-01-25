-- Rename table Prompt -> ApartRent
ALTER TABLE "Prompt" RENAME TO "ApartRent";

-- Rename column promptId -> apartRentId
ALTER TABLE "Vote" RENAME COLUMN "promptId" TO "apartRentId";

-- Rename join table _PromptToTag -> _ApartRentToTag
ALTER TABLE "_PromptToTag" RENAME TO "_ApartRentToTag";

-- Rename indexes
ALTER INDEX "Prompt_ownerId_updatedAt_idx" RENAME TO "ApartRent_ownerId_updatedAt_idx";
ALTER INDEX "Prompt_visibility_createdAt_idx" RENAME TO "ApartRent_visibility_createdAt_idx";
ALTER INDEX "Vote_promptId_idx" RENAME TO "Vote_apartRentId_idx";
ALTER INDEX "Vote_userId_promptId_key" RENAME TO "Vote_userId_apartRentId_key";
ALTER INDEX "_PromptToTag_AB_unique" RENAME TO "_ApartRentToTag_AB_unique";
ALTER INDEX "_PromptToTag_B_index" RENAME TO "_ApartRentToTag_B_index";

-- Rename foreign key constraints
ALTER TABLE "ApartRent" RENAME CONSTRAINT "Prompt_ownerId_fkey" TO "ApartRent_ownerId_fkey";
ALTER TABLE "ApartRent" RENAME CONSTRAINT "Prompt_categoryId_fkey" TO "ApartRent_categoryId_fkey";
ALTER TABLE "Vote" RENAME CONSTRAINT "Vote_promptId_fkey" TO "Vote_apartRentId_fkey";
ALTER TABLE "_ApartRentToTag" RENAME CONSTRAINT "_PromptToTag_A_fkey" TO "_ApartRentToTag_A_fkey";
ALTER TABLE "_ApartRentToTag" RENAME CONSTRAINT "_PromptToTag_B_fkey" TO "_ApartRentToTag_B_fkey";
