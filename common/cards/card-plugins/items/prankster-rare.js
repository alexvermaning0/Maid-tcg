import ItemCard from './_item-card'

class PranksterRareItemCard extends ItemCard {
	constructor() {
		super({
			id: 'item-prankster-rare',
			name: 'Prankster',
			rarity: 'rare',
			hermitType: 'prankster',
		})
	}

	register(game) {}
}

export default PranksterRareItemCard
