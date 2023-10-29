/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import PauseModal from './PauseModal'

function RoundStartModal ({ open, handleReady, pauseCountdown, roundInfo }) {
  console.log('roundInfo', roundInfo)
  return (
    <PauseModal open={open} pauseCountdown={pauseCountdown} handleReady={handleReady}>
      <div>
        <h1 id="modal-modal-title">{`Round ${Number(roundInfo?.level) - 1} Complete!`}</h1>
        <h2>{`Ready for round ${roundInfo?.level}?`}</h2>
      </div>
    </PauseModal>
  )
}
export default RoundStartModal
