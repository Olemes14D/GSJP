-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `role` ENUM('AUTHOR', 'REVIEWER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'AUTHOR',
    `institution` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `orcid` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `specialties` TEXT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_orcid_key`(`orcid`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submissions` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `abstract` TEXT NOT NULL,
    `keywords` TEXT NULL,
    `articleType` ENUM('ORIGINAL_RESEARCH', 'REVIEW', 'SYSTEMATIC_REVIEW', 'CASE_REPORT', 'BRIEF_COMMUNICATION', 'COMMENTARY', 'PERSPECTIVE') NOT NULL,
    `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'REVISIONS_REQUESTED', 'REVISED_SUBMITTED', 'ACCEPTED', 'REJECTED', 'PUBLISHED', 'WITHDRAWN') NOT NULL DEFAULT 'SUBMITTED',
    `manuscriptFileUrl` VARCHAR(191) NULL,
    `figuresUrls` TEXT NULL,
    `wordCount` INTEGER NULL,
    `correspondingAuthor` TEXT NOT NULL,
    `coAuthors` TEXT NULL,
    `ethicalApprovalNumber` VARCHAR(191) NULL,
    `fundingInfo` TEXT NULL,
    `conflictsOfInterest` TEXT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `submissions_authorId_idx`(`authorId`),
    INDEX `submissions_status_idx`(`status`),
    INDEX `submissions_articleType_idx`(`articleType`),
    INDEX `submissions_submittedAt_idx`(`submittedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NOT NULL,
    `status` ENUM('INVITED', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE') NOT NULL DEFAULT 'INVITED',
    `recommendation` ENUM('ACCEPT', 'MINOR_REVISIONS', 'MAJOR_REVISIONS', 'REJECT') NULL,
    `commentsToAuthor` TEXT NULL,
    `commentsToEditor` TEXT NULL,
    `confidentialComments` TEXT NULL,
    `reviewQuality` TEXT NULL,
    `invitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `acceptedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,

    INDEX `reviews_submissionId_idx`(`submissionId`),
    INDEX `reviews_reviewerId_idx`(`reviewerId`),
    INDEX `reviews_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publications` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `doi` VARCHAR(191) NOT NULL,
    `volume` INTEGER NULL,
    `issue` INTEGER NULL,
    `pages` VARCHAR(191) NULL,
    `publishedDate` DATETIME(3) NOT NULL,
    `pdfUrl` VARCHAR(191) NOT NULL,
    `htmlUrl` VARCHAR(191) NULL,
    `xmlUrl` VARCHAR(191) NULL,
    `viewsCount` INTEGER NOT NULL DEFAULT 0,
    `downloadsCount` INTEGER NOT NULL DEFAULT 0,
    `license` VARCHAR(191) NOT NULL DEFAULT 'CC-BY-4.0',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `publications_submissionId_key`(`submissionId`),
    UNIQUE INDEX `publications_doi_key`(`doi`),
    INDEX `publications_doi_idx`(`doi`),
    INDEX `publications_publishedDate_idx`(`publishedDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `editorial_board` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `boardRole` ENUM('EDITOR_IN_CHIEF', 'DEPUTY_EDITOR', 'ASSOCIATE_EDITOR', 'SECTION_EDITOR', 'EDITORIAL_MEMBER') NOT NULL,
    `section` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 999,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `editorial_board_userId_key`(`userId`),
    INDEX `editorial_board_boardRole_idx`(`boardRole`),
    INDEX `editorial_board_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_idx`(`userId`),
    INDEX `notifications_read_idx`(`read`),
    INDEX `notifications_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_logs_submissionId_idx`(`submissionId`),
    INDEX `activity_logs_userId_idx`(`userId`),
    INDEX `activity_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
