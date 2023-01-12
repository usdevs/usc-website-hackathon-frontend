export {};

declare global {
    interface ButtonInfo {
        name: string,
        link: string
    }

    interface IGInfo {
        contact: string,
        invite_link: string,
        image: string,
        title: string,
        description: string,
        category: string
    }
}
