import { getContext} from "hono/context-storage"

export const generateKarabinerURL = (url: string) => {
    const targetUrl = `${new URL(getContext().req.url).origin}${url}`
    return `karabiner://karabiner/assets/complex_modifications/import?url=${targetUrl}`
}