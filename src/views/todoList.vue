<template>
  <div class="todo-bg pt-1">
    <loading :active="isLoading">
    <!--     樣式包進 loading 元件內     -->
    <div class="loadingio-spinner-bean-eater-iylmkqp50l"><div class="ldio-t0eby9sr4hr">
      <div><div></div><div></div><div></div></div><div><div></div><div></div><div></div></div>
      </div>
    </div>
    <!--     樣式包進 loading 元件內     -->
    </loading>
    <div class="d-none d-md-block">
      <header class="m-4 d-flex justify-content-between">
        <h1 class="f-Baloo fw-bold h2 ps-3">
          <img src="../assets/check.png" alt="checkbox" style="height:55px">
          ONLINE TODO LIST
        </h1>
        <div class="d-flex align-items-center">
          <h2 class="h3 pe-3">{{ user }}</h2>
          <button class="btn btn-lg btn-h" @click="signOut">登出</button>
        </div>
      </header>
    </div>
    <!-- responsive -->
    <header class="m-3 d-flex justify-content-between d-md-none">
      <h1 class="f-Baloo fw-bold pt-2 h5">
        <img src="../assets/check-s.png" alt="checkbox">
        ONLINE TODO LIST
      </h1>
      <div class="d-flex align-items-center">
        <button class=" btn btn-sm btn-h" @click="signOut">登出</button>
      </div>
    </header>
    <main class="container pb-5">
      <div class="input-group mb-4">
        <input v-model="todoAdd" type="text"
          class="form-control border-0" placeholder="新增待辦事項" id="todo">
        <label class="input-group-text bg-white border-0" for="todo" style="height:60px">
          <button class="btn btn-sm" @click="addTodo"
          type="button" id="button-addon2">
            <i class="bi bi-plus-square-fill fs-2"></i>
          </button>
        </label>
      </div>
      <div v-if="!token" class="row row-cols-1 d-flex justify-content-center my-5">
        <h3 class="col text-center">目前尚無待辦資料</h3>
        <img class="img-fluid col-4 " src="../assets/empty.png" alt="">
      </div>
      <!-- todo card -->
      <div class="card text-center">
        <div class="card-header bg-transparent">
          <nav class="nav row mt-2">
            <a class="text-sm-center text-decoration-none col-4 py-2"
            v-for="(item, key) in category" :key="'category' + key"
            :class="{ 'tab': filteredType === item }"
            aria-current="page" href="#"
            @click.prevent="handleChangeCategory(item)"
            >{{item}}</a>
          </nav>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush text-start"
            v-for="item in changeTodo" :key="item.id">
            <li class="list-group-item fs-5 d-flex justify-content-between">
              <span>
                <input class="form-check-input me-3 p-2"
                type="checkbox" :id="item.id" :value="item.content"
                :checked="item.completed_at !== null"
                @click="toggleTodo(item.id)"
                >
                <label class="form-check-label" :for="item.id"
                :class="{ 'text-decoration-line-through': item.completed_at !== null }">
                  {{ item.content }}
                </label>
              </span>
              <span>
                <button type="button" class="btn" @click="editTodo(item.id)">
                  <i class="bi bi-pencil-fill btn-li-h"></i></button>
                <button type="button" class="btn" @click="delTodo(item.id)">
                  <i class="bi bi-trash-fill btn-li-h"></i></button>
              </span>
            </li>
          </ul>
        </div>
        <div class="card-footer bg-transparent d-flex justify-content-between pt-3">
          <p class="pt-3"><span class="fs-5">{{ todoList.length }}</span> {{ itemCountText }}</p>
          <button type="button" class="btn border-0 btn-h" @click="clearAll">清除已完成項目</button>
        </div>
      </div>
    </main>
  </div>
</template>
<style>
@media (min-width: 768px) {
    .todo-bg {
      min-height: 100vh;
      /* background-image: linear-gradient(174deg, #ffd370 2%, #ffd370 46%,
      #ffffff 46%, #ffffff 100%, #e8e8e8 100%); */
      background: linear-gradient(0deg, rgb(216, 254, 255) 0%, rgba(253,187,45,1) 100%);
    }
  }
</style>
<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      todoList: [],
      checked: [],
      todoAdd: '',
      token: '',
      user: '',
      isLoading: false,
      filteredType: '全部',
      category: ['全部', '待完成', '已完成'],
    };
  },
  methods: {
    // init
    getData() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_API}/todos`;
      this.$http.get(url, {
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        this.todoList = [...response.data.todos];
        this.isLoading = false;
      }).catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
    },
    // 切換類別
    handleChangeCategory(type) {
      this.filteredType = type;
    },
    // 新增 todo
    addTodo() {
      this.isLoading = true;
      const data = {
        todo: {
          content: this.todoAdd,
        },
      };
      const config = {
        method: 'post',
        url: 'https://todoo.5xcamp.us/todos',
        headers: {
          Authorization: this.token,
        },
        data,
      };
      this.$http(config).then((response) => {
        console.log(response);
        this.getData();
        this.isLoading = false;
        this.todoAdd = '';
      })
        .catch((err) => {
          this.isLoading = false;
          Swal.fire({
            title: err.response.data.message,
            text: '新增失敗',
            icon: 'error',
            confirmButtonText: '了解',
          });
        });
    },
    // 編輯 todo
    editTodo(id) {
      Swal.fire({
        title: '待辦事項修改',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          const data = {
            todo: {
              content: login,
            },
          };
          const config = {
            method: 'put',
            url: `https://todoo.5xcamp.us/todos/${id}`,
            headers: {
              Authorization: this.token,
            },
            data,
          };
          return this.$http(config).then((response) => {
            console.log(response);
            this.getData();
          })
            .catch((error) => {
              console.log(error);
              Swal.showValidationMessage(
                '編輯失敗，請輸入待完成事項',
              );
            });
        },
      });
    },
    // 刪除單一 todo
    delTodo(id) {
      Swal.fire({
        title: '確定刪除?',
        text: '不要放棄 !請先試著努力完成待辦再刪除',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '刪除 !',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          const config = {
            method: 'delete',
            url: `https://todoo.5xcamp.us/todos/${id}`,
            headers: {
              Authorization: this.token,
            },
          };
          this.$http(config).then((response) => {
            console.log(response);
            Swal.fire(
              '刪除成功!',
              '您已成功刪除待辦 !',
              'success',
            );
            this.getData();
          }).catch((err) => {
            console.log(err);
            Swal.fire(
              '刪除失敗!',
              '請確定是否帳號密碼過期',
              'error',
            );
          });
        }
      });
    },
    // 登出
    signOut() {
      const url = `${process.env.VUE_APP_API}/users/sign_out`;
      this.isLoading = true;
      this.$http.delete(url, {
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        this.$router.push('/');
        this.isLoading = false;
        Swal.fire({
          title: response.data.message,
          text: '登出成功',
          icon: 'success',
          confirmButtonText: '了解',
        });
      })
        .catch((err) => {
          this.isLoading = false;
          Swal.fire({
            title: err.response.data.message,
            text: '登出失敗',
            icon: 'error',
            confirmButtonText: '了解',
          });
        });
    },
    // 切換狀態
    toggleTodo(id) {
      const config = {
        method: 'patch',
        url: `https://todoo.5xcamp.us/todos/${id}/toggle`,
        headers: {
          Authorization: this.token,
        },
      };
      this.$http(config).then((response) => {
        console.log(response);
        this.getData();
      });
    },
    // 清除已完成
    clearAll() {
      const checkedList = this.todoList.filter((item) => item.completed_at);
      console.log('checked', checkedList);
      const promiseList = [];
      checkedList.forEach((item) => {
        const config = {
          method: 'delete',
          url: `https://todoo.5xcamp.us/todos/${item.id}`,
          headers: {
            Authorization: this.token,
          },
        };
        promiseList.push(this.$http(config));
      });
      Promise.all(promiseList).then(() => {
        Swal.fire({
          icon: 'success',
          title: '刪除已完成項目成功',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getData();
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: err,
          showConfirmButton: false,
          timer: 2000,
        });
      });
    },
  },
  computed: {
    itemCountText() {
      if (this.filteredType === '全部') {
        return '個全部項目';
      }
      if (this.filteredType === '待完成') {
        return '個待完成項目';
      }
      return '個已完成項目';
    },
    changeTodo() {
      if (this.filteredType === '全部') {
        return this.todoList;
      } if (this.filteredType === '待完成') {
        const toBeDone = this.todoList.filter((item) => item.completed_at === null);
        return toBeDone;
      }
      const done = this.todoList.filter((item) => item.completed_at !== '' && item.completed_at !== null);
      return done;
    },
  },
  mounted() {
    this.getData();
  },
  created() {
    this.token = this.$route.query.id;
    this.user = this.$route.query.nickname;
  },
};
</script>
