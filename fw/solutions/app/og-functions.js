(function(global){
  /**
   * OG global
   * @type {Object}
   */
  var og = global.og = {};

  /**
   * Удаление элемента массива или объекта по ключу
   * @param objOrArray
   * @param key
   */
  og.del = function(objOrArray,key){
    if (angular.isArray(objOrArray)) {
      objOrArray.splice(+key,1);
    } else if (angular.isObject(objOrArray)){
      objOrArray[key] = undefined;
      delete(objOrArray[key]);
    }
  };

  /**
   * Поиск элемента(-ов) массива по значению ключа
   * @param array
   * @param key
   * @param match
   * @param {boolean} many поиск одного или всех совпадений
   * @returns {Array}
   */
  og.findInBy = function(array,key,match,many){
    var done,find = many ? [] : undefined;
    angular.forEach(array,function(itemValue){
      if (!done && itemValue[key]==match) {
        if (!many) {
          find = itemValue;
          done = true;
        } else {
          find.push(itemValue);
        }
      }
    });
    return find;
  };

  /**
   * Удаление элемента(-ов) массива по значению ключа
   * @param array
   * @param key
   * @param match
   */
  og.delInBy = function(array,key,match){
    angular.forEach(array,function(itemValue,i){
      if (itemValue[key]==match) {
        og.del(array,i);
      }
    });
  };

  /**
   * Вспомогательные методы работы с коллекцией элементов
   * @param {Array} collection
   * @returns {{save: Function, delete: Function}}
   */
  og.collection = function(object,variable) {
    object[variable] = object[variable]||[];
    return {
      /**
       * Сохранение изменений (добавление нового) элемента коллекции по ключу
       * @param item
       * @param by
       */
      save: function(item,by){
        by = by||'uid';
        var exist = og.findInBy(object[variable],by,item[by]);
        if (exist) {
          angular.extend(exist,item);
        } else {
          object[variable].push(item);
        }
      },
      /**
       * Удаление элемента коллекции по ключу
       * @param item
       * @param by
       */
      delete: function(item,by){
        by = by||'uid';
        og.delInBy(object[variable],by,item[by]);
      }
    };
  };

  /**
   *
   */
  og.ucfirst = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   *
   * @param input
   * @param procName
   * @param procValue
   * @returns {*}
   */
  og.map = function(input,procName,procValue){
    var result;
    if (angular.isArray(input)) {
      result = [];
      angular.forEach(input,function(val){
        result.push(procName(val));
      });
    } else if (angular.isObject(input)) {
      result = {};
      if (procValue==undefined) {
        procValue = procName;
        procName = function(name){ return name };
      }
      angular.forEach(input,function(val,name){
        result[procName(name,val)] = procValue(val);
      });
    }
    return result;
  };

  String.prototype.shuffle = function () {
    var a = this.split(""),
      n = a.length;

    for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  }

})(this);