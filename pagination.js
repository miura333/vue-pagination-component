Vue.component('pagination', {
    template:   '<div>' +
                    '現在のページ：{{ nowPage }}' +
                    '<div id="pagination">' +
                        '<ul class="pagination">' +
                            '<li v-on:click="goFirst" class="page-item" v-bind:class="zeroPage()">' +
                                '<a class="page-link" href="#">|←</a>' +
                            '</li>' +
                            '<li v-on:click="goPrev" class="page-item" v-bind:class="zeroPage()">' +
                                '<a class="page-link" href="#">←</a>' +
                            '</li>' +
                            '<li v-on:click="showPage(i)" class="page-item" v-bind:class="{ active: nowPage == (i + offsetPage) }" v-for="i in 3">' +
                                '<a class="page-link" href="#">' +
                                    '{{ i + offsetPage }}' +
                                '</a>' +
                            '</li>' +
                            '<li class="page-item" v-bind:class="{ active: nowPage == fourBox}">' +
                                '<a class="page-link" href="#">{{ fourBox }}</a>' +
                            '</li>' +
                            '<li v-on:click="goLast" class="page-item" v-bind:class="{ active: nowPage == maxPages}">' +
                                '<a class="page-link" href="#">{{ maxPages }}</a>' +
                            '</li>' +
                            '<li v-on:click="goNext" class="page-item"><a class="page-link" href="#">→</a></li>' +
                            '<li v-on:click="goLast" class="page-item"><a class="page-link" href="#">→|</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div v-bind:class="maxPpp()">メッセージ総数：{{ maxMess }} 最大ページ：{{ maxPages }} オフセット：{{ offsetPage }}</div>' +
                '</div>',
    props: ['max_mess'],
    data: ()=> {
        return {
            maxMess: 180,
            dispMess: 20,
            maxPages: 0,
            nowPage: 1,
            offsetPage: 0,
            showPageCount: 5,
            btnDisable: 'disabled',
            btnShow: '',
            fourBox: '…'
        }
    },
    methods: {
        // 最大ページ数を算出
        maxPpp: function () {
            this.maxPages = Math.ceil(this.maxMess / this.dispMess);
            // console.log(this.nowPage + '|' + this.maxPages);
        },
        //今のページが最初のページかどうかを判定、最初のページなら押せないようにする
        zeroPage: function () {
            if (this.nowPage === 1) {
                return this.btnDisable;
            } else {
                return this.btnShow;
            }
        },
        // 今のページが最後のページか判定して、最後なら押せないようにする
        lastPage: function () {
            if (this.nowPage === this.maxPages) {
                return this.btnDisable;
            } else {
                return this.btnShow;
            }
        },
        // 最初のページへ戻る
        goFirst: function () {
            this.nowPage = 1;
            this.offsetPage = 0;
            if (this.maxPages > 5) {
                this.fourBox = '…';
            } else {
                this.fourBox = ' ';
            }

            this.notifyCurrentPage();
        },
        // 1ページ戻る
        goPrev: function () {
            // 最初のページでなければ1ページ戻る
            if (this.nowPage > 1) {
                this.nowPage--;
                this.offsetPage--;
            }
            // オフセットが0以下にならないように
            if (this.offsetPage < 0) {
                this.offsetPage = 0;
            }
            // 4番目に数字を書く処理
            if ((this.maxPages - this.offsetPage) > 4 && (this.maxPages - this.nowPage) < 4) {
                this.fourBox = (this.maxPages - 1);
                this.offsetPage++;

                console.log(this.offsetPage + 'OKOK');
            }
            // 4番目に数字を書く処理
            if ((this.maxPages - this.nowPage) > 3) {
                this.fourBox = '…';
            }

            this.notifyCurrentPage();
        },
        // 1ページ進む
        goNext: function () {
            // 最大ページに到達していなければ進む
            if (this.nowPage < this.maxPages) {
                this.nowPage++;
            } else {
                // 最大ページで停止
                this.nowPage = this.maxPages;
                this.offsetPage = (this.maxPages - 5);
            }
            // 4番目に到達したときにオフセットを加算
            if ((this.nowPage - this.offsetPage) > 3 && this.nowPage < (this.maxPages - 1)) {
                this.offsetPage++;
            }
            if ((this.nowPage + 2) === this.maxPages) {
                this.fourBox = this.nowPage + 1;
            }

            this.notifyCurrentPage();
        },
        //
        showPage: function (foo) {
            this.nowPage = foo;
            this.notifyCurrentPage();
        },
        // 最後のページへ移動
        goLast: function () {
            this.nowPage = this.maxPages;
            this.offsetPage = this.maxPages - 5;
            this.fourBox = this.maxPages - 1;

            this.notifyCurrentPage();
        },
        notifyCurrentPage: function() {
            this.$emit('page_changed', this.nowPage);
        }
    },
    mounted: function () {
        this.maxMess = this.max_mess;
    }
});
