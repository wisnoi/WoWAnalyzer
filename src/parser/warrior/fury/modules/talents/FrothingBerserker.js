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

const DAMAGE_BONUS = 0.1;

class FrothingBerserker extends Analyzer {
    static dependencies = {
        abilityTracker: AbilityTracker,
    };

    damage = 0;

    constructor(...args) {
        super(...args);

        this.active = false;

        if (this.selectedCombatant.hasTalent(SPELLS.FROTHING_BERSERKER_TALENT.id)) {
            this.active = true;
            this.addEventListener(Events.damage.by(SELECTED_PLAYER), this.onPlayerDamage);
        }
    }

    onPlayerDamage(event) {
        if (this.selectedCombatant.hasBuff(SPELLS.FROTHING_BERSERKER.id)) {
            this.damage += calculateEffectiveDamage(event, DAMAGE_BONUS);
        }
    }

    get damagePercent() {
        return this.owner.getPercentageOfTotalDamageDone(this.damage);
    }

    get damageIncreasePercent() {
        return this.damagePercent / (1 - this.damagePercent);
    }

    get uptimePercent() {
        const uptime = this.selectedCombatant.getBuffUptime(SPELLS.FROTHING_BERSERKER.id) / 1000;
        const fightLengthSec = this.owner.fightDuration / 1000;

        return uptime / fightLengthSec;
    }

    get suggestionThresholds() {
        return {
          isLessThan: {
            minor: 0.65,
            average: 0.6,
            major: 0.55,
          },
          style: 'percentage',
        };
      }

    suggestions(when) {
        const {
            isLessThan: {
              minor,
              average,
              major,
            },
          } = this.suggestionThresholds;

        when(true).isTrue().addSuggestion((suggest) => {
            return suggest(
              <>
              You are currently using <SpellLink id={SPELLS.FROTHING_BERSERKER_TALENT.id} />. It is highly recommended to talent into <SpellLink id={SPELLS.CARNAGE_TALENT.id} />, as there are currently no situations in which  <SpellLink id={SPELLS.FROTHING_BERSERKER_TALENT.id} /> outperforms <SpellLink id={SPELLS.CARNAGE_TALENT.id} />.
              </>
            )
            .icon(SPELLS.CARNAGE_TALENT.icon)
            .staticImportance(SUGGESTION_IMPORTANCE.REGULAR);
        });
    
        when(this.frothingBerserkerUptime).isLessThan(minor)
          .addSuggestion((suggest, actual, recommended) => {
            return suggest(<>Your <SpellLink id={SPELLS.FROTHING_BERSERKER.id} /> uptime can be improved.</>)
              .icon(SPELLS.FROTHING_BERSERKER.icon)
              .actual(`${formatPercentage(actual)}% Frothing Berserker uptime`)
              .recommended(`>${formatPercentage(recommended)}% is recommended`)
              .regular(average).major(major)
              .extraSuggestion();
          });
      }

    statistic() {
        return (
            <TalentStatisticBox
              talent={SPELLS.FROTHING_BERSERKER_TALENT.id}
              value={`${formatPercentage(this.uptimePercent)}% uptime`}
              label="Frothing Berserker"
              tooltip={`Frothing Berserker contributed to ${formatPercentage(this.damagePercent)}% of your overall DPS.`}
            />
        );
    }
}

export default FrothingBerserker;