import { useMemo, useState } from 'react'
import { Button, Card, Space, Tag, Typography } from 'antd'

const BOARD_SIZE = 15
const WIN_LENGTH = 5

type Player = 'black' | 'white'
type CellValue = Player | null
type Move = {
  row: number
  col: number
  player: Player
}

const directions = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<CellValue>(BOARD_SIZE).fill(null)
  )
}

function countInDirection(
  board: CellValue[][],
  row: number,
  col: number,
  player: Player,
  rowStep: number,
  colStep: number
) {
  let count = 0
  let currentRow = row + rowStep
  let currentCol = col + colStep

  while (
    currentRow >= 0 &&
    currentRow < BOARD_SIZE &&
    currentCol >= 0 &&
    currentCol < BOARD_SIZE &&
    board[currentRow][currentCol] === player
  ) {
    count += 1
    currentRow += rowStep
    currentCol += colStep
  }

  return count
}

function getWinningLine(
  board: CellValue[][],
  row: number,
  col: number,
  player: Player
) {
  for (const [rowStep, colStep] of directions) {
    const forward = countInDirection(board, row, col, player, rowStep, colStep)
    const backward = countInDirection(
      board,
      row,
      col,
      player,
      -rowStep,
      -colStep
    )

    if (forward + backward + 1 >= WIN_LENGTH) {
      const line = [{ row, col }]

      for (let i = 1; i <= backward; i += 1) {
        line.unshift({ row: row - rowStep * i, col: col - colStep * i })
      }

      for (let i = 1; i <= forward; i += 1) {
        line.push({ row: row + rowStep * i, col: col + colStep * i })
      }

      return line.slice(0, WIN_LENGTH)
    }
  }

  return []
}

function Gomoku() {
  const [board, setBoard] = useState<CellValue[][]>(createBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')
  const [winner, setWinner] = useState<Player | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [winningCells, setWinningCells] = useState<string[]>([])

  const boardFull = useMemo(
    () => board.every((row) => row.every((cell) => cell !== null)),
    [board]
  )

  const statusText = winner
    ? `${winner === 'black' ? '黑子' : '白子'}获胜`
    : boardFull
      ? '平局'
      : `当前落子: ${currentPlayer === 'black' ? '黑子' : '白子'}`

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winner) {
      return
    }

    const nextBoard = board.map((boardRow) => [...boardRow])
    nextBoard[row][col] = currentPlayer

    const line = getWinningLine(nextBoard, row, col, currentPlayer)

    setBoard(nextBoard)
    setMoves((prev) => [...prev, { row, col, player: currentPlayer }])

    if (line.length > 0) {
      setWinner(currentPlayer)
      setWinningCells(line.map((cell) => `${cell.row}-${cell.col}`))
      return
    }

    setCurrentPlayer((prev) => (prev === 'black' ? 'white' : 'black'))
  }

  const handleReset = () => {
    setBoard(createBoard())
    setCurrentPlayer('black')
    setWinner(null)
    setMoves([])
    setWinningCells([])
  }

  const handleUndo = () => {
    if (moves.length === 0) {
      return
    }

    const lastMove = moves[moves.length - 1]
    const nextBoard = board.map((boardRow) => [...boardRow])
    nextBoard[lastMove.row][lastMove.col] = null

    setBoard(nextBoard)
    setMoves((prev) => prev.slice(0, -1))
    setCurrentPlayer(lastMove.player)
    setWinner(null)
    setWinningCells([])
  }

  return (
    <div
      style={{
        minHeight: '100%',
        padding: 24,
        color: '#f5ead6',
        background:
          'radial-gradient(circle at top, #43311f 0%, #241912 42%, #15110e 100%)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) 360px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <Card
          bordered={false}
          style={{
            background:
              'linear-gradient(145deg, rgba(244, 210, 157, 0.96), rgba(196, 144, 84, 0.96))',
            borderRadius: 28,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
          }}
          bodyStyle={{ padding: 28 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(18px, 1fr))`,
              aspectRatio: '1 / 1',
              width: '100%',
              maxWidth: 760,
              margin: '0 auto',
              border: '2px solid rgba(91, 55, 27, 0.75)',
              background:
                'linear-gradient(180deg, rgba(121, 76, 37, 0.16), rgba(255, 255, 255, 0.06))',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isWinningCell = winningCells.includes(
                  `${rowIndex}-${colIndex}`
                )

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      position: 'relative',
                      padding: 0,
                      borderRadius: 0,
                      border: '1px solid rgba(91, 55, 27, 0.38)',
                      background: 'transparent',
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '50% auto auto 50%',
                        width: '76%',
                        height: '76%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        opacity: cell ? 1 : 0,
                        background:
                          cell === 'black'
                            ? 'radial-gradient(circle at 30% 30%, #666, #1f1f1f 52%, #050505 100%)'
                            : 'radial-gradient(circle at 30% 30%, #fffef9, #dfd7c8 56%, #b8ad9b 100%)',
                        boxShadow: isWinningCell
                          ? '0 0 0 4px rgba(255, 93, 31, 0.22), 0 0 18px rgba(255, 93, 31, 0.9)'
                          : cell === 'black'
                            ? '0 8px 14px rgba(0, 0, 0, 0.34)'
                            : '0 8px 14px rgba(71, 47, 29, 0.18)',
                        transition: 'all 0.2s ease',
                      }}
                    />
                    {rowIndex === Math.floor(BOARD_SIZE / 2) &&
                    colIndex === Math.floor(BOARD_SIZE / 2) ? (
                      <span
                        style={{
                          position: 'absolute',
                          inset: '50% auto auto 50%',
                          width: 7,
                          height: 7,
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '50%',
                          background: '#724a27',
                        }}
                      />
                    ) : null}
                  </button>
                )
              })
            )}
          </div>
        </Card>

        <div style={{ display: 'grid', gap: 20 }}>
          <Card
            bordered={false}
            style={{
              borderRadius: 28,
              background: 'rgba(24, 17, 13, 0.86)',
              color: '#f8ead3',
              boxShadow: '0 18px 45px rgba(0, 0, 0, 0.24)',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <div>
                <Typography.Title
                  level={2}
                  style={{ margin: 0, color: '#fff1d6', fontFamily: 'KaiTi, STKaiti, serif' }}
                >
                  五子棋
                </Typography.Title>
                <Typography.Paragraph
                  style={{ margin: '8px 0 0', color: '#d7c1a0' }}
                >
                  双人对弈，黑子先行。连成五子即可获胜。
                </Typography.Paragraph>
              </div>

              <Space wrap>
                <Tag
                  color={winner ? 'success' : 'processing'}
                  style={{ padding: '6px 12px', fontSize: 14 }}
                >
                  {statusText}
                </Tag>
                <Tag style={{ padding: '6px 12px', fontSize: 14 }}>
                  总手数: {moves.length}
                </Tag>
              </Space>

              <Space wrap>
                <Button type="primary" size="large" onClick={handleReset}>
                  重新开始
                </Button>
                <Button size="large" onClick={handleUndo} disabled={moves.length === 0}>
                  悔棋一步
                </Button>
              </Space>
            </Space>
          </Card>

          <Card
            bordered={false}
            style={{
              borderRadius: 28,
              background: 'rgba(24, 17, 13, 0.86)',
              color: '#f8ead3',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Typography.Title level={4} style={{ marginTop: 0, color: '#fff1d6' }}>
              对局记录
            </Typography.Title>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
                maxHeight: 420,
                overflowY: 'auto',
              }}
            >
              {moves.length === 0 ? (
                <Typography.Text style={{ color: '#d7c1a0' }}>
                  还没有落子，点击棋盘开始。
                </Typography.Text>
              ) : (
                moves.map((move, index) => (
                  <div
                    key={`${move.row}-${move.col}-${index}`}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#f7ebd7',
                    }}
                  >
                    第 {index + 1} 手 · {move.player === 'black' ? '黑子' : '白子'}
                    <div style={{ marginTop: 4, color: '#d7c1a0' }}>
                      {move.row + 1} 行 {move.col + 1} 列
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Gomoku
