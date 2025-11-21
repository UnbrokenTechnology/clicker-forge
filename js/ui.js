/**
 * UI Module
 * Handles all UI updates and user interactions
 */
const UI = (function() {
    'use strict';

    // Constants for repair timing and progress
    const REPAIR_BASE_TIME_MS = 3000; // 3 seconds base repair time
    const REPAIR_CLICK_BOOST_MS = 100; // Each click adds 100ms worth of progress
    const REPAIR_UPDATE_INTERVAL_MS = 50; // Update progress every 50ms

    // DOM element cache
    let elements = {};
    
    // Repair state tracking
    let repairState = {
        isRepairing: false,
        progress: 0,
        progressInterval: null
    };

    // Cache DOM elements
    function cacheElements() {
        elements = {
            forgeIcon: document.getElementById('forgeIcon'),
            forgeStatus: document.getElementById('forgeStatus'),
            forgeProgressContainer: document.getElementById('forgeProgressContainer'),
            forgeProgressFill: document.getElementById('forgeProgressFill'),
            forgeProgressText: document.getElementById('forgeProgressText'),
            weaponToRepair: document.getElementById('weaponToRepair'),
            searchButton: document.getElementById('searchButton'),
            loadingBarContainer: document.getElementById('loadingBarContainer'),
            loadingBarFill: document.getElementById('loadingBarFill'),
            loadingText: document.getElementById('loadingText'),
            repairCount: document.getElementById('repairCount'),
            brokenCount: document.getElementById('brokenCount'),
            inventoryGrid: document.getElementById('inventoryGrid'),
            brokenWeaponsList: document.getElementById('brokenWeaponsList')
        };
    }

    // Update the repair counter
    function updateRepairCount(count) {
        elements.repairCount.textContent = count;
    }

    // Update the broken weapons counter
    function updateBrokenCount(count) {
        elements.brokenCount.textContent = count;
    }

    // Render the weapon to repair section
    function renderWeaponToRepair(weapon) {
        if (!weapon) {
            elements.weaponToRepair.innerHTML = '<p>No broken weapon selected</p>';
            return;
        }

        elements.weaponToRepair.innerHTML = `
            <div class="weapon-item">
                <i class="fa-duotone fa-regular ${weapon.icon}"></i>
                <div>
                    <div class="weapon-name">${weapon.name}</div>
                    <div class="weapon-type">Condition: ${weapon.condition}% damaged</div>
                </div>
            </div>
        `;
    }

    // Render the broken weapons list
    function renderBrokenWeaponsList(weapons) {
        if (weapons.length === 0) {
            elements.brokenWeaponsList.innerHTML = '<p class="empty-message">No broken weapons. Search for some!</p>';
            return;
        }

        const selectedWeapon = GameState.getSelectedWeapon();
        const selectedId = selectedWeapon ? selectedWeapon.id : null;

        elements.brokenWeaponsList.innerHTML = weapons.map(weapon => `
            <div class="broken-weapon-item ${weapon.id === selectedId ? 'selected' : ''}" data-weapon-id="${weapon.id}">
                <div class="broken-weapon-info">
                    <i class="fa-duotone fa-regular ${weapon.icon}"></i>
                    <div class="weapon-details">
                        <div class="weapon-name">${weapon.name}</div>
                        <div class="weapon-type">Condition: ${weapon.condition}% damaged</div>
                    </div>
                </div>
                <div>
                    <i class="fa-duotone fa-regular fa-hand-pointer"></i>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.broken-weapon-item').forEach(item => {
            item.addEventListener('click', function() {
                const weaponId = this.getAttribute('data-weapon-id');
                handleWeaponSelection(weaponId);
            });
        });
    }

    // Render inventory
    function renderInventory(inventory) {
        const entries = Object.entries(inventory);
        
        if (entries.length === 0) {
            elements.inventoryGrid.innerHTML = '<p class="empty-message">No repaired items yet</p>';
            return;
        }

        const weaponTypes = Weapons.getWeaponTypes();
        
        elements.inventoryGrid.innerHTML = entries.map(([type, count]) => {
            const weaponDef = weaponTypes[type];
            return `
                <div class="inventory-item">
                    <i class="fa-duotone fa-regular ${weaponDef.icon}"></i>
                    <div class="item-name">${weaponDef.name}</div>
                    <div class="item-count">x${count}</div>
                </div>
            `;
        }).join('');
    }

    // Handle weapon selection
    function handleWeaponSelection(weaponId) {
        const weapon = GameState.selectWeapon(weaponId);
        if (weapon) {
            renderWeaponToRepair(weapon);
            renderBrokenWeaponsList(GameState.getBrokenWeapons());
            elements.forgeStatus.textContent = 'Click the forge to repair!';
            elements.forgeStatus.style.color = '#27ae60';
        }
    }

    // Handle forge click (repair action)
    function handleForgeClick() {
        const selectedWeapon = GameState.getSelectedWeapon();
        
        if (!selectedWeapon) {
            elements.forgeStatus.textContent = 'Select a weapon first!';
            elements.forgeStatus.style.color = '#f39c12';
            elements.forgeIcon.classList.add('failure-animation');
            setTimeout(() => {
                elements.forgeIcon.classList.remove('failure-animation');
            }, 500);
            return;
        }

        // If already repairing, speed up the process with clicks
        if (repairState.isRepairing) {
            repairState.progress += REPAIR_CLICK_BOOST_MS;
            elements.forgeIcon.classList.add('hammer-pulse');
            setTimeout(() => {
                elements.forgeIcon.classList.remove('hammer-pulse');
            }, 200);
            updateForgeProgress();
            return;
        }

        // Start the repair process
        startRepair(selectedWeapon);
    }

    // Start the repair process
    function startRepair(weapon) {
        repairState.isRepairing = true;
        repairState.progress = 0;
        
        // Show progress bar
        elements.forgeProgressContainer.style.display = 'block';
        elements.forgeProgressFill.style.width = '0%';
        elements.forgeStatus.textContent = 'Forging in progress...';
        elements.forgeStatus.style.color = '#f39c12';
        elements.forgeIcon.classList.add('repairing');

        // Update progress at regular intervals
        repairState.progressInterval = setInterval(() => {
            repairState.progress += REPAIR_UPDATE_INTERVAL_MS;
            updateForgeProgress();

            if (repairState.progress >= REPAIR_BASE_TIME_MS) {
                completeRepair(weapon);
            }
        }, REPAIR_UPDATE_INTERVAL_MS);
    }

    // Update forge progress bar
    function updateForgeProgress() {
        const progressPercent = Math.min((repairState.progress / REPAIR_BASE_TIME_MS) * 100, 100);
        elements.forgeProgressFill.style.width = progressPercent + '%';
    }

    // Complete the repair process
    function completeRepair(weapon) {
        // Clear the interval
        if (repairState.progressInterval) {
            clearInterval(repairState.progressInterval);
            repairState.progressInterval = null;
        }

        // Reset repair state
        repairState.isRepairing = false;
        repairState.progress = 0;

        // Hide progress bar
        elements.forgeProgressContainer.style.display = 'none';
        elements.forgeIcon.classList.remove('repairing');
        
        // Complete the repair
        GameState.addToInventory(weapon.type);
        GameState.removeBrokenWeapon(weapon.id);
        
        elements.forgeStatus.textContent = 'Repair complete!';
        elements.forgeStatus.style.color = '#27ae60';
        elements.forgeIcon.classList.add('success-animation');
        
        setTimeout(() => {
            elements.forgeIcon.classList.remove('success-animation');
            elements.forgeStatus.textContent = 'Ready to repair';
            elements.forgeStatus.style.color = '#27ae60';
        }, 1000);

        // Update all UI
        updateStats();
        renderWeaponToRepair(null);
        renderBrokenWeaponsList(GameState.getBrokenWeapons());
        renderInventory(GameState.getInventory());
    }

    // Handle search button click
    function handleSearchClick() {
        if (GameState.isSearching()) {
            return;
        }

        GameState.setSearching(true);
        elements.searchButton.disabled = true;
        elements.loadingBarContainer.style.display = 'block';
        elements.loadingBarFill.style.width = '0%';
        elements.loadingText.textContent = 'Searching...';

        // Animate loading bar
        const duration = 3000; // 3 seconds
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        const loadingInterval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / steps) * 100;
            elements.loadingBarFill.style.width = progress + '%';

            if (currentStep >= steps) {
                clearInterval(loadingInterval);
                completeSearch();
            }
        }, interval);
    }

    // Complete the search process
    function completeSearch() {
        const result = Weapons.searchForWeapons();

        if (result.success) {
            // Add weapons to game state
            result.weapons.forEach(weapon => {
                GameState.addBrokenWeapon(weapon);
            });

            elements.loadingText.textContent = result.message;
            elements.loadingText.style.color = '#27ae60';
            elements.searchButton.classList.add('success-animation');
        } else {
            elements.loadingText.textContent = result.message;
            elements.loadingText.style.color = '#c0392b';
            elements.searchButton.classList.add('failure-animation');
        }

        setTimeout(() => {
            elements.loadingBarContainer.style.display = 'none';
            elements.searchButton.disabled = false;
            elements.searchButton.classList.remove('success-animation', 'failure-animation');
            GameState.setSearching(false);
            
            // Update UI
            updateStats();
            renderBrokenWeaponsList(GameState.getBrokenWeapons());
        }, 2000);
    }

    // Update all stats
    function updateStats() {
        updateRepairCount(GameState.getRepairCount());
        updateBrokenCount(GameState.getBrokenWeapons().length);
    }

    // Initialize UI and event handlers
    function init() {
        cacheElements();

        // Set up event handlers
        elements.forgeIcon.addEventListener('click', handleForgeClick);
        elements.searchButton.addEventListener('click', handleSearchClick);

        // Initial render
        updateStats();
        renderWeaponToRepair(GameState.getSelectedWeapon());
        renderBrokenWeaponsList(GameState.getBrokenWeapons());
        renderInventory(GameState.getInventory());
    }

    // Public API
    return {
        init: init,
        updateStats: updateStats,
        renderWeaponToRepair: renderWeaponToRepair,
        renderBrokenWeaponsList: renderBrokenWeaponsList,
        renderInventory: renderInventory
    };
})();
