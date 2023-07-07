<template>
    <div class="header" :style="{'background': $store.state.bkcolor, color: '#F4F4F4', 'font-family': 'Comic Sans MS'}">     
      <img class= "logo" src="../assets/logo.png">
      <p>Vue.JS Sticky Notes</p>
      <button class="add-btn" @click.prevent="openEditor"><i class="fas fa-plus"></i></button>
      <input class="search" type="text" v-model ="searchtext" @input="search" placeholder="검색하기(제목, 내용, 글쓴이, 해시태그)"> 
      <p class= "theme-text" :style="{'font-family': 'Comic Sans MS'}">Weather:</p>
      <div class="weather-image">
        <i :class=$store.state.icon></i>
      </div>  
      <div class = "menubut"><b-button  v-b-toggle.sidebar-right variant="outline-dark"><i class="fas fa-cog"></i></b-button></div>
        <b-sidebar id="sidebar-right" title="Setting" right shadow>
          <div class="px-3 py-2">
            <b-form-group label="Login/Logout" label-for="theme-setting">
              <img v-if="isLogin == false" src="../assets/kakao_login_medium_wide.png" @click="loginWithKakao" width="290px">
              <img v-if="isLogin == true" class="" src="../assets/kakao_logout_medium_wide.png" @click="logoutWithKakao" width="290px"> 
            </b-form-group>
            <b-form-group label="Theme Setting" label-for="theme-setting">
              <b-form-select id="backdrop-variant" v-model="$store.state.apptheme" :options="variants" @change="changetheme"></b-form-select>
            </b-form-group>
            <b-form-group label="Location Setting" label-for="location-setting">
              <b-form-select id="backdrop-variant" v-model="$store.state.city" :options="cities" @change="searchweather"></b-form-select>
            </b-form-group>
            <b-nav vertical>
              <b-button @click="openBoard">그림판 열기</b-button>
            </b-nav>
          </div>
        </b-sidebar>
    </div>
</template>
<script>
import {posix} from 'path';
var userdata = '';
  export default {
    props: ['notes'],
    data: function() {
        return {
            searchtext:'',
            count:0,
            notearr:[],
            isLogin: false,
            user: userdata, 
            variants: [
              'Default',
              'Light',
              'Dark',
              'Sun',
              'Midnight',

            ],
            cities: [
              'Gumi',
              'Seoul',
              'Gimhae',
              'Daegu'
            ],
        }
    },  
       methods:{
          openEditor: function(){
            this.$emit('openEditor');
          },
          openBoard: function(){
            this.$emit('openBoard');
          },
          loginWithKakao() {
            function makePromise() {
              return new Promise((resolve, reject) => {
                  const params = {
                      redirectUri: "http://localhost:8080",
                  };
                  window.Kakao.Auth.loginForm({ 
                    success: (auth) => {
                      window.Kakao.API.request({
                        url: "/v2/user/me",
                        success: function (response) {
                          userdata= response.kakao_account.profile.nickname
                          alert(userdata + "으로 로그인 되었습니다.");
                          resolve();
                        },
                        fail: function (error) {
                            console.log(error);
                        },
                      })
                      }, 
                    fail: (err) => { 
                        console.error(err) }
                      })
                    })
                  }
              makePromise().then(res => {
                this.isLogin= true
                this.$store.commit('userinfo', userdata);
              })
          },
          logoutWithKakao() {
             window.Kakao.Auth.logout(() => { 
              alert('로그아웃 되었습니다'); 
              this.$store.state.user = '';
              this.isLogin= false 
              })
          },
          search()
          {
            for(var i =0; i< this.notes.length; i++)
            {
              if(this.notes[i].title.includes(this.searchtext)||this.notes[i].text.includes(this.searchtext)||
                                      this.notes[i].user.includes(this.searchtext)||this.notes[i].hashtag.toString().includes(this.searchtext))
              {
                this.count = this.count+1
                this.notearr.push(i)
              }
            }
            this.$emit('search',this.searchtext, this.count, this.notearr);
            this.count = 0
            this.notearr = []
          },
          changetheme(){
              if(this.$store.state.apptheme != '')
              {
                  this.$store.commit('changeTheme');
              }
          },
          changefont(){
              this.$store.commit('changefont');
          },
          searchweather() {
            this.$store.commit('getWeather');
            this.$store.commit('weatherTheme')
          },
    },
  }
</script>