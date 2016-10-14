<template lang="jade">
.input-range
  .track(@click="click")
    .range(:style="{width: percentage}")
    .thumb(:style="{left: percentage}",  @mousedown="dragStart" v-if="!isSupportTouch")
    .thumb(:style="{left: percentage}",  @touchmove="dragStart" v-if="isSupportTouch")
    //- .thumb(:style="{left: percentage}",  @mousedown="dragStart")
    .value(:style="{left: percentage}")  {{ valFilter(val) }}
      | <slot></slot>
  ul.mark
    li(v-for="s in scale", :style="{left: _getPercentage(s)}") {{ s }}
</template>


<script>


let isSupportTouch = (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })();

console.log('isSupportTouch : ' + isSupportTouch)

let desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
if (window.navigator.pointerEnabled){
  desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
}else if (window.navigator.msPointerEnabled){
  desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
}
const touchEvents = {
    start : isSupportTouch   ? 'touchstart' : desktopEvents[0],
    move : isSupportTouch  ? 'touchmove' : desktopEvents[1],
    end : isSupportTouch  ? 'touchend' : desktopEvents[2]
};


export default {
  data() {
    return{
      isSupportTouch : isSupportTouch,
      startEv: touchEvents.start,
      moveEv: touchEvents.move,
      endEv: touchEvents.end
    }
  },
  props: {
    step: {
      default: 1
    },
    val: {
      default: 0
    },
    scale: Array
  },
  computed: {
    max () {
      return this.scale[this.scale.length -1];
    },
    min () {
      return this.scale[0];
    },
    precision() {
      return (this.step.toString().split('.')[1] || []).length;
    },
    percentage () {
      if(this.val < this.min) this.val = this.min;
      if(this.val > this.max) this.val = this.max;
      return this._getPercentage(this.val);
    }
  },
  ready () {
    console.log('vue--ready')

    this._getWholeWidth();
    this.offset = this.$el.offsetLeft;
    window.addEventListener('resize', this._getWholeWidth);
  },
  methods: {
    click(e) {
      console.log(e)
      const me = this;
      const left = e.pageX ||  e.targetTouches[0].pageX - me.offset;
      if (left < 0 || left > me.wholeWidth) return false;
      const delta = (left * (me.max-me.min) / me.wholeWidth).toFixed(this.precision+1);
      me.val = (delta % me.step < me.step / 2)
               ? (Math.floor(delta / me.step) * me.step + me.min)
               : (Math.ceil(delta / me.step) * me.step + me.min);
    },
    dragStart () {      
      document.body.addEventListener(this.moveEv, this.move);
      document.body.addEventListener(this.endEv, this.dragEnd);
    },
    dragEnd () {
      document.body.removeEventListener(this.moveEv, this.move);
      document.body.removeEventListener(this.endEv, this.dragEnd);
    },
    move (e) {
      console.log('move')
      const me = this;

      console.log(e)

      const left = e.pageX ||  e.targetTouches[0].pageX - me.offset;
      if (left < 0 || left > me.wholeWidth) return false;
      const delta = (left * (me.max-me.min) / me.wholeWidth).toFixed(this.precision+1);
      me.val = (delta % me.step < me.step / 2)
               ? (Math.floor(delta / me.step) * me.step + me.min)
               : (Math.ceil(delta / me.step) * me.step + me.min);
    },
    _getWholeWidth() {
      this.wholeWidth = this.$el.querySelector('.track').offsetWidth;
    },
    _getPercentage(value) {
      return (value - this.min) * 100 / (this.max - this.min) + '%';
    },
    valFilter(val) {
      this.val = parseFloat(val).toFixed(this.precision);
      return this.val;
    }
  },
  destroyed() {
    window.removeEventListener('resize',this._getWholeWidth);
  }
}
</script>

<style lang="sass" src="./inputrange.scss"></style>