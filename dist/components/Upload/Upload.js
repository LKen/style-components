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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import UploadList from './UploadList';
import Dragger from './Dragger';
import axios from 'axios';
export var Upload = function (props) {
    var action = props.action, defaultFileList = props.defaultFileList, beforeUpload = props.beforeUpload, onError = props.onError, onProgress = props.onProgress, onSuccess = props.onSuccess, onChange = props.onChange, onRemove = props.onRemove, children = props.children, drag = props.drag, accept = props.accept, multiple = props.multiple, name = props.name, headers = props.headers, data = props.data, withCredentials = props.withCredentials;
    var fileInput = useRef(null);
    var _a = useState(defaultFileList || []), fileList = _a[0], setFileList = _a[1];
    var handleClick = function () {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    var handleFileChange = function (e) {
        var files = e.target.files;
        if (!files)
            return;
        uploadFiles(files);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };
    var uploadFiles = function (files) {
        var postFiles = Array.from(files);
        postFiles.forEach(function (file) {
            if (!beforeUpload) {
                post(file);
            }
            else {
                var result = beforeUpload(file);
                if (result && result instanceof Promise) {
                    result.then(function (processedFile) {
                        post(processedFile);
                    });
                }
                else if (result !== false) {
                    post(file);
                }
            }
        });
    };
    var updateFileList = function (updateFile, updateObj) {
        setFileList(function (prevFile) {
            return prevFile.map(function (file) {
                return file.uid === updateFile.uid ? __assign(__assign({}, file), updateObj) : file;
            });
        });
    };
    var handleRemove = function (file) {
        setFileList(function (prevList) {
            return prevList.filter(function (item) { return item.uid !== file.uid; });
        });
        if (onRemove)
            onRemove(file);
    };
    var post = function (file) {
        var _file = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        };
        setFileList(function (prevList) {
            return __spreadArray([_file], prevList);
        });
        var formData = new FormData();
        formData.append(name || 'file', file);
        if (data) {
            Object.keys(data).forEach(function (key) {
                formData.append(key, data[key]);
            });
        }
        axios
            .post(action, formData, {
            timeout: 30 * 1000,
            headers: __assign(__assign({}, headers), { 'Content-Type': 'multipart/form-data' }),
            withCredentials: withCredentials,
            onUploadProgress: function (e) {
                var percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    updateFileList(_file, { percent: percentage, status: 'uploading' });
                    if (onProgress)
                        onProgress(percentage, file);
                }
            }
        })
            .then(function (res) {
            updateFileList(_file, { status: 'success', response: res.data });
            if (onSuccess)
                onSuccess(res.data, file);
            if (onChange)
                onChange(file);
        })
            .catch(function (err) {
            updateFileList(_file, { status: 'error', error: err });
            if (onError) {
                onError(err, file);
            }
            if (onChange) {
                onChange(file);
            }
        });
    };
    return (_jsxs("div", __assign({ className: "g-upload-component" }, { children: [_jsxs("div", __assign({ className: "g-upload-input", style: { display: 'inline-block' }, onClick: handleClick }, { children: [drag ? (_jsx(Dragger, __assign({ onFile: function (files) { return uploadFiles(files); } }, { children: children }), void 0)) : (children),
                    _jsx("input", { className: "g-file-input", style: { display: 'none' }, ref: fileInput, onChange: handleFileChange, type: "file", accept: accept, multiple: multiple }, void 0)] }), void 0),
            _jsx(UploadList, { fileList: fileList, onRemove: handleRemove }, void 0)] }), void 0));
};
Upload.defaultProps = {
    name: 'file'
};
export default Upload;
