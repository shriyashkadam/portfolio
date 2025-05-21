const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const chalk = require('chalk');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname);
// CHANGED: Vite uses 'dist' as the default output directory instead of 'build'
const BUILD_DIR = path.join(PROJECT_ROOT, 'dist');
// CHANGED: Vite asset paths are different
const CSS_DIR = path.join(BUILD_DIR, 'assets'); // Vite puts CSS in assets directory
const JS_DIR = path.join(BUILD_DIR, 'assets'); // Vite puts JS in assets directory
const MEDIA_DIR = path.join(BUILD_DIR, 'assets'); // Vite puts media in assets directory

// --- Logging ---
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;
    switch (type) {
        case 'success': console.log(chalk.green(`${prefix} ✓ ${message}`)); break;
        case 'error': console.error(chalk.red(`${prefix} ✗ ${message}`)); break;
        case 'warn': console.warn(chalk.yellow(`${prefix} ⚠ ${message}`)); break;
        default: console.log(chalk.blue(`${prefix} ℹ ${message}`));
    }
}

// --- Utilities ---
function runCommand(command, options = {}) {
    try {
        log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit', ...options, cwd: PROJECT_ROOT });
        return true;
    } catch (error) {
        log(`Command failed: ${command}`, 'error');
        log(`Error message: ${error.message}`, 'error');
        return false;
    }
}

function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        try {
            fs.mkdirSync(directory, { recursive: true });
            log(`Created directory: ${path.relative(PROJECT_ROOT, directory)}`, 'success');
        } catch (err) {
            log(`Failed to create directory: ${path.relative(PROJECT_ROOT, directory)}: ${err.message}`, 'error');
            process.exit(1);
        }
    }
}

function findFiles(pattern, description, baseDir = BUILD_DIR) {
    const normalizedPattern = pattern.replace(/\\/g, '/');
    log(`Searching for ${description} in ${path.relative(PROJECT_ROOT, baseDir)} using pattern: ${normalizedPattern}`);
    try {
        // Use absolute: true to ensure paths are consistent
        const files = glob.sync(normalizedPattern, { cwd: baseDir, absolute: true, nodir: true });
        log(`Found ${files.length} ${description}.`);
        if (files.length === 0 && !pattern.includes('.tmp')) { // Don't warn for missing temp files
             log(`No ${description} found. This might be expected or indicate an issue.`, 'warn');
        }
        return files;
    } catch(error) {
        log(`Error while searching for ${description}: ${error.message}`, 'error');
        return [];
    }
}

function formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(k)));
    const index = Math.min(i, sizes.length - 1); // Prevent index out of bounds
    return parseFloat((bytes / Math.pow(k, index)).toFixed(dm)) + ' ' + sizes[index];
}

// --- Build Steps ---

// Step 1: Build the Vite React application (includes minification)
function buildReactApp() {
    log('Starting Vite build process (production mode)');
    // Vite already sets NODE_ENV=production internally when building
    // It also doesn't generate source maps by default in production
    
    if (!runCommand('npm run build')) {
        log('Vite build failed. Aborting optimization.', 'error');
        process.exit(1);
    }
    log('Vite build completed successfully (includes JS/CSS minification)', 'success');
}

// Step 2: Optimize CSS with PurgeCSS (Removes unused CSS)
function purgeCss() {
    log('Purging unused CSS (using config from package.json)');
    // Assumes purgecss is configured in package.json or purgecss.config.js
    // See https://purgecss.com/configuration.html#configuration-file
    const purgecssCmd = 'npx purgecss'; // Use locally installed version

    // Check if a config file exists or if config is in package.json
    const hasConfigFile = fs.existsSync(path.join(PROJECT_ROOT, 'purgecss.config.js')) ||
                          fs.existsSync(path.join(PROJECT_ROOT, 'purgecss.config.cjs')) ||
                          fs.existsSync(path.join(PROJECT_ROOT, 'purgecss.config.mjs'));
    const packageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
    const hasPackageConfig = !!packageJson.purgecss;

    if (!hasConfigFile && !hasPackageConfig) {
        log('No PurgeCSS config found in package.json or config file. Skipping CSS purge.', 'warn');
        return;
    }

    if (!runCommand(purgecssCmd)) { // Runs based on config file or package.json
         log('PurgeCSS command failed. Check configuration and output.', 'error');
         // Decide if this is fatal - usually not, but CSS won't be optimized
    } else {
        log('CSS purging potentially completed (check PurgeCSS output for details).', 'success');
    }
}

// Step 3: Brotli Compression for Static Assets
async function compressAssetsBrotli() {
    log('Compressing assets using Brotli (Node.js zlib)');
    // CHANGED: Updated patterns for Vite's output structure
    const assetPatterns = [
        'assets/*.js',       // Vite places JS in assets folder with content hash
        'assets/*.css',      // Vite places CSS in assets folder with content hash
        'assets/*.mjs',      // Vite may use .mjs extensions
        '*.html',
        '*.json',
        '*.ico',
        '*.webmanifest',
        'assets/*.svg',      // SVGs in assets directory
        // Do not compress already compressed formats (jpg, png, webp, woff2, etc.)
    ];
    
    const assets = assetPatterns.flatMap(pattern => findFiles(pattern, 'assets for Brotli compression', BUILD_DIR));

    if (assets.length === 0) {
        log('No assets found matching patterns for Brotli compression.', 'warn');
        return;
    }
    log(`Found ${assets.length} assets to compress with Brotli.`);
    let successCount = 0;
    let failCount = 0;

    const compressionPromises = assets.map(async (sourcePathAbs) => {
        // Ensure we are working with absolute paths
        const destinationPathAbs = `${sourcePathAbs}.br`;
        const fileName = path.basename(sourcePathAbs);
        const relativeSourcePath = path.relative(PROJECT_ROOT, sourcePathAbs); // For logging

        try {
            const sourceStream = fs.createReadStream(sourcePathAbs);
            const destinationStream = fs.createWriteStream(destinationPathAbs);
            // Use highest Brotli compression level (11) for best size reduction
            const brotliStream = zlib.createBrotliCompress({
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY, // Level 11
                },
            });

            await pipeline(sourceStream, brotliStream, destinationStream);

            const originalSize = fs.statSync(sourcePathAbs).size;
            const compressedSize = fs.statSync(destinationPathAbs).size;
            const ratio = originalSize > 0 ? (compressedSize / originalSize).toFixed(2) : 'N/A';
            log(`Brotli compressed: ${relativeSourcePath} (${formatBytes(originalSize)} -> ${formatBytes(compressedSize)}, ratio: ${ratio})`, 'success');
            successCount++;
        } catch (error) {
            log(`Failed to Brotli compress ${relativeSourcePath}: ${error.message}`, 'error');
            failCount++;
            // Clean up potentially corrupted .br file
            if (fs.existsSync(destinationPathAbs)) {
                try { fs.unlinkSync(destinationPathAbs); } catch (_) {}
            }
        }
    });

    await Promise.all(compressionPromises);

    log(`Brotli compression completed. ${successCount} successful, ${failCount} failed.`, failCount > 0 ? 'warn' : 'success');
    if (failCount > 0) {
        log('Review errors above for failed compressions.', 'warn');
    }
}

// Step 4: Create a report file with optimization details
function createOptimizationReport(startTime, endTime) {
    const reportPathAbs = path.join(BUILD_DIR, 'optimization-report.json');
    log(`Generating optimization report...`);

    try {
        // CHANGED: Updated file patterns for Vite
        const jsFileStats = findFiles('assets/*.js', 'JS files for report', BUILD_DIR)
            .map(fileAbs => {
                if (!fs.existsSync(fileAbs)) return null; // Skip if file missing
                const stats = fs.statSync(fileAbs);
                const brPath = `${fileAbs}.br`; // Look for .br
                const brStats = fs.existsSync(brPath) ? fs.statSync(brPath) : null;
                return {
                    name: path.basename(fileAbs),
                    size: stats.size, sizeFormatted: formatBytes(stats.size),
                    brotliSize: brStats?.size, brotliSizeFormatted: formatBytes(brStats?.size), // Report Brotli size
                };
            }).filter(Boolean); // Remove null entries

        // CHANGED: Updated file patterns for Vite
        const cssFileStats = findFiles('assets/*.css', 'CSS files for report', BUILD_DIR)
             .map(fileAbs => {
                 if (!fs.existsSync(fileAbs)) return null;
                 const stats = fs.statSync(fileAbs);
                 const brPath = `${fileAbs}.br`; // Look for .br
                 const brStats = fs.existsSync(brPath) ? fs.statSync(brPath) : null;
                 return {
                    name: path.basename(fileAbs),
                    size: stats.size, sizeFormatted: formatBytes(stats.size),
                    brotliSize: brStats?.size, brotliSizeFormatted: formatBytes(brStats?.size), // Report Brotli size
                 };
             }).filter(Boolean);

        // Calculate totals
        const totalJsSize = jsFileStats.reduce((acc, file) => acc + file.size, 0);
        const totalCssSize = cssFileStats.reduce((acc, file) => acc + file.size, 0);
        const totalBrotliJsSize = jsFileStats.reduce((acc, file) => acc + (file.brotliSize || 0), 0);
        const totalBrotliCssSize = cssFileStats.reduce((acc, file) => acc + (file.brotliSize || 0), 0);

        const report = {
            optimizationDate: new Date().toISOString(),
            durationSeconds: ((endTime - startTime) / 1000).toFixed(2),
            optimizationSteps: [
                "Vite Build (Minification)",
                "PurgeCSS (if configured)",
                "Brotli Compression"
            ],
            totalJsSize: formatBytes(totalJsSize),
            totalCssSize: formatBytes(totalCssSize),
            totalBrotliJsSize: formatBytes(totalBrotliJsSize),
            totalBrotliCssSize: formatBytes(totalBrotliCssSize),
            jsFiles: jsFileStats,
            cssFiles: cssFileStats,
            notes: [
                "Vite already performs code splitting and minification by default",
                "JS obfuscation was skipped to prioritize runtime performance",
                "Image optimization was skipped as images are assumed pre-optimized (e.g., WebP)",
                "Vercel automatically serves .br files if available and supported by the browser"
            ]
        };

        fs.writeFileSync(reportPathAbs, JSON.stringify(report, null, 2));
        log(`Optimization report created at: ${path.relative(PROJECT_ROOT, reportPathAbs)}`, 'success');
    } catch (error) {
        log(`Failed to generate optimization report: ${error.message}`, 'error');
        console.error(error.stack); // Log stack trace for debugging
    }
}

// Step 5: Clean up (Optional - Build process usually cleans)
function cleanupBuildFolder() {
    log('Cleaning dist directory before starting...');
    // CHANGED: Updated build directory name to 'dist'
    const buildDirRelative = path.relative(PROJECT_ROOT, BUILD_DIR);
    if (fs.existsSync(BUILD_DIR)) {
        try {
            fs.rmSync(BUILD_DIR, { recursive: true, force: true });
            log(`Removed existing dist directory: ${buildDirRelative}`, 'success');
        } catch (error) {
             log(`Failed to remove existing dist directory: ${buildDirRelative}: ${error.message}`, 'warn');
        }
    } else {
         log(`Dist directory ${buildDirRelative} does not exist, skipping cleanup.`);
    }
}

// --- Main Execution ---
async function runOptimization() {
    const startTime = Date.now();
    log(`Starting build & optimization in: ${PROJECT_ROOT}`);
    log(`Node version: ${process.version}, Platform: ${process.platform}`);

    // Optional: Clean previous build entirely
    // cleanupBuildFolder(); // Uncomment this if you want a clean slate each time

    // Step 1: Build (includes JS/CSS minification)
    buildReactApp(); // Exits on failure

    // Ensure essential build subdirectories exist AFTER build (safety check)
    ensureDirectoryExists(BUILD_DIR); // Should already exist from build
    ensureDirectoryExists(JS_DIR);  // assets directory for JS in Vite
    ensureDirectoryExists(CSS_DIR); // assets directory for CSS in Vite
    ensureDirectoryExists(MEDIA_DIR); // assets directory for media in Vite

    // Step 2: Purge CSS (if configured)
    purgeCss();

    // Step 3: Compress Assets with Brotli (Async)
    // Vercel will automatically pick up .br files
    await compressAssetsBrotli();

    // Step 4: Report
    const endTime = Date.now();
    createOptimizationReport(startTime, endTime);

    const duration = ((endTime - startTime) / 1000).toFixed(2);
    log(`Performance-focused build & optimization process finished in ${duration} seconds`, 'success');
    log(chalk.cyan(`Deploy the contents of the '${path.relative(PROJECT_ROOT, BUILD_DIR)}' directory to Vercel.`));
}

// Execute the optimization process
runOptimization().catch(error => {
    log(`Unhandled error during optimization: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
});