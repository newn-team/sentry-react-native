import { logger } from "@sentry/utils";
import { InternalRoutingInstrumentation, } from "./routingInstrumentation";
import { getBlankTransactionContext } from "./utils";
const defaultOptions = {
    routeChangeTimeoutMs: 1000,
};
/**
 * Instrumentation for React Native Navigation. See docs or sample app for usage.
 *
 * How this works:
 * - `_onCommand` is called every time a commands happens and sets an IdleTransaction on the scope without any route context.
 * - `_onComponentWillAppear` is then called AFTER the state change happens due to a dispatch and sets the route context onto the active transaction.
 * - If `_onComponentWillAppear` isn't called within `options.routeChangeTimeoutMs` of the dispatch, then the transaction is not sampled and finished.
 */
export class ReactNativeNavigationInstrumentation extends InternalRoutingInstrumentation {
    constructor(
    /** The react native navigation `NavigationDelegate`. This is usually the import named `Navigation`. */
    navigation, options = {}) {
        super();
        this._prevComponentEvent = null;
        this._recentComponentIds = [];
        this._navigation = navigation;
        this._options = Object.assign(Object.assign({}, defaultOptions), options);
    }
    /**
     * Registers the event listeners for React Native Navigation
     */
    registerRoutingInstrumentation(listener, beforeNavigate, onConfirmRoute) {
        super.registerRoutingInstrumentation(listener, beforeNavigate, onConfirmRoute);
        this._navigation
            .events()
            .registerCommandListener(this._onCommand.bind(this));
        this._navigation
            .events()
            .registerComponentWillAppearListener(this._onComponentWillAppear.bind(this));
    }
    /**
     * To be called when a navigation command is dispatched
     */
    _onCommand() {
        if (this._latestTransaction) {
            this._discardLatestTransaction();
        }
        this._latestTransaction = this.onRouteWillChange(getBlankTransactionContext(ReactNativeNavigationInstrumentation.name));
        this._stateChangeTimeout = setTimeout(this._discardLatestTransaction.bind(this), this._options.routeChangeTimeoutMs);
    }
    /**
     * To be called AFTER the state has been changed to populate the transaction with the current route.
     */
    _onComponentWillAppear(event) {
        var _a, _b, _c;
        // If the route is a different key, this is so we ignore actions that pertain to the same screen.
        if (this._latestTransaction &&
            (!this._prevComponentEvent ||
                event.componentId != this._prevComponentEvent.componentId)) {
            this._clearStateChangeTimeout();
            const originalContext = this._latestTransaction.toContext();
            const routeHasBeenSeen = this._recentComponentIds.includes(event.componentId);
            const data = Object.assign(Object.assign({}, originalContext.data), { route: Object.assign(Object.assign({}, event), { name: event.componentName, hasBeenSeen: routeHasBeenSeen }), previousRoute: this._prevComponentEvent
                    ? Object.assign(Object.assign({}, this._prevComponentEvent), { name: (_a = this._prevComponentEvent) === null || _a === void 0 ? void 0 : _a.componentName }) : null });
            const updatedContext = Object.assign(Object.assign({}, originalContext), { name: event.componentName, tags: Object.assign(Object.assign({}, originalContext.tags), { "routing.route.name": event.componentName }), data });
            let finalContext = (_b = this._beforeNavigate) === null || _b === void 0 ? void 0 : _b.call(this, updatedContext);
            // This block is to catch users not returning a transaction context
            if (!finalContext) {
                logger.error(`[${ReactNativeNavigationInstrumentation.name}] beforeNavigate returned ${finalContext}, return context.sampled = false to not send transaction.`);
                finalContext = Object.assign(Object.assign({}, updatedContext), { sampled: false });
            }
            if (finalContext.sampled === false) {
                logger.log(`[${ReactNativeNavigationInstrumentation.name}] Will not send transaction "${finalContext.name}" due to beforeNavigate.`);
            }
            this._latestTransaction.updateWithContext(finalContext);
            (_c = this._onConfirmRoute) === null || _c === void 0 ? void 0 : _c.call(this, finalContext);
            this._prevComponentEvent = event;
        }
        else {
            this._discardLatestTransaction();
        }
    }
    /** Cancels the latest transaction so it does not get sent to Sentry. */
    _discardLatestTransaction() {
        if (this._latestTransaction) {
            this._latestTransaction.sampled = false;
            this._latestTransaction.finish();
            this._latestTransaction = undefined;
        }
        this._clearStateChangeTimeout();
    }
    /** Cancels the latest transaction so it does not get sent to Sentry. */
    _clearStateChangeTimeout() {
        if (typeof this._stateChangeTimeout !== "undefined") {
            clearTimeout(this._stateChangeTimeout);
            this._stateChangeTimeout = undefined;
        }
    }
}
ReactNativeNavigationInstrumentation.instrumentationName = "react-native-navigation";
//# sourceMappingURL=reactnativenavigation.js.map