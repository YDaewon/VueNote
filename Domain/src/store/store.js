import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        apptheme:"Default",
        bodycolor:"#FFFFFF",
        city:"Gumi",
        user:'',
        weather:'',
        icon:'',
        bkcolor:'',
        fontcolor:'#4F4F4F'
    },
    getters:{
        getPred: state => {
            return state.predicted;
        },
    },
    mutations:{
        changeTheme: (state) => {
            if(state.apptheme == 'Light')
            {
                state.bkcolor = '#02BBC4';
                state.bodycolor = '#FDFAF5';
                state.fontcolor = '#4F4F4F';
            }
            else if(state.apptheme == 'Dark')
            { 
                state.bkcolor = '#000000';
                state.bodycolor = '#2F2F2F';
                state.fontcolor = '#D4D4D4';
            }
            else if(state.apptheme == 'Default')
            {
                state.bkcolor = "#000";
                state.bodycolor = '#FFFFFF';
                state.fontcolor = '#4F4F4F';
            }
            if(state.apptheme === 'Sun')
            {
              state.bkcolor = '#02BBC4';
              state.bodycolor = '#FDFAF5';
              state.fontcolor = '#4F4F4F';
            }
            else if(state.apptheme === 'Midnight')
            {
              state.icon = 'fas fa-cloud fa-3x'
              state.bkcolor = '#02021F';
              state.bodycolor = '#131940';
              state.fontcolor = '#B4B4B4';
            }
        },
        userinfo (state, payload) {
            state.user = payload
            console.log("유저정보: ", state.user)
        },
        getWeather: (state) => {
            fetch("http://api.openweathermap.org/data/2.5/weather?q="+state.city+"&appid=a5edeb79d117db797277bb5401ea65a4", {
                method: "POST",
            })
             .then((response) => response.json())
                    .then((response) => {
                        state.weather = response.weather[0].main
                    })
              .catch((error) => {
                 console.error(error);
              });
        },
        weatherTheme(state){
            if(state.weather === 'Clear')
            {
                state.icon = 'fas fa-sun fa-3x'
                state.bkcolor = '#02BBC4';
                state.bodycolor = '#FDFAF5';
                state.fontcolor = '#4F4F4F';
            }
            else if(state.weather === 'Clouds')
            {
                state.icon = 'fas fa-cloud fa-3x'
                state.bkcolor = '#4F4F4F';
                state.bodycolor = '#A8A8A8';
                state.fontcolor = '#2F2F2F';
            }
            else if(state.weather === 'Rain')
            {
                state.icon = 'fas fa-cloud-showers-heavy fa-3x'
                state.bkcolor = '#7f9eb2';
                state.bodycolor = '#77919d';
                state.fontcolor = '#2F2F2F';
            }
            else if(state.weather === 'Haze')
            {
                state.icon = 'fas fa-smog fa-3x'
                state.bkcolor = '#a3a1a1';
                state.bodycolor = '#F0F0F0';
                state.fontcolor = '#4F4F4F';
            }
          },
    },
})