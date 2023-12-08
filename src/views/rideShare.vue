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
        <h1 class="fw-bold h2 ps-3">
          <img src="../assets/check.png" alt="checkbox" style="height:55px">
          {{ userInfo.userType?? "" + " " + userInfo.userName??"" + " 的共乘服務" }}
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
        {{ userInfo.userType?? "" + " " + userInfo.userName??"" + " 的共乘服務" }}
      </h1>
      <div class="d-flex align-items-center">
        <button class=" btn btn-sm btn-h" @click="signOut">登出</button>
      </div>
    </header>
    <main class="container pb-5">
<!--      <div class="input-group mb-4">-->
<!--        <input v-model="todoAdd" type="text"-->
<!--          class="form-control border-0" placeholder="新增待辦事項" id="todo">-->
<!--        <label class="input-group-text bg-white border-0" for="todo" style="height:60px">-->
<!--          <button class="btn btn-sm" @click="addTodo"-->
<!--          type="button" id="button-addon2">-->
<!--            <i class="bi bi-plus-square-fill fs-2"></i>-->
<!--          </button>-->
<!--        </label>-->
<!--      </div>-->
<!--      <div v-if="!token" class="row row-cols-1 d-flex justify-content-center my-5">-->
<!--        <h3 class="col text-center">目前尚無待辦資料</h3>-->
<!--        <img class="img-fluid col-4 " src="../assets/empty.png" alt="">-->
<!--      </div>-->
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
            v-for="item in formattedFareData" :key="item.id">
            <li class="list-group-item fs-5 d-flex justify-content-between">
<!--              <span>-->
<!--                <input class="form-check-input me-3 p-2"-->
<!--                type="checkbox" :id="item.id" :value="item.content"-->
<!--                :checked="item.completed_at !== null"-->
<!--                @click="toggleTodo(item.id)"-->
<!--                >-->
<!--                <label class="form-check-label" :for="item.id"-->
<!--                :class="{ 'text-decoration-line-through': item.completed_at !== null }">-->
<!--                  {{ item.content }}-->
<!--                </label>-->
<!--              </span>-->
<!--              <span>-->
<!--                <button type="button" class="btn" @click="editTodo(item.id)">-->
<!--                  <i class="bi bi-pencil-fill btn-li-h"></i></button>-->
<!--                <button type="button" class="btn" @click="delTodo(item.id)">-->
<!--                  <i class="bi bi-trash-fill btn-li-h"></i></button>-->
<!--              </span>-->
            </li>
            <li class="list-group-item fs-5 d-flex justify-content-between">
              <span>
<!--                <input class="form-check-input me-3 p-2"-->
<!--                type="checkbox" :id="item.id" :value="item.content"-->
<!--                :checked="item.completed_at !== null"-->
<!--                @click="toggleTodo(item.id)"-->
<!--                >-->
                <label class="form-check-label">
                  紀錄日期:{{item.update_time}}, 費用:{{item.user_fare}}{{item.user_remark ? `, 原因:${item.user_remark}` : ""}}
                </label>
              </span>
            </li>
          </ul>
        </div>
        <div class="card-footer bg-transparent d-flex justify-content-between pt-3">
     <p class="pt-3"><span class="fs-5">{{ formattedFareData.length }}</span> 個車費紀錄</p>
          <button type="button" class="btn border-0 btn-h">清除已完成項目</button>
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
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      formattedFareData: [],
      fareData: [], // 儲存fare數據
      fareCountData: [], // 儲存fareCount數據
      token: '',
      user: '',
      isLoading: false,
      filteredType: '當月',
      category: ['當月', '上個月', '已完成'],
    };
  },
  methods: {
    // init
    getFareData() {
      const { email } = this.userInfo;
      const { token } = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        email,
      };

      // Sending GET request
      this.$http.post(`${process.env.VUE_APP_API}/fare/get_fare`, data, config)
        .then((response) => {
          const { found, message, fareData } = response.data;

          if (found) {
            this.fareData = fareData.fare; // fare data
            this.fareCountData = fareData.fareCount; // fareCount data
            console.log(this.fareData);
            console.log(this.fareCountData);
          } else {
            console.log(message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
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
                '編輯失敗，請輸入上個月事項',
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
      // 清除 Vuex 和 localStorage 中的令牌
      this.$store.dispatch('clearAuthData');
      localStorage.removeItem('token');

      // 可選：向後端發送登出請求
      // 如果您的後端需要撤銷令牌，請保留以下代碼
      const url = `${process.env.VUE_APP_API}/users/sign_out`;
      this.$http.delete(url)
        .then((response) => {
          // 登出成功後的處理
          Swal.fire({
            title: '登出成功',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: '了解',
          });
        })
        .catch((err) => {
          // 登出失敗的處理
          Swal.fire({
            title: '登出失敗',
            text: err.response.data.message,
            icon: 'error',
            confirmButtonText: '了解',
          });
        });

      // 無論後端登出請求是否成功，都導航到登入頁面
      this.$router.push('/login');
      this.isLoading = false;
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
  watch: {
    filteredType: {
      immediate: true,
      handler(newValue) {
        if (newValue === '當月') {
          this.formattedFareData = this.fareData.map((item) => ({
            ...item,
            update_time: this.$moment(item.update_time).format('YYYY-MM-DD'),
          }));
        } else if (newValue === '上個月') {
          this.formattedFareData = this.fareCountData.map((item) => ({
            update_time: this.$moment(item.update_time).format('YYYY-MM-DD'),
            user_fare: item.user_fare_count,
            user_remark: item.user_remark,
          }));
        } else {
          this.formattedFareData = this.fareCountData.map((item) => ({
            update_time: this.$moment(item.update_time).format('YYYY-MM-DD'),
            user_fare: item.user_fare_count,
            user_remark: item.user_remark,
          }));
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    }),
  },
  mounted() {
    this.getFareData();
  },
  created() {
    this.token = this.$route.query.id;
    this.user = this.$route.query.nickname;
  },
};
</script>
