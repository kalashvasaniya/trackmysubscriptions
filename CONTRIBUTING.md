## Contributing to TrackMySubscriptions

First off, thank you for taking the time to contribute — every improvement helps.

### Ways to contribute

- **Report bugs** using GitHub Issues
- **Suggest enhancements** or new features
- **Improve documentation** (README, comments, guides)
- **Submit code changes** via Pull Requests

### Development setup

1. Fork the repository and clone your fork.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file (see `.env.example`).
4. Start the dev server:

```bash
npm run dev
```

### Branching & workflow

- Base all work off the `main` branch.
- Use descriptive branch names, e.g.:
  - `feat/add-calendar-filter`
  - `fix/analytics-crash`
  - `docs/update-readme`

### Coding standards

- Use **TypeScript** for all new code.
- Follow existing patterns and folder structure.
- Keep components focused and small when possible.
- Run:

```bash
npm run lint
```

before opening a PR.

### Commit messages

Use clear, descriptive messages. Examples:

- `fix: handle empty subscription list`
- `feat: add monthly spending chart`
- `docs: clarify env setup`

### Pull Requests

Before opening a PR:

- Ensure the app builds: `npm run build`
- Ensure lint passes: `npm run lint`
- Add or update tests where it makes sense.

PR checklist:

- Describe **what** you changed and **why**.
- Include screenshots/GIFs for UI changes if helpful.
- Link related issues (e.g. `Closes #12`).

### Reporting security issues

If you discover a security vulnerability, **do not** open a public issue.
Instead, please email the maintainer directly:

- `kalashvasaniya@gmail.com`

You will receive an acknowledgement as soon as possible.

### Code of Conduct

By participating in this project, you agree to abide by the
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

# Contributing to TrackMySubscriptions

First off, thank you for considering contributing to TrackMySubscriptions! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Features

Feature suggestions are welcome! Please:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested feature**
- **Explain why this feature would be useful**
- **Include mockups or examples if possible**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18.x or later
- MongoDB (local or Atlas)
- Google OAuth credentials (for authentication testing)

### Getting Started

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/trackmysubscriptions.git
cd trackmysubscriptions
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file:

```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Project Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components
├── lib/           # Utility functions and configurations
├── models/        # Mongoose database models
└── types/         # TypeScript type definitions
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS for styling
- Follow the existing design patterns
- Ensure dark mode compatibility

### Code Style

- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commits

- Use clear, descriptive commit messages
- Reference issues in commits when applicable (e.g., "Fix #123")
- Keep commits focused on a single change

## Testing

Before submitting a PR, please:

1. Test your changes locally
2. Ensure the app builds without errors: `npm run build`
3. Check for linting errors: `npm run lint`
4. Test on both light and dark modes
5. Test on mobile viewport sizes

## Documentation

- Update the README.md if you change functionality
- Add JSDoc comments for new functions
- Update the .env.example if you add new environment variables

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
