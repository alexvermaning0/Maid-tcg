import {CARDS, ITEM_CARDS} from '../cards'
import {getCardPos} from '../models/card-pos-model'
import {GameModel} from '../models/game-model'
import {RowPos} from '../types/cards'
import {
	CardT,
	GenericActionResult,
	PlayerState,
	RowState,
	RowStateWithHermit,
} from '../types/game-state'
import {PickedSlots} from '../types/pick-process'

export function getActiveRow(playerState: PlayerState) {
	if (playerState.board.activeRow === null) return null
	const row = playerState.board.rows[playerState.board.activeRow]
	if (!row.hermitCard) return null
	return row
}

export function getActiveRowPos(playerState: PlayerState): RowPos | null {
	const rowIndex = playerState.board.activeRow
	if (rowIndex === null) return null
	const row = playerState.board.rows[rowIndex]
	if (!row.hermitCard) return null
	return {
		player: playerState,
		rowIndex,
		row,
	}
}

export function rowHasItem(row: RowState): boolean {
	const itemCards = row.itemCards
	let total = 0
	for (const itemCard of itemCards) {
		if (!itemCard) continue
		const cardInfo = ITEM_CARDS[itemCard.cardId]
		// String
		if (!cardInfo) continue
		total += 1
	}

	return total > 0
}

export function rowHasEmptyItemSlot(row: RowStateWithHermit): boolean {
	return row.itemCards.filter((card) => !card).length > 0
}

export function isRowFull(row: RowStateWithHermit): boolean {
	return row.itemCards.filter((card) => !!card).length === 3
}

export function isRowEmpty(row: RowStateWithHermit): boolean {
	return row.itemCards.filter((card) => !!card).length === 0
}

export function getNonEmptyRows(
	playerState: PlayerState,
	includeActive: boolean = true
): Array<RowPos> {
	const rows: Array<RowPos> = []
	const activeRowIndex = playerState.board.activeRow
	for (let i = 0; i < playerState.board.rows.length; i++) {
		const row = playerState.board.rows[i]
		if (i === activeRowIndex && !includeActive) continue
		if (row.hermitCard) rows.push({player: playerState, rowIndex: i, row})
	}
	return rows
}

export function getRowsWithEmptyItemsSlots(
	playerState: PlayerState,
	includeActive: boolean = true
): RowStateWithHermit[] {
	const result: Array<RowStateWithHermit> = []
	const activeRow = playerState.board.activeRow
	const rows = playerState.board.rows
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]
		if (i === activeRow && !includeActive) continue
		if (row.hermitCard && !isRowFull(row)) result.push(row)
	}
	return result
}

export function getAdjacentRows(playerState: PlayerState): Array<RowStateWithHermit[]> {
	const result: Array<RowStateWithHermit[]> = []
	const rows = playerState.board.rows
	for (let i = 1; i < rows.length + 1; i++) {
		const row = rows[i]
		const prevRow = rows[i - 1]
		if (row && prevRow && row.hermitCard && prevRow.hermitCard) result.push([prevRow, row])
	}
	return result
}

export function hasSingleUse(playerState: PlayerState, id: string, isUsed: boolean = false) {
	const suCard = playerState.board.singleUseCard
	const suUsed = playerState.board.singleUseCardUsed
	return suCard?.cardId === id && suUsed === isUsed
}

export function applySingleUse(
	game: GameModel,
	pickedSlots: PickedSlots = {},
	modalResult: any = null
): GenericActionResult {
	const {currentPlayer} = game

	const suCard = currentPlayer.board.singleUseCard
	if (!suCard) return 'FAILURE_NOT_APPLICABLE'
	const pos = getCardPos(game, suCard.cardInstance)
	if (!pos) return 'FAILURE_UNKNOWN_ERROR'

	const cardInstance = currentPlayer.board.singleUseCard?.cardInstance
	if (!cardInstance) return 'FAILURE_NOT_APPLICABLE'

	currentPlayer.hooks.beforeApply.call(pickedSlots)

	currentPlayer.board.singleUseCardUsed = true

	currentPlayer.hooks.onApply.call(pickedSlots)

	// This can only be done once per turn
	game.addCompletedActions('PLAY_SINGLE_USE_CARD')

	currentPlayer.hooks.afterApply.call(pickedSlots)

	return 'SUCCESS'
}

export function canAttachToCard(
	game: GameModel,
	card: CardT | null,
	cardAttaching: CardT | null
): boolean {
	if (!card || !cardAttaching) return false

	const cardAttachingPos = getCardPos(game, cardAttaching.cardInstance)
	const cardInfo = CARDS[card.cardId]
	if (!cardAttachingPos || !cardInfo) return false

	if (!cardInfo.canAttachToCard(game, cardAttachingPos)) return false

	return true
}
