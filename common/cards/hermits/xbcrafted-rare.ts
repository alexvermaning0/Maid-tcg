import {CardPosModel, getCardPos} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'
import {HermitAttackType} from '../../types/attack'
import {PickedSlots} from '../../types/pick-process'
import HermitCard from '../base/hermit-card'
import {createWeaknessAttack, isTargetingPos} from '../../utils/attacks'
import {getActiveRowPos} from '../../utils/board'
class XBCraftedRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'xbcrafted_rare',
			numericId: 110,
			name: 'XB',
			rarity: 'rare',
			hermitType: 'explorer',
			health: 270,
			primary: {
				name: 'Giggle',
				cost: ['explorer'],
				damage: 50,
				power: null,
			},
			secondary: {
				name: 'Noice!',
				cost: ['explorer', 'any'],
				damage: 70,
				power: "The opponent Hermit's attached effect card is ignored during this attack.",
			},
		})
	}

	override getAttacks(
		game: GameModel,
		instance: string,
		pos: CardPosModel,
		hermitAttackType: HermitAttackType,
		pickedSlots: PickedSlots
	) {
		const attacks = super.getAttacks(game, instance, pos, hermitAttackType, pickedSlots)

		if (attacks[0].type === 'secondary') {
			// Noice attack, set flag to ignore target effect card
			pos.player.custom[this.getInstanceKey(instance, 'ignore')] = true
		}

		const newAttacks = [attacks[0]]

		const weaknessAttack = createWeaknessAttack(attacks[0])
		if (weaknessAttack) newAttacks.push(weaknessAttack)

		return newAttacks
	}

	override onAttach(game: GameModel, instance: string, pos: CardPosModel) {
		const {player, opponentPlayer} = pos
		const ignoreKey = this.getInstanceKey(instance, 'ignore')

		player.hooks.beforeAttack.addBefore(instance, (attack) => {
			if (!player.custom[ignoreKey]) return
			const opponentActivePos = getActiveRowPos(opponentPlayer)
			if (!opponentActivePos) return

			// All attacks from our side should ignore opponent attached effect card this turn
			attack.shouldIgnoreCards.push((instance) => {
				const pos = getCardPos(game, instance)
				if (!pos || !attack.target) return false

				const isTargeting = isTargetingPos(attack, opponentActivePos)
				if (isTargeting && pos.slot.type === 'effect') {
					// It's the targets effect card, ignore it
					return true
				}

				return false
			})
		})

		player.hooks.afterAttack.add(instance, () => {
			// Remove ignore flag
			if (player.custom[ignoreKey]) {
				delete player.custom[ignoreKey]
			}
		})
	}

	override onDetach(game: GameModel, instance: string, pos: CardPosModel) {
		const {player} = pos

		// Remove hooks
		player.hooks.beforeAttack.remove(instance)
		player.hooks.afterAttack.remove(instance)
	}
}

export default XBCraftedRareHermitCard
