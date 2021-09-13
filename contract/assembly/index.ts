// https://docs.near.org/docs/develop/contracts/as/intro

import { context, logging, storage, PersistentUnorderedMap } from 'near-sdk-as'

type AccountId = string;

interface Piece {
  owner: AccountId;
  mass: i32;
}

// interface IGameData {
//   id: string;
//   status: string;
//   players: (AccountId)[];
//   turn: AccountId;
//   winner: AccountId;
//   board: (Piece|null)[][];
// }

@nearBindgen
class GameData {
  id: string;
  status: string;
  players: (AccountId)[];
  turn: AccountId ;
  winner: AccountId;
  board: (Piece|null)[][];
  constructor(
    id: string,
    status: string,
    players: (AccountId)[],
    turn: AccountId,
    winner: AccountId,
    board: (Piece|null)[][],
  ) {
    this.id = id
    this.status = status
    this.players = players
    this.turn = turn
    this.winner = winner
    this.board = board
  }
}

const gameStorage = new PersistentUnorderedMap<string, GameData>('crosses-game')

const STATUS_PENDING:  string = 'PENDING'
const STATUS_RUNNING:  string = 'RUNNING'
const STATUS_FINISHED: string = 'FINISHED'

export function getOrInitGame(gameId: string): GameData {
  let game: GameData|null = gameStorage.get(gameId, null)
  if (game == null) {
    game = new GameData(
      gameId,
      STATUS_PENDING,
      [ context.sender, '' ],
      '',
      '',
      [ [null,null,null], [null,null,null], [null,null,null] ]
    )
    gameStorage.set(gameId, game)
  }
  return game
}

const DEFAULT_MESSAGE = 'Hello'

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const account_id = context.sender

  // Use logging.log to record logs permanently to the blockchain!
  logging.log(
    // String interpolation (`like ${this}`) is a work in progress:
    // https://github.com/AssemblyScript/assemblyscript/pull/1115
    'Saving greeting "' + message + '" for account "' + account_id + '"'
  )

  storage.set(account_id, message)
}
