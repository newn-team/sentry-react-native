import { Hub } from "@sentry/hub";
import { RequestInstrumentationOptions, Transaction } from "@sentry/tracing";
import { EventProcessor, Integration, TransactionContext } from "@sentry/types";
import { RoutingInstrumentationInstance } from "../tracing/routingInstrumentation";
import { NativeFramesInstrumentation } from "./nativeframes";
import { StallTrackingInstrumentation } from "./stalltracking";
export declare type BeforeNavigate = (context: TransactionContext) => TransactionContext;
export interface ReactNativeTracingOptions extends RequestInstrumentationOptions {
    /**
     * The time to wait in ms until the transaction will be finished. The transaction will use the end timestamp of
     * the last finished span as the endtime for the transaction.
     * Time is in ms.
     *
     * Default: 1000
     */
    idleTimeout: number;
    /**
     * The maximum duration of a transaction before it will be marked as "deadline_exceeded".
     * If you never want to mark a transaction set it to 0.
     * Time is in seconds.
     *
     * Default: 600
     */
    maxTransactionDuration: number;
    /**
     * The routing instrumentation to be used with the tracing integration.
     * There is no routing instrumentation if nothing is passed.
     */
    routingInstrumentation?: RoutingInstrumentationInstance;
    /**
     * Does not sample transactions that are from routes that have been seen any more and don't have any spans.
     * This removes a lot of the clutter as most back navigation transactions are now ignored.
     *
     * Default: true
     */
    ignoreEmptyBackNavigationTransactions: boolean;
    /**
     * beforeNavigate is called before a navigation transaction is created and allows users to modify transaction
     * context data, or drop the transaction entirely (by setting `sampled = false` in the context).
     *
     * @param context: The context data which will be passed to `startTransaction` by default
     *
     * @returns A (potentially) modified context object, with `sampled = false` if the transaction should be dropped.
     */
    beforeNavigate: BeforeNavigate;
    /**
     * Track the app start time by adding measurements to the first route transaction. If there is no routing instrumentation
     * an app start transaction will be started.
     *
     * Default: true
     */
    enableAppStartTracking: boolean;
    /**
     * Track slow/frozen frames from the native layer and adds them as measurements to all transactions.
     */
    enableNativeFramesTracking: boolean;
    /**
     * Track when and how long the JS event loop stalls for. Adds stalls as measurements to all transactions.
     */
    enableStallTracking: boolean;
}
/**
 * Tracing integration for React Native.
 */
export declare class ReactNativeTracing implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    /** ReactNativeTracing options */
    options: ReactNativeTracingOptions;
    nativeFramesInstrumentation?: NativeFramesInstrumentation;
    stallTrackingInstrumentation?: StallTrackingInstrumentation;
    useAppStartWithProfiler: boolean;
    private _getCurrentHub?;
    private _awaitingAppStartData?;
    private _appStartFinishTimestamp?;
    constructor(options?: Partial<ReactNativeTracingOptions>);
    /**
     *  Registers routing and request instrumentation.
     */
    setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
    /**
     * To be called on a transaction start. Can have async methods
     */
    onTransactionStart(transaction: Transaction): void;
    /**
     * To be called on a transaction finish. Cannot have async methods.
     */
    onTransactionFinish(transaction: Transaction, endTimestamp?: number): void;
    /**
     * Called by the ReactNativeProfiler component on first component mount.
     */
    onAppStartFinish(endTimestamp: number): void;
    /**
     * Instruments the app start measurements on the first route transaction.
     * Starts a route transaction if there isn't routing instrumentation.
     */
    private _instrumentAppStart;
    /**
     * Adds app start measurements and starts a child span on a transaction.
     */
    private _addAppStartData;
    /** To be called when the route changes, but BEFORE the components of the new route mount. */
    private _onRouteWillChange;
    /**
     * Creates a breadcrumb and sets the current route as a tag.
     */
    private _onConfirmRoute;
    /** Create routing idle transaction. */
    private _createRouteTransaction;
}
//# sourceMappingURL=reactnativetracing.d.ts.map