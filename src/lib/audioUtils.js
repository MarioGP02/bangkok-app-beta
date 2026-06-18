/**
 * Plays a two-tone notification chime using the Web Audio API.
 * Falls back silently if AudioContext is unavailable.
 */
export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    /**
     * Schedule a single sine tone.
     * @param {number} freq      - Frequency in Hz
     * @param {number} startAt   - Seconds from now
     * @param {number} length    - Duration in seconds
     */
    function tone(freq, startAt, length) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt)

      // Smooth attack → exponential decay
      gain.gain.setValueAtTime(0, ctx.currentTime + startAt)
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + startAt + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + length)

      osc.start(ctx.currentTime + startAt)
      osc.stop(ctx.currentTime + startAt + length + 0.01)
    }

    // Two ascending notes: A5 → E6
    tone(880,  0,    0.12)
    tone(1318, 0.13, 0.22)
  } catch (_) {
    // Audio not supported or blocked — fail silently
  }
}
