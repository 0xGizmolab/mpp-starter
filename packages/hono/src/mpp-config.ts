export const mppConfig = {
  recipient: process.env.MPP_RECIPIENT ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  currency: process.env.MPP_CURRENCY ?? '0x20c0000000000000000000000000000000000000',
  amount: process.env.MPP_AMOUNT ?? '0.01',
  waitForConfirmation: process.env.MPP_WAIT_FOR_CONFIRMATION !== 'false',
}
