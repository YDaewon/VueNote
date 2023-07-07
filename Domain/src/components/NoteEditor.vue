<template>
    <div class="note-grid">
        <div class="note-editor" :style="{'background-color': theme}">
            <input class="title-input" type="text" v-model="title" placeholder="새 노트 쓰기">
            <textarea rows="10" v-model="text" placeholder="Take a note..."></textarea>
            <div class="note-editor-info">
                <table class="theme-input">
                    <tr>
                        <td><div class="color-red" @click.prevent="settheme('#F57F82')"></div></td>
                        <td><div class="color-orange" @click.prevent="settheme('#ff9e4f')"></div></td>
                        <td><div class="color-yellow" @click.prevent="settheme('#F5F28E')"></div></td>
                        <td><div class="color-green" @click.prevent="settheme('#5DD4A6')"></div></td>
                        <td><div class="color-blue" @click.prevent="settheme('#7A82F0')"></div></td>
                        <td><div class="color-navy" @click.prevent="settheme('#3F4E9D')"></div></td>
                        <td><div class="color-purple" @click.prevent="settheme('#C481E6')"></div></td>
                        <td><div class="color-white" @click.prevent="settheme('#FFFFFF')"></div></td>
                    </tr>
                </table>
                <select v-model="font" class="font-input" :style="{'font-family': font}">
                    <option value = ''>폰트선택</option>
                    <option value='Sans-Serif' :style="{'font-family': 'Sans-Serif'}">Sans-Serif</option>
                    <option value='Monospace' :style="{'font-family': 'Monospace'}">Monospace</option>
                    <option value='Comic Sans MS' :style="{'font-family': 'Comic Sans MS'}">Comic Sans MS</option>
                    <option value='굴림체' :style="{'font-family': '굴림체'}">굴림체</option>
                    <option value='Times New Roman' :style="{'font-family': 'Times New Roman'}">Times New Roman</option>
                    <option value='Impact' :style="{'font-family': 'Impact'}">Impact</option>
                </select>      
                <input class="user-input" type="text" v-model="user" placeholder="글쓴이">  
            </div> 
            <div class="input-hashtag">
                <button class="tag-button" @click=imgsearch>태그 추가</button>
                <input class="tag-input" type="text" v-model="hashtag" placeholder="#해시태그, #hashtag">
            </div>    
            <img :src="image" class="imageupload" id="imgdata" crossorigin="anonymous">
            <input type="file" name="image" id="imageselect">  
            <div class="note-editor-bottom">
                <button @click=createNew class="fas fas-check-circle"><i class="fas fa-check-circle"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['predict'],
    data: function() {
        return {
            title: '',  
            user: this.$store.state.user,   
            text: '',       
            theme: '#FFFFFF',            
            font:'Comic Sans MS',
            hashtag: '',
            image:'',
        }
    }, 
    methods: {    
        imgsearch(){
            this.$emit('imgsearch');
            this.hashtag = this.predict
        },  
        Upload(){
            const fileInput = document.getElementById("imageselect");

            const upload = (file) => {
            if (file && file.size < 5000000) {
                console.log("파일 용량:", file.size,"파일:", file);
                const formData = new FormData();
                formData.append("image", file);
                fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                        Authorization: "Client-ID c0838b58f30fa2a",
                        Accept: "application/json",
                    },
                    body: formData,
                })
                .then((response) => response.json())
                .then((response) => {
                    const { data } = response;
                    this.image = data.link;
                })
                .catch((error) => {
                    console.error(error);
                });
            } else {
                console.error("파일 용량 초과");
            }
            };
            if (fileInput) {
                fileInput.addEventListener("change", () => {
                    upload(fileInput.files[0]);
                });
            }
        },  
        createNew() {
            const tag = this.hashtag.split(",");
            this.$emit('noteAdded', this.title, this.user, this.text, this.theme, this.font, tag, this.image);
            this.$emit('close');
            this.image = '';
            this.title = '';
            this.user = '';
            this.text = '',
            this.theme = '';
            this.font = '';
            this.hashtag = '';
        },
        settheme(theme){
            this.theme = theme;
        },
        // deleteNote(index) {
        //     this.$emit('noteDeleted', index);
        // },
    },
    async mounted() {
        this.Upload();
    },
}
</script>
