# clicker-forge

**[Play the game here!](https://unbrokentechnology.github.io/clicker-forge/)**

A clicker game focused on your role as a Blacksmith in a post apocalyptic world where adventurers band together to defeat the demon lord.

## How to Play

1. Open `index.html` in a web browser
2. Click the **Search for Broken Weapons** button to find broken weapons
3. Wait for the loading bar to complete (3 seconds)
4. Click on a broken weapon from the list to select it
5. Click the **forge icon** at the top to repair the selected weapon
6. Watch your inventory grow as you repair more weapons!

## Features

- 🔨 **Forge Mechanic**: Click the forge to repair selected weapons
- 🔍 **Search System**: Find broken weapons with a loading bar and success chance
- ⚔️ **Weapon Types**: Currently supports swords (easily expandable to axes, daggers, maces)
- 📦 **Inventory System**: Track all your repaired weapons
- 💾 **Auto-Save**: Game state persists using localStorage
- 🎨 **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- Pure HTML5, CSS3, and JavaScript (no dependencies)
- Font Awesome for icons
- Modular JavaScript architecture for easy expansion
- LocalStorage for game state persistence

## Project Structure

```
clicker-forge/
├── index.html          # Main HTML file
├── styles.css          # All CSS styling
└── js/
    ├── gameState.js    # Game state management
    ├── weapons.js      # Weapon generation and logic
    ├── ui.js           # UI updates and interactions
    └── main.js         # Game initialization
```

## Future Expansion

The modular code structure allows for easy addition of:
- New weapon types (axes, daggers, maces, etc.)
- Upgrade systems
- Resource management
- Character progression
- Crafting complexity
- Shop system
