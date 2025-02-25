-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `idUsuario` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alumno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrupoAlumno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idGrupo` INTEGER NOT NULL,
    `idAlumno` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asistencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAlumno` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Grupo` ADD CONSTRAINT `Grupo_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupoAlumno` ADD CONSTRAINT `GrupoAlumno_idGrupo_fkey` FOREIGN KEY (`idGrupo`) REFERENCES `Grupo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupoAlumno` ADD CONSTRAINT `GrupoAlumno_idAlumno_fkey` FOREIGN KEY (`idAlumno`) REFERENCES `Alumno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asistencia` ADD CONSTRAINT `Asistencia_idAlumno_fkey` FOREIGN KEY (`idAlumno`) REFERENCES `Alumno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
