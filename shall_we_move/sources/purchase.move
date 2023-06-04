// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// Example of a game character with basic attributes, inventory, and
/// associated logic.
module shall_we_move::purchase {
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::object::{Self, ID, UID};
    use sui::math;
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::option::{Self, Option};

    /// Our hero!
    struct Store has key, store {
        id: UID,
        /// Hit points. If they go to zero, the hero can't do anything
        hp: u64,
        /// Experience of the hero. Begins at zero
        experience: u64,
        /// The hero's minimal inventory
        item: Option<Item>,
        /// An ID of the game user is playing
        game_id: ID,
    }

    /// The hero's trusty sword
    struct Item has key, store {
        id: UID,
        /// Constant set at creation. Acts as a multiplier on sword's strength.
        /// Swords with high magic are rarer (because they cost more).
        /// Sword grows in strength as we use it
        equipment_type: u64,
        /// An ID of the game
        game_id: ID,
    }

    /// An immutable object that contains information about the
    /// game admin. Created only once in the module initializer,
    /// hence it cannot be recreated or falsified.
    struct GameInfo has key {
        id: UID,
        admin: address
    }

    /// Capability conveying the authority to create boars and potions
    struct GameAdmin has key {
        id: UID,
        /// Total number of boars the admin has created
        boars_created: u64,
        /// Total number of potions the admin has created
        potions_created: u64,
        /// ID of the game where current user is an admin
        game_id: ID,
    }
    // --- Initialization

    /// On module publish, sender creates a new game. But once it is published,
    /// anyone create a new game with a `new_game` function.
    fun init(ctx: &mut TxContext) {
        create(ctx);
    }

    /// Anyone can create run their own game, all game objects will be
    /// linked to this game.
    public entry fun new_game(ctx: &mut TxContext) {
        create(ctx);
    }

    /// Create a new game. Separated to bypass public entry vs init requirements.
    fun create(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let game_id = object::uid_to_inner(&id);

        transfer::freeze_object(GameInfo {
            id,
            admin: sender,
        });

        transfer::transfer(
            GameAdmin {
                game_id,
                id: object::new(ctx),
                boars_created: 0,
                potions_created: 0,
            },
            sender
        )
    }

    // --- Gameplay ---
    // add item to the shop
    public entry fun add_item(
        game: &GameInfo, equipment_type: u64, ctx: &mut TxContext 
    ) {
        let item = create_item(game, equipment_type, ctx);
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(item, sender)
    }

    // transfert selected item to the player
    public entry fun transfer_item(
        item: Item, to_address : address
    ) {
        transfer::transfer(item, to_address)
    }

    // create item to add to the shop
    public fun create_item(
        game: &GameInfo,
        equipment_type: u64,
        ctx: &mut TxContext
    ): Item {
        Item {
            id: object::new(ctx),
            equipment_type: equipment_type,
            game_id: id(game)
        }
    }


    // // --- Game integrity / Links checks ---

    public fun check_id(game_info: &GameInfo, id: ID) {
        assert!(id(game_info) == id, 403); // TODO: error code
    }

    public fun id(game_info: &GameInfo): ID {
        object::id(game_info)
    }

}
