<template>
    <div class="note-grid">
        <div class="note-editor" :style="{'background-color': theme}">
            <input class="title-input" type="text" v-model="title" placeholder="제목 입력">
            <canvas id="myCanvas" class="canvas" width="600" height="400" @mousemove="draw" @mousedown="beginDrawing" @mouseup="stopDrawing"/>  
            <div class="note-editor-info">   
            </div>
            <div class="note-editor-bottom">
                <button @click.prevent="download" class="canvasdown"><i class="fas fa-arrow-alt-circle-down"></i></button>
            </div>
        </div>
    </div>
</template>

<style>
#myCanvas {
  border: 1px solid grey;
}
</style>
<script>
export default {
  data: function(){
    return{
      canvas:null,
      x: 0,
      y:0,
      isDrawing: false,
      title:'',
      theme:''
    }
  },
  methods: {
    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    download(){
      var canvas = document.getElementById("myCanvas");
      var img = canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
      var link = document.createElement('a');
      link.download = this.title + ".png";
      link.href = img;
      console.log(link)
      link.click();
    },
    draw(e) {
      if(this.isDrawing)
      {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
     beginDrawing(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },
    stopDrawing(e) {
      if (this.isDrawing) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
    },
    settheme(theme){
      this.theme = theme;
    },
  },
  mounted() {
    var c = document.getElementById("myCanvas");
    this.canvas = c.getContext('2d');
  }
}
</script>