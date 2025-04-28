import { FastifyRequest, FastifyReply } from "fastify"

async function validateBearerToken(request: FastifyRequest, reply: FastifyReply) {
    const secret = request.headers.authorization.split(' ')[1]
    if (secret !== process.env.API_KEY) {
        reply.send({ message: 'Unauthorized, please provide a valid secret.', statusCode: 401 })
    }
}

export { validateBearerToken }