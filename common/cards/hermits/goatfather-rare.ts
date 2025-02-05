import {AttackModel} from '../../models/attack-model'
import {CardPosModel} from '../../models/card-pos-model'
import {GameModel} from '../../models/game-model'
import {HermitAttackType} from '../../types/attack'
import {PickedSlots} from '../../types/pick-process'
import {flipCoin} from '../../utils/coinFlips'
import HermitCard from '../base/hermit-card'

class GoatfatherRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'goatfather_rare',
			numericId: 129,
			name: 'Goatfather',
			rarity: 'rare',
			hermitType: 'prankster',
			health: 270,
			primary: {
				name: 'Omerta',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'Anvil Drop',
				cost: ['prankster', 'prankster'],
				damage: 80,
				power:
					"Flip a coin. If heads, do an additional 30hp damage to your opponent's active Hermit and 10hp damage to each Hermit directly below it.",
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

		const {player, opponentPlayer, row, rowIndex} = pos

		if (attacks[0].type !== 'secondary') return attacks

		const coinFlip = flipCoin(player, this.id)

		if (coinFlip[0] === 'tails') return attacks

		const activeRow = opponentPlayer.board.activeRow
		const rows = opponentPlayer.board.rows
		if (activeRow === null || rowIndex === null || !row || !row.hermitCard) return attacks
		for (let i = activeRow; i < rows.length; i++) {
			const targetRow = rows[i]
			if (!targetRow.hermitCard) continue

			const attack = new AttackModel({
				id: this.getInstanceKey(instance),
				attacker: {
					player,
					rowIndex: rowIndex,
					row: row,
				},
				target: {
					player: opponentPlayer,
					rowIndex: i,
					row: targetRow,
				},
				type: hermitAttackType,
			}).addDamage(this.id, activeRow === i ? 30 : 10)
			attacks.push(attack)
		}

		return attacks
	}

	override getExpansion() {
		return 'alter_egos'
	}

	override getPalette() {
		return 'alter_egos'
	}

	override getBackground() {
		return 'alter_egos_background'
	}
}

export default GoatfatherRareHermitCard
