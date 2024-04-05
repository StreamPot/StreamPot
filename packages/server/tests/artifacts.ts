import fs from 'fs'

export const doesArtifactExist = (path: string) => fs.existsSync(path)

export const cleanUpArtifact = (path: string) => fs.unlinkSync(path)

export const getArtifactPath = (name: string) => `./tests/artifacts/${name}`