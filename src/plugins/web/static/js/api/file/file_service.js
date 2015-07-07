/**
 * Created by bustamante on 6/24/15.
 */
angular.module('magicSurface').factory('FileApi',["MSValidator", "FileRestApi", "$timeout", function(MSValidator, FileRestApi, $timeout){

    function save(file, layer){
        var promise = {
            success: function(_func){promise._success = _func},
            error: function(_func){promise._error = _func},
            finally: function(_func){promise._finally = _func}
        };

        $timeout(function(){
            var _rules = {
                isFile: [file],
                hasId: [layer]
            };

            var status = MSValidator.validate(undefined, _rules);

            if(status.isValid)
            {
                var form = new FormData();
                form.append("layerId", isNaN(layer)? layer.id : layer);
                form.append("file", file);
                FileRestApi.save(form)
                    .success(promise._success)
                    .error(promise._error)
                    .finally(promise._finally);
            } else {
                if(promise._error) promise._error(status);
                if(promise._finally) promise._finally('');
            }
        });

        return promise;
    }

     function get(file){
        var promise = {
            success: function(_func){promise._success = _func},
            error: function(_func){promise._error = _func},
            finally: function(_func){promise._finally = _func}
        };

        $timeout(function(){
            var status = MSValidator.validate(file, {hasId: [file]});
            if(status.isValid){
                var params = {fileId: isNaN(file)? file.id : file};
                FileRestApi.get(params)
                    .success(promise._success)
                    .error(promise._error)
                    .finally(promise._finally);
            } else {
                if(promise._error) promise._error(status);
                if(promise._finally) promise._finally('');
            }
        });

        return promise
    }

    function list(form){
        var promise = {
            success: function(_func){promise._success = _func},
            error: function(_func){promise._error = _func},
            finally: function(_func){promise._finally = _func}
        };

        $timeout(function(){
            var _rules = {
                hasId: [form.layerId]
            };

            if(!form.filters) form.filters = {};
            var status = MSValidator.validate(undefined, _rules);

            if(status.isValid)
            {
                form.layerId = isNaN(form.layerId)? form.layerId.id : form.layerId;

                FileRestApi.list(form)
                    .success(promise._success)
                    .error(promise._error)
                    .finally(promise._finally);
            } else {
                if(promise._error) promise._error(status);
                if(promise._finally) promise._finally('');
            }
        });

        return promise;
    }

    function del(file){
        var promise = {
            success: function(_func){promise._success = _func},
            error: function(_func){promise._error = _func},
            finally: function(_func){promise._finally = _func}
        };

        $timeout(function(){
            var is_file_object = angular.isObject(file) && angular.isUndefined(file.id);
            if(is_file_object || !isNaN(file)){
                var params = {FileId: isNaN(file)? file.id : file};
                FileRestApi.del(params)
                    .success(promise._success)
                    .error(promise._error)
                    .finally(promise._finally);
            } else {
                if(promise._error) promise._error({msg: 'fileId inválido'});
                if(promise._finally) promise._finally('');
            }
        });

        return promise
    }

    return {
        save: save,
        get: get,
        list: list,
        del: del
    }
}]);