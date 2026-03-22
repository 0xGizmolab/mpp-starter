// Works in both Deno and Node
const getEnv = (key: string, fallback: string) => {
  if (typeof Deno !== 'undefined') {
    return Deno.env.get(key) ?? fallback
  }
  return process.env[key] ?? fallback
}

export const mppConfig = {
  recipient: getEnv('MPP_RECIPIENT', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
  currency: getEnv('MPP_CURRENCY', '0x20c0000000000000000000000000000000000000'),
  amount: getEnv('MPP_AMOUNT', '0.01'),
}
