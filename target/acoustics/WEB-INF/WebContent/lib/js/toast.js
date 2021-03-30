/**
 * 全屏 Toast 提示
 *
 * @param obj {object|string} toast 文本 或 包含很多信息的对象
 * @param obj.dom {HTMLDivElement} 可复用的 dom 元素，本方法未对该属性做检查
 * @param obj.image {string} Toast 左侧 icon，为 img 标签的 src 属性值
 * @param obj.text {string} Toast 文字内容
 * @returns {HTMLDivElement} 返回可复用的 dom 元素
 */
window.toast = obj => {
  if (typeof obj === "string") {
    obj = {"text": obj};
  }
  let domAlert;
  if (obj.dom !== undefined) {
    domAlert = obj.dom;
  } else {
    let domAlertContainer = document.createElement("div");
    domAlertContainer.style.height = "100vh";
    domAlertContainer.style.width = "100vw";
    domAlertContainer.style.position = "absolute";
    domAlertContainer.style.top = "0";
    domAlertContainer.style.left = "0";
    domAlertContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    domAlertContainer.style.zIndex = "99999999";

    domAlert = document.createElement("div");
    domAlert.style.width = "678px";
    domAlert.style.maxWidth = "75%";
    domAlert.style.height = "auto";
    domAlert.style.position = "relative";
    domAlert.style.right = "0";
    domAlert.style.left = "0";
    domAlert.style.margin = "auto";
    domAlert.style.padding = "20px 60px 20px 20px";
    domAlert.style.lineHeight = "25px";
    domAlert.style.backgroundColor = "white";
    domAlert.style.borderRadius = "15px";

    let domAlertImg = document.createElement("img");
    domAlertImg.height = 50;
    domAlertImg.width = 50;
    domAlertImg.style.position = "absolute";
    domAlertImg.style.top = "calc(50% - 25px)";

    let domAlertText = document.createElement("span");
    domAlertText.style.width = "100%";
    domAlertText.style.color = "#000000";
    domAlertText.style.wordBreak = "break-word";

    let domAlertClose = document.createElement("div");
    domAlertClose.style.backgroundImage =
      "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDgtMTdUMTQ6Mjc6MzErMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDgtMTdUMTQ6Mjc6MzErMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA4LTE3VDE0OjI3OjMxKzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNhNzA2OTMzLWZiZGQtNGM1OS1hMzFmLTI3NmU4Y2Q0NTJiNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjQ5YTBkNjRlLWE2ZTUtNzk0Yi05YTA4LTQ2NTQ4YTA3OTJiMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjExMzE5MTU0LWZhN2ItNGE3Mi1iMjVlLTkzNTJkZjU2MWM5MyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTEzMTkxNTQtZmE3Yi00YTcyLWIyNWUtOTM1MmRmNTYxYzkzIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTE3VDE0OjI3OjMxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6M2E3MDY5MzMtZmJkZC00YzU5LWEzMWYtMjc2ZThjZDQ1MmI3IiBzdEV2dDp3aGVuPSIyMDIwLTA4LTE3VDE0OjI3OjMxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74a2BUAAABgElEQVRoge3YUY7CMAwE0GGPAz3Pcpz24KyyH2CJDbS1nYkddbHUD5Cw51ESAqdSCo5QX9kBWPWBDFellD9XVeeMTCs1PT94yb0BWQDcAHwHhl2rK+5ZFnlCC1kAlMeVjRGE5FkAHWSqXpiJqRGS5ay9I2sNIjGbGSxrJBOzO9sCUTXMQHgg6saRCC/ENCAC0QIxD+qJaIW4BvZAMCDuwexeDEhTAFYPFqQ1SPMbwYR4A1E+mmyINRhtffWAaANSd7xekL2g9G27JwQrgX8eF/WLtDcEeI+hnwYiIMAdU98FuTuU81md+9/8i+KpQ3y0LIv92jJotO3XjRnxC9GFiTyivAtIw0QdGreCUTARx3hNoGZM7x9Wlne1qQcDwly07l6tEPo26u3ZAumBcPf2QnoiXDM8kAiEeZYVEokwzbRAMhDq2VpIJkKVQQO5DICQWsNM2jsyIx8hVWNmwLZGZuQjpAQzyxPWXWuKTLtTl+cHde6T8zfIcHWYf1E+kNHqF5zgcC85ILzVAAAAAElFTkSuQmCC')";
    domAlertClose.style.backgroundSize = "cover";
    domAlertClose.style.height = "18px";
    domAlertClose.style.width = "18px";
    domAlertClose.style.position = "absolute";
    domAlertClose.style.left = "unset";
    domAlertClose.style.top = "calc(50% - 9px)";
    domAlertClose.style.right = "20px";
    domAlertClose.style.cursor = "pointer";
    domAlertClose.addEventListener("click", () => {
      let opacity = 1;
      let i = setInterval(() => {
        opacity -= 0.05;
        domAlertContainer.style.opacity = opacity + "";
        if (opacity <= 0) {
          domAlertContainer.remove();
          clearInterval(i);
        }
      }, 10);
    });

    domAlert.append(domAlertImg, domAlertText, domAlertClose);
    domAlertContainer.append(domAlert);
    document.body.append(domAlertContainer);
  }
  if (obj.image !== undefined) {
    domAlert.firstElementChild.src = obj.image;
    domAlert.firstElementChild.style.display = "";
    domAlert.firstElementChild.nextElementSibling.style.paddingLeft = "60px";
  } else {
    domAlert.firstElementChild.style.display = "none";
    domAlert.firstElementChild.nextElementSibling.style.paddingLeft = "";
  }
  domAlert.firstElementChild.nextElementSibling.textContent = obj.text !== undefined ? obj.text : "";
  domAlert.style.top = `calc(50% - ${domAlert.clientHeight}px)`;
  return domAlert;
};

/**
 * 移除指定 Toast
 *
 * @param domToast {HTMLDivElement}
 */
window.toastClose = domToast => {
  if (domToast !== undefined && domToast.parentNode !== undefined && typeof domToast.parentNode.remove === "function") {
    domToast.parentNode.remove();
  }
};