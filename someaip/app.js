
const vm = new Vue({
  el: "#starting",
  data: {
      direct_flug:false,
      flug:false,
      articles: [],
      isbns: [],
      checkIsbn:[],
      loading: true,
      currentArticle: {},
      message: null,
      newArticle:
      {
          title: null,
          title_kana: null,
          author: null,
          author_kana: null,
          isbn: null,
          sales_date: null,
      },
      search_term: "",
      rakuten_books: [],
      search_rakuten_books: "",

      parPage: 20,
       currentPage: 1,
  },
  mounted: function () {
      this.getArticles();
      this.getAllIsbns();

        this.$refs.direct_isbn.focus(); // OK

  },
  methods: {

      getArticles: function () {
          let api_url = "http://localhost:8000/book/book";
          if (this.search_term !== "" || this.search_term !== null) {
              api_url = `http://localhost:8000/book/book/?search=${this.search_term}`;
          }

          axios
              .get(api_url)
              .then(response => {
                  this.articles = response.data.results;
                  this.loading = false;
              })
              .catch(err => {
                  this.loading = false;
                  console.log(err);
                  console.log('getarticleserr');
              });
      },
      getArticle: function (id) {
          //編集や削除をするため


        axios
            .get(`http://localhost:8000/book/book/${id}/`)
            .then(response => {
                this.currentArticle = response.data;
                this.loading = false;
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
            });
    },
    searchArticle: function (id) {

        let  api_url = `http://localhost:8000/book/book/?search=${id}`;

        axios
            .get(api_url)
            .then(response => {
                this.articles = response.data.results;
                this.loading = false;
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
                console.log('getarticleserr');
            });
    },
      addArticle: function () {
        console.log('え');
      axios
          .post("http://localhost:8000/book/book/", this.newArticle)
          .then(response => {

            this.newArticle =
            {
              title:null,
              title_kana:null,
              author:null,
              author_kana:null,
              isbn:null,
              sales_date:null,
          },

            this.getArticles();

            $("#addArticleModal").modal('toggle');
            console.log('成功');
          })
          .catch(err => {
              this.loading = true;
              console.log(err);
          });
    },
    addArticle: function (id) {
        //addArticleDirectのための．モーダルが表示されない
      axios
          .post("http://localhost:8000/book/book/", this.newArticle)
          .then(response => {

            if(this.direct_flug==true){alert(this.newArticle.title+"を追加しました");}
            this.newArticle =
            {
              title:null,
              title_kana:null,
              author:null,
              author_kana:null,
              isbn:null,
              sales_date:null,
          },
            this.getArticles();
            console.log('addarticle成功');
          })
          .catch(err => {
              this.loading = false;
              console.log(err);
          });
    },
      deleteArticle: function (id) {
          this.loading = true;
          axios
              .delete(`http://localhost:8000/book/book/${id}/`)
              .then(response => {
                  this.loading = false;
                  this.getArticles();
                  $("#deleteArticleModal").modal('toggle');
              })
              .catch(err => {
                  this.loading = false;
                  console.log(err);
              });
      },
      updateArticle: function () {
        console.log('アプデ');
        this.loading = true;
        axios
            .put(
                `http://localhost:8000/book/book/${this.currentArticle.book_id}/`,
                this.currentArticle
            )
            .then(response => {
                this.loading = false;
                this.currentArticle = response.data;
                this.getArticles();
                $("#editArticleModal").modal('toggle');
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
            });
    },
    getRakutenBooks: function () {
        //IsbnSearch かくにんせず追加，新規登録から呼び出される
        for(let i=0;i<this.checkIsbn.length;i++){
            if(this.checkIsbn[i]==this.search_rakuten_books){
                if(this.direct_flug==true){alert('この書籍は登録済みです');}
                break;
            }
        }
        //ISBN検索
        let api_url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=1089485087595106373&isbn=${this.search_rakuten_books}`;
        if (this.search_rakuten_books != "" && this.search_rakuten_books !=null) {
          // 9784098252022
        this.api_url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=1089485087595106373&isbn=${this.search_rakuten_books}`;
        console.log(this.api_url );
        console.log(this.search_rakuten_books);
        this.loading = false;
        axios
            .get(api_url)
            .then(response => {
                //検索結果をnewArticleに代入．
                this.rakuten_books = response.data["Items"][0].Item
                this.newArticle.title=this.rakuten_books.title;
                this.newArticle.title_kana=this.rakuten_books.titleKana;
                this.newArticle.author=this.rakuten_books.author;
                this.newArticle.author_kana=this.rakuten_books.authorKana;
                this.newArticle.isbn=this.rakuten_books.isbn;
                this.newArticle.sales_date=this.rakuten_books.salesDate;
                this.loading = false;
                this.flug=true;
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
                console.log('データを取得できませんでした');
                alert('データを取得できませんでした');
                this.loading = false;
            }); }else{
                alert('値を入力してください');
                this.loading = false;
            }
    },
    addArticleDirect: function () {
        this.getRakutenBooks();//isbnコードからデータをgetし，その値をnewArticleに代入する．

        setTimeout(() => {
            this.addArticle('コメント');//1秒後にnewArticleがpostされる
        }, 1000)
    },
    addBookDirect: function (id) {
        //ISBN入力(fast)
        this.getRakutenBooks();//isbnコードからデータをgetし，その値をnewArticleに代入する．
        setTimeout(() => {
            this.addArticle('コメント');
            this.search_rakuten_books = "";
            this.rakuten_books=[];
            this.flug=false;
            //1秒後にnewArticleがpostされる
        }, 1000)
    },
    clickCallback: function (pageNum) {
        this.currentPage = Number(pageNum);
     },

     getAllIsbns: function () {
        let api_url = "http://localhost:8000/book/book";
        this.loading = true;
        axios
            .get(api_url)
            .then(response => {
                this.isbns = response.data.results
                // this.isbns = response.data.results.length
                for(let i=0;i<this.isbns.length;i++){
                    this.checkIsbn[i]= this.isbns[i].isbn;
                    // console.log(this.checkIsbn[i]);
                }

                this.loading = false;
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
                console.log('getarticleserr');
            });


    },
    },
    computed: {
        getItems: function() {
          let current = this.currentPage * this.parPage;
          let start = current - this.parPage;
          return this.articles.slice(start, current);
        },
        getPageCount: function() {
          return Math.ceil(this.articles.length / this.parPage);
        }
      }
});
