/*!
 * Optionlist component for Vue2
 * @version 1.0.5
 * @author Hpyer
 * @license MIT
 * @homepage https://github.com/hpyer/vue-optionlist
 */

(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    var Vue = require('vue/dist/vue.common.js');
    module.exports = factory(Vue);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define('VueOptionList', ['vue/dist/vue.common.js'], factory());
  }
  else {
    global.VueOptionList = factory(global.Vue);
  }
} (window, (function (Vue) {

  if (typeof Array.indexOf === 'undefined') {
    Array.prototype.indexOf = function (item) {
      var index = -1;
      for (var i=0; i<this.length; i++) {
        if (item === this[i]) {
          index = i;
          break;
        }
      }
      return index;
    };
  }
  if (typeof Array.inArray === 'undefined') {
    Array.prototype.inArray = function (item) {
      var index = this.indexOf(item);
      return index != -1;
    };
  }
  if (typeof Array.each === 'undefined') {
    Array.prototype.each = function (cb) {
      for (var i=0; i<this.length; i++) {
        if (false === cb(this[i], i)) {
          break;
        }
      }
    };
  }

  if (typeof Array.setLimit === 'undefined') {
    Array.prototype.setLimit = function (maxLength) {
      maxLength = parseInt(maxLength);
      if (maxLength > 0 && this.length > maxLength) {
        for (var i=maxLength, j=this.length; i<j; i++) {
          this.pop();
        }
      }
      return this;
    };
  }

  return Vue.component('VueOptionList', {
    template: '\
      <div>\
        <div class="optionlist-item" v-for="item in list">\
          <input v-if="multi" class="optionlist-item-input" type="checkbox" :value="item.value" v-model="values">\
          <input v-else class="optionlist-item-input" type="radio" :value="item.value" v-model="values">\
          <div class="optionlist-item-text" @click="toggleItem(item)">\
            <slot :item="item">{{item.text}}</slot>\
          </div>\
        </div>\
      </div>\
    ',
    props: {
      list: {
        type: Array,
        require: true
      },
      multi: {
        type: Boolean,
        default: true
      },
      selected: {
        default: null
      },
      limit: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        values: ''
      }
    },
    created () {
      if (this.selected) {
        var selected = this.selected;
        if (this.multi) {
          if (typeof selected != 'object') selected = [selected];
          else selected.setLimit(this.limit);
        } else {
          if (typeof selected == 'object' && selected.length) selected = selected.pop();
        }
        this.values = selected;
      } else {
        if (this.multi) {
          this.values = [];
        } else {
          this.values = '';
        }
      }
    },
    beforeUpdate () {
      if (this.multi) {
        this.values = this.values.setLimit(this.limit);
      }
    },
    watch: {
      values: function (val) {
        if (this.multi && this.limit > 0 & val.length > this.limit) {
          this.$emit('limit', this.limit);
        } else {
          this.$emit('change', val);
        }
      }
    },
    methods: {
      toggleItem: function (item) {
        if (this.multi) {
          var pos = this.values.indexOf(item.value);
          if (pos != -1) {
            this.values.splice(pos, 1);
          } else {
            this.values.push(item.value);
          }
        } else {
          this.values = item.value;
        }
      },
      getValues: function () {
        return this.values;
      },
      selectAll: function () {
        if (!this.multi) return;
        this.values = [];
        var that = this;
        this.list.each(function (one, index) {
          that.values.push(one.value);
        });
      },
      selectReverse: function () {
        if (!this.multi) return;
        var reverseValues = [];
        var that = this;
        this.list.each(function (one, index) {
          if (!that.values.inArray(one.value)) {
            reverseValues.push(one.value);
          }
        });
        this.values = reverseValues;
      },
      unselectAll: function () {
        if (!this.multi) return;
        this.values = [];
      }
    }
  })
})));
