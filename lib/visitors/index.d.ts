export declare const cjs2esmVisitors: {
    VariableDeclaration(path: any): void;
    CallExpression(path: any): void;
    AssignmentExpression(path: any): void;
};
export declare const namespaceImportVisitors: (importFromInclude: string[]) => {
    ImportDeclaration(path: any): void;
};
