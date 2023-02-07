import {GameState} from 'types/game-state'
import {CardT} from 'types/game-state'
import {PickProcessT, PickedCardT} from 'types/pick-process'

export const gameState = (gameState: GameState) => ({
	type: 'GAME_STATE' as const,
	payload: gameState,
})

export const gameStart = () => ({
	type: 'GAME_START' as const,
})

export const gameEnd = () => ({
	type: 'GAME_END' as const,
})

export const setSelectedCard = (card: CardT | null) => ({
	type: 'SET_SELECTED_CARD' as const,
	payload: card,
})

export const setOpenedModalId = (modalId: string | null) => ({
	type: 'SET_OPENED_MODAL_ID' as const,
	payload: modalId,
})

export const setPickProcess = (pickProcess: PickProcessT | null) => ({
	type: 'SET_PICK_PROCESS' as const,
	payload: pickProcess,
})

export const updatePickProcess = (
	currentReq: number,
	pickedCards: Array<PickedCardT>
) => ({
	type: 'UPDATE_PICK_PROCESS' as const,
	payload: {
		currentReq,
		pickedCards,
	},
})

export const slotPicked = (pickInfo: PickedCardT) => ({
	type: 'SLOT_PICKED' as const,
	payload: pickInfo,
})

export const forfeit = () => ({
	type: 'FORFEIT' as const,
})

export const startAttack = (type: 'zero' | 'primary' | 'secondary') => ({
	type: 'START_ATTACK' as const,
	payload: {type},
})

// ---

export const followUp = (payload: any) => ({
	type: 'FOLLOW_UP' as const,
	payload,
})

export const applyEffect = (payload: any) => ({
	type: 'APPLY_EFFECT' as const,
	payload,
})

export const removeEffect = () => ({
	type: 'REMOVE_EFFECT' as const,
})

export const changeActiveHermit = (payload: any) => ({
	type: 'CHANGE_ACTIVE_HERMIT' as const,
	payload,
})

export const playCard = (payload: any) => ({
	type: 'PLAY_CARD' as const,
	payload,
})

export const endTurn = () => ({
	type: 'END_TURN' as const,
})

export const attack = (
	type: 'zero' | 'primary' | 'secondary',
	pickedCards: Record<string, Array<CardT>>
) => ({
	type: 'ATTACK' as const,
	payload: {type, pickedCards},
})