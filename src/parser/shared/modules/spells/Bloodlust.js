import SPELLS from 'common/SPELLS';
import Module from 'parser/core/Module';
import Buffs, { BuffDuration } from 'parser/core/modules/Buffs';

export const HASTE_AMOUNTS = {
  [SPELLS.BLOODLUST.id]: 0.3,
  [SPELLS.HEROISM.id]: 0.3, // Alliance Bloodlust 🤢
  [SPELLS.TIME_WARP.id]: 0.3, // Mage
  [SPELLS.PRIMAL_RAGE.id]: 0.3, // Hunter pet BL
  [SPELLS.DRUMS_OF_FURY.id]: 0.25, // Legion Leatherworking crafted
  [SPELLS.DRUMS_OF_THE_MOUNTAIN.id]: 0.25, // Legion Leatherworking crafted
  [SPELLS.DRUMS_OF_RAGE.id]: 0.25, // Legion Leatherworking crafted
};
export const BUFFS = Object.keys(HASTE_AMOUNTS);

class Bloodlust extends Module {
  static dependencies = {
    buffs: Buffs,
  };

  constructor(options) {
    super(options);
    this.buffs.add({
      spell: BUFFS,
      duration: BuffDuration.STATIC(40000),
    });
  }
}

export default Bloodlust;
