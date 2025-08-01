# Contributing to GenRide

Thank you for your interest in contributing to GenRide! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.0 or higher)
- npm or yarn package manager
- Git
- Firebase account
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/car-rental-website.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .env.example .env.local`
5. Configure your Firebase credentials in `.env.local`
6. Start development server: `npm run dev`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add proper type definitions
- Use ESLint and Prettier for code formatting

### Component Guidelines
- Create reusable components in the `src/components` directory
- Use the existing UI component library (Radix UI)
- Follow the atomic design principles
- Add proper prop types and documentation

### File Naming Conventions
- Use kebab-case for file names: `user-management.tsx`
- Use PascalCase for component names: `UserManagement`
- Use camelCase for functions and variables: `handleUserDelete`

### Git Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit with descriptive messages: `git commit -m "feat: add user deletion functionality"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a pull request

### Commit Message Format
Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Write unit tests for utility functions
- Write integration tests for components
- Use Jest and React Testing Library
- Aim for good test coverage

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for functions and components
- Document complex logic and algorithms
- Update README.md for new features
- Add inline comments for clarity

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error handling

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information
- Console errors if any

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the feature
- Use case and benefits
- Mockups or wireframes if applicable
- Implementation suggestions

## 🔍 Code Review Process

### Before Submitting
- Ensure all tests pass
- Run linting: `npm run lint`
- Test your changes thoroughly
- Update documentation if needed
- Rebase your branch if needed

### Pull Request Guidelines
- Use a clear and descriptive title
- Provide detailed description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure CI checks pass

## 🏗️ Architecture Guidelines

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Consider using React Query for server state

### API Integration
- Use Firebase SDK for backend operations
- Handle errors gracefully
- Implement proper loading states
- Add retry logic where appropriate

### Performance
- Optimize images and assets
- Use lazy loading for components
- Implement proper caching strategies
- Monitor bundle size

## 🔒 Security Guidelines

- **NEVER** commit API keys, passwords, tokens, or other sensitive information
- Always use environment variables for configuration (`.env.local` for local development)
- Ensure `.env*` files are properly excluded in `.gitignore`
- Follow security best practices for authentication and data handling
- Review your commits before pushing to ensure no sensitive data is included
- Use placeholder values in documentation and example files
- Report security vulnerabilities privately to the maintainers
- When sharing code snippets or screenshots, redact any sensitive information
- Validate all user inputs
- Implement proper authentication checks
- Follow Firebase security best practices

## 📱 Responsive Design

- Mobile-first approach
- Test on multiple screen sizes
- Use Tailwind CSS breakpoints
- Ensure touch-friendly interfaces

## 🎨 UI/UX Guidelines

- Follow the existing design system
- Maintain consistency across components
- Ensure accessibility standards
- Use semantic HTML elements
- Provide proper ARIA labels

## 📦 Dependencies

### Adding New Dependencies
- Justify the need for new dependencies
- Choose well-maintained packages
- Consider bundle size impact
- Update package.json and documentation

### Updating Dependencies
- Test thoroughly after updates
- Check for breaking changes
- Update related documentation

## 🚀 Deployment

### Staging
- Test on staging environment
- Verify all features work correctly
- Check performance metrics

### Production
- Follow the deployment checklist
- Monitor for issues after deployment
- Have rollback plan ready

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in discussions
- Join our community channels
- Contact maintainers if needed

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to GenRide! 🚗✨