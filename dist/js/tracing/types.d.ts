import { TransactionContext } from "@sentry/types";
export interface ReactNavigationRoute {
    name: string;
    key: string;
    params: Record<string, any>;
}
export interface ReactNavigationCurrentRoute extends ReactNavigationRoute {
    hasBeenSeen: boolean;
}
export declare type RouteChangeContextData = {
    previousRoute?: {
        [key: string]: unknown;
        name: string;
    } | null;
    route: {
        [key: string]: unknown;
        name: string;
        hasBeenSeen: boolean;
    };
};
export interface ReactNavigationTransactionContext extends TransactionContext {
    tags: {
        "routing.instrumentation": string;
        "routing.route.name": string;
    };
    data: RouteChangeContextData;
}
//# sourceMappingURL=types.d.ts.map