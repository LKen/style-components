import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
function useDebounce(value, delay) {
    if (delay === void 0) { delay = 300; }
    var _a = useState(value), debounceValue = _a[0], setDebounceValue = _a[1];
    useEffect(function () {
        // 方式一
        var handler = debounce(function (v) {
            setDebounceValue(v);
        }, delay, { leading: false, trailing: true });
        handler(value);
        return handler.cancel;
    }, [value, delay]);
    // 方式二
    // useEffect(() => {
    //   const handler = setTimeout(() => {
    //     setDebounceValue(value)
    //   }, delay)
    //   return () => window.clearTimeout(handler)
    // }, [value, delay])
    return debounceValue;
}
export default useDebounce;
