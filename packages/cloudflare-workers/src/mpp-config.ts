export interface Env {
  MPP_RECIPIENT: string
  MPP_CURRENCY: string
  MPP_AMOUNT: string
}

export function getMppConfig(env: Env) {
  return {
    recipient: env.MPP_RECIPIENT ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    currency: env.MPP_CURRENCY ?? '0x20c0000000000000000000000000000000000000',
    amount: env.MPP_AMOUNT ?? '0.01',
  }
}
