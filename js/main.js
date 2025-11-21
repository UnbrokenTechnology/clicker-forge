/**
 * Main Game Initialization
 * Entry point for the Clicker Forge game
 */
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Clicker Forge - Initializing...');

        // Initialize modules in order
        GameState.init();
        UI.init();

        console.log('Clicker Forge - Ready!');
        
        // Optional: Add some starting weapons for testing
        // Uncomment the following lines to start with some broken weapons
        /*
        if (GameState.getBrokenWeapons().length === 0) {
            for (let i = 0; i < 3; i++) {
                const weapon = Weapons.generateBrokenWeapon();
                GameState.addBrokenWeapon(weapon);
            }
            UI.updateStats();
            UI.renderBrokenWeaponsList(GameState.getBrokenWeapons());
        }
        */
    });

    // Expose game API for debugging/testing (optional)
    window.ClickerForge = {
        version: '1.0.0',
        GameState: GameState,
        Weapons: Weapons,
        UI: UI
    };
})();
