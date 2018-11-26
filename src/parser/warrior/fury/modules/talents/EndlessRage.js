import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import Events from 'parser/core/Events';
import { SELECTED_PLAYER } from 'parser/core/EventFilter';
import SUGGESTION_IMPORTANCE from 'parser/core/ISSUE_IMPORTANCE';

class EndlessRage extends Analyzer {
    rageGen = 0;
    
    constructor(...args) {
        super(...args);

        this.active = this.selectedCombatant.hasTalent(SPELLS.ENDLESS_RAGE_TALENT.id);

        this.addEventListener(Events.applybuff.by(SELECTED_PLAYER).to(SELECTED_PLAYER), this.onPlayerBuff);
    }

    onPlayerBuff(event) {
        if (event.ability.guid === SPELLS.ENRAGE.id) {
            this.rageGen += 6;
        }
    }

    statistic() {
        return (
            <TalentStatisticBox
              talent={SPELLS.ENDLESS_RAGE_TALENT.id}
              value={`${this.rageGen} rage generated`}
              label="Endless Rage"
            />
        );
    }
}

export default EndlessRage;