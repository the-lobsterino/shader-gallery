 uniform float globalAlpha;
    uniform bool axisY;
    uniform bool mixt;
    uniform bool hasImage2;

    czm_material czm_getMaterial(czm_materialInput materialInput) {
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = repeat * materialInput.st;
      float currTime;
      if(time < 0.0) {
        currTime = speed * czm_frameNumber / 1000.0;
      } else {
        currTime = time;
      }
      // 在opengl中是求一个数的小数点部分。这个time应该是动态变化的，毕竟时间一直在走，可能和cesium不一样，它的时间数不是整数，而是小数。
      vec4 colorImage = texture2D(image, vec2(fract((axisY ? st.t : st.s) - currTime), st.t));
      if(color.a == 0.0) {
        if(colorImage.rgb == vec3(1.0)) {
          discard;
        }
      }

      if(color.rgb == vec3(1.0)) {
        material.alpha = colorImage.a * globalAlpha;
        material.diffuse = colorImage.rgb;
      } else {
        material.alpha = colorImage.a * color.a * globalAlpha;
        if(mixt)
          material.diffuse = max(colorImage.rgb * color.rgb * material.alpha * 3.0, colorImage.rgb * color.rgb);
        else
          material.diffuse =  max(color.rgb * material.alpha * 3.0, color.rgb);
      }
      if(hasImage2) {
        vec4 colorBG = texture2D(image2, materialInput.st);
        if(colorBG.a > 0.5) {
          // 控制的效果是这个颜色的亮度
          material.diffuse = color2.rgb;
        }
      }
      return material;
    }