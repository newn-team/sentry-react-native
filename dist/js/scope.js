import { Scope } from "@sentry/hub";
import { NATIVE } from "./wrapper";
/**
 * Extends the scope methods to set scope on the Native SDKs
 */
export class ReactNativeScope extends Scope {
    /**
     * @inheritDoc
     */
    setUser(user) {
        NATIVE.setUser(user);
        return super.setUser(user);
    }
    /**
     * @inheritDoc
     */
    setTag(key, value) {
        NATIVE.setTag(key, value);
        return super.setTag(key, value);
    }
    /**
     * @inheritDoc
     */
    setTags(tags) {
        // As native only has setTag, we just loop through each tag key.
        Object.keys(tags).forEach((key) => {
            NATIVE.setTag(key, tags[key]);
        });
        return super.setTags(tags);
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setExtras(extras) {
        Object.keys(extras).forEach((key) => {
            NATIVE.setExtra(key, extras[key]);
        });
        return super.setExtras(extras);
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    setExtra(key, extra) {
        NATIVE.setExtra(key, extra);
        return super.setExtra(key, extra);
    }
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        NATIVE.addBreadcrumb(breadcrumb);
        return super.addBreadcrumb(breadcrumb, maxBreadcrumbs);
    }
    /**
     * @inheritDoc
     */
    clearBreadcrumbs() {
        NATIVE.clearBreadcrumbs();
        return super.clearBreadcrumbs();
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setContext(key, context) {
        NATIVE.setContext(key, context);
        return super.setContext(key, context);
    }
}
//# sourceMappingURL=scope.js.map