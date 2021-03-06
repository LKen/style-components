var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Transition from '../Transition/transition';
import useDebounce from '../../hooks/useDebounce';
import Input from '../Input/Input';
import Icon from '../Icon/icon';
import classNames from 'classnames';
import useClickOutside from '../../hooks/useClickOutside';
export var AutoComplete = function (props) {
    var fetchSuggestions = props.fetchSuggestions, onSelect = props.onSelect, value = props.value, renderOption = props.renderOption, restProps = __rest(props, ["fetchSuggestions", "onSelect", "value", "renderOption"]);
    var _a = useState(value), inputValue = _a[0], setInputValue = _a[1];
    var _b = useState([]), suggestions = _b[0], setSuggestions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), showDropdown = _d[0], setShowDropdown = _d[1];
    var _e = useState(-1), highlightIndex = _e[0], setHighlightIndex = _e[1];
    var triggerSearch = useRef(false);
    var componentRef = useRef(null);
    var debounceValue = useDebounce(inputValue);
    var handleChange = function (e) {
        var value = e.target.value.trim();
        setInputValue(value);
        triggerSearch.current = true;
    };
    var handleKeyDown = function (e) {
        switch (e.keyCode) {
            case 13: // center
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            case 38: // up
                setHighlightIndex(highlightIndex - 1);
                break;
            case 40: // down
                setHighlightIndex(highlightIndex + 1);
                break;
            case 27: // esc
                setShowDropdown(false);
                break;
        }
    };
    var handleSelect = function (item) {
        setInputValue(item.value);
        setShowDropdown(false);
        if (onSelect) {
            onSelect(item);
        }
        triggerSearch.current = false;
    };
    var renderTemplate = function (item) {
        return renderOption ? renderOption(item) : item.value;
    };
    var generateDropdown = function () { return (_jsx(Transition, __assign({ in: showDropdown || loading, animation: "zoom-in-top", timeout: 300, onExited: function () { return setSuggestions([]); } }, { children: _jsxs("ul", __assign({ className: "g-suggestion-list" }, { children: [loading && (_jsx("div", __assign({ className: "suggestions-loading-icon" }, { children: _jsx(Icon, { icon: "spinner", spin: true }, void 0) }), void 0)),
                Array.isArray(suggestions) &&
                    suggestions.map(function (item, index) {
                        var cnames = classNames('suggestion-item', {
                            'is-active': index === highlightIndex
                        });
                        return (_jsx("li", __assign({ className: cnames, onClick: function () { return handleSelect(item); } }, { children: renderTemplate(item) }), index));
                    })] }), void 0) }), void 0)); };
    useClickOutside(componentRef, function () {
        setShowDropdown(false);
        setSuggestions([]);
    });
    useEffect(function () {
        if (debounceValue && triggerSearch.current) {
            setSuggestions([]);
            var results = fetchSuggestions(debounceValue);
            if (results instanceof Promise) {
                setLoading(true);
                results.then(function (data) {
                    setLoading(false);
                    setSuggestions(data);
                    if (data.length > 0) {
                        // open dropdown - menu
                        setShowDropdown(true);
                    }
                });
            }
            else {
                setSuggestions(results);
                // open dropdown menu
                if (results.length > 0)
                    setShowDropdown(true);
            }
        }
        else {
            setShowDropdown(false);
        }
        setHighlightIndex(-1);
    }, [debounceValue, fetchSuggestions]);
    return (_jsxs("div", __assign({ ref: componentRef, className: "g-auto-complete" }, { children: [_jsx(Input, __assign({ value: inputValue, onChange: handleChange, onKeyDown: handleKeyDown }, restProps), void 0), generateDropdown()] }), void 0));
};
export default AutoComplete;
