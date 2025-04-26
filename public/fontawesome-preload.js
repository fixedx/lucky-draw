// 在页面加载时预先加载FontAwesome图标
(function () {
    // 创建一个空的SVG元素，这样浏览器会预加载FontAwesome字体
    const iconPreload = document.createElement('div');
    iconPreload.style.position = 'absolute';
    iconPreload.style.width = '0';
    iconPreload.style.height = '0';
    iconPreload.style.overflow = 'hidden';
    iconPreload.style.opacity = '0';

    // 添加一些常用图标类名来触发加载
    iconPreload.innerHTML = `
    <i class="fa fa-play"></i>
    <i class="fa fa-stop"></i>
    <i class="fa fa-cog"></i>
    <i class="fa fa-trophy"></i>
    <i class="fa fa-keyboard"></i>
    <i class="fa fa-times"></i>
    <i class="fa fa-tachometer-alt"></i>
    <i class="fa fa-expand"></i>
    <i class="fa fa-compress"></i>
    <i class="fa fa-user-group"></i>
    <i class="fa fa-user-plus"></i>
    <i class="fa fa-random"></i>
    <i class="fa fa-search"></i>
    <i class="fa fa-file-upload"></i>
    <i class="fa fa-triangle-exclamation"></i>
  `;

    // 当DOM加载完毕后添加这个预加载容器
    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(iconPreload);
    });
})(); 