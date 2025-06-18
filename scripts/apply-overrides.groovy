#!/usr/bin/env groovy

import java.nio.file.*
import java.nio.file.attribute.*
import java.util.zip.*

try {
    // Setup paths and directories
    def projectBuildDir = project.build.directory
    def projectArtifactId = project.artifactId
    def projectVersion = project.version
    def distroPath = "${projectBuildDir}/${projectArtifactId}-${projectVersion}"

    def overridesFrontendDir = Paths.get(project.basedir.toString(), "configs", "openmrs", "overrides", "frontend")
    def overridesBackendDir = Paths.get(project.basedir.toString(), "configs", "openmrs", "overrides", "modules")
    def frontendBinariesDir = Paths.get(distroPath, "distro", "binaries", "openmrs", "frontend")
    def moduleBinariesDir = Paths.get(distroPath, "distro", "binaries", "openmrs", "modules")
    def tempDir = Paths.get(projectBuildDir, "temp-overrides")

    println "Starting override processing..."
    println "Distro path: ${distroPath}"

    // Improved base name extraction functions
    def getBackendBaseName = { String fileName ->
        fileName.split("-")[0]
    }

    def getFrontendBaseName = { String fileName ->
        def cleanName = fileName.replaceAll(/\.zip$/, '')
        def appIndex = cleanName.indexOf("-app")
        appIndex > 0 ? cleanName.substring(0, appIndex + 4) : cleanName
    }

    // Optimized matching function
    def findMatchingPath = { Path dir, String baseName, boolean isFrontend ->
        if (!Files.exists(dir)) return null
        
        def matcher = isFrontend ? 
            { it.fileName.toString().startsWith(baseName) } : 
            { getBackendBaseName(it.fileName.toString()) == baseName }
            
        Files.list(dir)
            .filter { matcher(it) }
            .findFirst()
            .orElse(null)
    }

    // File operations with better logging
    def unzipFile = { Path zipFile, Path targetDir ->
        println "Unzipping ${zipFile.fileName} to ${targetDir.fileName}"
        Files.createDirectories(targetDir)
        
        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(zipFile))) {
            ZipEntry entry
            while ((entry = zis.nextEntry) != null) {
                Path targetPath = targetDir.resolve(entry.name)
                if (entry.isDirectory()) {
                    Files.createDirectories(targetPath)
                } else {
                    Files.createDirectories(targetPath.parent)
                    Files.copy(zis, targetPath, StandardCopyOption.REPLACE_EXISTING)
                }
                zis.closeEntry()
            }
        }
    }

    def copyDirectoryContents = { Path source, Path target ->
        println "Copying contents to ${target.fileName}"
        Files.walkFileTree(source, new SimpleFileVisitor<Path>() {
            FileVisitResult preVisitDirectory(Path directory, BasicFileAttributes attrs) {
                Files.createDirectories(target.resolve(source.relativize(directory)))
                FileVisitResult.CONTINUE
            }

            FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                Files.copy(file, target.resolve(source.relativize(file)), StandardCopyOption.REPLACE_EXISTING)
                FileVisitResult.CONTINUE
            }
        })
    }

    def cleanupDirectory = { Path dirToClean ->
        if (Files.exists(dirToClean)) {
            Files.walkFileTree(dirToClean, new SimpleFileVisitor<Path>() {
                FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    Files.delete(file)
                    FileVisitResult.CONTINUE
                }
                FileVisitResult postVisitDirectory(Path directory, IOException exc) {
                    if (directory != tempDir) Files.delete(directory)
                    FileVisitResult.CONTINUE
                }
            })
        }
    }

    // Processing functions with focused logging
    def processFrontendOverrides = {
        println "\nProcessing frontend overrides:"
        Files.walkFileTree(overridesFrontendDir, new SimpleFileVisitor<Path>() {
            FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                if (file.toString().endsWith('.zip')) {
                    def overrideName = file.fileName.toString()
                    def baseName = getFrontendBaseName(overrideName)
                    
                    def targetPath = findMatchingPath(frontendBinariesDir, baseName, true)
                    if (targetPath) {
                        println " - Overriding ${targetPath.fileName} with ${overrideName}"
                        
                        def tempExtractDir = tempDir.resolve(baseName)
                        cleanupDirectory(tempExtractDir)
                        unzipFile(file, tempExtractDir)
                        
                        // Find the actual app directory inside the extracted contents
                        def extractedAppDir = Files.list(tempExtractDir)
                            .filter { Files.isDirectory(it) && it.fileName.toString().contains(baseName) }
                            .findFirst()
                            .orElse(null)
                        
                        if (extractedAppDir != null) {
                            cleanupDirectory(targetPath)
                            copyDirectoryContents(extractedAppDir, targetPath)
                        } else {
                            // Fallback to original behavior if no subdirectory found
                            cleanupDirectory(targetPath)
                            copyDirectoryContents(tempExtractDir, targetPath)
                        }
                    }
                }
                FileVisitResult.CONTINUE
            }
        })
    }

    def processBackendOverrides = {
        println "\nProcessing backend overrides:"
        Files.walkFileTree(overridesBackendDir, new SimpleFileVisitor<Path>() {
            FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                if (file.toString().endsWith('.omod')) {
                    def overrideName = file.fileName.toString()
                    def baseName = getBackendBaseName(overrideName)
                    
                    def targetFile = findMatchingPath(moduleBinariesDir, baseName, false)
                    if (targetFile) {
                        println " - Overriding ${targetFile.fileName} with ${overrideName}"
                        Files.delete(targetFile)
                        Files.copy(file, moduleBinariesDir.resolve(file.fileName), StandardCopyOption.REPLACE_EXISTING)
                    } else {
                        // If module doesn't exist, just copy it to the binaries directory
                        println " - Adding new module ${overrideName} to binaries"
                        Files.copy(file, moduleBinariesDir.resolve(file.fileName), StandardCopyOption.REPLACE_EXISTING)
                    }
                }
                FileVisitResult.CONTINUE
            }
        })
    }

    // Main execution
    cleanupDirectory(tempDir)
    Files.createDirectories(tempDir)

    if (isDirectoryNotEmpty(overridesFrontendDir)) processFrontendOverrides()
    if (isDirectoryNotEmpty(overridesBackendDir)) processBackendOverrides()

    cleanupDirectory(tempDir)
    println "\nOverride processing completed successfully."

} catch (Exception e) {
    println "Error during override processing: ${e.message}"
    e.printStackTrace()
    throw e
}

// Helper function
def isDirectoryNotEmpty(Path dir) {
    Files.exists(dir) && Files.list(dir).findFirst().isPresent()
}
