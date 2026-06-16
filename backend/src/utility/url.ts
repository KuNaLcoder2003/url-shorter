import { customAlphabet } from "nanoid"
export const generateShortUrl = (url: string) => {
    const domain = url.split('https://').at(-1)?.split('/').map(item => {
        if (item == '/') {
            item = ''
            return item
        }
        else {
            return item
        }
    }).join('').replaceAll(".", "")
    const nanoId = customAlphabet(domain as string, 9)
    const id = nanoId()
    return id
}
