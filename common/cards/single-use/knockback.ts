import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'
import {applySingleUse, getActiveRow, getNonEmptyRows} from '../../utils/board'
import SingleUseCard from '../base/single-use-card'

class KnockbackSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'knockback',
			numericId: 73,
			name: 'Knockback',
			rarity: 'rare',
			description:
				'After attack, your opponent must choose an AFK Hermit to replace their active Hermit, unless they have no AFK Hermits. ',
		})
	}

	override canAttach(game: GameModel, pos: CardPosModel) {
		const canAttach = super.canAttach(game, pos)
		if (canAttach !== 'YES') return canAttach

		const {opponentPlayer} = pos

		// Check if there is an AFK Hermit
		const inactiveRows = getNonEmptyRows(opponentPlayer, false)
		if (inactiveRows.length === 0) return 'NO'

		return 'YES'
	}

	override onAttach(game: GameModel, instance: string, pos: CardPosModel) {
		const {player, opponentPlayer} = pos

		player.hooks.afterAttack.add(instance, (attack) => {
			applySingleUse(game)

			// Only Apply this for the first attack
			player.hooks.afterAttack.remove(instance)
		})

		player.hooks.onApply.add(instance, (pickedSlots) => {
			const activeRow = getActiveRow(opponentPlayer)

			if (activeRow && activeRow.health) {
				activeRow.ailments.push({id: 'knockedout', duration: 1})
				opponentPlayer.board.activeRow = null
			}
		})
	}

	override onDetach(game: GameModel, instance: string, pos: CardPosModel) {
		const {player} = pos
		player.hooks.afterAttack.remove(instance)
		player.hooks.onApply.remove(instance)
	}
}

export default KnockbackSingleUseCard
