-- Crear tablas iniciales de la base de datos
CREATE TABLE IF NOT EXISTS `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `failedAttempts` INTEGER NOT NULL DEFAULT 0,
    `lockoutUntil` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Carrera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `facultad` VARCHAR(191) NOT NULL,
    `duracion` VARCHAR(191) NOT NULL,
    `modalidad` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `imagen` VARCHAR(191) NULL,
    `imagenes` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `inscripcionAbierta` BOOLEAN NOT NULL DEFAULT true,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'Carrera',
    `linkInscripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SystemConfig` (
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Novedad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `contenido` TEXT NOT NULL,
    `imagen` VARCHAR(191) NULL,
    `imagenes` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `destacada` BOOLEAN NOT NULL DEFAULT false,
    `video` VARCHAR(191) NULL,
    `videos` JSON NULL,
    `color` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usuarios admin y daniela
INSERT INTO `User` (`username`, `password`) VALUES 
('admin', '$2b$10$KXiuPV3Pzf6uZ77KGRyXT.eul7TPKT6SsOhgPknNpLW9g5bs2rFna'),
('daniela', '$2b$10$stzQr6Agy3mAEEcyGyyaQ.a9Y9oynRlyPNlqrPciiplvMJCvXd6rW')
ON DUPLICATE KEY UPDATE `password` = VALUES(`password`);
