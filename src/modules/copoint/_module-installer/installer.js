const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * CoPoint Module Installer
 * Standard module installer function that executes after IDE installations
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('📊 Installing CoPoint Module...'));

    // Create output directory if configured
    if (config['output_folder']) {
      // Strip {project-root}/ prefix if present
      const outputConfig = config['output_folder'].replace('{project-root}/', '');
      const outputPath = path.join(projectRoot, outputConfig);
      if (!(await fs.pathExists(outputPath))) {
        logger.log(chalk.yellow(`Creating CoPoint output directory: ${outputConfig}`));
        await fs.ensureDir(outputPath);
      }
    }

    // Handle Gamma API key if provided
    if (config['gamma_api_key']) {
      const envPath = path.join(projectRoot, '.env');
      const envExists = await fs.pathExists(envPath);

      if (envExists) {
        const envContent = await fs.readFile(envPath, 'utf8');
        if (!envContent.includes('GAMMA_API_KEY')) {
          await fs.appendFile(envPath, `\nGAMMA_API_KEY=${config['gamma_api_key']}\n`);
          logger.log(chalk.green('✓ Added GAMMA_API_KEY to .env'));
        }
      } else {
        await fs.writeFile(envPath, `GAMMA_API_KEY=${config['gamma_api_key']}\n`);
        logger.log(chalk.green('✓ Created .env with GAMMA_API_KEY'));
      }

      // Ensure .env is in .gitignore
      const gitignorePath = path.join(projectRoot, '.gitignore');
      if (await fs.pathExists(gitignorePath)) {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
        if (!gitignoreContent.includes('.env')) {
          await fs.appendFile(gitignorePath, '\n.env\n');
          logger.log(chalk.green('✓ Added .env to .gitignore'));
        }
      }
    }

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring CoPoint for IDEs: ${installedIDEs.join(', ')}`));

      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ CoPoint Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing CoPoint module: ${error.message}`));
    return false;
  }
}

/**
 * Configure CoPoint module for specific IDE
 * @private
 */
async function configureForIDE(ide) {
  // Add IDE-specific configurations here
  switch (ide) {
    case 'claude-code': {
      // Claude Code specific CoPoint configurations
      break;
    }
    case 'cursor': {
      // Cursor specific CoPoint configurations
      break;
    }
    case 'windsurf': {
      // Windsurf specific CoPoint configurations
      break;
    }
    default: {
      // No specific configuration needed
      break;
    }
  }
}

module.exports = { install };
