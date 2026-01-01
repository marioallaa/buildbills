# Contributing to BuildBills

Thank you for your interest in contributing to BuildBills! This guide will help you get started.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/buildbills.git`
3. Follow the [Development Setup Guide](docs/SETUP.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### 1. Pick an Issue

- Check the [Issues](https://github.com/marioallaa/buildbills/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Write unit tests for new functions
- Run all tests: `npm test`
- Test manually on iOS and Android (for mobile changes)
- Test with Firebase emulators (for backend changes)

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add invoice filtering"
git commit -m "fix: correct amount calculation"
git commit -m "docs: update API documentation"
git commit -m "test: add expense creation tests"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Detailed description of what and why
- Reference any related issues
- Screenshots for UI changes

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use meaningful variable and function names
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Add JSDoc comments for public functions

```typescript
/**
 * Calculate the total amount from invoice items
 * @param items Array of invoice items
 * @returns Total amount
 */
export function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}
```

### React Native

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components small and focused
- Use StyleSheet.create for styles
- Avoid inline styles

```typescript
const MyComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Firebase Functions

- Keep functions small and focused
- Handle errors appropriately
- Use proper authentication checks
- Add logging for debugging
- Use proper HTTP status codes

```typescript
export const myFunction = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  try {
    // Function logic
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    throw new functions.https.HttpsError('internal', 'Operation failed');
  }
});
```

## Project Structure

```
buildbills/
├── apps/
│   └── mobile/              # React Native app
│       ├── src/
│       │   ├── screens/     # Screen components
│       │   ├── components/  # Reusable components
│       │   ├── navigation/  # Navigation setup
│       │   ├── services/    # Business logic
│       │   └── utils/       # Utility functions
│       └── __tests__/       # Tests
├── packages/
│   ├── firebase-functions/  # Backend functions
│   │   ├── src/
│   │   │   ├── functions/   # Cloud functions
│   │   │   ├── models/      # Data models
│   │   │   ├── services/    # Business logic
│   │   │   └── utils/       # Utilities
│   │   └── __tests__/       # Tests
│   ├── shared-types/        # Shared TypeScript types
│   ├── shared-utils/        # Shared utilities
│   └── api-client/          # API client library
└── docs/                    # Documentation
```

## Testing Requirements

All code contributions must include tests:

### Unit Tests
- Test all new functions
- Test edge cases and error conditions
- Mock external dependencies

### Integration Tests
- Test API endpoints end-to-end
- Test Firebase interactions

### Manual Testing
- Test on both iOS and Android
- Test different screen sizes
- Test offline behavior

See [Testing Guide](docs/TESTING.md) for details.

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Updating dependencies
- Modifying setup procedures

Documentation locations:
- Main README: Project overview
- docs/SETUP.md: Development setup
- docs/API.md: API documentation
- docs/DEPLOYMENT.md: Deployment guide
- docs/TESTING.md: Testing guide

## Pull Request Process

1. **Update Documentation**: Ensure all docs are current
2. **Add Tests**: All new code must have tests
3. **Run Tests**: Ensure all tests pass
4. **Update CHANGELOG**: Add entry for your changes
5. **Request Review**: Tag maintainers for review

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added and passing
- [ ] No console errors or warnings
- [ ] Works on iOS and Android (for mobile changes)
- [ ] Firebase emulators tested (for backend changes)

## Review Process

- Maintainers will review PRs within 1-2 weeks
- Address review comments promptly
- Be open to feedback and suggestions
- Update PR based on review comments

## Feature Requests

Have an idea? Great!

1. Check if it already exists in Issues
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
3. Discuss with maintainers before building

## Bug Reports

Found a bug? Help us fix it!

1. Check if it's already reported
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Device/platform information
   - Error logs

## Need Help?

- Check existing [documentation](docs/)
- Search closed [issues](https://github.com/marioallaa/buildbills/issues)
- Ask in issue comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to BuildBills! 🎉
