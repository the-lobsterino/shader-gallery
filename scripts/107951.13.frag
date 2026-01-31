#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 2D Perlin 噪声函数
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {
    // 定义屏幕空间的 UV 坐标
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 定义渐变颜色范围
    vec3 color1 = vec3(15.0/255.0, 21.0/255.0, 92.0/255.0); // #0F155C
    vec3 color2 = vec3(53.0/255.0, 5.0/255.0, 60.0/255.0);  // #35053C

    // 计算渐变颜色
    vec3 gradientColor = mix(color1, color2, uv.x);

    // 调整动态效果，通过时间变化
    float speed = 2.0; // 调整这个值以改变渐变速度
    gradientColor *= 0.5 + 0.5 * sin(speed * time);

    // 使用噪声函数来随机化渐变方向
    float randomOffset = noise(uv + time);
    uv = mod(uv + randomOffset, 1.0);

    // 输出最终颜色
    gl_FragColor = vec4(gradientColor, 1.0);
}
