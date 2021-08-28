/**
 * Somewhat the structure of the gamestate file.
 * "variable" is an ID as a key.
 * TODO : Use this object to build a configurable properties checker
 * to decide the data to extract from the file.
 */
export const GAMESTATE_STRUCTURE = {
  activities: false,
  ai: false,
  armies: {
    armies: false,
    army_regiments: false,
    gathering_armies: false,
    regiments: false,
  },
  character_lookup: false, // List of ID = other ID ?
  characters: {
    dead_prunable: false,
    dummy_male: false,
    dummy_female: false,
    natural_deaths: false,
    sexuality_chances: false,
    unborn: false,
    unborn_birth: false,
  },
  coat_of_arms: {
    coat_of_arms_manager_database: {
      variable: {
        pattern: false,
        color1: false,
        color2: false,
        textured_emblem: {
          texture: false
        },
        colored_emblem: {
          color1: false,
          color2: false,
          texture: false,
          instance: {
            position: false,
            scale: false,
            rotation: false
          }
        }
      }
    }
  },
  combats: {
    combat_results: false,
    combats: false
  },
  county_manager: {
    counties: {
      variable: {
        
      }
    }
  },
  culture_manager: {
    cultures: {
      variable: {
        culture_template: false,
        culture_era_data: false,
        culture_innovation: false,
      },
    },
  },
  dead_unprunable: {
    variable: {
      first_name: false,
      birth: false,
      was_playable: false,
      culture: false,
      faith: false,
      dynasty_house: false,
      skill: false,
      mass: false,
      traits: false,
      family_data: {
        child: false,
      },
      dead_data: {
        date: false,
        domain: false,
      },
    },
  },
  deleted_characters: false, // List of character ID
  faction_manager: {
    factions: false
  },
  fleet_manager: {
    fleets: false
  },
  holdings: {
    constructions: false
  },
  holy_orders: {
    holy_orders: false
  },
  living: {
    variable: {
      first_name: false,
      birth: false,
      female: false,
      culture: false,
      faith: false,
      sexuality: false,
      skill: false,
      mass: false,
      traits: false,
      dna: false,
      weight: {
        base: false,
        current: false,
        target: false,
      },
      dynasty_house: false, // Dynasty ID
      prowess_age: false,
      alive_data: {
        location: false, // Location ID
        fertility: false, // Number
        health: false, // Number
        piety: {
          currency: false,
          accumulated: false,
        },
        prestige: {
          currency: false,
          accumulated: false,
        },
        stress: false, // Number
        secrets: false, // List of ID
        targeting_secrets: false, // List of ID
      },
      family_data: {
        primary_spouse: false, // Character ID
        spouse: false, // Character ID or list
        child: false, // List of character ID
      },
      court_data: {
        employer: false,
        council_task: false,
        wants_to_leave_court: false,
      },
    },
  },
  mercenary_company_manager: {
    mercenary_companies: false
  },
  relations: {
    active_relations: {
      data: {
        first: false, // Character ID?
        second: false, // Character ID?

        // Multiples choices
        alliances: false,
        active_hook_variable: {
          type: false,
          gold: false,
          expiration_date: false,
        },
        cooldown_against_recipient_1: false,
      },
    },
  },

  meta_data: {
    save_game_version: false,
    version: false,
    portraits_version: false,
    meta_date: true,
    meta_player_name: true,
    meta_title_name: false,
    meta_coat_of_arms: false,
  },
  ironman_manager: false,
  date: false,
  bookmark_date: false,
  first_start: false,
  speed: false,
  random_seed: false,
  random_count: false,
  variables: false,
  game_rules: false,
  provinces: {
    variable: {
      holding: {
        buildings: {
          data: false, // Array of buildings or empty slot
        },
      },
      levy: false,
      garrison: false,
      income: false,
    },
  },
  landed_titles: {
    dynamic_templates: {
      data: false, // Array of key/tier/dyn
    },
    landed_titles: {
      variable: {
        key: false,
        de_facto_liege: false,
        de_jure_liege: false,
        holder: false, // ID of the holder
        name: false,
        date: false,
        history: false, // List of history = Event ID
        heir: false, // List of characters
        claim: false, // List of claimants
        capital: false, // Capital ID
        coat_of_arms_id: false,
        // Flags
        theocratic_lease: false,
        capital_barony: false,
        duchy_capital_barony: false,
      },
    },
  },
  dynasties: {
    dynasty_house: {
      variable: {
        name: false,
        localized_name: false, // name or this
        prefix: false,
        found_date: false,
        head_of_house: false,
        dynasty: false,
        historical: false,
        motto: false,
      },
    },
  },
  units: false,
  opinions: {
    active_opinions: {
      data: false,
    },
  },
  schemes: false,
  stories: false,
  pending_character_interactions: false,
  secrets: false,
  vassal_contracts: false,
  religion: {
    religions: {
      variable: {
        template: false,
        tag: false,
        graphical_faith: false,
        piety_icon_group: false,
        doctrine_background_icon: false,
        family: false,
        faiths: false,
      },
    },
    faiths: {
      variable: {
        template: false,
        tag: false,
        color: false,
        icon: false,
        texticon: false,
        graphical_faith: false,
        fervor: false,
        religious_head: false,
        doctrine: false,
        religion: false,
        holy_sites: false,
      },
    },
  },
  wars: {
    active_wars: {
      variable: false
    }
  },
  sieges: false,
  raid: false,
  succession: false,
  council_task_manager: false,
  important_action_manager: false,
  triggered_event: false,
  next_player_event_id: false,
  played_character: false,
  currently_played_characters: false,
};
