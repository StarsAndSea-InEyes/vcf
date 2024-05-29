import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
      res: JSON.parse(localStorage.getItem('userRes')) || {}
    }),
    actions: {
      // 登录
      // login(userInfo) {
      //   const username = userInfo.username.trim()
      //   const password = userInfo.password
      //   const code = userInfo.code
      //   const uuid = userInfo.uuid
      //   return new Promise((resolve, reject) => {
      //     login(username, password, code, uuid).then(res => {
      //       setToken(res.data.token)
      //       this.token = res.data.token
      //       this.res=res
      //       const user = res.user
      //       const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

      //       if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
      //         this.roles = res.roles
      //         this.permissions = res.permissions
      //       } else {
      //         this.roles = ['ROLE_DEFAULT']
      //       }
      //       this.id = user.userId
      //       this.name = user.userName
      //       this.avatar = avatar
      //       resolve()
      //     }).catch(error => {
      //       reject(error)
      //     })
      //   })
      // },
      login(userInfo) {
        const username = userInfo.username.trim();
        const password = userInfo.password;
        const code = userInfo.code;
        const uuid = userInfo.uuid;
        
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            setToken(res.data.token);
            this.token = res.data.token;
            // 将 res 存储到本地存储
            this.res = res;
            localStorage.setItem('userRes', JSON.stringify(res));
            // const user = res.user;
            // const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
      
            // if (res.roles && res.roles.length > 0) {
            //   this.roles = res.roles;
            //   this.permissions = res.permissions;
            // } else {
            //   this.roles = ['ROLE_DEFAULT'];
            // }
            // this.id = user.userId;
            // this.name = user.userName;
            // this.avatar = avatar;
      
            resolve(); // 登录成功后resolve
          }).catch(error => {
            reject(error); // 登录失败时reject
          });
        });
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          // getInfo().then(res => {
            const user = this.res.data.user
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (this.res.data.roles && this.res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = this.res.data.roles
              this.permissions = []
            } else {
              this.roles = ['ROLE_COMMON']
            }
            this.id = user.id
            this.name = user.userName
            this.avatar = avatar
            resolve(this.res.data)
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
            // 清除本地存储中的数据
            localStorage.removeItem('userRes');
          resolve()
          // logout(this.token).then(() => {
          //   this.token = ''
          //   this.roles = []
          //   this.permissions = []
          //   removeToken()
          //   resolve()
          // }).catch(error => {
          //   reject(error)
          // })
        })
      }
    }
  })

export default useUserStore
