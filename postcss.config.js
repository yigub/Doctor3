// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // 设备宽度375计算vw的值,这里是以宽度为375的设备为一个基准
      viewportWidth: 375
    }
  }
}
