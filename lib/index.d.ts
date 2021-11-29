/**
 *
 * @param sourceDir
 * @returns
 */
export declare function cjs2esm({ include, importFromInclude }: {
    include?: string[];
    importFromInclude?: string[];
}): {
    name: string;
    transform(sourceCode: any, id: any): import("@babel/generator").GeneratorResult;
};
export declare function cjs2esm4esbuild(include?: string[]): {
    name: string;
    setup(build: any): void;
};
export declare function transformNamespaceImport({ include, importFromInclude }: {
    include?: string[];
    importFromInclude?: string[];
}): {
    name: string;
    transform(sourceCode: any, id: any): import("@babel/generator").GeneratorResult;
};
export declare function transformNamespaceImport4esbuild({ include, importFromInclude }: {
    include?: string[];
    importFromInclude?: string[];
}): {
    name: string;
    setup(build: any): void;
};
export { transformFiles } from './scripts';
