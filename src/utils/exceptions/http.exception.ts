export default class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly status: number
    ) {
        console.log(message + "message")
        super(message);
    }
}
