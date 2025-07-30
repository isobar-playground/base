[![PHPUnit](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml)
[![Coverage](https://raw.githubusercontent.com/isobar-playground/base/refs/heads/badges/coverage.svg)](https://github.com/isobar-playground/base/actions/workflows/phpunit.yml)
[![GrumPHP](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/grumphp.yml)
[![Docker Build](https://github.com/isobar-playground/base/actions/workflows/test_build.yml/badge.svg?branch=master)](https://github.com/isobar-playground/base/actions/workflows/test_build.yml)

# Base Project 🚀

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/isobar-playground/base?quickstart=1)

This project is a base for web applications built with Drupal. It leverages custom Docker images for PHP, Apache, and Node.js for containerization. For local environments, it utilizes `docker-compose` along with `mysql` for database services.

## Features ✨

- **Drupal Installation**: Drupal is installed using Composer.
- **Dependency Management**: Dependencies are updated via Dependabot on GitHub.
- **Coding Standards**: Code quality is enforced using `grumphp`.
- **Starterkit Theme**: A starterkit theme is created using Single Directory Components and TailwindCSS.
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
3. Run the Task command to start the local environment:
   ```sh
   task init:local
   ```
4. Access the local environment at http://base.localhost

## Taskfile Commands 📜

The `taskfile.yml` includes several commands to manage the Docker environment:

| Command           | Description                                                                                                    |
|-------------------|----------------------------------------------------------------------------------------------------------------|
| `help`            | Prints the help for available commands.                                                                        |
| `init:local`      | Initializes local environment.                                                                                 |
| `init:workflows`  | Initializes environment for Github Workflows.                                                                  |
| `init:codespaces` | Initializes codespaces environment.                                                                            |
| `build`           | Builds containers.                                                                                             |
| `up`              | Starts up the containers, installs Composer dependencies, and waits for the database to be ready.              |
| `down`            | Stops the containers and removes networks.                                                                     |
| `restart`         | Restarts the application (runs down and up tasks in sequence).                                                 |
| `prune`           | Removes containers and their volumes.                                                                          |
| `shell`           | Accesses a container via shell. By default, enters the PHP container, but can be used with any container name. |
| `drush`           | Run drush with arguments like `task drush -- cr`.                                                              |
| `yolo`            | Recreates the environment, imports configuration, and indexes search.                                          |
| `theme`           | Generates a theme from the custom theme starterkit.                                                            |

## Docker Compose Configuration 🐳

The project uses `docker-compose` for managing the local development environment. The `.env` and `.env.local` files are included to configure environment variables for Docker Compose.

### Building Docker Images 🏗️

#### Node Image

The Node image is a custom image built from the official Node.js image and requires the `NODE_TAG` argument, which specifies the version of Node.js to use. The version information is located in the `.env` or `.env.local` file.

#### PHP Image

The PHP image is a custom image built specifically for this project. It includes all the PHP extensions and configurations needed for Drupal. The image requires the `PHP_TAG` argument for the PHP version, which is specified in the `.env` or `.env.local` file. The image also requires the `NODE_IMAGE` argument, which copies built assets from the Node image.

#### Apache Image

The Apache image is a custom image that uses the built PHP image passed via the `PHP_IMAGE` argument. It also requires the `APACHE_TAG` argument to specify the Apache version. The configuration for Apache is included in the Docker image.

### Build Order

The images are built in the following order:

1. PHP image
2. Node image (uses files from PHP image)
3. Apache image (uses files from both PHP and Node images)

## Static Code Analysis and Coding Standards 🧹

Code quality and adherence to coding standards are ensured using `grumphp`. The tool runs a set of predefined tasks, including static code analysis and unit tests, before each commit to maintain high code quality.

## Unit Testing with PHPUnit 🧪

Unit tests are written using PHPUnit and run on every pull request and commit to the master branch.

## Theme Development 🎨

The base starterkit theme is developed using Single Directory Components and TailwindCSS, providing a modern and efficient approach to theming in Drupal. In order to use it run following command:

```bash
task theme
```

You will be prompted for a new topic name. By default this will be the PROJECT_NAME from the .env file.

**Important: Once you have created a new theme from the starterkit, please apply the changes to the Docker configuration.**

### Creating new Single Directory Component

To create a new Single Directory Component please follow steps below:

1. Create a new Twig file in the respective directory within the `components` directory with the component template.
2. Optionally, create a new `*.component.yml` file next to the Twig file to define component properties using the following guide: [Annotated Example Component YAML](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components/annotated-example-componentyml)
3. When developing a new component, remember to flush the Drupal cache with the `task drush -- cr` command if problems occur.

## RabbitMQ Integration 🐰

The project integrates with a RabbitMQ service, which is available at http://rabbitmq.base.localhost. The default login credentials are:

- Username: admin
- Password: admin

Drupal integrates its internal queues with this RabbitMQ service, allowing for efficient background processing and message handling.

## Contribution 🤝

Feel free to contribute to this project by creating issues or submitting pull requests. Ensure to follow the coding standards and guidelines provided.

### Initial database dump update

To update the initial database dump stored in `docker/mariadb/base.sql.gz`, use the following command:

```bash
task drush -- "sql:dump --gzip"
```

### Reverting project to initial stage

To revert project to initial stage and purge all data stored in volumes, use the following command:

```bash
task yolo
```
Optionally, you can reset the current state of the Git repository with

```bash
git reset --hard
git clean -fd
```

and then rebuild and lunch local images so that the environment is up to date with the HEAD state:

```bash
task yolo
```
