/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import PauseModal from './PauseModal'

function RoundStartModal ({ open, handleReady, pauseCountdown, roundInfo }) {
  console.log('roundInfo', roundInfo)
  return (
    <PauseModal open={open} pauseCountdown={pauseCountdown} handleReady={handleReady}>
      <div>
        <h1 id="modal-modal-title">{`Round ${roundInfo?.level?.numCards}`}</h1>
        <h2>Whoo you did it!</h2>
      </div>
    </PauseModal>
  )
}
export default RoundStartModal
