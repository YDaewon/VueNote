<template>
  <div id="app"  :style="{'background': $store.state.bodycolor}">
    <app-header @openBoard="openBoard = !openBoard, updaterOpen = false, editorOpen = false" @openEditor="editorOpen = !editorOpen, updaterOpen = false, openBoard = false"  @search="showSearchResult" :notes="notes"></app-header>
    <app-note-editor v-if="editorOpen" @noteAdded="newNote" @close="editorOpen = !editorOpen" @imgsearch ="predict" :predict="predicted"></app-note-editor>  
    <app-note-updater v-if="updaterOpen" @noteUpdate="updateNote" @close="updaterOpen = !updaterOpen" @imgsearch ="predict"  v-bind:idx="noteindex" :note="tempnote" :predict="predicted"></app-note-updater>
    <app-White-Board v-if="openBoard" @noteAdded="newNote, openBoard = false"></app-White-Board>
    <div class="noteContainer">   
        <div v-for="(note, index) in notes" :key="`note-${index}`">
          <div v-if="note.title.includes(searchtext)||note.text.includes(searchtext)||note.user.includes(searchtext)||note.hashtag.toString().includes(searchtext)">
            <div  v-show="((currentPage-1) * perPage <= notearr.indexOf(index) && notearr.indexOf(index) < currentPage * perPage ) 
            " class="note" :style="{'background-color': note.theme, 'font-family': note.font}" @mouseover="iconOpen = true , noteindex = index" @mouseleave="iconOpen = false">  
              <span v-if="noteindex==index" v-show="iconOpen" class="delete" @click.prevent="deleteNote(index)"><i class="fas fa-times-circle"></i></span> 
              <span v-if="noteindex==index" v-show="iconOpen" class="download" @click.prevent="createfile(note)"><i class="fas fa-arrow-alt-circle-down"></i></span>
              <span v-if="noteindex==index" v-show="iconOpen" class="update"  @click.prevent="updaterOpen = !updaterOpen, editorOpen = false, noteindex = index, tempnote=note, openBoard = false"><i class="fas fa-pen"></i></span> 
              <span >{{ note.title}}</span>
              <img :src="note.image" class="imageprint">
              <p class="note-text">{{ note.text }}</p>
              <p class="note-name">- {{ note.user }} -</p>
              <span v-for="tag in note.hashtag" :key ="tag" class="note-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
    </div>
  <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="center"
  ></b-pagination>
  <div class = "foute" :style="{'color': $store.state.fontcolor}">
  <h1 :style="{'font-family': 'Nanum Brush Script'}">{{qoutes.text}}</h1>
  <p :style="{'font-family': 'Comic Sans MS'}">- {{qoutes.author}} -</p>
  </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap');
</style>
<script>
import Vue from "vue";
import VueHtml2Canvas from 'vue-html2canvas';
import Whiteboard from "./components/Whiteboard.vue";
import NoteEditor from './components/NoteEditor.vue';
import NoteUpdater from './components/NoteUpdater.vue';
import Header from './components/Header.vue';
import * as cocoSSD from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
let model;

Vue.use(VueHtml2Canvas);
Vue.component('app-White-Board', Whiteboard);
export default {
  name: 'App',
  data: function() {
    return {
      searchtext: '',
      openBoard: false,
      editorOpen: false,
      updaterOpen: false,
      iconOpen: false,
      noteindex: 0,
      currentPage: 1,
      perPage: 4,
      notecount: 0,
      notearr:[],
      qoutes :[
        {
          text: '',
          author: '',
        }
      ],
      randNum: 0,
      tempnote:[{
          title: '',
          user: '',
          text: '',
          theme: '',
          font: '',
          hashtag: '',
          image:'',
        }],
      notes: [
        {
          title: 'Code',
          user: '',
          text: '1131111222',
          theme: '#FF8A80',
          font: '',
          hashtag: '',
          image:'',
        },
        {
          title: 'event',
          user: '',
          text: 'event',
          theme: '#DDA0DD',
          font: '',
          hashtag: '',
          image:'',   
        },
      ],     
      predicted:"",  
    }
  },
	computed: {
		rows() {
      return this.notecount;
    },
	},
  methods: {  
    newNote(title, user, text, theme, font, hashtag, image) {
      this.notes.push({title: title, user: user, text: text, theme: theme, font:font, hashtag:hashtag, image:image});
      this.searchtext= ''
      this.notecount = this.notes.length
      this.notearr.push(this.notecount)
      console.log(this.notearr)
    },
    deleteNote(index) {
      this.notes.splice(index, 1);
      this.updaterOpen = false;
      this.searchtext= ''
      this.notecount = this.notes.length
    },
    qoute(){
      this.randNum = Math.floor(Math.random() * (1643)) + 0;
      
      const URL = "https://type.fit/api/quotes";
      this.$http.get(`${URL}`)
      //result가 받아온 파일이고 그안의 데이터는 result.data로 따로 불러줘야함
      //이거 사용 할때는 result.data[int형 숫자].text or author
      .then((result) => {
        this.translate(Object.assign(result.data[this.randNum].text))
        this.qoutes.author = Object.assign(result.data[this.randNum].author);
      })
    },
    translate(text){
        // 카카오 KEY
        var kakao_key= '카카오 키를 넣어주세요';
        const api_url = 'https://dapi.kakao.com/v2/translation/translate';
        var query = text;
        fetch(api_url + '?src_lang='+'en'+'&target_lang='+'kr'+'&query='+ text, {
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${kakao_key}`,
                Accept: "application/json",
            },
        })
         .then((response) => response.json())
          .catch((error) => {
             console.error(error);
          });
    },
    updateNote(index, title, user, text, theme, font, hashtag, image) {
      this.notes.splice(index, 1, {title: title, user: user, text: text, theme: theme, font:font, hashtag:hashtag, image:image});
    },
    showSearchResult(searchtext, count, notearr)
    {
      this.notecount = count;
      this.searchtext = searchtext;
      this.notearr = notearr
    },
    createfile(note) {
      const data = JSON.stringify(note, null, 2)
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = note.title + ".txt";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/txt', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    async predict(){
      const img = document.getElementById('imgdata');     
      let tmp = await model.detect(img);      
      this.predicted = "#" + tmp[0].class
    },
  },
  async mounted() {
    this.qoute();
    if (localStorage.getItem('notes'))
    { 
      this.notes = await JSON.parse(localStorage.getItem('notes'));
    }
    for(var i =0; i< this.notes.length; i++)
      {
        this.notearr.push(i)
      }
    this.notecount = this.notes.length;
    model = await cocoSSD.load();
    console.log("model loaded");  
    this.$store.commit('getWeather');
  },
  watch: {
    notes: {
      handler() {
        var newNotes = this.notes;
        localStorage.setItem('notes', JSON.stringify(newNotes));
      },
      deep: true,
    },
  },
  components: {
    appNoteEditor: NoteEditor,
    appNoteUpdater: NoteUpdater,
    appHeader: Header,
    },
}
</script>

<style lang="scss">
  @import '/styles/global.scss';
</style>
