export type ChakraColor = `${string}.${number}`

export const generateChakraColour = (n: number): ChakraColor => {
  const shades = [300, 400, 500, 600, 700]
  const colours = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink']

  const shade = shades[n % shades.length]
  const colour = colours[n % colours.length]

  return `${colour}.${shade}`
}
