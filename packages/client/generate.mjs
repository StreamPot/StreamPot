import { Project } from "ts-morph";

const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
    addFilesFromTsConfig: true,
});

project.addSourceFileAtPath('src/filters.ts')

const sourceFile = project.addSourceFileAtPath("src/index.d.ts");

sourceFile.addImportDeclarations([
    {
        moduleSpecifier: "./filters.ts",
        namedImports: ["AudioVideoFilter", "FilterSpecification"]
    }
]);

const classDeclaration = sourceFile.getClassOrThrow("StreamPot");

const output = project.createSourceFile("src/index.generated.ts", "", { overwrite: true });

output.addStatements(`export default class StreamPot {
    protected secret: string;
    protected baseUrl: string;
    protected actions: any[] = [];

    constructor({ secret, baseUrl = 'http://localhost:3000' }: { secret: string, baseUrl?: string }) {
        this.secret = secret;
        this.baseUrl = baseUrl;
    }

    protected addAction(name: string, ...values: any) {
        this.actions.push({ name, values });
    }`);

classDeclaration.getMethods().forEach(method => {
    const methodParameters = method.getParameters().map(param => `${param.getName()}: ${param.getType().getText()}`);

    method.getParameters().forEach(param => {
        console.log(param.getType().getText())
    });

    const methodName = method.getName();

    const actionParameters = method.getParameters().map(param => param.getName());

    output.addStatements(`
    public ${methodName}(${methodParameters.join(", ")}) {
        this.addAction('${methodName}'${actionParameters.length > 0 ? ', ' + actionParameters.join(", ") : ''});
        return this;
    }`);
});

output.addStatements(`}`);
output.saveSync();
