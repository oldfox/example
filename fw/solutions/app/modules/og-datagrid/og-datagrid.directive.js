(function(){
  'use strict';

  angular.module('app')

    .directive('innerList',function($interpolate){
      return {
        restrict:'A',
        terminal:true,
        compile: {
          pre: function(scope,el){
            var tpl = el[0];
            console.log(el);
          }
        },
        link: function(scope,el,attr){
          var tpl = el[0];
          console.log(el);
          el.html('');
          var list = scope.$eval(attr.innerList);
          console.log(list);
          angular.forEach(list,function(item){
            var it = $interpolate(tpl)({role:item});
            console.log(it);
            el.append($($interpolate(tpl)({role:item})).html());
          });
          console.log($interpolate(el.html())(scope[attr.innerList]));
        }
      };
    })


    .directive('ogDatagrid',ogDatagridDirective);

  function ogDatagridDirective($timeout,$compile) {
    var dg = {};
    return {
      restrict: 'A',
      terminal: true,
      //priority: 3000,
      compile: function(el){
        dg.el = el;
        dg.data = el.attr('og-datagrid');

        return function($scope){
          //dg.el.attr('ng-class','{init:!'+dg.data+'.pagination,loading:'+dg.data+'.pagination.loading,\'has-rows\':'+dg.data+'.collection.length>0}');
          _setdHeader(dg);
          //_setItemTemplates(dg);
          _setNgRepeat(dg);
          _setMessages(dg);
          _setTools(dg);
          //_renderUxDatagrid(dg);


          $timeout(function(){

            el.children().wrapAll('<div class="datagrid-wrap" ng-class="{init:!'+dg.data+'.pagination,loading:'+dg.data+'.pagination.loading,\'has-rows\':'+dg.data+'.collection.length>0}"></div>');

            if (dg.header) {
              //$compile(dg.header[0])($scope);
            }

            $compile(dg.el.children()[0])($scope);

            if (dg.tools) {
              //$compile(dg.tools[0])($scope);
              var select = dg.tools.find('.og-datagrid-pagination .nya-bs-select');
              select.find('.btn').removeClass('btn btn-default');
            }
//            if (dg.uxgrid) {
//              $compile(dg.uxgrid[0])($scope);
//              $scope.$on('datagrid:onBeforeRender',function(){
//                dg.uxgrid.find('.datagrid-content').height('auto');
//                dg.uxgrid.find('.datagrid-chunk').height('auto');
//              });
//            }

            if (dg.ngRepeat) {
//              console.log(dg.ngRepeat.html());
//              $compile(dg.ngRepeat[0])($scope);
//              $compile(dg.informers[0])($scope);

//              $scope.$on('datagrid:onBeforeRender',function(){
//                dg.ngRepeat.find('.datagrid-content').height('auto');
//                dg.ngRepeat.find('.datagrid-chunk').height('auto');
//              });
            }
          });
        }
      }
    };
  }

  function _setdHeader(dg) {
    var header = $('[og-datagrid-header]',dg.el[0]);
    if (header.length) {
      dg.header = header;
      dg.header
        .addClass('og-datagrid-header')
          .children()
          .wrapAll('<div class="og-datagrid-header-row datagrid-row"></div>');
      //dg.header.attr('ng-if',dg.data+'.collection.length');
    }
  }

  function _setMessages(dg) {
    dg.emptyText = dg.el.find('[empty-text]');
    if (dg.emptyText.length) {
      dg.emptyText.remove();
    }
  }

  function _setTools(dg){
    var tools = $('[og-datagrid-tools]',dg.el[0]);
    if (tools.length) {
      dg.tools = tools;
      ////////////
      var paginations = $('[og-datagrid-pagination]',dg.el[0]);
      if (paginations.length) {
        paginations.each(function(i,pagination){
          pagination = $(pagination);
          var perPageLabel = pagination.attr('per-page-label');
          var perPageList = pagination.attr('per-page-list');
          pagination
            .removeAttr('og-datagrid-pagination')
            .removeAttr('per-page-label')
            .removeAttr('per-page-list')
            .attr('ng-cloak','')
            .addClass('og-datagrid-pagination')
            //  .attr('ng-if',dg.data+'.collection.length')
          ;
          pagination.append($('' +
            '<span translate="'+(perPageLabel||'datagrid.perPage')+'"></span>' +
            '<ol class="per-page nya-bs-select inline" ng-model="'+dg.data+'.pagination.meta.perPage" ng-change="'+dg.data+'.pagination.getPage()" title="{{'+dg.data+'.pagination.meta.perPage}}">' +
            '<li nya-bs-option="pp in '+(perPageList||'[5,10,20,50]')+'"><a>{{pp}}</a></li>' +
            '</ol>' +
            '<span class="info">{{'+dg.data+'.pagination.fromTo()||\'-\'}}/{{'+dg.data+'.pagination.meta.totalCount||\'-\'}}</span>' +
            '<span class="prev-next">' +
            '<button class="btn" ng-click="'+dg.data+'.pagination.links.prev.go()" ng-disabled="!'+dg.data+'.pagination.links.prev.go"><fa-icon angle-left></fa-icon></button>' +
            '<button class="btn" ng-click="'+dg.data+'.pagination.links.next.go()" ng-disabled="!'+dg.data+'.pagination.links.next.go"><fa-icon angle-right></fa-icon></button>' +
            '</span>' +
            '<div class="clearfix"></div>'));
        });
      }

      ////////////
      var downloads = $('[og-datagrid-download]',tools[0]);
      if (downloads.length) {

        downloads.each(function(i,download){
          download = $(download);

          var downloadParams = download.attr('og-datagrid-download');


          if (downloadParams!=undefined && downloadParams!='') {
            ///var format = download.attr('format');
            download
              //.removeAttr('og-datagrid-download')
              .removeAttr('link-label')
              //.removeAttr('format')
              .addClass('og-datagrid-download form-inline')
              .attr('ng-show',dg.data+'.collection.length')
              //.attr('ng-init',dg.data+'.downloadParams = '+downloadParams)
            ;
  //          download.append($(
  //            '<div class="input-group">' +
  //              '<input class="form-control" type="text" ng-model="'+dg.data+'.downloadName" placeholder="{{\'datagrid.download-input\'|translate}}"/>' +
  //              '<span class="input-group-btn">' +
  //                '<button class="btn btn-default" ng-disabled="!'+dg.data+'.downloadName" ng-click="'+dg.data+'.downloadCreate(\''+(format||'csv')+'\')">' +
  //                  '<span translate="datagrid.download-button"></span>' +
  //                '</button>' +
  //              '</span>' +
  //            '</div>'
  //          ));
            download.append($('<div class="datagrid-download-link">' +
              '<a href="#" ng-click="'+dg.data+'.downloadCreate(\''+download.attr('og-datagrid-download')+'\')">' +
              '<span translate="datagrid.download-button"></span>' +
              '</a></div>'));

          }

        });


      }
    }
  }

//  function _setItemTemplates0(dg){
//    dg.templates = {};
//    var templates = $('[og-datagrid-item]',dg.el[0]);
//    if (templates.length) {
//      dg.uxgrid = $('<div></div>').insertBefore($(templates[0]));
//      dg.uxgrid = $(dg.uxgrid);
//      angular.forEach(templates,function(template){
//        template = $(template);
//        var name = template.attr('template')||'default';
//        var item = template.attr('og-datagrid-item');
//        template.removeAttr('og-datagrid-item');
//        if (template.attr('no-wrap')==undefined) {
//          template = $('<div></div>').append(template);
//        } else {
//          template.wrapAll('<div></div>');
//          template = template.parent();
//        }
//        if (dg.templates[name]) {
//          dg.templates[name] = dg.templates[name].replace(/<\/script>/,template.html()+'\n</script>');
//        } else {
//          dg.templates[name] = '<script type="template/html" template-item="'+item+'" template-name="'+name+'">\n'+template.html()+'\n</script>';
//        }
//        template.remove();
//      });
//    }
//  }

  function _setNgRepeat(dg){
    var template = $('[og-datagrid-item]',dg.el[0]);
    if (template.length) {
      dg.ngRepeat = template.attr('ng-cloak','');
//      dg.ngRepeat = $('<div></div>').insertBefore($(template[0]));
//      dg.ngRepeat = $(dg.ngRepeat);

      dg.informers = $('<div class="datagrid-rows-container">' +
        '<div class="datagrid-row datagrid-loading-row"><span loader></span></div>' +
        '</div>');
      dg.informers.append($('<div class="datagrid-row datagrid-empty-row text-warning"><span translate="datagrid.emptyResult"></span></div>')
      //  .append(dg.emptyText?dg.emptyText:$(''))
      );
      dg.ngRepeat.before(dg.informers);

      //var name = template.attr('template')||'default';
      var item = dg.ngRepeat.attr('og-datagrid-item');
      dg.ngRepeat.removeAttr('og-datagrid-item');
//      if (template.attr('no-wrap')==undefined) {
//        template = $('<div></div>').append(template);
//      } else {
      dg.ngRepeat.attr('ng-repeat',item+' in '+dg.data+'.collection track by $index');

      dg.ngRepeat.addClass('datagrid-row');
      //template.wrapAll('<div class="datagrid-row " ng-repeat="'+item+' in '+dg.data+'.collection track by $index"></div>');
      //dg.ngRepeat = template.parent();
//      }

      //dg.ngRepeat.attr('ng-if',dg.data+'.collection.length');
      dg.ngRepeat.wrap('<div class="datagrid-rows-container datagrid-data"></div>');
      dg.ngRepeat = dg.ngRepeat.parent();


    }
  }

//  function _renderUxDatagrid(dg){
//    if (dg.uxgrid) {
//      var templates = '';
//      angular.forEach(dg.templates,function(template){
//        templates += '\n'+template;
//      });
//      dg.uxgrid.html(templates);
//      dg.uxgrid.attr('ux-datagrid',dg.data+'.collection');
//      //dg.uxgrid.attr('options','{minHeight:\'48\'}');
//      dg.uxgrid.attr('ng-if',dg.data+'.collection.length');
//      dg.uxgrid.attr('addons',dg.el.attr('ux-datagrid-addons'));
//      //dg.uxgrid.attr('data-options','{readyToRenderRetryMax:0,renderThresholdWait:0}');
//      dg.uxgrid.wrap('<div class="datagrid-rows-container" ng-class="{init:!'+dg.data+'.pagination,loading:'+dg.data+'.pagination.loading,\'has-rows\':'+dg.data+'.collection.length>0}"></div>');
//      dg.uxgrid = dg.uxgrid.parent();
//      dg.uxgrid.prepend($('<div class="datagrid-row datagrid-empty-row text-warning"></div>').append(dg.emptyText.length?dg.emptyText:$('<span translate="datagrid.emptyResult"></span>')));
//      dg.uxgrid.prepend($('<div class="datagrid-row datagrid-loading-row"><span loader></span></div>'));
//
//    }
//  }
//
//  function _renderNgRepeat(dg){
//    if (dg.ngRepeat) {
//      var templates = '';
//      angular.forEach(dg.templates,function(template){
//        templates += '\n'+template;
//      });
//      dg.uxgrid.html(templates);
//      dg.uxgrid.attr('ux-datagrid',dg.data+'.collection');
//      //dg.uxgrid.attr('options','{minHeight:\'48\'}');
//      dg.uxgrid.attr('ng-if',dg.data+'.collection.length');
//      dg.uxgrid.attr('addons',dg.el.attr('ux-datagrid-addons'));
//      //dg.uxgrid.attr('data-options','{readyToRenderRetryMax:0,renderThresholdWait:0}');
//      dg.uxgrid.wrap('<div class="datagrid-rows-container" ng-class="{init:!'+dg.data+'.pagination,loading:'+dg.data+'.pagination.loading,\'has-rows\':'+dg.data+'.collection.length>0}"></div>');
//      dg.uxgrid = dg.uxgrid.parent();
//      dg.uxgrid.prepend($('<div class="datagrid-row datagrid-empty-row text-warning"></div>').append(dg.emptyText.length?dg.emptyText:$('<span translate="datagrid.emptyResult"></span>')));
//      dg.uxgrid.prepend($('<div class="datagrid-row datagrid-loading-row"><span loader></span></div>'));
//
//    }
//  }

})();