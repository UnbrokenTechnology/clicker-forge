# Agent Guidelines for Clicker Forge Refactoring

## Overview
This document provides guidelines for maintaining clean, organized, and maintainable code when working on the Clicker Forge project.

## Core Principles

### 1. Preserve Working Functionality
- **Never remove or modify working code** unless it's necessary to fix a bug or implement a required feature
- Before making changes, ensure you understand what the existing code does
- Test thoroughly after changes to ensure nothing breaks

### 2. Minimal Code Changes
When implementing new features or fixing bugs, follow these priorities:

1. **Update existing code** when it makes sense to extend or modify current functionality
2. **Add new code** only when the feature is genuinely new and doesn't fit existing patterns
3. **Create new modules/files/classes** only when:
   - The functionality is substantially different from existing modules
   - The current file is becoming too large (>500 lines)
   - The new feature represents a distinct concern or domain

### 3. Code Organization

#### Module Structure
The project uses a modular JavaScript architecture:
- `gameState.js` - State management and persistence
- `weapons.js` - Weapon generation and mechanics
- `ui.js` - UI updates and user interactions
- `main.js` - Game initialization

**When to add a new module:**
- The feature represents a new major system (e.g., shop, upgrades, quests)
- The module would have 200+ lines of code
- The functionality is reusable across multiple parts of the game

**When to extend existing modules:**
- The feature builds on existing functionality
- It fits naturally with the module's current responsibilities
- The module won't become bloated (keep under 500 lines)

#### Function Guidelines
- Keep functions small and focused (ideally under 50 lines)
- Use descriptive names that clearly indicate purpose
- Add comments only when the code's intent isn't immediately clear
- Follow existing naming conventions in the codebase

### 4. Refactoring Approach

#### Before Refactoring
1. Understand the current implementation completely
2. Identify what's working and what needs to change
3. Plan minimal changes that achieve the goal
4. Consider backwards compatibility

#### During Refactoring
1. Make one logical change at a time
2. Test after each change
3. Keep git commits focused and descriptive
4. Don't combine bug fixes with feature additions

#### After Refactoring
1. Test all affected functionality
2. Verify no working features were broken
3. Check that the code is cleaner and more maintainable
4. Update comments and documentation if needed

### 5. When Adding Features

#### State Management
- Add new state properties to `GameState` module
- Use the existing save/load pattern
- Don't create separate state management systems

#### UI Changes
- Follow existing UI patterns in `ui.js`
- Cache new DOM elements in the `cacheElements()` function
- Use existing CSS classes and variables when possible
- Add new animations/styles only when necessary

#### Game Mechanics
- Extend the `Weapons` module for weapon-related features
- Keep mechanics consistent with existing gameplay
- Balance new features with current progression

### 6. Code Quality Standards

#### Clean Code Practices
- **DRY (Don't Repeat Yourself)**: Extract repeated code into functions
- **Single Responsibility**: Each function/module should do one thing well
- **Consistent Style**: Match the existing code style and formatting
- **Clear Intent**: Code should be self-documenting

#### Avoid These Anti-Patterns
- ❌ Creating helper scripts or workarounds instead of proper solutions
- ❌ Duplicating existing functionality in a new place
- ❌ Adding temporary fixes that should be permanent solutions
- ❌ Leaving commented-out code in production
- ❌ Adding excessive logging that should be debug-only

### 7. Testing and Validation

#### Manual Testing Checklist
- [ ] Test the specific feature you changed
- [ ] Test related features that might be affected
- [ ] Test edge cases and error conditions
- [ ] Verify the game state persists correctly (localStorage)
- [ ] Check responsive design on mobile viewports

#### Before Committing
- [ ] Review your changes line by line
- [ ] Remove any debug code or console.logs
- [ ] Ensure code follows existing style
- [ ] Verify no working functionality was broken
- [ ] Test in a clean browser session (clear localStorage)

### 8. Documentation

#### When to Update Documentation
- New features that users interact with
- Changes to existing gameplay mechanics
- New configuration options
- Breaking changes (rare, but document thoroughly)

#### Keep Documentation Minimal
- Update README.md for major features
- Use inline comments sparingly and only for complex logic
- Let the code speak for itself when possible

## Example Scenarios

### Scenario 1: Adding Click Progress Bar
**Good Approach ✅**
- Update existing `handleForgeClick()` function in `ui.js`
- Add progress tracking to existing repair state
- Extend HTML with progress bar elements
- Reuse existing CSS patterns for the loading bar

**Bad Approach ❌**
- Create a new `forgeProgress.js` module
- Duplicate state management
- Create completely new CSS from scratch
- Add a separate progress tracking system

### Scenario 2: Fixing a Bug
**Good Approach ✅**
- Identify the minimal code change needed
- Add a flag or condition to prevent the bug
- Test that existing functionality still works
- Document why the change was needed (if not obvious)

**Bad Approach ❌**
- Rewrite the entire function
- Change working parts of the code
- Add complex workarounds
- Fix multiple unrelated things at once

### Scenario 3: Adding a Shop System
**Good Approach ✅**
- Create a new `shop.js` module (major new feature)
- Integrate with existing `GameState` for purchases
- Follow existing UI patterns in the HTML/CSS
- Keep the API consistent with other modules

**Bad Approach ❌**
- Add shop logic to `weapons.js` or `ui.js`
- Create a separate state management system
- Use different patterns from the rest of the codebase

## Summary
The goal is to maintain a codebase that is:
- **Clean**: Easy to read and understand
- **Organized**: Logical structure and separation of concerns
- **Maintainable**: Easy to modify and extend
- **Stable**: Changes don't break existing functionality

When in doubt, ask yourself:
1. Is this the minimal change needed?
2. Does this fit naturally with existing code?
3. Am I preserving all working functionality?
4. Will future developers understand this easily?

If you can answer "yes" to all four, you're on the right track!
