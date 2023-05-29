class PhotoGallery{
    constructor(){
        this.API_KEY = 'tZ5qrVaxX1CbnNZrDOv39ktmK9ht1ZOY35FXOrmEq9G3KjLTkDfpp2um';
        this.galleryDiv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load_more');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle(){
        document.addEventListener('DOMContentLoaded',()=>{
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e)=>{
            this.pageIndex = 1;
           this.getSearchedImages(e); 
        });
        this.loadMore.addEventListener('click', (e)=>{
            this.loadMoreImages(e);
        })
    }
    async getImg(index){
        this.loadMore.setAttribute('data_img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
        console.log(data)
    }
    async fetchImages(baseURL){
        const response = await fetch(baseURL, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        //console.log(data);
        return data;
    }
    GenerateHTML(photos){
        photos.forEach(photo=>{
           const item = document.createElement('div');
           item.classList.add('item');
           item.innerHTML = `
           <a href='${photo.src.original}' target = "blank">
               <img src="${photo.src.large}">
               <h3>${photo.photographer}</h3>
           </a>
           `;
           this.galleryDiv.appendChild(item)
        })
    }
    async getSearchedImages(e){
        this.loadMore.setAttribute('data_img', 'search');
        e.preventDefault();
        this.galleryDiv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index){
        //console.log(searchValue)
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
        const data = await this.fetchImages(baseURL);
        //console.log(data)
        this.GenerateHTML(data.photos);
    }
    loadMoreImages(e){
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data_img');
        if(loadMoreData === 'curated'){
            // carga la página 2 para CURATED
            this.getImg(index)
        }else{
            // carga la página 2 para SEARCH
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new PhotoGallery;