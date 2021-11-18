/**
 *
 * @param sourceDir
 * @returns
 */
export declare function cjs2esmVitePlugin({ sourceDir }?: {
    sourceDir?: string;
}): {
    name: string;
    transform(src: any, id: any): import("@babel/generator").GeneratorResult;
};
export declare function cjs2esm4esbuild(include?: string[]): {
    name: string;
    setup(build: any): void;
};
export declare function transformNamespaceImport4esbuild({ include, importFromInclude }: {
    include: string[];
    importFromInclude: string[];
}): {
    name: string;
    setup(build: any): void;
};
export { transformFiles } from './scripts';
