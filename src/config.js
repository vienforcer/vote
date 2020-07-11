export default {
  development: {
    // ApiService: 'http://xiaotuni.cn:4100',
    ApiService: 'http://127.0.0.1:3050',
  },
  
}[process.env.NODE_ENV || 'development']