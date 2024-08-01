[![PHPUnit](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml) [![GrumPHP](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml)

# Base Project 🚀

This project is a base for web applications built with Drupal. It leverages Docker images `wodby/drupal-php` and `wodby/apache` for containerization. For local environments, it utilizes `docker-compose` along with `mariadb` and `wodby/node` images.

## Features ✨

- **Drupal Installation**: Drupal is installed using Composer.
- **Dependency Management**: Dependencies are updated via Dependabot on GitHub.
- **Coding Standards**: Code quality is enforced using `grumphp`.
- **Base Theme**: A base theme is created using Single Directory Components and TailwindCSS.
- **Static Code Analysis**: Automated code analysis to ensure code quality and standards.
- **Unit Testing**: PHPUnit is used for running unit tests.
- **GitHub Codespaces**: The project is configured to run in GitHub Codespaces.

## Local Environment Setup 🛠️

To set up the local development environment, follow these steps:

1. Clone the repository:
   ```sh
   git clone git@github.com:isobar-playground/base.git
   ```
2. Navigate to the project directory:
   ```sh
   cd base
   ```
3. Run the Make command to start the environment:
   ```sh
   make
   ```

## Makefile Commands 📜

The `Makefile` includes several commands to manage the Docker environment:

| Command    | Description                                                                                                          |
|------------|----------------------------------------------------------------------------------------------------------------------|
| `help`     | Prints the help for available commands.                                                                              |
| `up`       | Starts up the containers, builds them if necessary, and installs Composer dependencies.                              |
| `down`     | Stops the containers.                                                                                                |
| `start`    | Starts the containers without updating.                                                                              |
| `stop`     | Stops the containers.                                                                                                |
| `prune`    | Removes containers and their volumes. Optionally, specify a service name to prune a single container.                |
| `ps`       | Lists running containers.                                                                                            |
| `shell`    | Accesses the `php` container via shell. Optionally, specify a service name to open a shell on a different container. |
| `composer` | Executes `composer` commands in the specified `COMPOSER_ROOT` directory.                                             |
| `drush`    | Executes `drush` commands in the specified `DRUPAL_ROOT` directory.                                                  |
| `logs`     | Views container logs. Optionally, specify a service name to limit logs.                                              |

## Docker Compose Configuration 🐳

The project uses `docker-compose` for managing the local development environment. The `.env` and `.env.local` files are included to configure environment variables for Docker Compose.

## Static Code Analysis and Coding Standards 🧹

Code quality and adherence to coding standards are ensured using `grumphp`. The tool runs a set of predefined tasks, including static code analysis and unit tests, before each commit to maintain high code quality.

## Unit Testing with PHPUnit 🧪

Unit tests are written using PHPUnit. These tests are automatically run as part of the `grumphp` tasks to ensure that code changes do not break existing functionality.

## Theme Development 🎨

The base theme is developed using Single Directory Components and TailwindCSS, providing a modern and efficient approach to theming in Drupal.

## Contribution 🤝

Feel free to contribute to this project by creating issues or submitting pull requests. Ensure to follow the coding standards and guidelines provided.

## License 📄

This project is licensed under the MIT License.

For more details, visit the [repository](https://github.com/isobar-playground/base).