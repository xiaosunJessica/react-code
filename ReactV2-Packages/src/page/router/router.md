<!--
 * @Author: your name
 * @Date: 2021-01-26 13:49:33
 * @LastEditTime: 2021-01-26 13:55:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-code/ReactV2-Packages/src/page/router/router.md
-->
# 概念
  ## hash实现
  hash是URL中的（#）及后面的部分，常用作锚点在页面内进行导航，改变URL中的hash部分不会引起页面刷新。

  通过hashChange事件监听URL的变化，改变URL的方式有如下几种：通过浏览器前进后退改变URL、通过标签改变URL、通过window.location改变URL。
  ## history实现
  history提供pushState和replaceState两种方式，这2个方式改变URL的path部分不会引起页面刷新。

  history提供类似hashChange事件的popState事件，但popState事件有些不同：通过浏览器前进后退改变URL时会触发popState事件，通过pushState/replaceState或标签改变URL不会触发popState事件。我们可以拦截pushState/replaceState的调用和标签的点击事件来检测URL变化，所以监听URL变化可以实现，只是没有hashChange那么方便
# 1. 如何改变URL却不引起页面刷新
# 2. 如何检测URL变化

