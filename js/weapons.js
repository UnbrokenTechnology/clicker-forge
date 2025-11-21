/**
 * Weapons Module
 * Manages weapon types, generation, and repair mechanics
 */
const Weapons = (function() {
    'use strict';

    // Weapon type definitions with Font Awesome icons
    const weaponTypes = {
        sword: {
            name: 'Sword',
            icon: 'fa-sword',
            baseSuccessChance: 0.7,
            repairTime: 1000 // ms for animation purposes
        },
        // Future expansion: more weapon types can be added here
        axe: {
            name: 'Axe',
            icon: 'fa-axe',
            baseSuccessChance: 0.65,
            repairTime: 1200
        },
        dagger: {
            name: 'Dagger',
            icon: 'fa-knife',
            baseSuccessChance: 0.8,
            repairTime: 800
        },
        mace: {
            name: 'Mace',
            icon: 'fa-mace',
            baseSuccessChance: 0.6,
            repairTime: 1500
        }
    };

    // Currently active weapon types (start with swords only)
    let activeWeaponTypes = ['sword'];

    let weaponIdCounter = 1;

    // Generate a unique weapon ID
    function generateWeaponId() {
        return `weapon_${weaponIdCounter++}_${Date.now()}`;
    }

    // Generate weapon condition descriptor
    function getConditionDescriptor() {
        const conditions = ['Badly Broken', 'Damaged', 'Chipped', 'Cracked', 'Worn'];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Public API
    return {
        // Get all weapon type definitions
        getWeaponTypes: function() {
            return { ...weaponTypes };
        },

        // Get active weapon types
        getActiveWeaponTypes: function() {
            return [...activeWeaponTypes];
        },

        // Enable a weapon type (for future expansion)
        enableWeaponType: function(type) {
            if (weaponTypes[type] && !activeWeaponTypes.includes(type)) {
                activeWeaponTypes.push(type);
            }
        },

        // Generate a random broken weapon
        generateBrokenWeapon: function() {
            const type = activeWeaponTypes[Math.floor(Math.random() * activeWeaponTypes.length)];
            const weaponDef = weaponTypes[type];
            
            return {
                id: generateWeaponId(),
                type: type,
                name: `${getConditionDescriptor()} ${weaponDef.name}`,
                icon: weaponDef.icon,
                condition: Math.floor(Math.random() * 50) + 30 // 30-80% damage
            };
        },

        // Calculate search success chance
        getSearchSuccessChance: function() {
            // Base 60% chance to find a weapon
            return 0.6;
        },

        // Perform a search for broken weapons
        searchForWeapons: function() {
            const successChance = this.getSearchSuccessChance();
            const roll = Math.random();
            
            if (roll < successChance) {
                // Success! Generate 1-3 weapons
                const count = Math.floor(Math.random() * 3) + 1;
                const weapons = [];
                for (let i = 0; i < count; i++) {
                    weapons.push(this.generateBrokenWeapon());
                }
                return {
                    success: true,
                    weapons: weapons,
                    message: `Found ${count} broken weapon${count > 1 ? 's' : ''}!`
                };
            } else {
                return {
                    success: false,
                    weapons: [],
                    message: 'Search failed. No weapons found.'
                };
            }
        },

        // Get weapon definition by type
        getWeaponDef: function(type) {
            return weaponTypes[type] ? { ...weaponTypes[type] } : null;
        }
    };
})();
