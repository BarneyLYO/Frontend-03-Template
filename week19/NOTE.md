学习笔记

# 发布系统

服务器基于 ubuntu 20.04 版本，我不太喜欢 ubuntu， 个人用用就行。
PS：NAT 连接都需要配置 port forwaring

1. SSH：
   - start： service sshd start
   - grep： systemctl list-unit-files | grep sshd
2. SCP secure copy
   - scp -P port_number -r [location][server location]
3. n (version control for node)
   - usage: n latest
4. express

- nodejs 服务器框架
- 使用 express-generator 产生最佳实践
  - routes：路由 middlewares
  - views： 渲染引擎/数据接入
  - public： 前端页面
  - app.js： express config
  - service： 通常会用 service 来承载路由实际逻辑实现
  - model： 数据结构模型
  - db/data-source：数据库/io 访问配置
  - express 属于早期 node 项目， 内部实现充满了大量的时代的影子（es5）， 大量使用 Object Behavior Delegation 的 pattern（OLOO programming style）， 同时 express 不能称为 framework， 最多和 java 世界的 servlet 对等。
- stream, 基于 buffer 的数据结构， 其实就是操作系统的缓存区的读取, stream 就是一段一段的 buffer 的抽象。
  - event： close， data，
  - type： readale， writable
  - pipe: readable.pipe(writable)

5. 文件打包

- archiver
  - ```
    const archive = archiver('zip', {
      zlib:{level:9}
    })
    ```
- unzipper
  - ```
    fs.createReadStream('path/to/archive.zip').
    pipe(unzipper.Extract({path:'output/path'}))
    ```

6. OAuth
   > OAuth 是一个认证授权的开放标准。 OAuth 之前， 互联网全部都是使用 HTTP Basic Authentication 访问第三方资源。

- 组件
  1. Scope And Consent
  - authorization 时的请求权限， 与 access token 绑定在一起的一组权限， OAuth Scope 将授权策略与授权执行解耦
  2. Actor
  - Resource Owner： 我们的例子当中， Github
  - Resorce Server： 储存用户信息的 api service
  - Client： 想要访问 resource 的外部应用
  - Authorization Server： 授权服务器
  3. Clients
  - 想要访问 Resource 的客户端
  4. Tokens：
  - Access Token： 客户端用来请求 Resource Server， 由 Authorization Server 获取
  - Refresh Token： access token 过期后， 用来获取新的 access token
  - End points： Token 是由访问不同的 end points 获取
    - authorize endpoint： 用于获取用户的许可和授权， 并且将用户的授权传递给 token endpoint， 这部分逻辑发生与 front channel， 客户端授权
    - token endpoint： token endpoint 对用户的授权信息进行处理，之后返回 access token 或者 refresh token，发生于 backend channel
  5. Authorization Server， 授权服务器
