.DEFAULT_GOAL := help

%:
	make help

help:
	@echo "❌  This Makefile is no longer supported!"
	@echo "📋 Please switch to using Taskfile (https://taskfile.dev)"
	@echo ""
	@if command -v task >/dev/null 2>&1; then \
		echo "✅  Taskfile is already installed on your system."; \
		echo "💡 Use: task to see available tasks"; \
		task; \
	else \
		echo "❗ Taskfile is not installed on your system."; \
		echo ""; \
		echo "🔧 To install Taskfile, run:"; \
		echo 'sh -c "$$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin'; \
		echo ""; \
		echo "📖 More installation options: https://taskfile.dev/installation/"; \
	fi
