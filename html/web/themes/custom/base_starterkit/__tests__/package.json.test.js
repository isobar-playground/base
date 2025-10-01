/**
 * Comprehensive Unit Tests for package.json
 * Testing Framework: Jest
 * 
 * These tests validate:
 * - JSON structure and syntax
 * - Required fields and metadata
 * - Dependency integrity
 * - Script definitions
 * - Version format compliance
 * - Security and best practices
 */

const fs = require('fs');
const path = require('path');

describe('package.json Validation', () => {
  let packageJson;
  let packageJsonRaw;

  beforeAll(() => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    packageJsonRaw = fs.readFileSync(packagePath, 'utf8');
    packageJson = JSON.parse(packageJsonRaw);
  });

  describe('JSON Structure and Syntax', () => {
    test('should be valid JSON', () => {
      expect(() => JSON.parse(packageJsonRaw)).not.toThrow();
    });

    test('should not contain trailing commas', () => {
      // Check for trailing commas before closing braces/brackets
      expect(packageJsonRaw).not.toMatch(/,\s*[}\]]/);
    });

    test('should use consistent indentation', () => {
      const lines = packageJsonRaw.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s+\S/));
      // Check that indentation is consistent (2 spaces)
      indentedLines.forEach(line => {
        const indent = line.match(/^(\s+)/);
        if (indent) {
          expect(indent[1].length % 2).toBe(0);
        }
      });
    });

    test('should not contain comments', () => {
      expect(packageJsonRaw).not.toMatch(/\/\//);
      expect(packageJsonRaw).not.toMatch(/\/\*/);
    });
  });

  describe('Required Fields', () => {
    test('should have a name field', () => {
      expect(packageJson).toHaveProperty('name');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name).toBeTruthy();
    });

    test('should have a valid name format', () => {
      expect(packageJson.name).toMatch(/^[a-z0-9_-]+$/);
      expect(packageJson.name.length).toBeLessThanOrEqual(214);
    });

    test('should have a version field', () => {
      expect(packageJson).toHaveProperty('version');
      expect(typeof packageJson.version).toBe('string');
    });

    test('should have a valid semver version', () => {
      const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
      expect(packageJson.version).toMatch(semverRegex);
    });
  });

  describe('Scripts Validation', () => {
    test('should have scripts field', () => {
      expect(packageJson).toHaveProperty('scripts');
      expect(typeof packageJson.scripts).toBe('object');
    });

    test('should have build script', () => {
      expect(packageJson.scripts).toHaveProperty('build');
      expect(typeof packageJson.scripts.build).toBe('string');
      expect(packageJson.scripts.build).toBeTruthy();
    });

    test('should have watch script', () => {
      expect(packageJson.scripts).toHaveProperty('watch');
      expect(typeof packageJson.scripts.watch).toBe('string');
      expect(packageJson.scripts.watch).toBeTruthy();
    });

    test('build script should use webpack', () => {
      expect(packageJson.scripts.build).toContain('webpack');
    });

    test('build script should set production mode', () => {
      expect(packageJson.scripts.build).toContain('production');
    });

    test('watch script should use webpack watch mode', () => {
      expect(packageJson.scripts.watch).toContain('webpack');
      expect(packageJson.scripts.watch).toContain('--watch');
    });

    test('watch script should use development mode', () => {
      expect(packageJson.scripts.watch).toContain('development');
    });

    test('all script values should be non-empty strings', () => {
      Object.values(packageJson.scripts).forEach(script => {
        expect(typeof script).toBe('string');
        expect(script.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Dependencies Validation', () => {
    test('should have dependencies field', () => {
      expect(packageJson).toHaveProperty('dependencies');
      expect(typeof packageJson.dependencies).toBe('object');
    });

    test('should have devDependencies field', () => {
      expect(packageJson).toHaveProperty('devDependencies');
      expect(typeof packageJson.devDependencies).toBe('object');
    });

    test('all dependencies should have valid version strings', () => {
      const versionRegex = /^[\^~]?\d+\.\d+\.\d+/;
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(typeof version).toBe('string');
        expect(version).toMatch(versionRegex);
      });
    });

    test('all devDependencies should have valid version strings', () => {
      const versionRegex = /^[\^~]?\d+\.\d+\.\d+/;
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        expect(typeof version).toBe('string');
        expect(version).toMatch(versionRegex);
      });
    });

    test('should not have duplicate dependencies', () => {
      const deps = Object.keys(packageJson.dependencies || {});
      const devDeps = Object.keys(packageJson.devDependencies || {});
      const duplicates = deps.filter(dep => devDeps.includes(dep));
      expect(duplicates).toHaveLength(0);
    });

    test('should have webpack in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('webpack');
    });

    test('should have webpack-cli in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('webpack-cli');
    });

    test('should have babel-core in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('@babel/core');
    });

    test('should have babel-preset-env in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('@babel/preset-env');
    });

    test('should have tailwindcss in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
    });

    test('should have postcss in devDependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('postcss');
    });

    test('should have flowbite in dependencies', () => {
      expect(packageJson.dependencies).toHaveProperty('flowbite');
    });

    test('should have swiper in dependencies', () => {
      expect(packageJson.dependencies).toHaveProperty('swiper');
    });
  });

  describe('Version Specifications', () => {
    test('should use caret (^) or tilde (~) for semantic versioning', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.entries(allDeps).forEach(([name, version]) => {
        expect(['~', '^']).toContain(version.charAt(0));
      });
    });

    test('dependencies should not use wildcards', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.values(allDeps).forEach(version => {
        expect(version).not.toContain('*');
        expect(version).not.toContain('x');
        expect(version).not.toContain('X');
      });
    });

    test('should not use latest or next tags', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.values(allDeps).forEach(version => {
        expect(version).not.toBe('latest');
        expect(version).not.toBe('next');
      });
    });
  });

  describe('Package Metadata', () => {
    test('name should match expected value', () => {
      expect(packageJson.name).toBe('base_starterkit');
    });

    test('version should match expected format', () => {
      expect(packageJson.version).toBe('1.0.0');
    });

    test('should not have unknown top-level fields', () => {
      const validFields = [
        'name', 'version', 'description', 'main', 'scripts',
        'keywords', 'author', 'license', 'bugs', 'homepage',
        'dependencies', 'devDependencies', 'peerDependencies',
        'optionalDependencies', 'bundledDependencies', 'engines',
        'os', 'cpu', 'private', 'publishConfig', 'workspaces',
        'repository', 'config', 'bin', 'man', 'directories',
        'files', 'type', 'exports', 'imports', 'sideEffects',
        'types', 'typings', 'browserslist'
      ];
      
      const packageFields = Object.keys(packageJson);
      packageFields.forEach(field => {
        expect(validFields).toContain(field);
      });
    });
  });

  describe('Build Tool Configuration', () => {
    test('should have webpack configuration dependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('webpack');
      expect(packageJson.devDependencies).toHaveProperty('webpack-cli');
      expect(packageJson.devDependencies).toHaveProperty('babel-loader');
    });

    test('should have CSS processing dependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('css-loader');
      expect(packageJson.devDependencies).toHaveProperty('postcss-loader');
      expect(packageJson.devDependencies).toHaveProperty('mini-css-extract-plugin');
    });

    test('should have PostCSS plugins', () => {
      expect(packageJson.devDependencies).toHaveProperty('postcss');
      expect(packageJson.devDependencies).toHaveProperty('postcss-import');
      expect(packageJson.devDependencies).toHaveProperty('autoprefixer');
    });

    test('should have ESLint configuration', () => {
      expect(packageJson.devDependencies).toHaveProperty('eslint');
      expect(packageJson.devDependencies).toHaveProperty('eslint-config-airbnb-base');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing optional fields gracefully', () => {
      // These fields are optional but commonly used
      const optionalFields = ['description', 'repository', 'keywords', 'author', 'license'];
      optionalFields.forEach(field => {
        if (packageJson[field]) {
          expect(typeof packageJson[field]).toBe('string');
        }
      });
    });

    test('should not have empty dependency objects', () => {
      if (packageJson.dependencies) {
        expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
      }
      if (packageJson.devDependencies) {
        expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
      }
    });

    test('should not have null or undefined values', () => {
      const checkForNullValues = (obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          expect(value).not.toBeNull();
          expect(value).not.toBeUndefined();
          
          if (typeof value === 'object' && value !== null) {
            checkForNullValues(value);
          }
        });
      };
      
      checkForNullValues(packageJson);
    });

    test('should handle special characters in dependency names', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.keys(allDeps).forEach(name => {
        // Check for valid npm package naming
        expect(name).toMatch(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/);
      });
    });
  });

  describe('Security and Best Practices', () => {
    test('should not contain suspicious scripts', () => {
      const suspiciousPatterns = [
        /rm\s+-rf\s+\//,  // Dangerous delete commands
        /curl.*\|\s*sh/,   // Piping to shell
        /wget.*\|\s*sh/,   // Piping to shell
        /eval\s*\(/        // Eval usage
      ];
      
      Object.values(packageJson.scripts).forEach(script => {
        suspiciousPatterns.forEach(pattern => {
          expect(script).not.toMatch(pattern);
        });
      });
    });

    test('should not use deprecated package names', () => {
      const deprecatedPackages = [
        'babel-core',  // Should use @babel/core
        'babel-preset-es2015',  // Should use @babel/preset-env
        'node-sass'  // Should use sass
      ];
      
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      deprecatedPackages.forEach(pkg => {
        expect(allDeps).not.toHaveProperty(pkg);
      });
    });

    test('webpack version should be 5.x or higher', () => {
      const webpackVersion = packageJson.devDependencies.webpack;
      const majorVersion = parseInt(webpackVersion.replace(/[\^~]/, '').split('.')[0]);
      expect(majorVersion).toBeGreaterThanOrEqual(5);
    });

    test('should use modern babel configuration', () => {
      expect(packageJson.devDependencies).toHaveProperty('@babel/core');
      expect(packageJson.devDependencies).toHaveProperty('@babel/preset-env');
    });
  });

  describe('Consistency Checks', () => {
    test('webpack config should be referenced correctly in scripts', () => {
      expect(packageJson.scripts.build).toContain('webpack.config.js');
      expect(packageJson.scripts.watch).toContain('webpack.config.js');
    });

    test('build script should use NODE_ENV=production', () => {
      expect(packageJson.scripts.build).toMatch(/NODE_ENV=production/);
    });

    test('scripts should use npx for local binaries', () => {
      expect(packageJson.scripts.build).toContain('npx');
      expect(packageJson.scripts.watch).toContain('npx');
    });

    test('should have matching loader and tool versions', () => {
      // Ensure loaders are compatible with webpack 5
      const webpack5CompatibleLoaders = [
        'babel-loader',
        'css-loader',
        'postcss-loader'
      ];
      
      webpack5CompatibleLoaders.forEach(loader => {
        expect(packageJson.devDependencies).toHaveProperty(loader);
      });
    });
  });

  describe('Framework Integration', () => {
    test('should have Tailwind CSS with PostCSS', () => {
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
      expect(packageJson.devDependencies).toHaveProperty('postcss');
      expect(packageJson.devDependencies).toHaveProperty('autoprefixer');
    });

    test('should have Flowbite UI components', () => {
      expect(packageJson.dependencies).toHaveProperty('flowbite');
    });

    test('should have Swiper for carousels', () => {
      expect(packageJson.dependencies).toHaveProperty('swiper');
    });

    test('Flowbite version should be 3.x or higher', () => {
      const flowbiteVersion = packageJson.dependencies.flowbite;
      const majorVersion = parseInt(flowbiteVersion.replace(/[\^~]/, '').split('.')[0]);
      expect(majorVersion).toBeGreaterThanOrEqual(3);
    });

    test('Tailwind version should be 3.x or higher', () => {
      const tailwindVersion = packageJson.devDependencies.tailwindcss;
      const majorVersion = parseInt(tailwindVersion.replace(/[\^~]/, '').split('.')[0]);
      expect(majorVersion).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Failure Scenarios', () => {
    test('should fail on malformed version strings', () => {
      const invalidVersions = ['1.0', '1', 'latest', 'v1.0.0', '1.0.0.0'];
      
      invalidVersions.forEach(version => {
        expect(() => {
          const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
          if (!version.match(semverRegex)) {
            throw new Error(`Invalid version: ${version}`);
          }
        }).toThrow();
      });
    });

    test('should validate dependency count is reasonable', () => {
      const depCount = Object.keys(packageJson.dependencies).length;
      const devDepCount = Object.keys(packageJson.devDependencies).length;
      
      // Sanity check - not too few or too many dependencies
      expect(depCount).toBeGreaterThan(0);
      expect(depCount).toBeLessThan(100);
      expect(devDepCount).toBeGreaterThan(0);
      expect(devDepCount).toBeLessThan(100);
    });

    test('should not have circular script references', () => {
      Object.entries(packageJson.scripts).forEach(([scriptName, scriptValue]) => {
        // Check if script calls itself
        const selfReference = new RegExp(`npm run ${scriptName}\\b`);
        expect(scriptValue).not.toMatch(selfReference);
      });
    });

    test('should handle empty script values', () => {
      Object.values(packageJson.scripts).forEach(script => {
        expect(script.trim()).not.toBe('');
      });
    });
  });

  describe('Package.json File System', () => {
    test('package.json should exist', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    test('package.json should be readable', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      expect(() => fs.readFileSync(packagePath, 'utf8')).not.toThrow();
    });

    test('package.json should not be too large', () => {
      const stats = fs.statSync(path.join(__dirname, '..', 'package.json'));
      // Package.json should typically be under 100KB
      expect(stats.size).toBeLessThan(100 * 1024);
    });
  });
});