router.post('/user/refreshToken', async (ctx) => {
  const { refreshToken } = ctx.request.body;
  // 验证逻辑 ...
});