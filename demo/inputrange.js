import Vue from 'vue'
import Range from '../src/inputrange.vue'

Vue.component('range', Range);

var demo = new Vue({
    el: "#demo",
    data: {
    	val: 0.6,
        step: 2,
        scale: [0,100,200]
    },
    ready(){
        document.querySelector('#demo').classList.remove('hide');
    }
});

