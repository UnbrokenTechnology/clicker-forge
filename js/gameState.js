/**
 * GameState Module
 * Manages the global game state including inventory, broken weapons, and statistics
 */
const GameState = (function() {
    'use strict';

    // Private state
    let state = {
        inventory: {}, // { weaponType: count }
        brokenWeapons: [],
        repairCount: 0,
        selectedWeapon: null,
        isSearching: false
    };

    // Load state from localStorage on init
    function loadState() {
        const savedState = localStorage.getItem('clickerForgeState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                state = { ...state, ...parsed };
            } catch (e) {
                console.error('Failed to load saved state:', e);
            }
        }
    }

    // Save state to localStorage
    function saveState() {
        try {
            localStorage.setItem('clickerForgeState', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }

    // Public API
    return {
        // Initialize the game state
        init: function() {
            loadState();
        },

        // Get current state
        getState: function() {
            return { ...state };
        },

        // Add a broken weapon to the list
        addBrokenWeapon: function(weapon) {
            // Initialize repair progress for the weapon
            if (!weapon.repairProgress) {
                weapon.repairProgress = 0;
            }
            state.brokenWeapons.push(weapon);
            saveState();
        },

        // Remove a broken weapon by ID
        removeBrokenWeapon: function(weaponId) {
            state.brokenWeapons = state.brokenWeapons.filter(w => w.id !== weaponId);
            if (state.selectedWeapon && state.selectedWeapon.id === weaponId) {
                state.selectedWeapon = null;
            }
            saveState();
        },

        // Get all broken weapons
        getBrokenWeapons: function() {
            return [...state.brokenWeapons];
        },

        // Get a specific weapon by ID
        getWeaponById: function(weaponId) {
            return state.brokenWeapons.find(w => w.id === weaponId);
        },

        // Update weapon repair progress
        updateWeaponProgress: function(weaponId, progress) {
            const weapon = state.brokenWeapons.find(w => w.id === weaponId);
            if (weapon) {
                weapon.repairProgress = progress;
                saveState();
            }
        },

        // Get weapon repair progress
        getWeaponProgress: function(weaponId) {
            const weapon = state.brokenWeapons.find(w => w.id === weaponId);
            return weapon ? weapon.repairProgress : 0;
        },

        // Select a weapon for repair
        selectWeapon: function(weaponId) {
            const weapon = state.brokenWeapons.find(w => w.id === weaponId);
            if (weapon) {
                state.selectedWeapon = weapon;
                saveState();
                return weapon;
            }
            return null;
        },

        // Get the currently selected weapon
        getSelectedWeapon: function() {
            return state.selectedWeapon;
        },

        // Add a repaired weapon to inventory
        addToInventory: function(weaponType) {
            if (!state.inventory[weaponType]) {
                state.inventory[weaponType] = 0;
            }
            state.inventory[weaponType]++;
            state.repairCount++;
            saveState();
        },

        // Get inventory
        getInventory: function() {
            return { ...state.inventory };
        },

        // Get repair count
        getRepairCount: function() {
            return state.repairCount;
        },

        // Set searching state
        setSearching: function(searching) {
            state.isSearching = searching;
            saveState();
        },

        // Get searching state
        isSearching: function() {
            return state.isSearching;
        },

        // Reset the game (for future use)
        reset: function() {
            state = {
                inventory: {},
                brokenWeapons: [],
                repairCount: 0,
                selectedWeapon: null,
                isSearching: false
            };
            saveState();
        }
    };
})();
